import fs from "node:fs";
import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds
} from "@firebase/rules-unit-testing";
import {
  doc,
  setDoc,
  writeBatch,
  serverTimestamp
} from "firebase/firestore";

function getTodayUtcKey() {
  return new Date().toISOString().slice(0, 10);
}

function validStudentDoc(uid, email) {
  return {
    uid,
    name: "Test Scholar",
    email,
    level: "ug",
    grade: "Year 2",
    school: "Test University",
    major: "Computer Science",
    pillar: "Sciences",
    skills: "Python",
    project: "Synthetic verification",
    role: "student",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
}

function validSubmissionDoc(uid) {
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
    status: "submitted",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
}

describe("Firestore Security Rules — Strict Document ID Validation Regression Tests", function () {
  this.timeout(15000);
  let testEnv;

  before(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: "demo-seekresearch-docid-xss",
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

  it("rejects crafted submission document IDs containing quotes, HTML tags, or JS expressions", async () => {
    const dateKey = getTodayUtcKey();
    const dbA = testEnv.authenticatedContext("stu_xss_1", { email: "xss1@test.edu", email_verified: true }).firestore();

    const maliciousSubIds = [
      "sub',this.value);alert(1);void('",
      'sub" onclick="alert(1)',
      "sub<img src=x onerror=alert(1)>",
      "sub;alert(1)",
      "sub with spaces"
    ];

    for (const badId of maliciousSubIds) {
      const batch = writeBatch(dbA);
      batch.set(doc(dbA, "submissions", badId), validSubmissionDoc("stu_xss_1"));
      batch.set(doc(dbA, "dailyQuotas", `stu_xss_1_${dateKey}`), {
        uid: "stu_xss_1",
        dateKey,
        lastSubmissionId: badId,
        count: 1,
        updatedAt: serverTimestamp()
      });
      await assertFails(batch.commit());
    }
  });

  it("rejects crafted student UIDs containing quotes or HTML/JS characters", async () => {
    const badUid = "stu'\"<script>";
    const dbBad = testEnv.authenticatedContext(badUid, { email: "bad@test.edu", email_verified: true }).firestore();
    await assertFails(setDoc(doc(dbBad, "students", badUid), validStudentDoc(badUid, "bad@test.edu")));
  });

  it("still permits valid alphanumeric/hyphen/underscore document IDs with atomic quota enforcement", async () => {
    const dateKey = getTodayUtcKey();
    const dbA = testEnv.authenticatedContext("stu_safe-01", { email: "safe1@test.edu", email_verified: true }).firestore();

    await assertSucceeds(
      setDoc(doc(dbA, "students", "stu_safe-01"), validStudentDoc("stu_safe-01", "safe1@test.edu"))
    );

    const safeSubId = "sub_Safe-2026_01";
    const batch = writeBatch(dbA);
    batch.set(doc(dbA, "submissions", safeSubId), validSubmissionDoc("stu_safe-01"));
    batch.set(doc(dbA, "dailyQuotas", `stu_safe-01_${dateKey}`), {
      uid: "stu_safe-01",
      dateKey,
      lastSubmissionId: safeSubId,
      count: 1,
      updatedAt: serverTimestamp()
    });
    await assertSucceeds(batch.commit());
  });
});
