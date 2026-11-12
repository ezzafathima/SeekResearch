import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  runTransaction,
  serverTimestamp,
  writeBatch
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { db } from "./firebase-config.js";

export function getServerAlignedUtcDateKey() {
  return new Date().toISOString().slice(0, 10);
}

const ALLOWED_LEVELS = new Set(["highschool", "ug", "uni", "ms", "pg"]);
const ALLOWED_PILLARS = new Set(["Sciences", "Commerce", "Design", "Humanities"]);
const ALLOWED_STRATEGIES = new Set([
  "highschool",
  "undergrad",
  "commerce",
  "design",
  "humanities",
  "summer",
  "grad",
  "paper"
]);
const ALLOWED_CHANNELS = new Set(["gmail_compose", "tuesday_queue", "draft_saved"]);
const ALLOWED_ADMIN_STATUSES = new Set(["submitted", "reviewed", "flagged"]);

export const FIRESTORE_LIMITS = Object.freeze({
  studentName: 120,
  email: 254,
  grade: 60,
  school: 160,
  major: 120,
  skills: 400,
  project: 800,
  professorId: 80,
  professorName: 120,
  university: 180,
  targetPaper: 300,
  researchSummary: 1500,
  subject: 200,
  bodyMin: 10,
  bodyMax: 5000
});

function validateTextField(val, label, { min = 0, max, fallback } = {}) {
  const s = String(val ?? "").trim();
  if (!s) {
    if (fallback !== undefined) return fallback;
    if (min > 0) {
      throw new Error(`${label} cannot be empty.`);
    }
    return "";
  }
  if (min > 0 && s.length < min) {
    throw new Error(`${label} must be at least ${min} characters (currently ${s.length}).`);
  }
  if (typeof max === "number" && s.length > max) {
    throw new Error(`${label} must be ${max} characters or fewer (currently ${s.length}).`);
  }
  return s;
}

export function validateStudentProfileInput(data = {}, { isCreate = false, userEmail = "" } = {}) {
  const level = normalizeLevel(data.level);
  const pillar = normalizePillar(data.pillar);

  const result = {
    name: validateTextField(data.name, "Full name", {
      min: 1,
      max: FIRESTORE_LIMITS.studentName,
      fallback: isCreate ? "Student" : undefined
    }),
    level,
    grade: validateTextField(data.grade, "Grade / Academic Year", {
      min: 1,
      max: FIRESTORE_LIMITS.grade,
      fallback: isCreate ? "Grade 11" : undefined
    }),
    school: validateTextField(data.school, "School / University", {
      min: 0,
      max: FIRESTORE_LIMITS.school,
      fallback: isCreate ? "Independent Scholar" : undefined
    }),
    major: validateTextField(data.major, "Major / Track", {
      min: 0,
      max: FIRESTORE_LIMITS.major,
      fallback: isCreate ? pillar : undefined
    }),
    pillar,
    skills: validateTextField(data.skills, "Skills & coursework", {
      min: 0,
      max: FIRESTORE_LIMITS.skills,
      fallback: isCreate ? "Analytical Research, Academic Writing" : undefined
    }),
    project: validateTextField(data.project, "Highlight project", {
      min: 0,
      max: FIRESTORE_LIMITS.project,
      fallback: isCreate ? `preparing an independent ${pillar.toLowerCase()} research inquiry` : undefined
    })
  };

  if (isCreate) {
    result.email = validateTextField(userEmail || data.email, "Email address", {
      min: 3,
      max: FIRESTORE_LIMITS.email
    });
  }

  return result;
}

