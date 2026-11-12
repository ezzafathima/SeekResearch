import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import {
  bindOwnSubmissionsDelegation,
  bindAdminModerationDelegation,
  renderOwnSubmissionsDom,
  renderAdminDashboardDom,
  normalizeSubmissionStatus
} from "../js/firebase-portal-view.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");

const KEBAB_TO_CAMEL = (kebab) => kebab.replace(/-([a-z])/g, (_, ch) => ch.toUpperCase());
const CAMEL_TO_KEBAB = (camel) => camel.replace(/[A-Z]/g, (ch) => `-${ch.toLowerCase()}`);

class MockTextNode {
  constructor(text) {
    this.nodeType = 3;
    this.textContent = String(text ?? "");
    this.parentNode = null;
  }
}

class MockFragment {
  constructor() {
    this.nodeType = 11;
    this.children = [];
    this.parentNode = null;
  }
  appendChild(node) {
    if (node.parentNode && typeof node.parentNode.removeChild === "function") {
      node.parentNode.removeChild(node);
    }
    node.parentNode = this;
    this.children.push(node);
    return node;
  }
}

class MockElement {
  constructor(tagName) {
    this.nodeType = 1;
    this.tagName = String(tagName).toUpperCase();
    this.children = [];
    this.parentNode = null;
    this.attributes = new Map();
    this.listeners = new Map();
    this.style = {};
    this._selected = false;
    this._value = "";

    this.dataset = new Proxy(
      {},
      {
        get: (_target, prop) => {
          if (typeof prop !== "string") return undefined;
          return this.attributes.get(`data-${CAMEL_TO_KEBAB(prop)}`);
        },
        set: (_target, prop, value) => {
          this.attributes.set(`data-${CAMEL_TO_KEBAB(prop)}`, String(value ?? ""));
          return true;
        },
        ownKeys: () => {
          const keys = [];
          for (const attr of this.attributes.keys()) {
            if (attr.startsWith("data-")) {
              keys.push(KEBAB_TO_CAMEL(attr.slice(5)));
            }
          }
          return keys;
        },
        getOwnPropertyDescriptor: (_target, prop) => {
          const val = this.attributes.get(`data-${CAMEL_TO_KEBAB(String(prop))}`);
          if (val === undefined) return undefined;
          return { enumerable: true, configurable: true, value: val };
        }
      }
    );
  }

  get innerHTML() {
    throw new Error("Reading innerHTML is disallowed in XSS regression harness");
  }

  set innerHTML(_val) {
    throw new Error("XSS regression violation: innerHTML assignment must never be called");
  }

  get className() {
    return this.attributes.get("class") || "";
  }

  set className(val) {
    this.attributes.set("class", String(val ?? ""));
  }

  get type() {
    return this.attributes.get("type") || "";
  }

  set type(val) {
    this.attributes.set("type", String(val ?? ""));
  }

  get title() {
    return this.attributes.get("title") || "";
  }

  set title(val) {
    this.attributes.set("title", String(val ?? ""));
  }

  get selected() {
    return this._selected;
  }

  set selected(val) {
    this._selected = Boolean(val);
    if (this._selected && this.parentNode?.tagName === "SELECT") {
      this.parentNode._value = this._value;
    }
  }

  get value() {
    return this._value;
  }

  set value(val) {
    this._value = String(val ?? "");
  }

  get firstChild() {
    return this.children[0] || null;
  }

  get textContent() {
    return this.children
      .map((c) => c.textContent || "")
      .join("");
  }

  set textContent(val) {
    for (const c of this.children) {
      c.parentNode = null;
    }
    this.children = [];
    const text = String(val ?? "");
    if (text.length > 0) {
      const textNode = new MockTextNode(text);
      textNode.parentNode = this;
      this.children.push(textNode);
    }
  }

  setAttribute(name, val) {
    this.attributes.set(String(name), String(val ?? ""));
  }

  getAttribute(name) {
    return this.attributes.has(name) ? this.attributes.get(name) : null;
  }

