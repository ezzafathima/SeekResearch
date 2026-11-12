# SeekResearch — Final Hackathon Presentation Guide

> **Scope & Status:** SeekResearch is a **hackathon prototype** demonstrated locally against the Firebase Emulator Suite (`Auth`, `Firestore`, `Hosting`, and `Emulator UI`). Everything documented below reflects verified code, configuration, and local automated tests in `c:\Users\Ezza\app`. Nothing in this document claims live production deployment, active real-world users, institutional partnerships, or external security certifications.

---

## 1. The Problem SeekResearch Solves

High school and undergraduate students interested in academic research often face two twin barriers when reaching out to university professors:

1. **Fragmented discovery across disciplines:** Official faculty pages are scattered across university departments and rarely highlight whether faculty work spans STEM, Commerce, Design, or Humanities—or which labs/departments offer accessible pre-college or undergraduate pathways.
2. **Low-signal, mass-blasted cold emails:** Without structure, students frequently send generic, overly long, or unproofread emails to dozens of professors without tying their message to a professor's specific research area—creating spam for faculty and discouraging rejection or silence for students.

Existing generic email tools neither curate verified faculty profiles across disciplines nor enforce a deliberate daily outreach cap at the database boundary.

---

## 2. The Solution & Implemented Main Features

**SeekResearch** is a browser-based research discovery and structured cold-outreach studio paired with a student data portal. Instead of automating bulk spam, it combines discovery, structured personalization, and an enforced **5-submissions-per-UTC-day** guardrail.

### Verified Features in the Current Build

- **Curated Faculty & University Directory:**
  - Browse **138 curated faculty profiles** spanning **30 Top World Universities** (`TOP_30_UNIVERSITIES` & `PROFESSORS_LIST` in `js/seekresearch-app.js`).
  - Filter across **4 Academic Pillars** (*Sciences & Eng*, *Commerce & Econ*, *Design & Arch*, *Humanities & Arts*), subfield chips (including *High School Friendly*), university dropdown, and real-time keyword search.
- **High School & Pre-College Hub (`#highSchoolPortal`):**
  - 6 guidance cards and 4 outreach rules aimed at helping younger students prepare concrete questions and respectful, concise outreach.
- **Cold Mail Studio (`#coldMailer`):**
  - Select any of the 138 professors, pick from **8 outreach strategies**, enter student details, and generate an editable **Subject** and **Body** with live academic highlights.
  - **Safe Mail Handoff:** **📋 Copy Cold Email** copies cleanly to clipboard, and **✉️ Open in Mail App (Gmail)** opens Gmail compose in a new tab—with a safe popup-blocked fallback that keeps SeekResearch open and guides the user to **📋 Copy Cold Email** (`openGmailComposeTab()`).
  - **Persistence & History:** Verified signed-in students can click **💾 Save Form Submission** (writes a `submitted` record and increments daily quota) or **📝 Save Draft** (saves a draft for later), and review/update/delete eligible records in **My Submissions**.
- **Student Authentication & Portal:**
  - Registration, sign-in, password reset, email verification banner with **↻ Refresh Status**, **Student Data Pass** profile editing, and **Account Deletion** with re-authentication and Firestore data cleanup (`reauthAndDeleteAccount` + `deleteAllStudentFirestoreData`).
  - Optional **Guest Preview Mode** (`Skip Login & Preview SeekResearch Website as Guest →`) to explore the directory and Cold Mail Studio with a client-side `localStorage` `5/day` preview counter before registering.
- **Role-Based Admin Moderation Console (`#adminConsolePanel`):**
  - Visible only when Firebase Custom Claims include `role === "admin"` or `admin === true` alongside a verified email. Lists student records and submissions and updates submission moderation status.

---

## 3. Polished 4-Minute Judge Presentation Script

**Preparation before stepping up:** Start `npm run emulators` (`npm.cmd run emulators` on PowerShell if needed) and open `http://127.0.0.1:5000/?emulator=1` in Chrome, plus `http://127.0.0.1:4000/auth` in a background tab for quick verification clicks.