export function validateSubmissionInput(payload = {}, profile = null, fallbackDisplayName = "") {
  const strategy = normalizeStrategy(payload.strategy);
  return {
    studentName: validateTextField(
      String(payload.studentName ?? "").trim() || profile?.name || fallbackDisplayName || "Student",
      "Student name",
      { min: 1, max: FIRESTORE_LIMITS.studentName }
    ),
    studentLevel: normalizeLevel(payload.studentLevel || profile?.level),
    professorId: validateTextField(
      String(payload.professorId ?? "").trim() || "custom",
      "Professor ID",
      { min: 1, max: FIRESTORE_LIMITS.professorId }
    ),
    professorName: validateTextField(
      String(payload.professorName ?? "").trim() || "Professor",
      "Target professor name",
      { min: 1, max: FIRESTORE_LIMITS.professorName }
    ),
    university: validateTextField(
      String(payload.university ?? "").trim() || "Research Institution",
      "University & department",
      { min: 1, max: FIRESTORE_LIMITS.university }
    ),
    strategy,
    targetPaper: validateTextField(payload.targetPaper, "Primary paper / focus", {
      min: 0,
      max: FIRESTORE_LIMITS.targetPaper
    }),
    researchSummary: validateTextField(payload.researchSummary, "Professor research summary", {
      min: 0,
      max: FIRESTORE_LIMITS.researchSummary
    }),
    subject: validateTextField(payload.subject, "Email subject", {
      min: 1,
      max: FIRESTORE_LIMITS.subject
    }),
    body: validateTextField(payload.body, "Email body", {
      min: FIRESTORE_LIMITS.bodyMin,
      max: FIRESTORE_LIMITS.bodyMax
    }),
    channel: normalizeChannel(payload.channel)
  };
}

export function validateSubmissionPatch(subject, body) {
  return {
    subject: validateTextField(subject, "Email subject", {
      min: 1,
      max: FIRESTORE_LIMITS.subject
    }),
    body: validateTextField(body, "Email body", {
      min: FIRESTORE_LIMITS.bodyMin,
      max: FIRESTORE_LIMITS.bodyMax
    })
  };
}

function normalizeLevel(val) {
  return ALLOWED_LEVELS.has(val) ? val : "highschool";
}

function normalizePillar(val) {
  return ALLOWED_PILLARS.has(val) ? val : "Sciences";
}

function normalizeStrategy(val) {
  return ALLOWED_STRATEGIES.has(val) ? val : "undergrad";
}

function normalizeChannel(val) {
  return ALLOWED_CHANNELS.has(val) ? val : "draft_saved";
}

/**
 * Create a new student profile document at /students/{uid}.
 * Never includes a password field and always locks initial role to "student".
 */