  appendChild(node) {
    if (node instanceof MockFragment) {
      for (const child of [...node.children]) {
        this.appendChild(child);
      }
      node.children = [];
      return node;
    }
    if (node.parentNode && typeof node.parentNode.removeChild === "function") {
      node.parentNode.removeChild(node);
    }
    node.parentNode = this;
    this.children.push(node);
    if (this.tagName === "SELECT" && node.tagName === "OPTION" && node.selected) {
      this._value = node.value;
    }
    return node;
  }

  removeChild(node) {
    const idx = this.children.indexOf(node);
    if (idx !== -1) {
      this.children.splice(idx, 1);
      node.parentNode = null;
    }
    return node;
  }

  replaceChildren(...nodes) {
    for (const c of this.children) {
      c.parentNode = null;
    }
    this.children = [];
    for (const n of nodes) {
      this.appendChild(n);
    }
  }

  contains(target) {
    let cur = target;
    while (cur) {
      if (cur === this) return true;
      cur = cur.parentNode || null;
    }
    return false;
  }

  matches(selector) {
    if (selector === "button[data-action][data-sub-id]") {
      return (
        this.tagName === "BUTTON" &&
        this.attributes.has("data-action") &&
        this.attributes.has("data-sub-id")
      );
    }
    if (selector === 'select[data-action="status-change"][data-sub-id]') {
      return (
        this.tagName === "SELECT" &&
        this.attributes.get("data-action") === "status-change" &&
        this.attributes.has("data-sub-id")
      );
    }
    if (selector.startsWith(".")) {
      return this.className.split(/\s+/).includes(selector.slice(1));
    }
    return this.tagName === selector.toUpperCase();
  }

  closest(selector) {
    let cur = this;
    while (cur && cur.nodeType === 1) {
      if (cur.matches(selector)) return cur;
      cur = cur.parentNode || null;
    }
    return null;
  }

  addEventListener(type, handler) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }
    this.listeners.get(type).push(handler);
  }

  dispatchEvent(event) {
    const evt = { ...event, target: event.target || this };
    let cur = this;
    while (cur) {
      evt.currentTarget = cur;
      const list = cur.listeners?.get(evt.type) || [];
      for (const fn of list) {
        fn(evt);
      }
      cur = cur.parentNode || null;
    }
  }

  findAll(predicate) {
    const hits = [];
    const walk = (node) => {
      if (node.nodeType === 1) {
        if (predicate(node)) hits.push(node);
        for (const c of node.children) walk(c);
      }
    };
    walk(this);
    return hits;
  }
}

function createMockDocument() {
  return {
    createElement: (tag) => new MockElement(tag),
    createTextNode: (text) => new MockTextNode(text),
    createDocumentFragment: () => new MockFragment()
  };
}

function assertNoUnsafeNodesOrInlineHandlers(rootEl) {
  const allElements = rootEl.findAll(() => true);
  for (const el of allElements) {
    assert.ok(
      !["SCRIPT", "IFRAME", "IMG", "SVG", "OBJECT", "EMBED"].includes(el.tagName),
      `Unexpected executable/active HTML tag rendered: <${el.tagName}>`
    );
    for (const [attrName, attrVal] of el.attributes.entries()) {
      assert.ok(
        !/^on/i.test(attrName),
        `Inline event handler attribute "${attrName}" must not exist on <${el.tagName}> (value: ${attrVal})`
      );
    }
  }
}