### [0:00 – 0:40] Hook & Problem (40s)
> **On screen:** Hero stage (`SEEK TO RESEARCH`, mission statement, `Launch Cold Mail Generator`, `Explore Top 30 Global Uni Faculty`).
>
> **Script:**
> "Hi everyone, I'm the developer of **SeekResearch**. When ambitious high school or undergraduate students try to get into academic research, they run into two problems: finding which professors actually match their interests across disciplines, and knowing how to write a concise, respectful cold email without accidentally spamming faculty. Most students either send one generic template to fifty professors, or give up before hitting send. SeekResearch fixes both by combining a structured faculty directory with a respectful outreach studio—and baking anti-spam quotas directly into our database security rules."

### [0:40 – 1:35] Directory, Cross-Disciplinary Discovery & Cold Mail Studio (55s)
> **Action:** Click **🔍 Explore Top 30 Global Uni Faculty**, switch across a couple of Pillar tabs (e.g., *Sciences & Eng* -> *Commerce & Econ* -> *High School Friendly*), click a professor card to load them into **Cold Mail Studio** (`#coldMailer`), and switch between two outreach strategies.
>
> **Script:**
> "Here in the directory, students can search and filter **138 faculty profiles** across **30 global universities** and **four academic pillars**—Sciences, Commerce, Design, and Humanities—including High School Friendly options. Clicking any professor loads their department and research focus straight into the **Cold Mail Studio**. From here, a student chooses an outreach strategy—one of eight structured approaches—tailors the live subject and body, and previews how their outreach aligns with the professor's topics."

### [1:35 – 2:35] Security-First Auth, Email Verification & Atomic Daily Quota (60s)
> **Action:** Open the Auth modal, register a synthetic demo user (e.g., `Alex Rivera`, `alex.demo@example.test`), point out the yellow **Email verification required** banner, switch to the terminal or `http://127.0.0.1:4000/auth` to open the emulator verification link, return and click **↻ Refresh Status**, then click **💾 Save Form Submission**.
>
> **Script:**
> "Now let's look under the hood at why this isn't just a static template site. When a student creates an account, Firebase Authentication enforces email verification—not just in the UI, where you can see the yellow warning banner blocking writes, but inside `firestore.rules` using `request.auth.token.email_verified == true`. Even if someone bypasses the frontend in DevTools, Firestore rejects unverified reads and writes.
>
> Once I complete verification in the Auth Emulator and click **Refresh Status**, the portal unlocks. Watch what happens when I click **Save Form Submission**: a Firestore transaction (`runTransaction`) atomically creates the submission document and increments `/dailyQuotas/{uid}_{UTC_date}`. Our `firestore.rules` require a 1-to-1 batched write between those two documents, validate the UTC server date via `request.time`, and cap every student at **5 outreach submissions per day**."

### [2:35 – 3:25] Safe Handoff, Data Isolation & Technical Architecture (50s)
> **Action:** Click **✉️ Open in Mail App (Gmail)** (or show **📋 Copy Cold Email** fallback if popup blocked), scroll to **My Submissions** to show the saved record, and briefly show `OUTREACH STUDIO · DEMO` / Student Data Pass.
>
> **Script:**
> "When the student is ready to actually send the email, SeekResearch hands off safely to Gmail compose—or falls back to a one-click copy toast if the browser blocks popups—so the student always stays in control of their own inbox.
>
> Every piece of saved data is strictly isolated by UID and validated for field types and lengths in `firestore.rules`. On the frontend, we eliminated all `.innerHTML` DOM sinks in favor of `createElement` and `textContent`, locked down our Content Security Policy in `firebase.json` with zero `'unsafe-inline'` or `'unsafe-eval'`, and gated the Admin Moderation Console behind server-verified Firebase Custom Claims."

### [3:25 – 4:00] Verification & Closing (35s)
> **On screen:** Return to the Hero / Portal overview (or terminal showing `npm test` passing summary if appropriate).
>
> **Script:**
> "Right now, SeekResearch runs completely reproducibly on the local Firebase Emulator Suite, backed by automated verification: **17 Firestore security rule and document-ID injection tests**, **8 XSS regression tests**, and **12 Playwright end-to-end browser checks** across desktop, tablet, and mobile viewports—all passing locally with zero CSP violations. Next steps beyond the hackathon include enabling Firebase App Check, publishing privacy/minor-safety policies, and deploying to production Firebase Hosting. Thank you—I'd love to take your technical questions."