export async function createStudentProfile(user, data) {
  if (!user?.uid) throw new Error("Authenticated user is required.");

  const validated = validateStudentProfileInput(data, {
    isCreate: true,
    userEmail: user.email || ""
  });

  const payload = {
    uid: user.uid,
    ...validated,
    role: "student",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  await setDoc(doc(db, "students", user.uid), payload);
  return payload;
}

/**
 * Fetch only the signed-in student's own profile document.
 */
export async function getStudentProfile(uid) {
  if (!uid) return null;
  const snap = await getDoc(doc(db, "students", uid));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

/**
 * Update only editable fields on /students/{uid}.
 * Leaves uid, email, role, and createdAt untouched (protected in firestore.rules).
 */
export async function updateStudentProfile(uid, updates) {
  if (!uid) throw new Error("Authenticated user ID is required.");

  const validated = validateStudentProfileInput(updates, { isCreate: false });
  const safeUpdates = {
    ...validated,
    updatedAt: serverTimestamp()
  };

  await updateDoc(doc(db, "students", uid), safeUpdates);
  return safeUpdates;
}

/**
 * Atomically create a student submission under /submissions/{id} AND consume 1 slot
 * of today's server-UTC quota under /dailyQuotas/{uid}_{UTC_YYYY-MM-DD} in one
 * Firestore transaction, matched 1-to-1 via lastSubmissionId in firestore.rules.
 */
export async function createSubmissionWithDailyQuota(
  user,
  profile,
  payload,
  dateKey = getServerAlignedUtcDateKey(),
  maxLimit = 5
) {
  if (!user?.uid) throw new Error("Please sign in to submit and save outreach forms.");

  const validated = validateSubmissionInput(payload, profile, user.displayName || "");

  const utcDateKey = /^\d{4}-\d{2}-\d{2}$/.test(String(dateKey || ""))
    ? String(dateKey)
    : getServerAlignedUtcDateKey();

  const subRef = doc(collection(db, "submissions"));
  const quotaRef = doc(db, "dailyQuotas", `${user.uid}_${utcDateKey}`);

  const docData = {
    uid: user.uid,
    ...validated,
    status: "submitted",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  const count = await runTransaction(db, async (tx) => {
    const quotaSnap = await tx.get(quotaRef);
    const prev = quotaSnap.exists() && typeof quotaSnap.data()?.count === "number"
      ? quotaSnap.data().count
      : 0;

    if (prev >= maxLimit) {
      const err = new Error(`Daily limit of ${maxLimit} submissions reached for today (UTC).`);
      err.code = "resource-exhausted";
      err.currentCount = prev;
      throw err;
    }

    const next = prev + 1;
    tx.set(subRef, docData);

    if (!quotaSnap.exists()) {
      tx.set(quotaRef, {
        uid: user.uid,
        dateKey: utcDateKey,
        lastSubmissionId: subRef.id,
        count: 1,
        updatedAt: serverTimestamp()
      });
    } else {
      tx.update(quotaRef, {
        count: next,
        lastSubmissionId: subRef.id,
        updatedAt: serverTimestamp()
      });
    }

    return next;
  });

  return {
    submission: { id: subRef.id, ...docData },
    count,
    dateKey: utcDateKey
  };
}

/**
 * Fetch only the signed-in user's own submissions (sorted newest first client-side
 * so no composite index build blocks local/demo use).
 */
export async function getOwnSubmissions(uid) {
  if (!uid) return [];
  const q = query(
    collection(db, "submissions"),
    where("uid", "==", uid),
    orderBy("createdAt", "desc"),
    limit(50)
  );
  const snap = await getDocs(q);
  const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  items.sort((a, b) => {
    const tA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
    const tB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
    return tB - tA;
  });
  return items;
}

/**
 * Update subject/body of an owned submission that is still in "submitted" status.
 */
export async function updateOwnSubmission(submissionId, subject, body) {
  if (!submissionId) throw new Error("Submission ID is required.");
  const { subject: cleanSub, body: cleanBody } = validateSubmissionPatch(subject, body);
  await updateDoc(doc(db, "submissions", submissionId), {
    subject: cleanSub,
    body: cleanBody,
    updatedAt: serverTimestamp()
  });
}

/**
 * Delete one of the student's own submissions.
 */
export async function deleteOwnSubmission(submissionId) {
  if (!submissionId) throw new Error("Submission ID is required.");
  await deleteDoc(doc(db, "submissions", submissionId));
}

/**
 * Read daily submission count for /dailyQuotas/{uid}_{UTC_YYYY-MM-DD}.
 */
export async function getTodayQuotaCount(uid, dateKey = getServerAlignedUtcDateKey()) {
  if (!uid || !dateKey) return 0;
  const ref = doc(db, "dailyQuotas", `${uid}_${dateKey}`);
  const snap = await getDoc(ref);
  if (!snap.exists()) return 0;
  const c = snap.data()?.count;
  return typeof c === "number" ? c : 0;
}

/**
 * Admin-only operations (enforced on backend by Firestore Security Rules Custom Claims).
 */
export async function adminListStudents() {
  const q = query(collection(db, "students"), orderBy("createdAt", "desc"), limit(50));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function adminListSubmissions() {
  const q = query(collection(db, "submissions"), orderBy("createdAt", "desc"), limit(50));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function adminUpdateSubmissionStatus(submissionId, newStatus) {
  if (!ALLOWED_ADMIN_STATUSES.has(newStatus)) {
    throw new Error("Invalid submission review status.");
  }
  await updateDoc(doc(db, "submissions", submissionId), {
    status: newStatus,
    updatedAt: serverTimestamp()
  });
}

/**
 * Remove student-deletable Firestore data belonging to uid prior to Auth deleteUser().
 * Non-PII /dailyQuotas counters remain protected against student deletion (`allow delete: if isAdmin();`)
 * so accounts cannot reset daily quota limits before deletion.
 */
export async function deleteAllStudentFirestoreData(uid) {
  if (!uid) throw new Error("UID is required for account cleanup.");

  const targets = [];

  const subSnap = await getDocs(query(collection(db, "submissions"), where("uid", "==", uid)));
  subSnap.docs.forEach((d) => targets.push(d.ref));

  const profileRef = doc(db, "students", uid);
  const profileSnap = await getDoc(profileRef);
  if (profileSnap.exists()) {
    targets.push(profileRef);
  }

  for (let i = 0; i < targets.length; i += 400) {
    const batch = writeBatch(db);
    targets.slice(i, i + 400).forEach((ref) => batch.delete(ref));
    await batch.commit();
  }
}
