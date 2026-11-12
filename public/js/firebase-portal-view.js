/**
 * Safe DOM rendering and delegated event handlers for student and admin submission views.
 * Never uses innerHTML or inline event attributes (onclick/onchange), and never
 * interpolates Firestore document IDs or user fields into HTML/JS strings.
 */

const ALLOWED_SUBMISSION_STATUSES = new Set(["submitted", "reviewed", "flagged"]);
const ownSubmissionsHandlers = new WeakMap();
const adminModerationHandlers = new WeakMap();

export function normalizeSubmissionStatus(status) {
  const normalized = String(status || "submitted").trim().toLowerCase();
  return ALLOWED_SUBMISSION_STATUSES.has(normalized) ? normalized : "submitted";
}

function clearChildren(el) {
  if (!el) return;
  if (typeof el.replaceChildren === "function") {
    el.replaceChildren();
    return;
  }
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
}

function createEl(doc, tagName, options = {}) {
  const el = doc.createElement(tagName);
  if (options.className) el.className = options.className;
  if (options.type) el.type = options.type;
  if (options.title) el.title = options.title;
  if (options.ariaLabel) el.setAttribute("aria-label", options.ariaLabel);
  if (options.text !== undefined) el.textContent = String(options.text);
  if (options.dataset) {
    for (const [key, val] of Object.entries(options.dataset)) {
      el.dataset[key] = String(val ?? "");
    }
  }
  return el;
}

function findClosestMatching(target, selector, matchFn) {
  if (target && typeof target.closest === "function") {
    return target.closest(selector);
  }
  let node = target;
  while (node) {
    if (matchFn(node)) return node;
    node = node.parentNode || null;
  }
  return null;
}

/**
 * Bind a single delegated click handler for the student's submissions list.
 * Re-calling updates handlers without stacking duplicate DOM listeners.
 */
export function bindOwnSubmissionsDelegation(listEl, handlers = {}) {
  if (!listEl) return;
  const isAlreadyBound = ownSubmissionsHandlers.has(listEl);
  ownSubmissionsHandlers.set(listEl, handlers);
  if (isAlreadyBound) return;

  listEl.addEventListener("click", (event) => {
    const actionBtn = findClosestMatching(
      event?.target,
      "button[data-action][data-sub-id]",
      (node) =>
        String(node?.tagName || "").toUpperCase() === "BUTTON" &&
        Boolean(node?.dataset?.action) &&
        Boolean(node?.dataset?.subId)
    );
    if (!actionBtn) return;
    if (typeof listEl.contains === "function" && !listEl.contains(actionBtn)) return;

    const action = actionBtn.dataset?.action ?? actionBtn.getAttribute?.("data-action");
    const subId = actionBtn.dataset?.subId ?? actionBtn.getAttribute?.("data-sub-id");
    if (!subId) return;

    const current = ownSubmissionsHandlers.get(listEl) || {};
    if (action === "edit") {
      current.onEdit?.(subId);
    } else if (action === "delete") {
      current.onDelete?.(subId);
    }
  });
}

/**
 * Bind a single delegated change handler for admin submission moderation dropdowns.
 * Re-calling updates handlers without stacking duplicate DOM listeners.
 */
export function bindAdminModerationDelegation(listEl, handlers = {}) {
  if (!listEl) return;
  const isAlreadyBound = adminModerationHandlers.has(listEl);
  adminModerationHandlers.set(listEl, handlers);
  if (isAlreadyBound) return;

  listEl.addEventListener("change", (event) => {
    const selectEl = findClosestMatching(
      event?.target,
      'select[data-action="status-change"][data-sub-id]',
      (node) =>
        String(node?.tagName || "").toUpperCase() === "SELECT" &&
        node?.dataset?.action === "status-change" &&
        Boolean(node?.dataset?.subId)
    );
    if (!selectEl) return;
    if (typeof listEl.contains === "function" && !listEl.contains(selectEl)) return;

    const subId = selectEl.dataset?.subId ?? selectEl.getAttribute?.("data-sub-id");
    if (!subId) return;

    const current = adminModerationHandlers.get(listEl) || {};
    current.onStatusChange?.(subId, selectEl.value);
  });
}

function formatChannelLabel(channel) {
  if (channel === "gmail_compose") return "Gmail Launch";
  return "Saved Draft";
}