---

## 4. Technical Architecture Breakdown

| Layer | Implementation Details (Verified Files) |
| :--- | :--- |
| **Frontend UI (HTML/CSS/JS)** | Pure static SPA built with vanilla HTML, CSS, and modular ES scripts (`index.html`, `css/seekresearch.css`, `js/seekresearch-app.js`, `js/firebase-config.js`, `js/firebase-auth.js`, `js/firebase-db.js`, `js/firebase-portal.js`, `js/firebase-portal-view.js`). Synchronized and SHA-256 verified into `public/` via `scripts/prepare-hosting.mjs`. |
| **Firebase Authentication** | Uses Firebase Auth `11.1.0` (`createUserWithEmailAndPassword`, `signInWithEmailAndPassword`, `sendEmailVerification`, `sendPasswordResetEmail`, `reload()`, `getIdTokenResult(true)`, `reauthenticateWithCredential`, `deleteUser`). Localhost emulator mode routes auth traffic to `http://127.0.0.1:9099`. |
| **Cloud Firestore Data Model** | 3 collections stored in Firestore (emulator `127.0.0.1:8080` for local demo):<br>1. `/students/{uid}` — Student profile (`13` validated fields; stores no passwords).<br>2. `/submissions/{docId}` — Outreach submissions & drafts (`15` validated fields, composite index on `uid ASC, createdAt DESC` in `firestore.indexes.json`).<br>3. `/dailyQuotas/{uid}_{YYYY-MM-DD}` — Server-date keyed daily outreach counters (`5` validated fields). |
| **Firestore Security Rules** | `firestore.rules` (473 lines): Default-deny catch-all at bottom; enforces `isAuthenticated()`, `isEmailVerified()` (`request.auth.token.email_verified == true`), UID ownership (`isOwner(uid)` / `isDocOwner()`), admin custom claims (`isAdmin()` checking `role == 'admin' || admin == true` + verified email), regex document-ID validation (`^[A-Za-z0-9_-]{1,128}$`), exact field-key/type/size validators, and strict server-time matching via `request.time`. |
| **Daily Submission Quota (5/UTC-Day)** | Handled atomically in `createSubmissionWithDailyQuota()` (`js/firebase-db.js`) via `runTransaction`. It computes the UTC date (`YYYY-MM-DD`), checks `dailyQuotas/{uid}_{date}`, rejects once count reaches `5`, and atomically creates the `/submissions/{id}` doc while creating or incrementing the quota doc (`1..5`). `firestore.rules` enforces `isAtomicQuotaConsumed` / `isAtomicNewSubmission` with `getAfter()` so neither document can be forged independently, and denies client deletion of `dailyQuotas` (`allow delete: if isAdmin()`). Guest preview mode uses a separate client-side `localStorage` counter (`seekresearch_daily_mail_v1`). |

---

## 5. Security Measures Demonstrated in the Project