describe("Stored XSS Regression Tests (Safe DOM Rendering & Delegated Listeners)", () => {
  const CRAFTED_XSS_DOC_ID =
    `sub',this.value);globalThis.__xssPayloadExecuted=true;void('<img src=x onerror="alert(1)">"\\`;
  const CRAFTED_HTML_JS_FIELDS = {
    id: CRAFTED_XSS_DOC_ID,
    uid: `stu_<script>alert(1)</script>'\"`,
    studentName: `<img src=x onerror="globalThis.__xssPayloadExecuted=true"> 'Alice'`,
    professorName: `Prof. <svg onload=alert(1)> "Bob"`,
    university: `MIT <script>alert(1)</script>`,
    subject: `Subject "><img src=x onerror=alert(1)>`,
    channel: "gmail_compose",
    status: `reviewed" onclick="globalThis.__xssPayloadExecuted=true`,
    createdAt: null
  };

  afterEach(() => {
    delete globalThis.__xssPayloadExecuted;
  });

  it("source files contain no innerHTML, inline scripts/styles, or inline event handlers", () => {
    const runtimeFiles = [
      "index.html",
      "js/seekresearch-app.js",
      "js/firebase-auth.js",
      "js/firebase-config.js",
      "js/firebase-db.js",
      "js/firebase-portal-view.js",
      "js/firebase-portal.js"
    ];

    for (const relPath of runtimeFiles) {
      const src = fs.readFileSync(path.join(ROOT_DIR, relPath), "utf8");
      assert.equal(/\.innerHTML\b/.test(src), false, `${relPath} must not contain .innerHTML`);
      assert.equal(/\bouterHTML\b|\binsertAdjacentHTML\b/.test(src), false, `${relPath} must not use outerHTML or insertAdjacentHTML`);
      assert.equal(/\beval\s*\(/.test(src), false, `${relPath} must not invoke eval()`);
      assert.equal(/\bnew\s+Function\s*\(/.test(src), false, `${relPath} must not invoke new Function()`);
      if (relPath.startsWith("js/")) {
        assert.equal(/\bonclick\s*=/.test(src), false, `${relPath} must not generate inline onclick= handlers`);
        assert.equal(/\bonchange\s*=/.test(src), false, `${relPath} must not generate inline onchange= handlers`);
        assert.equal(/setAttribute\s*\(\s*['"]style['"]/i.test(src), false, `${relPath} must not call setAttribute("style", ...)`);
      }
      if (relPath === "index.html") {
        assert.equal(/<style\b/i.test(src), false, "index.html must not contain inline <style> blocks");
        assert.equal(/<script(?![^>]*\bsrc\s*=)/i.test(src), false, "index.html must not contain inline <script> blocks");
        assert.equal(/\son[a-z]+\s*=/i.test(src), false, "index.html must not contain inline on* event handlers");
        assert.equal(/\sstyle\s*=/i.test(src), false, "index.html must not contain inline style= attributes");
      }
    }
  });

  it("normalizeSubmissionStatus prevents CSS class / attribute injection via untrusted status strings", () => {
    assert.equal(normalizeSubmissionStatus("reviewed"), "reviewed");
    assert.equal(normalizeSubmissionStatus("flagged"), "flagged");
    assert.equal(
      normalizeSubmissionStatus('reviewed" onclick="alert(1)'),
      "submitted"
    );
  });

  it("renderOwnSubmissionsDom safely renders crafted IDs/fields as literal text + data-sub-id and dispatches via delegation", () => {
    const doc = createMockDocument();
    const listEl = doc.createElement("div");
    const countEl = doc.createElement("span");
    const editingBanner = doc.createElement("div");
    const editingLabel = doc.createElement("span");

    const edits = [];
    const deletes = [];

    const handlers = {
      onEdit: (id) => edits.push(id),
      onDelete: (id) => deletes.push(id)
    };

    // Re-bind multiple times to verify delegation does not duplicate listeners
    for (let i = 0; i < 3; i += 1) {
      bindOwnSubmissionsDelegation(listEl, handlers);
      renderOwnSubmissionsDom({
        listEl,
        countEl,
        editingBanner,
        editingLabel,
        isSignedIn: true,
        submissions: [CRAFTED_HTML_JS_FIELDS],
        editingSubmissionId: CRAFTED_XSS_DOC_ID,
        doc
      });
    }

    assert.equal(globalThis.__xssPayloadExecuted, undefined);
    assert.equal(countEl.textContent, "1 SAVED");
    assert.ok(editingLabel.textContent.includes(CRAFTED_HTML_JS_FIELDS.professorName));
    assertNoUnsafeNodesOrInlineHandlers(listEl);

    const editBtns = listEl.findAll((el) => el.matches("button[data-action][data-sub-id]") && el.dataset.action === "edit");
    const deleteBtns = listEl.findAll((el) => el.matches("button[data-action][data-sub-id]") && el.dataset.action === "delete");
    assert.equal(editBtns.length, 1);
    assert.equal(deleteBtns.length, 1);
    assert.equal(editBtns[0].dataset.subId, CRAFTED_XSS_DOC_ID);
    assert.equal(deleteBtns[0].dataset.subId, CRAFTED_XSS_DOC_ID);
    assert.equal(editBtns[0].getAttribute("onclick"), null);

    // Ensure crafted HTML/script strings inside fields stay literal text
    const subjectDivs = listEl.findAll((el) => el.tagName === "DIV" && el.textContent === CRAFTED_HTML_JS_FIELDS.subject);
    assert.equal(subjectDivs.length, 1);

    // Trigger delegated click events with crafted subId
    editBtns[0].dispatchEvent({ type: "click", target: editBtns[0] });
    deleteBtns[0].dispatchEvent({ type: "click", target: deleteBtns[0] });

    assert.deepEqual(edits, [CRAFTED_XSS_DOC_ID]);
    assert.deepEqual(deletes, [CRAFTED_XSS_DOC_ID]);
    assert.equal(globalThis.__xssPayloadExecuted, undefined);
  });

  it("renderAdminDashboardDom neutralizes crafted sub.id in moderation select and preserves status updates via delegation", () => {
    const doc = createMockDocument();
    const listEl = doc.createElement("div");
    const stCountEl = doc.createElement("span");
    const subCountEl = doc.createElement("span");
    const statusChanges = [];

    const adminStudents = [
      {
        name: `<img src=x onerror=alert(1)> Student`,
        level: `highschool"`,
        grade: `Grade 11'`,
        email: `evil"<script>@school.edu`,
        school: `Springfield <svg onload=alert(1)>`
      }
    ];

    for (let i = 0; i < 3; i += 1) {
      bindAdminModerationDelegation(listEl, {
        onStatusChange: (subId, nextStatus) => statusChanges.push({ subId, nextStatus })
      });
      renderAdminDashboardDom({
        listEl,
        stCountEl,
        subCountEl,
        isAdmin: true,
        adminStudents,
        adminSubmissions: [CRAFTED_HTML_JS_FIELDS],
        doc
      });
    }

    assert.equal(globalThis.__xssPayloadExecuted, undefined);
    assert.equal(stCountEl.textContent, "1 Students");
    assert.equal(subCountEl.textContent, "1 Submissions");
    assertNoUnsafeNodesOrInlineHandlers(listEl);

    const selects = listEl.findAll((el) => el.matches('select[data-action="status-change"][data-sub-id]'));
    assert.equal(selects.length, 1);
    const selectEl = selects[0];
    assert.equal(selectEl.dataset.subId, CRAFTED_XSS_DOC_ID);
    assert.equal(selectEl.getAttribute("data-sub-id"), CRAFTED_XSS_DOC_ID);
    assert.equal(selectEl.getAttribute("onchange"), null);
    assert.equal(selectEl.value, "submitted");

    // Simulate admin changing status via delegated change listener
    selectEl.value = "flagged";
    selectEl.dispatchEvent({ type: "change", target: selectEl });

    assert.deepEqual(statusChanges, [{ subId: CRAFTED_XSS_DOC_ID, nextStatus: "flagged" }]);
    assert.equal(globalThis.__xssPayloadExecuted, undefined);
  });

  it("preserves signed-out / empty states and resolves nested target clicks via closest()", () => {
    const doc = createMockDocument();
    const listEl = doc.createElement("div");
    const countEl = doc.createElement("span");
    const edits = [];

    bindOwnSubmissionsDelegation(listEl, { onEdit: (id) => edits.push(id) });

    // Signed out view
    renderOwnSubmissionsDom({ listEl, countEl, isSignedIn: false, submissions: [], doc });
    assert.equal(countEl.textContent, "SIGN IN TO SAVE");
    assertNoUnsafeNodesOrInlineHandlers(listEl);

    // Signed in, zero submissions view
    renderOwnSubmissionsDom({ listEl, countEl, isSignedIn: true, submissions: [], doc });
    assert.equal(countEl.textContent, "0 SAVED");
    assertNoUnsafeNodesOrInlineHandlers(listEl);

    // Populated view with nested span clicked inside button
    renderOwnSubmissionsDom({
      listEl,
      countEl,
      isSignedIn: true,
      submissions: [{ id: CRAFTED_XSS_DOC_ID, professorName: "Prof. Doe", subject: "Hello", channel: "draft_saved" }],
      doc
    });
    const editBtn = listEl.findAll((el) => el.dataset?.action === "edit")[0];
    const nestedSpan = doc.createElement("span");
    nestedSpan.textContent = "Label";
    editBtn.appendChild(nestedSpan);
    nestedSpan.dispatchEvent({ type: "click", target: nestedSpan });

    assert.deepEqual(edits, [CRAFTED_XSS_DOC_ID]);
  });

  it("disables automatic Analytics initialization and replaces Tuesday Queue labels with Save Draft", () => {
    const configJs = fs.readFileSync(path.join(ROOT_DIR, "js", "firebase-config.js"), "utf8");
    const indexHtml = fs.readFileSync(path.join(ROOT_DIR, "index.html"), "utf8");
    const portalViewJs = fs.readFileSync(path.join(ROOT_DIR, "js", "firebase-portal-view.js"), "utf8");

    assert.equal(/\bgetAnalytics\b/.test(configJs), false, "firebase-config.js must not call getAnalytics");
    assert.equal(/firebase-analytics\.js/.test(configJs), false, "firebase-config.js must not import firebase-analytics.js");
    assert.equal(/Queue for Tuesday|Tuesday Queue|Queued Tuesday/i.test(indexHtml), false, "index.html must not expose Tuesday queue labels");
    assert.equal(/Queue for Tuesday|Tuesday Queue|Queued Tuesday/i.test(portalViewJs), false, "firebase-portal-view.js must not expose Tuesday queue labels");

    const doc = createMockDocument();
    const listEl = doc.createElement("div");
    const countEl = doc.createElement("span");
    renderOwnSubmissionsDom({
      listEl,
      countEl,
      isSignedIn: true,
      submissions: [{ id: "sub_legacy_1", professorName: "Prof. Lee", subject: "Test", channel: "tuesday_queue" }],
      doc
    });
    const pills = listEl.findAll((el) => el.className === "submission-meta-pill");
    assert.equal(pills[0].textContent, "Saved Draft");
  });

  it("refactors renderProfessors() and populateGradeChips() away from innerHTML and inline JS interpolation", () => {
    const indexHtml = fs.readFileSync(path.join(ROOT_DIR, "index.html"), "utf8");
    const appJs = fs.readFileSync(path.join(ROOT_DIR, "js", "seekresearch-app.js"), "utf8");
    const portalJs = fs.readFileSync(path.join(ROOT_DIR, "js", "firebase-portal.js"), "utf8");

    const renderProfStart = appJs.indexOf("function renderProfessors(list)");
    const renderProfEnd = appJs.indexOf("function handleProfFilter()", renderProfStart);
    assert.ok(renderProfStart > -1 && renderProfEnd > renderProfStart);
    const renderProfSrc = appJs.slice(renderProfStart, renderProfEnd);

    assert.equal(/\.innerHTML\s*=/.test(renderProfSrc), false, "renderProfessors() must not assign innerHTML");
    assert.equal(/\bonclick\s*=/.test(renderProfSrc), false, "renderProfessors() must not emit inline onclick handlers");
    assert.ok(renderProfSrc.includes("createElement(") && renderProfSrc.includes("textContent"), "renderProfessors() must use createElement + textContent");

    const chipsStart = appJs.indexOf("function populateGradeChips(");
    const chipsEnd = appJs.indexOf("function selectGradeChip(", chipsStart);
    assert.ok(chipsStart > -1 && chipsEnd > chipsStart);
    const chipsSrc = appJs.slice(chipsStart, chipsEnd);

    assert.equal(/\.innerHTML\s*=/.test(chipsSrc), false, "populateGradeChips() must not assign innerHTML");
    assert.equal(/\bonclick\s*=/.test(chipsSrc), false, "populateGradeChips() must not emit inline onclick interpolation");
    assert.ok(chipsSrc.includes("addEventListener(\"click\"") || chipsSrc.includes("addEventListener('click'"));

    assert.equal(/querySelector\s*\(\s*`[^`]*\$\{/.test(indexHtml), false, "index.html must not interpolate variables into querySelector()");
    assert.equal(/querySelector\s*\(\s*`[^`]*\$\{/.test(appJs), false, "js/seekresearch-app.js must not interpolate variables into querySelector()");
    assert.equal(/querySelector\s*\(\s*`[^`]*\$\{/.test(portalJs), false, "js/firebase-portal.js must not interpolate variables into querySelector()");
  });

  it("enforces Firestore-aligned maxlength attributes, explicit validation instead of silent truncation, and Hosting security headers", () => {
    const indexHtml = fs.readFileSync(path.join(ROOT_DIR, "index.html"), "utf8");
    const dbJs = fs.readFileSync(path.join(ROOT_DIR, "js", "firebase-db.js"), "utf8");
    const firebaseJson = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, "firebase.json"), "utf8"));
    const pkgJson = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, "package.json"), "utf8"));

    const expectedMaxLengths = [
      ["loginEmailInput", 254],
      ["resetEmailInput", 254],
      ["regNameInput", 120],
      ["regEmailInput", 254],
      ["regGradeInput", 60],
      ["regSchoolInput", 160],
      ["regMajorInput", 120],
      ["regSkillsInput", 400],
      ["regProjectInput", 800],
      ["editNameInput", 120],
      ["editGradeInput", 60],
      ["editSchoolInput", 160],
      ["editMajorInput", 120],
      ["editSkillsInput", 400],
      ["editProjectInput", 800],
      ["targetProfInput", 120],
      ["targetUniInput", 180],
      ["targetPaperInput", 300],
      ["targetResearchWorkInput", 1500],
      ["studentNameInput", 120],
      ["studentSkillsInput", 400],
      ["studentProjectInput", 800],
      ["subjectEditorInput", 200],
      ["emailBodyEditor", 5000]
    ];

    for (const [id, maxLen] of expectedMaxLengths) {
      const rx = new RegExp(`id="${id}"[^>]*maxlength="${maxLen}"`);
      assert.ok(rx.test(indexHtml), `Expected #${id} to define maxlength="${maxLen}"`);
    }

    assert.equal(/\bfunction clipStr\b/.test(dbJs), false, "Silent truncation clipStr() must be removed from firebase-db.js");
    assert.ok(dbJs.includes("export function validateStudentProfileInput("));
    assert.ok(dbJs.includes("export function validateSubmissionInput("));
    assert.ok(dbJs.includes("export function validateSubmissionPatch("));

    const headerRules = firebaseJson.hosting?.headers?.[0]?.headers || [];
    const headerMap = Object.fromEntries(headerRules.map((h) => [h.key, h.value]));
    assert.equal(headerMap["X-Content-Type-Options"], "nosniff");
    assert.equal(headerMap["Referrer-Policy"], "strict-origin-when-cross-origin");
    assert.equal(headerMap["X-Frame-Options"], "DENY");
    assert.ok(headerMap["Permissions-Policy"] && headerMap["Permissions-Policy"].includes("camera=()"));
    const csp = headerMap["Content-Security-Policy"] || "";
    assert.ok(csp.includes("frame-ancestors 'none'"));
    assert.equal(csp.includes("'unsafe-inline'"), false, "CSP must not permit 'unsafe-inline'");
    assert.equal(csp.includes("'unsafe-eval'"), false, "CSP must not permit 'unsafe-eval'");
    assert.ok(csp.includes("script-src 'self' https://www.gstatic.com;"));
    assert.ok(csp.includes("style-src 'self' https://fonts.googleapis.com;"));
    assert.equal(/script-src[^;]*\*/.test(csp), false, "CSP script-src must not contain wildcards");

    assert.equal(pkgJson.dependencies, undefined);
    for (const removedPkg of ["next", "react", "react-dom", "three"]) {
      assert.equal(Boolean(pkgJson.devDependencies?.[removedPkg]), false, `${removedPkg} should be removed`);
    }
  });
});
