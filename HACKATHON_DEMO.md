# SeekResearch — Hackathon Local Emulator Demo Guide

This guide covers running SeekResearch locally against the Firebase Emulator Suite for hackathon demonstrations without modifying production Firebase data or bypassing authentication/email verification.

## 1. Sync Hosting Files & Run Tests

Verify that `public/` matches the root runtime files and run the security/XSS test suites:

```powershell
npm run prepare:hosting
npm test
```

> If PowerShell script execution policy blocks `npm.ps1`, run `npm.cmd run prepare:hosting`, `npm.cmd test`, and `npm.cmd run emulators`.

## 2. Start the Local Firebase Emulators

Start the Auth (`9099`), Firestore (`8080`), Hosting (`5000`), and Emulator UI (`4000`) servers:

```powershell
npm run emulators
```

Wait until Firebase prints that the Hosting, Auth, and Firestore emulators are ready.

## 3. Open the Demo

Open Chrome directly to:

```text
http://127.0.0.1:5000/?emulator=1
```

Or press **F5** in VS Code using the `Launch SeekResearch Emulator Demo` configuration in `.vscode/launch.json`.

- Any connection to `http://127.0.0.1:5000/?emulator=1` (and `http://127.0.0.1:5000/` on the Hosting emulator port) routes Firebase Authentication and Cloud Firestore traffic exclusively to the local emulators (`127.0.0.1:9099` and `127.0.0.1:8080`).

## 4. Demonstrating Email Verification (Emulator Procedure)

SeekResearch enforces verified emails (`request.auth.token.email_verified == true`) in both the UI and `firestore.rules` before allowing profile edits or saving outreach submissions.

1. Register a fictional test account (for example, `Alex Rivera`, `alex.demo@example.test`) on the **Create Account** tab.
2. Observe the yellow **Email verification required** banner inside the signed-in portal (editing/saving remains gated until verified).
3. To complete verification locally without real email delivery:
   - **Option A (Terminal):** Look in the `npm run emulators` terminal output for the line starting with:
     `To verify the email address ..., follow this link: http://127.0.0.1:9099/emulator/action?mode=verifyEmail&...`
     Open that URL in a browser tab.
   - **Option B (Emulator UI):** Open `http://127.0.0.1:4000/auth`, view the synthetic test user / email verification link, and open it.
4. Return to `http://127.0.0.1:5000/?emulator=1` and click **↻ Refresh Status**.
5. The banner turns green (`✓ Email verified with Firebase Authentication.`), unlocking profile updates, draft saving, and the 5-per-UTC-day quota counter.

## 5. Safe Cold Mailer & Gmail Compose Demo

- Use **💾 Save Form Submission** or **📝 Save Draft** to demonstrate atomic Firestore writes and the 5/UTC-day quota enforcement.
- Clicking **✉️ Open in Mail App (Gmail)** opens Gmail compose in a new tab. If popups are blocked by the browser, SeekResearch stays open and displays a prompt to use **📋 Copy Cold Email** instead.