1. **Server-Side Verification Gate (`request.auth.token.email_verified == true`):** Both the UI banner and `firestore.rules` block profile mutations, submission writes, and protected reads until the user's Firebase Auth email is verified.
2. **Strict UID Data Isolation & Role Protection:** Students can only read/write their own `/students/{uid}` and `/submissions/{id}` documents, and schema rules prevent clients from escalating privileges or altering protected role/timestamp fields.
3. **Trusted Admin RBAC via Custom Claims:** Admin console visibility and Firestore admin permissions require Firebase Custom Claims (`role == 'admin'` or `admin == true`) provisioned server-side (`scripts/set-admin-claim.mjs`), never client-writable profile flags.
4. **Atomic 5/Day Quota Anti-Abuse Enforcement:** Uses `getAfter()` cross-document validation in `firestore.rules` tied to `request.time` UTC date keys so users cannot reset their quota by deleting submissions, tampering with quota counts, or spoofing device clocks.
5. **Document ID Injection Protection:** `isValidDocIdSegment` restricts document IDs to `^[A-Za-z0-9_-]{1,128}$`, and quota IDs are pinned to `{uid}_{YYYY-MM-DD}`.
6. **Zero `.innerHTML` Sinks (XSS Defense):** Dynamic DOM rendering uses `document.createElement` and `.textContent`, verified by 8 automated XSS regression tests (`tests/xss-regression.test.mjs`) and zero `.innerHTML` occurrences in runtime scripts.
7. **Hardened Content Security Policy & Security Headers (`firebase.json`):** Serves `script-src 'self' https://www.gstatic.com`, `script-src-attr 'none'`, `style-src 'self' https://fonts.googleapis.com`, `style-src-attr 'none'`, `object-src 'none'`, `frame-ancestors 'none'`, `X-Frame-Options: DENY`, and `X-Content-Type-Options: nosniff` — with zero `'unsafe-inline'` or `'unsafe-eval'`.
8. **Safe Popup & Sign-Out State Cleanup:** Blocked Gmail compose popups keep SeekResearch open with a recovery toast (`Copy Cold Email`), and `resetSignedOutState()` / `clearStudentSessionUi()` wipe UI state on sign-out.
9. **Re-Authenticated Account & Data Deletion:** Account deletion requires password re-authentication (`reauthenticateWithCredential`) before batch-deleting `/submissions` and `/students/{uid}` and deleting the Auth user (`deleteUser`).

---

## 6. Implemented vs. Planned Comparison

| Capability | Current Verified Status | Planned / Post-Hackathon |
| :--- | :--- | :--- |
| **Core Directory, 4 Pillars & High School Hub** | **Implemented** (30 universities, 138 faculty profiles, filters, rules) | Ongoing directory expansion & verification workflow |
| **Cold Mail Studio (8 Strategies & Gmail/Copy Handoff)** | **Implemented** (client-side template personalization, popup-safe fallback) | Optional backend mail telemetry / institutional templates |
| **Firebase Auth & Verified-Email Rules** | **Implemented & Tested Locally** (Auth/Firestore/Hosting emulators) | Production SMTP / custom verification action URL |
| **Atomic 5/UTC-Day Quota & Security Rules** | **Implemented & Tested Locally** (`firestore.rules` + 17 rules tests) | Production monitoring & quota telemetry |
| **Admin Moderation Console & Custom Claim Script** | **Implemented Locally** (`#adminConsolePanel` + `scripts/set-admin-claim.mjs`) | Dedicated admin provisioning workflow |
| **XSS Prevention & Strict CSP (Local Emulator)** | **Implemented & Tested Locally** (8 XSS tests + 0 CSP errors in 12 E2E checks) | Production CSP split (removing `127.0.0.1` emulator `connect-src` origins) |
| **Firebase App Check (`ReCaptchaV3Provider`)** | **Scaffolded Only** (`APP_CHECK_SITE_KEY = ""` in `js/firebase-config.js`) | Register site key and enforce App Check in Firebase Console |
| **Vendored / Offline Firebase SDK Bundle** | **Planned** (currently loads Firebase 11.1.0 ESM from `gstatic.com`) | Bundle Firebase SDK locally so Auth UI works with zero internet |
| **Production Deployment & Billing/Blaze** | **Not Deployed** (no `.firebaserc`; Spark/local emulator only) | Configure production project & deploy via `firebase deploy` |
| **Privacy Policy, Terms & Student/Minor Safeguards** | **Planned Only** (Stage 5.4 planning; not published) | Publish reviewed legal policy, retention schedule & age/consent controls before real student onboarding |

---

## 7. Top 10 Likely Technical Judge Questions & Answers

1. **Q: Why use a client-side `runTransaction` + `firestore.rules` instead of a Cloud Function for the daily quota?**
   * **A:** This prototype is engineered to stay within Firebase's free **Spark plan** without requiring a paid Blaze plan for Cloud Functions. Using Firestore `runTransaction` paired with `getAfter()` cross-document validation and server `request.time` in `firestore.rules` gives us server-enforced atomicity—neither the submission nor the quota document can exist or increment without the other, and clients cannot manipulate timestamps or delete quota documents.
