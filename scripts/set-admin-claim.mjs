/**
 * TRUSTED SERVER-SIDE ADMIN ROLE UTILITY (NEVER IMPORT IN FRONTEND)
 *
 * Usage (Node >= 20, after downloading a private Service Account JSON locally
 * and keeping it OUTSIDE git):
 *
 *   set GOOGLE_APPLICATION_CREDENTIALS=C:\path\to\seekresearch-service-account.json
 *   npm install --no-save firebase-admin
 *   node scripts/set-admin-claim.mjs grant <TARGET_USER_UID>
 *   node scripts/set-admin-claim.mjs revoke <TARGET_USER_UID>
 *
 * The user must sign out and sign back in (or call user.getIdToken(true))
 * to receive the updated Firebase Auth Custom Claim.
 */

import admin from "firebase-admin";

const [, , action, targetUid] = process.argv;

if (!action || !targetUid || !["grant", "revoke"].includes(action)) {
  console.error("Usage: node scripts/set-admin-claim.mjs <grant|revoke> <UID>");
  process.exit(1);
}

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error(
    "Missing GOOGLE_APPLICATION_CREDENTIALS env var pointing to your private Service Account JSON."
  );
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

const nextClaims = action === "grant" ? { role: "admin" } : { role: "student" };

await admin.auth().setCustomUserClaims(targetUid, nextClaims);
const updatedUser = await admin.auth().getUser(targetUid);
console.log(
  `Updated custom claims for UID=${targetUid} (${updatedUser.email || "no-email"}):`,
  updatedUser.customClaims
);
process.exit(0);