function formatCreatedDate(createdAt) {
  return createdAt?.toDate
    ? createdAt.toDate().toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
    : "Just now";
}

function buildEmptySubmissionsHelpNote(doc) {
  const note = createEl(doc, "div", { className: "submissions-empty-note" });
  note.appendChild(doc.createTextNode("No saved drafts or submissions yet. Customize a professor draft above and click "));
  note.appendChild(createEl(doc, "strong", { text: "Save Form Submission" }));
  note.appendChild(doc.createTextNode(", "));
  note.appendChild(createEl(doc, "strong", { text: "Open in Mail App (Gmail)" }));
  note.appendChild(doc.createTextNode(", or "));
  note.appendChild(createEl(doc, "strong", { text: "Save Draft" }));
  note.appendChild(doc.createTextNode(". Saving a draft stores text only and does not schedule or send an email."));
  return note;
}

/**
 * Safely render the authenticated student's own outreach submissions via DOM APIs.
 */
export function renderOwnSubmissionsDom(
  {
    listEl,
    countEl,
    editingBanner,
    editingLabel,
    isSignedIn,
    submissions = [],
    editingSubmissionId = null,
    doc = typeof document !== "undefined" ? document : null
  }
) {
  if (countEl) {
    countEl.textContent = isSignedIn ? `${submissions.length} SAVED` : "SIGN IN TO SAVE";
  }

  if (editingBanner && editingLabel) {
    if (editingSubmissionId) {
      const activeSub = submissions.find((s) => s.id === editingSubmissionId);
      editingBanner.style.display = "flex";
      editingLabel.textContent = `Editing saved submission for ${activeSub?.professorName || "Professor"}`;
    } else {
      editingBanner.style.display = "none";
    }
  }

  if (!listEl || !doc) return;
  clearChildren(listEl);

  if (!isSignedIn) {
    listEl.appendChild(
      createEl(doc, "div", {
        className: "submissions-empty-note",
        text:
          "Sign in with your student account to save outreach drafts, track submission history under your UID, and manage drafts securely. Saving a draft does not schedule or send an email."
      })
    );
    return;
  }

  if (submissions.length === 0) {
    listEl.appendChild(buildEmptySubmissionsHelpNote(doc));
    return;
  }

  const fragment = typeof doc.createDocumentFragment === "function" ? doc.createDocumentFragment() : null;
  const targetParent = fragment || listEl;

  for (const sub of submissions) {
    const safeStatus = normalizeSubmissionStatus(sub?.status);
    const statusLabel = String(sub?.status || "submitted").toUpperCase();
    const channelLabel = formatChannelLabel(sub?.channel);
    const dateStr = formatCreatedDate(sub?.createdAt);
    const subId = String(sub?.id ?? "");

    const item = createEl(doc, "div", { className: "submission-history-item" });

    const infoCol = createEl(doc, "div", { className: "sub-info-col" });
    const metaRow = createEl(doc, "div", { className: "sub-meta-row" });
    metaRow.appendChild(
      createEl(doc, "strong", {
        className: "sub-prof-name",
        text: sub?.professorName || "Professor"
      })
    );
    metaRow.appendChild(createEl(doc, "span", { className: "submission-meta-pill", text: channelLabel }));
    metaRow.appendChild(
      createEl(doc, "span", {
        className: `submission-meta-pill status-${safeStatus}`,
        text: statusLabel
      })
    );
    metaRow.appendChild(
      createEl(doc, "span", {
        className: "sub-date-label",
        text: dateStr
      })
    );

    const subjectLine = createEl(doc, "div", {
      className: "sub-subject-line",
      text: sub?.subject || ""
    });

    infoCol.appendChild(metaRow);
    infoCol.appendChild(subjectLine);

    const actionsCol = createEl(doc, "div", { className: "sub-actions-col" });
    actionsCol.appendChild(
      createEl(doc, "button", {
        type: "button",
        className: "btn-roster-switch",
        text: "Edit / Load",
        dataset: { action: "edit", subId }
      })
    );
    actionsCol.appendChild(
      createEl(doc, "button", {
        type: "button",
        className: "btn-roster-del",
        title: "Delete submission",
        text: "✕",
        dataset: { action: "delete", subId }
      })
    );

    item.appendChild(infoCol);
    item.appendChild(actionsCol);
    targetParent.appendChild(item);
  }

  if (fragment) {
    listEl.appendChild(fragment);
  }
}