2. **Q: Couldn't a user bypass the 5/day limit by just modifying JavaScript in browser DevTools?**
   * **A:** Only in **Guest Preview Mode**, which runs intentionally in browser `localStorage`. For authenticated users writing to Firestore, `firestore.rules` checks `request.time` (server UTC clock), forces the quota doc ID to match `uid + "_" + YYYY-MM-DD`, validates that `count` increments by `+1` up to a ceiling of `5`, and uses `getAfter()` to require a matching `/submissions` write. DevTools edits cannot bypass `firestore.rules`.
3. **Q: What prevents an unverified user or automated script from writing spam into Firestore?**
   * **A:** Every protected read and write rule in `firestore.rules` requires `isEmailVerified()`, which checks `request.auth.token.email_verified == true` inside the signed Firebase ID token—not a client boolean. Additionally, strict schema rules check exact allowed field keys, string lengths, URL prefixes, and document ID regex (`^[A-Za-z0-9_-]{1,128}$`).
4. **Q: What stops a student from setting `role: "admin"` in their own `/students/{uid}` document?**
   * **A:** First, `isAdmin()` in `firestore.rules` ignores Firestore profile documents entirely and inspects Firebase Auth **Custom Claims** (`request.auth.token.role == 'admin' || request.auth.token.admin == true`), which can only be minted using server-side Admin SDK credentials (`scripts/set-admin-claim.mjs`). Second, `/students/{uid}` rules forbid students from writing or escalating role fields.
5. **Q: Why does deleting an account keep `/dailyQuotas` intact when `/students` and `/submissions` are deleted?**
   * **A:** Two reasons: `allow delete: if isAdmin()` on `dailyQuotas` prevents a user from deleting their quota counter mid-day to get unlimited attempts, and `deleteAllStudentFirestoreData()` intentionally leaves `/dailyQuotas` while batch-deleting `/submissions` and `/students/{uid}` so daily rate-limiting survives delete-and-recreate abuse.
6. **Q: How did you verify there are no Cross-Site Scripting (XSS) vulnerabilities?**
   * **A:** We removed `.innerHTML` across all runtime JavaScript (creating elements via `document.createElement` and assigning user/catalog text via `.textContent`), locked down `firebase.json` CSP with `script-src-attr 'none'`, `style-src-attr 'none'`, and zero `'unsafe-inline'`, and run 8 automated XSS regression tests (`tests/xss-regression.test.mjs`) confirming XSS payloads render inertly.
7. **Q: Does SeekResearch send emails automatically from your server?**
   * **A:** No. Automated mass emailing increases spam risk. SeekResearch helps students craft tailored, respectful emails in the Cold Mail Studio, saves records/drafts to their own history, and hands off safely to Gmail compose (`Open in Mail App (Gmail)`) or clipboard (`Copy Cold Email`), keeping the human student in charge of hitting Send.
8. **Q: Why separate root files from `public/` with `prepare-hosting.mjs`?**
   * **A:** `scripts/prepare-hosting.mjs` acts as an explicit allowlist sync (`8` approved runtime files with SHA-256 verification and import/asset validation). That ensures test scripts, `.vscode` settings, and dev tools in the repo root are never accidentally served by Firebase Hosting (`public/`).
9. **Q: What happens if a user opens SeekResearch locally from disk (`file://`) instead of the Hosting emulator?**
   * **A:** Opening via `file://` violates standard browser ES module CORS and CSP semantics. That's why `.vscode/launch.json` and `HACKATHON_DEMO.md` launch `http://127.0.0.1:5000/?emulator=1`, where the local Hosting emulator serves the exact CSP headers and routes Auth/Firestore calls cleanly to `127.0.0.1:9099` and `127.0.0.1:8080`.
10. **Q: What is still missing before SeekResearch can onboard real students publicly?**
    * **A:** Three main things: (1) enabling and enforcing Firebase App Check (`APP_CHECK_SITE_KEY` is currently empty), (2) stripping localhost emulator origins from the production CSP and deploying to a production Firebase project, and (3) publishing reviewed Privacy Policy, Terms of Service, and age/minor-safety governance before accepting real student personal data.

---

