/**
 * Local Firestore Security Rules Test Suite (Synthetic Test Accounts Only)
 * Run against Firebase Local Emulator Suite (never live production Firestore):
 *   npm install --save-dev @firebase/rules-unit-testing@^3 firebase@^11.1.0 mocha firebase-tools
 *   npx firebase-tools emulators:exec --project demo-seekresearch-rules --only firestore "npx mocha tests/firestore.rules.test.mjs"
 */

import fs from "node:fs";
import assert from "node:assert/strict";
import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds
} from "@firebase/rules-unit-testing";
import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  collection,
  query,
  where,
  writeBatch,
  serverTimestamp
} from "firebase/firestore";

function getUtcDateKey(offsetDays = 0) {
  const d = new Date(Date.now() + offsetDays * 86400000);
  return d.toISOString().slice(0, 10);
}

let testEnv;

function syntheticStudent(uid, email, role = "student") {
  return {
    uid,
    name: "Test Scholar",
    email,
    level: "ug",
    grade: "Year 2 (Sophomore)",
    school: "Sample Institute",
    major: "Computer Science",
    pillar: "Sciences",
    skills: "Python, Data Analysis",
    project: "Evaluated synthetic model accuracy",
    role,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
}

function syntheticSubmission(uid, status = "submitted") {
  return {
    uid,
    studentName: "Test Scholar",
    studentLevel: "ug",
    professorId: "mit_barzilay",
    professorName: "Prof. Regina Barzilay",
    university: "MIT (QS #1)",
    strategy: "undergrad",
    targetPaper: "AI in oncology",
    researchSummary: "Machine learning models for diagnostics.",
    subject: "Undergraduate research inquiry",
    body: "Dear Professor Barzilay, I am writing to express interest in your synthetic test study.",
    channel: "draft_saved",
    status,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
}

function atomicCreateSubmission(db, uid, subId, dateKey, nextCount, overrides = {}) {
  const batch = writeBatch(db);
  const subRef = doc(db, "submissions", subId);
  const quotaRef = doc(db, "dailyQuotas", `${uid}_${dateKey}`);

  batch.set(subRef, { ...syntheticSubmission(uid), ...(overrides.submission || {}) });

  const quotaDoc = {
    uid,
    dateKey,
    lastSubmissionId: subId,
    count: nextCount,
    updatedAt: serverTimestamp(),
    ...(overrides.quota || {})
  };

  if (nextCount === 1 && !overrides.forceQuotaUpdate) {
    batch.set(quotaRef, quotaDoc);
  } else {
    batch.update(quotaRef, {
      count: quotaDoc.count,
      lastSubmissionId: quotaDoc.lastSubmissionId,
      updatedAt: quotaDoc.updatedAt,
      ...(overrides.quotaUpdateExtra || {})
    });
  }

  return batch.commit();
}

async function seedStudentSubmissionFixture(uid, email, submissionId, dateKey) {
  await testEnv.withSecurityRulesDisabled(async (ctx) => {
    // Obtain Firestore instance once per context so useEmulator/settings is never re-invoked after first op
    const bypassDb = ctx.firestore();
    await setDoc(doc(bypassDb, "students", uid), syntheticStudent(uid, email));
    await setDoc(doc(bypassDb, "submissions", submissionId), syntheticSubmission(uid));
    await setDoc(doc(bypassDb, "dailyQuotas", `${uid}_${dateKey}`), {
      uid,
      dateKey,
      lastSubmissionId: submissionId,
      count: 1,
      updatedAt: serverTimestamp()
    });
  });
}

describe("SeekResearch Firestore Security Rules", function () {
  this.timeout(15000);

  before(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: "demo-seekresearch-rules",
      firestore: {
        rules: fs.readFileSync("firestore.rules", "utf8"),
        host: "127.0.0.1",
        port: 8080
      }
    });
  });

  beforeEach(async () => {
    await testEnv.clearFirestore();
  });

  after(async () => {
    await testEnv.cleanup();
  });

  it("denies all unauthenticated reads and writes", async () => {
    const anonDb = testEnv.unauthenticatedContext().firestore();
    await assertFails(getDoc(doc(anonDb, "students", "stu_a")));
    await assertFails(getDocs(collection(anonDb, "submissions")));
    await assertFails(setDoc(doc(anonDb, "students", "stu_a"), syntheticStudent("stu_a", "a@test.edu")));
  });

  it("enforces email verification: unverified users cannot update profile, create submissions/quotas, or access protected/other data", async () => {
    const todayUtc = getUtcDateKey();
    await seedStudentSubmissionFixture("stu_b", "b@test.edu", "sub_b", todayUtc);

    const unverifiedCtx = testEnv.authenticatedContext("stu_unverified", {
      email: "unverified@test.edu",
      email_verified: false
    });
    const dbUnv = unverifiedCtx.firestore();

    // Registration profile creation & own read work prior to email verification
    await assertSucceeds(setDoc(doc(dbUnv, "students", "stu_unverified"), syntheticStudent("stu_unverified", "unverified@test.edu", "student")));
    await assertSucceeds(getDoc(doc(dbUnv, "students", "stu_unverified")));

    // Protected collection listings and cross-student reads are denied when unverified
    await assertFails(getDocs(collection(dbUnv, "students")));
    await assertFails(getDocs(collection(dbUnv, "submissions")));
    await assertFails(getDoc(doc(dbUnv, "students", "stu_b")));
    await assertFails(getDoc(doc(dbUnv, "submissions", "sub_b")));
    await assertFails(getDoc(doc(dbUnv, "dailyQuotas", `stu_b_${todayUtc}`)));

    // Profile update, submission create, and quota create/update are strictly blocked until verified
    await assertFails(updateDoc(doc(dbUnv, "students", "stu_unverified"), {
      grade: "Year 4 (Senior)",
      updatedAt: serverTimestamp()
    }));
    await assertFails(atomicCreateSubmission(dbUnv, "stu_unverified", "sub_unv_1", todayUtc, 1));

    // Seed an existing submission (simulating cleanup during self-deletion) — edit blocked, self-delete allowed
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), "submissions", "sub_unv_seed"), syntheticSubmission("stu_unverified"));
    });
    await assertFails(updateDoc(doc(dbUnv, "submissions", "sub_unv_seed"), {
      subject: "Blocked unverified edit",
      updatedAt: serverTimestamp()
    }));
    await assertSucceeds(deleteDoc(doc(dbUnv, "submissions", "sub_unv_seed")));
    await assertSucceeds(deleteDoc(doc(dbUnv, "students", "stu_unverified")));
  });

  it("allows student registration profile creation only for own UID with role='student'", async () => {
    const stuA = testEnv.authenticatedContext("stu_a", { email: "a@test.edu", email_verified: true });
    const dbA = stuA.firestore();

    await assertSucceeds(setDoc(doc(dbA, "students", "stu_a"), syntheticStudent("stu_a", "a@test.edu", "student")));
    await assertFails(setDoc(doc(dbA, "students", "stu_a"), syntheticStudent("stu_a", "a@test.edu", "admin")));
    await assertFails(setDoc(doc(dbA, "students", "stu_b"), syntheticStudent("stu_b", "a@test.edu", "student")));
  });

  it("never allows passwords or extra fields inside student documents", async () => {
    const stuA = testEnv.authenticatedContext("stu_a", { email: "a@test.edu", email_verified: true });
    const dbA = stuA.firestore();
    const withPassword = { ...syntheticStudent("stu_a", "a@test.edu"), password: "leaky" };
    await assertFails(setDoc(doc(dbA, "students", "stu_a"), withPassword));
  });

  it("prevents students from reading, listing, editing, or deleting other students' data", async () => {
    const todayUtc = getUtcDateKey();
    await seedStudentSubmissionFixture("stu_b", "b@test.edu", "sub_b", todayUtc);

    const dbA = testEnv.authenticatedContext("stu_a", { email: "a@test.edu", email_verified: true }).firestore();
    await assertFails(getDoc(doc(dbA, "students", "stu_b")));
    await assertFails(getDocs(collection(dbA, "students")));
    await assertFails(updateDoc(doc(dbA, "students", "stu_b"), { name: "Hacked" }));
    await assertFails(deleteDoc(doc(dbA, "students", "stu_b")));

    await assertFails(getDoc(doc(dbA, "submissions", "sub_b")));
    await assertFails(getDocs(collection(dbA, "submissions")));
    await assertFails(deleteDoc(doc(dbA, "submissions", "sub_b")));

    await assertFails(getDoc(doc(dbA, "dailyQuotas", `stu_b_${todayUtc}`)));
    await assertFails(deleteDoc(doc(dbA, "dailyQuotas", `stu_b_${todayUtc}`)));
  });

  it("prevents a student from escalating their own role to admin on update", async () => {
    const dbA = testEnv.authenticatedContext("stu_a", { email: "a@test.edu", email_verified: true }).firestore();
    await assertSucceeds(setDoc(doc(dbA, "students", "stu_a"), syntheticStudent("stu_a", "a@test.edu", "student")));
    await assertFails(updateDoc(doc(dbA, "students", "stu_a"), { role: "admin", updatedAt: serverTimestamp() }));
    await assertSucceeds(
      updateDoc(doc(dbA, "students", "stu_a"), {
        grade: "Year 3 (Junior)",
        updatedAt: serverTimestamp()
      })
    );
  });

  it("allows students to atomically create, read, edit (without extra quota), and delete own submissions", async () => {
    const todayUtc = getUtcDateKey();
    const dbA = testEnv.authenticatedContext("stu_a", { email: "a@test.edu", email_verified: true }).firestore();

    await assertSucceeds(atomicCreateSubmission(dbA, "stu_a", "sub_a_1", todayUtc, 1));
    await assertSucceeds(getDocs(query(collection(dbA, "submissions"), where("uid", "==", "stu_a"))));
    await assertSucceeds(
      updateDoc(doc(dbA, "submissions", "sub_a_1"), {
        subject: "Edited Subject Line",
        body: "Updated synthetic test email body text exceeding ten characters.",
        updatedAt: serverTimestamp()
      })
    );
    await assertSucceeds(deleteDoc(doc(dbA, "submissions", "sub_a_1")));
  });

  it("blocks direct submission creation that skips atomic dailyQuotas consumption", async () => {
    const dbA = testEnv.authenticatedContext("stu_a", { email: "a@test.edu", email_verified: true }).firestore();
    await assertFails(addDoc(collection(dbA, "submissions"), syntheticSubmission("stu_a")));
    await assertFails(setDoc(doc(dbA, "submissions", "bypass_sub"), syntheticSubmission("stu_a")));
  });

  it("blocks students from deleting or resetting their own dailyQuotas document", async () => {
    const todayUtc = getUtcDateKey();
    const dbA = testEnv.authenticatedContext("stu_a", { email: "a@test.edu", email_verified: true }).firestore();
    const quotaRef = doc(dbA, "dailyQuotas", `stu_a_${todayUtc}`);

    await assertSucceeds(atomicCreateSubmission(dbA, "stu_a", "sub_a_1", todayUtc, 1));
    await assertFails(deleteDoc(quotaRef));
    await assertFails(
      atomicCreateSubmission(dbA, "stu_a", "sub_a_reset", todayUtc, 1, { forceQuotaUpdate: true })
    );
    await assertSucceeds(atomicCreateSubmission(dbA, "stu_a", "sub_a_2", todayUtc, 2));
    await assertFails(
      atomicCreateSubmission(dbA, "stu_a", "sub_a_dec", todayUtc, 1, { forceQuotaUpdate: true })
    );
  });

  it("blocks batching multiple submissions on a single dailyQuotas increment", async () => {
    const todayUtc = getUtcDateKey();
    const dbA = testEnv.authenticatedContext("stu_a", { email: "a@test.edu", email_verified: true }).firestore();
    const batch = writeBatch(dbA);

    batch.set(doc(dbA, "submissions", "batch_sub_1"), syntheticSubmission("stu_a"));
    batch.set(doc(dbA, "submissions", "batch_sub_2"), syntheticSubmission("stu_a"));
    batch.set(doc(dbA, "dailyQuotas", `stu_a_${todayUtc}`), {
      uid: "stu_a",
      dateKey: todayUtc,
      lastSubmissionId: "batch_sub_1",
      count: 1,
      updatedAt: serverTimestamp()
    });

    await assertFails(batch.commit());
  });

  it("blocks quota tampering without a new submission and blocks dateKey clock spoofing", async () => {
    const todayUtc = getUtcDateKey();
    const futureUtc = getUtcDateKey(3);
    const pastUtc = getUtcDateKey(-2);
    const dbA = testEnv.authenticatedContext("stu_a", { email: "a@test.edu", email_verified: true }).firestore();

    await assertFails(
      setDoc(doc(dbA, "dailyQuotas", `stu_a_${todayUtc}`), {
        uid: "stu_a",
        dateKey: todayUtc,
        lastSubmissionId: "missing_submission_id",
        count: 1,
        updatedAt: serverTimestamp()
      })
    );

    await assertSucceeds(atomicCreateSubmission(dbA, "stu_a", "sub_a_1", todayUtc, 1));
    await assertFails(
      updateDoc(doc(dbA, "dailyQuotas", `stu_a_${todayUtc}`), {
        count: 2,
        lastSubmissionId: "sub_a_1",
        updatedAt: serverTimestamp()
      })
    );

    await assertFails(atomicCreateSubmission(dbA, "stu_a", "sub_future", futureUtc, 1));
    await assertFails(atomicCreateSubmission(dbA, "stu_a", "sub_past", pastUtc, 1));
  });

  it("enforces strict 5-submissions-per-UTC-day cap even after deleting earlier submissions", async () => {
    const todayUtc = getUtcDateKey();
    const dbA = testEnv.authenticatedContext("stu_a", { email: "a@test.edu", email_verified: true }).firestore();

    await assertSucceeds(atomicCreateSubmission(dbA, "stu_a", "sub_1", todayUtc, 1));
    await assertSucceeds(atomicCreateSubmission(dbA, "stu_a", "sub_2", todayUtc, 2));
    await assertSucceeds(atomicCreateSubmission(dbA, "stu_a", "sub_3", todayUtc, 3));
    await assertSucceeds(atomicCreateSubmission(dbA, "stu_a", "sub_4", todayUtc, 4));
    await assertSucceeds(atomicCreateSubmission(dbA, "stu_a", "sub_5", todayUtc, 5));

    // Deleting an earlier submission keeps quota count at 5 and must not unlock a 6th create
    await assertSucceeds(deleteDoc(doc(dbA, "submissions", "sub_1")));
    await assertFails(deleteDoc(doc(dbA, "dailyQuotas", `stu_a_${todayUtc}`)));
    await assertFails(atomicCreateSubmission(dbA, "stu_a", "sub_6", todayUtc, 6));
    await assertFails(atomicCreateSubmission(dbA, "stu_a", "sub_skip", todayUtc, 5, { forceQuotaUpdate: true }));
  });

  it("allows verified admin custom claim users to moderate, and rejects unverified or doc-only admins", async () => {
    const todayUtc = getUtcDateKey();
    await seedStudentSubmissionFixture("stu_a", "a@test.edu", "sub_a", todayUtc);

    // A student doc claiming role='admin' without Auth custom claims must have ZERO admin access
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), "students", "spoof_admin"), syntheticStudent("spoof_admin", "spoof@test.edu", "admin"));
    });
    const spoofDb = testEnv.authenticatedContext("spoof_admin", { email: "spoof@test.edu", email_verified: true }).firestore();
    await assertFails(getDocs(collection(spoofDb, "students")));
    await assertFails(getDocs(collection(spoofDb, "submissions")));
    await assertFails(updateDoc(doc(spoofDb, "submissions", "sub_a"), { status: "reviewed", updatedAt: serverTimestamp() }));

    // An admin custom claim whose email is unverified must also be rejected
    const unverifiedAdminDb = testEnv.authenticatedContext("admin_unv", {
      email: "admin-unv@test.edu",
      role: "admin",
      email_verified: false
    }).firestore();
    await assertFails(getDocs(collection(unverifiedAdminDb, "students")));

    // Verified admin custom claim succeeds
    const adminDb = testEnv.authenticatedContext("admin_1", {
      email: "admin@test.edu",
      role: "admin",
      email_verified: true
    }).firestore();
    await assertSucceeds(getDocs(collection(adminDb, "students")));
    await assertSucceeds(getDocs(collection(adminDb, "submissions")));
    await assertSucceeds(
      updateDoc(doc(adminDb, "submissions", "sub_a"), {
        status: "reviewed",
        updatedAt: serverTimestamp()
      })
    );
    await assertSucceeds(deleteDoc(doc(adminDb, "dailyQuotas", `stu_a_${todayUtc}`)));
  });

  it("denies reads and writes to arbitrary undefined collections (default deny)", async () => {
    const dbA = testEnv.authenticatedContext("stu_a", { email: "a@test.edu", email_verified: true }).firestore();
    await assertFails(getDoc(doc(dbA, "privateConfig", "secrets")));
    await assertFails(setDoc(doc(dbA, "auditLogs", "log_1"), { actor: "stu_a" }));
  });
});