/**
 * Safely render the Admin Moderation Console lists via DOM APIs without inline handlers.
 */
export function renderAdminDashboardDom(
  {
    listEl,
    stCountEl,
    subCountEl,
    isAdmin,
    adminStudents = [],
    adminSubmissions = [],
    doc = typeof document !== "undefined" ? document : null
  }
) {
  if (!isAdmin || !listEl || !doc) return;

  if (stCountEl) stCountEl.textContent = `${adminStudents.length} Students`;
  if (subCountEl) subCountEl.textContent = `${adminSubmissions.length} Submissions`;

  clearChildren(listEl);

  if (adminSubmissions.length === 0 && adminStudents.length === 0) {
    listEl.appendChild(
      createEl(doc, "div", {
        className: "submissions-empty-note",
        text: "No Firestore student profiles or submissions recorded yet."
      })
    );
    return;
  }

  const fragment = typeof doc.createDocumentFragment === "function" ? doc.createDocumentFragment() : null;
  const targetParent = fragment || listEl;

  targetParent.appendChild(
    createEl(doc, "div", {
      className: "admin-section-label",
      text: "Recent Submissions (All Students)"
    })
  );

  const visibleSubmissions = adminSubmissions.slice(0, 12);
  if (visibleSubmissions.length === 0) {
    targetParent.appendChild(
      createEl(doc, "div", { className: "submissions-empty-note", text: "No submissions yet." })
    );
  } else {
    for (const sub of visibleSubmissions) {
      const curStatus = normalizeSubmissionStatus(sub?.status);
      const subId = String(sub?.id ?? "");

      const row = createEl(doc, "div", {
        className: "submission-history-item submission-history-item-col"
      });

      const headerRow = createEl(doc, "div", {
        className: "admin-item-header"
      });

      const titleDiv = createEl(doc, "div", { className: "admin-item-title" });
      titleDiv.appendChild(doc.createTextNode(String(sub?.studentName || "")));
      titleDiv.appendChild(
        createEl(doc, "span", {
          className: "text-amber-warm",
          text: ` → ${sub?.professorName || ""}`
        })
      );

      const statusSelect = createEl(doc, "select", {
        className: "uni-filter-select admin-status-select",
        ariaLabel: "Review submission status",
        dataset: { action: "status-change", subId }
      });

      for (const optStatus of ALLOWED_SUBMISSION_STATUSES) {
        const opt = doc.createElement("option");
        opt.value = optStatus;
        opt.textContent = optStatus;
        if (curStatus === optStatus) {
          opt.selected = true;
        }
        statusSelect.appendChild(opt);
      }
      statusSelect.value = curStatus;

      headerRow.appendChild(titleDiv);
      headerRow.appendChild(statusSelect);

      const metaLine = createEl(doc, "div", {
        className: "admin-item-meta",
        text: `UID: ${sub?.uid || ""} · ${sub?.university || ""} · Subject: ${String(sub?.subject || "").slice(0, 70)}`
      });

      row.appendChild(headerRow);
      row.appendChild(metaLine);
      targetParent.appendChild(row);
    }
  }

  targetParent.appendChild(
    createEl(doc, "div", {
      className: "admin-section-label-students",
      text: "Registered Student Profiles"
    })
  );

  const visibleStudents = adminStudents.slice(0, 8);
  if (visibleStudents.length === 0) {
    targetParent.appendChild(
      createEl(doc, "div", { className: "submissions-empty-note", text: "No profiles yet." })
    );
  } else {
    for (const st of visibleStudents) {
      const stRow = createEl(doc, "div", { className: "saved-student-row" });
      const col = createEl(doc, "div", { className: "min-w-0" });

      const topLine = createEl(doc, "div", { className: "admin-item-title" });
      topLine.appendChild(doc.createTextNode(`${st?.name || ""} · `));
      topLine.appendChild(
        createEl(doc, "span", {
          className: "text-cyan-soft",
          text: `${st?.level || ""} (${st?.grade || ""})`
        })
      );

      const subLine = createEl(doc, "div", {
        className: "admin-student-email",
        text: `${st?.email || ""} · ${st?.school || ""}`
      });

      col.appendChild(topLine);
      col.appendChild(subLine);
      stRow.appendChild(col);
      targetParent.appendChild(stRow);
    }
  }

  if (fragment) {
    listEl.appendChild(fragment);
  }
}