## 8. Offline / Internet-Failure Fallback Procedure

> **Why plan for this:** `js/firebase-config.js`, `js/firebase-auth.js`, and `js/firebase-db.js` import Firebase `11.1.0` ESM modules from `https://www.gstatic.com/firebasejs/11.1.0/`, and `index.html` links Google Fonts (`https://fonts.googleapis.com`). Meanwhile, all local HTML, CSS, `js/seekresearch-app.js`, the 30 universities, 138 faculty profiles, High School Hub, and Cold Mail Engine run locally from `'self'` (`http://127.0.0.1:5000/`).

Use this 3-tier fallback sequence if venue Wi-Fi drops:

1. **Tier 1 — Keep Pre-Warmed Browser Tab / Switch to Mobile Hotspot (Full Firebase Emulator Demo):**
   - Start `npm run emulators` and load `http://127.0.0.1:5000/?emulator=1` **before** judging while online so Chrome caches `gstatic.com` Firebase ESM modules, or connect briefly to a phone hotspot.
   - Once cached or online briefly, Auth (`9099`), Firestore (`8080`), and Hosting (`5000`) run 100% locally on your machine with zero external database traffic.
2. **Tier 2 — Hard Offline Mode (Guest Studio + Local Test Proof):**
   - If the tab refreshes completely offline and `gstatic.com` fails to load from cache, Auth/Firestore module initialization will be unavailable, **but `index.html`, `css/seekresearch.css`, and `js/seekresearch-app.js` still load from the local Hosting emulator (`http://127.0.0.1:5000/?emulator=1`)**.
   - Click **Skip Login & Preview SeekResearch Website as Guest →** to run the live interactive demo: filter all **138 faculty** across **30 universities** and **4 pillars**, explore the **High School Hub**, craft outreach in **Cold Mail Studio** across all **8 strategies**, demo **📋 Copy Cold Email**, and trigger the client-side `5/day` preview counter.
3. **Tier 3 — Code & Security Verification Walkthrough:**
   - Open `firestore.rules` (especially `isEmailVerified()`, `isAdmin()`, and `isAtomicQuotaConsumed`) alongside `js/firebase-db.js` (`createSubmissionWithDailyQuota`) in the editor, and run the **offline local XSS suite** (`npm.cmd run test:xss`) and **hosting sync check** (`npm.cmd run prepare:hosting:verify`)—plus run `npm.cmd run test:rules` if the Firestore emulator jar is already cached locally.

---

## 9. Final Presentation-Day Checklist

- [ ] **Sync & Verify Hosting Files:** Run `npm.cmd run prepare:hosting:verify` and confirm `8/8` files in `public/` match root.
- [ ] **Run Automated Verification Suite Before Judging:** Run `npm.cmd test` and confirm **8 passing** XSS tests and **17 passing** Firestore rules tests.
- [ ] **Start Local Emulator Suite Early:** Run `npm.cmd run emulators` and verify ports `5000` (Hosting), `9099` (Auth), `8080` (Firestore), and `4000` (Emulator UI) report ready.
- [ ] **Pre-Load Browser Tabs:**
  - Tab 1: `http://127.0.0.1:5000/?emulator=1` (main demo stage; keep open so `gstatic.com` modules are warm).
  - Tab 2: `http://127.0.0.1:4000/auth` (quick access to Auth Emulator verification link / user view).
- [ ] **Prepare Clean Synthetic Demo Credentials:** Use fictional data only (e.g., `Alex Rivera`, `alex.demo@example.test`) and sign out cleanly before stepping on stage if re-running registration.
- [ ] **Check Popup Behavior & Clipboard:** Know where **📋 Copy Cold Email** is on screen in case the judge-screen browser blocks the Gmail compose popup (SeekResearch stays open and displays a toast guiding the audience to **📋 Copy Cold Email**).
- [ ] **No Real Data / No Secrets Visible:** Ensure no API keys, `.json` service accounts, or real student details appear in open editor tabs or terminal history.
- [ ] **Backup Plan Ready:** Have phone hotspot toggled off/ready and `firestore.rules` + `HACKATHON_DEMO.md` open in VS Code in case internet drops.
