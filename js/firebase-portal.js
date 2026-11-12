import { auth, USE_EMULATORS } from "./firebase-config.js";
import {
  mapFirebaseError,
  registerStudentAccount,
  loginStudentAccount,
  resendVerificationEmail,
  refreshAuthUserState,
  getUserClaims,
  sendStudentPasswordReset,
  reauthAndDeleteAccount,
  logoutFirebaseUser,
  subscribeToAuthState
} from "./firebase-auth.js";
import {
  getServerAlignedUtcDateKey,
  createStudentProfile,
  getStudentProfile,
  updateStudentProfile,
  validateStudentProfileInput,
  createSubmissionWithDailyQuota,
  getOwnSubmissions,
  updateOwnSubmission,
  deleteOwnSubmission,
  getTodayQuotaCount,
  adminListStudents,
  adminListSubmissions,
  adminUpdateSubmissionStatus,
  deleteAllStudentFirestoreData
} from "./firebase-db.js";
import {
  bindOwnSubmissionsDelegation,
  bindAdminModerationDelegation,
  renderOwnSubmissionsDom,
  renderAdminDashboardDom
} from "./firebase-portal-view.js";

const DAILY_LIMIT = 5;

const state = {
  user: null,
  profile: null,
  isAdmin: false,
  submissions: [],
  editingSubmissionId: null,
  todayCount: 0,
  adminStudents: [],
  adminSubmissions: []
};
let hadAuthenticatedSession = false;

function getTodayDateKey() {
  return getServerAlignedUtcDateKey();
}

function setButtonLoading(btnOrId, isLoading, loadingText = "Processing...") {
  const btn = typeof btnOrId === "string" ? document.getElementById(btnOrId) : btnOrId;
  if (!btn) return;
  if (isLoading) {
    if (!btn.dataset.originalText) {
      btn.dataset.originalText = btn.textContent;
    }
    btn.disabled = true;
    btn.classList.add("is-loading");
    btn.textContent = loadingText;
  } else {
    btn.disabled = false;
    btn.classList.remove("is-loading");
    if (btn.dataset.originalText) {
      btn.textContent = btn.dataset.originalText;
    }
  }
}

function setFeedback(boxId, message, type = "success") {
  if (typeof window.setAuthFeedback === "function") {
    window.setAuthFeedback(boxId, message, type);
    return;
  }
  const el = document.getElementById(boxId);
  if (!el) return;
  el.className = message ? `auth-feedback-box visible ${type}` : "auth-feedback-box";
  el.textContent = message || "";
}

function toast(msg) {
  if (typeof window.showToast === "function") {
    window.showToast(msg);
  }
}

function syncAppStateGlobals() {
  window.SeekAuthState = {
    isSignedIn: Boolean(state.user),
    uid: state.user?.uid || null,
    emailVerified: Boolean(state.user?.emailVerified),
    isAdmin: state.isAdmin,
    profile: state.profile,
    todayQuotaUsed: state.todayCount
  };
}

function updateVerificationBanner() {
  const banner = document.getElementById("emailVerificationBanner");
  const statusEl = document.getElementById("emailVerifyStatusText");
  const resendBtn = document.getElementById("btnResendVerify");
  const refreshBtn = document.getElementById("btnRefreshVerify");

  if (!banner || !statusEl) return;
  if (!state.user) {
    banner.style.display = "none";
    return;
  }

  banner.style.display = "flex";
  if (state.user.emailVerified) {
    banner.classList.add("verified");
    statusEl.textContent = "✓ Email verified with Firebase Authentication.";
    if (resendBtn) resendBtn.style.display = "none";
    if (refreshBtn) refreshBtn.style.display = "none";
  } else {
    banner.classList.remove("verified");
    statusEl.textContent = USE_EMULATORS
      ? "Email verification required — open the emulator verification link from your terminal or http://127.0.0.1:4000/auth, then click Refresh Status before editing your profile or saving outreach."
      : "Email verification required — check your inbox (then click Refresh Status) before editing your profile or saving outreach submissions.";
    if (resendBtn) resendBtn.style.display = "inline-flex";
    if (refreshBtn) refreshBtn.style.display = "inline-flex";
  }
}

function updateAdminWorkspaceVisibility() {
  const adminPanel = document.getElementById("adminConsolePanel");
  const studentNotice = document.getElementById("studentPrivacyNotice");
  const roleBadge = document.getElementById("activeRoleBadge");

  if (roleBadge) {
    if (state.isAdmin) {
      roleBadge.textContent = "ADMIN CLAIM VERIFIED";
      roleBadge.style.background = "rgba(251, 191, 36, 0.22)";
      roleBadge.style.color = "#fde68a";
      roleBadge.style.borderColor = "rgba(251, 191, 36, 0.55)";
    } else {
      roleBadge.textContent = "STUDENT ROLE";
      roleBadge.style.background = "rgba(0, 229, 204, 0.14)";
      roleBadge.style.color = "#5eead4";
      roleBadge.style.borderColor = "rgba(0, 229, 204, 0.35)";
    }
  }

  if (adminPanel) {
    adminPanel.style.display = state.isAdmin ? "flex" : "none";
  }
  if (studentNotice) {
    studentNotice.style.display = state.isAdmin ? "none" : "flex";
  }
}

function renderOwnSubmissionsList() {
  const listEl = document.getElementById("mySubmissionsList");
  const countEl = document.getElementById("mySubmissionsCountBadge");
  const editingBanner = document.getElementById("editingSubmissionBanner");
  const editingLabel = document.getElementById("editingSubmissionLabel");

  bindOwnSubmissionsDelegation(listEl, {
    onEdit: (subId) => loadSubmissionIntoEditor(subId),
    onDelete: (subId) => deleteMySubmission(subId)
  });

  renderOwnSubmissionsDom({
    listEl,
    countEl,
    editingBanner,
    editingLabel,
    isSignedIn: Boolean(state.user),
    submissions: state.submissions,
    editingSubmissionId: state.editingSubmissionId
  });
}

function renderAdminDashboardLists() {
  const stCountEl = document.getElementById("adminStudentsCount");
  const subCountEl = document.getElementById("adminSubmissionsCount");
  const listEl = document.getElementById("adminModerationList");
  if (!state.isAdmin || !listEl) return;

  bindAdminModerationDelegation(listEl, {
    onStatusChange: (subId, nextStatus) => adminChangeSubmissionStatus(subId, nextStatus)
  });

  renderAdminDashboardDom({
    listEl,
    stCountEl,
    subCountEl,
    isAdmin: state.isAdmin,
    adminStudents: state.adminStudents,
    adminSubmissions: state.adminSubmissions
  });
}

function renderQuotaDisplayFromFirebase() {
  const remaining = Math.max(0, DAILY_LIMIT - state.todayCount);
  const badge = document.getElementById("dailyRateLimitBadge");
  const radar = document.getElementById("radarDailyCapMetric");
  if (badge) {
    if (remaining === 0) {
      badge.style.color = "#fca5a5";
      badge.textContent = `⚠ DAILY LIMIT REACHED: ${state.todayCount} / ${DAILY_LIMIT} OUTREACH EMAILS USED TODAY (0 LEFT)`;
    } else {
      badge.style.color = "var(--cyan-bright)";
      badge.textContent = `✦ RATE LIMIT: ${state.todayCount} / ${DAILY_LIMIT} OUTREACH EMAILS USED TODAY (${remaining} LEFT)`;
    }
  }
  if (radar) {
    radar.textContent = `${remaining} / ${DAILY_LIMIT} Left`;
    radar.style.color = remaining === 0 ? "#fca5a5" : "var(--amber-warm)";
  }
}

async function hydrateSignedInWorkspace(user) {
  try {
    const refreshedAuth = await refreshAuthUserState(user);
    user = refreshedAuth.user || user;
    state.user = user;
    hadAuthenticatedSession = true;

    const [{ isAdmin }, profile, submissions, quotaCount] = await Promise.all([
      getUserClaims(user),
      getStudentProfile(user.uid),
      getOwnSubmissions(user.uid).catch(() => []),
      getTodayQuotaCount(user.uid, getTodayDateKey()).catch(() => 0)
    ]);

    state.isAdmin = isAdmin;
    state.submissions = submissions;
    state.todayCount = quotaCount;
    state.profile =
      profile || {
        uid: user.uid,
        name: user.displayName || "Authenticated User",
        email: user.email || "",
        level: "uni",
        grade: isAdmin ? "Administrator" : "Student",
        school: "SeekResearch",
        major: "Research Outreach",
        pillar: "Sciences",
        skills: "Research Methods",
        project: "Managing academic research outreach",
        role: isAdmin ? "admin" : "student"
      };

    syncAppStateGlobals();
    updateVerificationBanner();
    updateAdminWorkspaceVisibility();
    window.renderActiveAuthWorkspace?.(state.profile, state.isAdmin);
    window.syncActiveStudentToColdMailer?.(false, state.profile);
    renderOwnSubmissionsList();
    renderQuotaDisplayFromFirebase();

    if (state.isAdmin) {
      await handleAdminLoadDashboard(false);
    } else {
      state.adminStudents = [];
      state.adminSubmissions = [];
    }
  } catch (err) {
    setFeedback("authFeedbackBox", mapFirebaseError(err), "error");
  }
}

function resetSignedOutState() {
  const shouldClearColdMailer = hadAuthenticatedSession;
  hadAuthenticatedSession = false;
  state.user = null;
  state.profile = null;
  state.isAdmin = false;
  state.submissions = [];
  state.editingSubmissionId = null;
  state.todayCount = 0;
  state.adminStudents = [];
  state.adminSubmissions = [];
  syncAppStateGlobals();
  updateVerificationBanner();
  updateAdminWorkspaceVisibility();
  window.clearStudentSessionUi?.({ clearColdMailer: shouldClearColdMailer });
  window.renderActiveAuthWorkspace?.(null, false);
  renderOwnSubmissionsList();
  if (typeof window.renderDailyMailQuota === "function") {
    window.renderDailyMailQuota();
  }
}

async function handleStudentLogin(event) {
  event.preventDefault();
  const email = (document.getElementById("loginEmailInput")?.value || "").trim();
  const password = document.getElementById("loginPasswordInput")?.value || "";
  const submitBtn = document.getElementById("loginSubmitBtn");

  if (!email || !password) {
    setFeedback("authFeedbackBox", "Please enter both your email and password.", "error");
    return;
  }

  setFeedback("authFeedbackBox", "", "");
  setButtonLoading(submitBtn, true, "Signing in with Firebase...");
  try {
    await loginStudentAccount(email, password);
    document.getElementById("loginPasswordInput").value = "";
    window.enterMainApp?.("heroStage");
    toast("Signed in with Firebase Authentication!");
  } catch (err) {
    setFeedback("authFeedbackBox", mapFirebaseError(err), "error");
  } finally {
    setButtonLoading(submitBtn, false);
  }
}

async function handleStudentRegister(event) {
  event.preventDefault();
  const name = (document.getElementById("regNameInput")?.value || "").trim();
  const email = (document.getElementById("regEmailInput")?.value || "").trim();
  const password = document.getElementById("regPasswordInput")?.value || "";
  const level = document.querySelector('input[name="regAcademicLevel"]:checked')?.value || "highschool";
  const grade = (document.getElementById("regGradeInput")?.value || "").trim();
  const school = (document.getElementById("regSchoolInput")?.value || "").trim();
  const major = (document.getElementById("regMajorInput")?.value || "").trim();
  const pillar = document.getElementById("regPillarSelect")?.value || "Sciences";
  const skills = (document.getElementById("regSkillsInput")?.value || "").trim();
  const project = (document.getElementById("regProjectInput")?.value || "").trim();
  const submitBtn = document.getElementById("registerSubmitBtn");

  if (!name) {
    setFeedback("authFeedbackBox", "Please enter your full name.", "error");
    return;
  }
  if (!email || !email.includes("@")) {
    setFeedback("authFeedbackBox", "Please enter a valid email address.", "error");
    return;
  }
  if (password.length < 6) {
    setFeedback("authFeedbackBox", "Firebase requires a password of at least 6 characters.", "error");
    return;
  }
  if (!grade) {
    setFeedback("authFeedbackBox", "Please specify your Grade or Academic Year.", "error");
    return;
  }

  try {
    validateStudentProfileInput(
      { name, email, level, grade, school, major, pillar, skills, project },
      { isCreate: true, userEmail: email }
    );
  } catch (validationErr) {
    setFeedback("authFeedbackBox", validationErr.message, "error");
    return;
  }

  setFeedback("authFeedbackBox", "", "");
  setButtonLoading(submitBtn, true, "Creating Firebase Account...");
  try {
    const profileInput = { name, email, level, grade, school, major, pillar, skills, project };
    const { verificationSent } = await registerStudentAccount(
      email,
      password,
      profileInput,
      createStudentProfile
    );
    ["regNameInput", "regEmailInput", "regPasswordInput", "regSchoolInput", "regMajorInput", "regSkillsInput", "regProjectInput"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    });
    window.enterMainApp?.("heroStage");
    toast(
      verificationSent
        ? `Welcome, ${name}! Verification email sent — verify your email before editing profile data or saving outreach.`
        : `Account created for ${name}! Please verify your email before submitting outreach.`
    );
  } catch (err) {
    setFeedback("authFeedbackBox", mapFirebaseError(err), "error");
  } finally {
    setButtonLoading(submitBtn, false);
  }
}

function togglePasswordResetPanel(forceOpen) {
  const panel = document.getElementById("forgotPasswordBox");
  if (!panel) return;
  const isHidden = window.getComputedStyle(panel).display === "none";
  const next = typeof forceOpen === "boolean" ? forceOpen : isHidden;
  panel.style.display = next ? "flex" : "none";
  if (next) {
    const loginEmail = document.getElementById("loginEmailInput")?.value?.trim();
    const resetEmailEl = document.getElementById("resetEmailInput");
    if (resetEmailEl && loginEmail && !resetEmailEl.value) {
      resetEmailEl.value = loginEmail;
    }
  }
}

async function handlePasswordReset() {
  const email = (document.getElementById("resetEmailInput")?.value || "").trim();
  const btn = document.getElementById("btnSendResetEmail");
  if (!email || !email.includes("@")) {
    setFeedback("authFeedbackBox", "Enter your account email to receive a password reset link.", "error");
    return;
  }
  setButtonLoading(btn, true, "Sending...");
  try {
    await sendStudentPasswordReset(email);
    setFeedback(
      "authFeedbackBox",
      "If an account matches that email, a Firebase password reset link has been sent.",
      "success"
    );
    togglePasswordResetPanel(false);
  } catch (err) {
    if (err?.code === "auth/invalid-email" || err?.code === "auth/too-many-requests" || err?.code === "auth/network-request-failed") {
      setFeedback("authFeedbackBox", mapFirebaseError(err), "error");
    } else {
      setFeedback(
        "authFeedbackBox",
        "If an account matches that email, a Firebase password reset link has been sent.",
        "success"
      );
    }
  } finally {
    setButtonLoading(btn, false);
  }
}

async function handleResendVerification() {
  const btn = document.getElementById("btnResendVerify");
  setButtonLoading(btn, true, "Sending...");
  try {
    await resendVerificationEmail(state.user);
    setFeedback("profileEditFeedback", "Verification email sent! Please check your inbox and spam folder.", "success");
    toast("Verification email sent.");
  } catch (err) {
    setFeedback("profileEditFeedback", mapFirebaseError(err), "error");
  } finally {
    setButtonLoading(btn, false);
  }
}

async function handleRefreshVerification() {
  const btn = document.getElementById("btnRefreshVerify");
  setButtonLoading(btn, true, "Checking...");
  try {
    const { user, emailVerified, claims } = await refreshAuthUserState(state.user);
    if (user) state.user = user;
    state.isAdmin = Boolean(emailVerified && (claims?.role === "admin" || claims?.admin === true));
    syncAppStateGlobals();
    updateVerificationBanner();
    updateAdminWorkspaceVisibility();
    window.renderActiveAuthWorkspace?.(state.profile, state.isAdmin);
    if (state.isAdmin) {
      await handleAdminLoadDashboard(false);
    }
    setFeedback(
      "profileEditFeedback",
      emailVerified
        ? "Email verified! Profile editing and outreach submission access are now unlocked."
        : "Email is not verified yet — open the verification link in your inbox, then click Refresh Status.",
      emailVerified ? "success" : "error"
    );
    toast(emailVerified ? "Email verification confirmed!" : "Email is not verified yet — check your inbox.");
  } catch (err) {
    setFeedback("profileEditFeedback", mapFirebaseError(err), "error");
  } finally {
    setButtonLoading(btn, false);
  }
}

async function saveEditedStudentData(event) {
  event.preventDefault();
  if (!state.user) return;
  if (!state.user.emailVerified) {
    const msg = "Email verification required: please verify your email and click Refresh Status before editing your profile.";
    setFeedback("profileEditFeedback", msg, "error");
    toast(msg);
    return;
  }
  const name = document.getElementById("editNameInput").value.trim();
  const grade = document.getElementById("editGradeInput").value.trim();
  const level = document.querySelector('input[name="editAcademicLevel"]:checked')?.value || state.profile?.level || "highschool";
  const btn = document.getElementById("saveProfileSubmitBtn");

  if (!name || !grade) {
    setFeedback("profileEditFeedback", "Name and Grade / Academic Year cannot be empty.", "error");
    return;
  }

  setButtonLoading(btn, true, "Saving to Firestore...");
  try {
    const updated = await updateStudentProfile(state.user.uid, {
      name,
      level,
      grade,
      school: document.getElementById("editSchoolInput").value.trim(),
      major: document.getElementById("editMajorInput").value.trim(),
      pillar: document.getElementById("editPillarSelect").value,
      skills: document.getElementById("editSkillsInput").value.trim(),
      project: document.getElementById("editProjectInput").value.trim()
    });
    state.profile = { ...state.profile, ...updated };
    syncAppStateGlobals();
    window.renderActiveAuthWorkspace?.(state.profile, state.isAdmin);
    window.syncActiveStudentToColdMailer?.(false, state.profile);
    setFeedback("profileEditFeedback", "Student profile saved to Cloud Firestore & synced with Cold Mail Studio.", "success");
    toast(`Updated profile in Firestore for ${name}`);
  } catch (err) {
    setFeedback("profileEditFeedback", mapFirebaseError(err), "error");
  } finally {
    setButtonLoading(btn, false);
  }
}

function toggleDeleteAccountPanel(forceOpen) {
  const box = document.getElementById("deleteAccountConfirmBox");
  if (!box) return;
  const isHidden = window.getComputedStyle(box).display === "none";
  const next = typeof forceOpen === "boolean" ? forceOpen : isHidden;
  box.style.display = next ? "flex" : "none";
  if (!next) {
    const pwdEl = document.getElementById("deleteAccountPasswordInput");
    if (pwdEl) pwdEl.value = "";
  }
}

async function handleConfirmDeleteAccount(event) {
  event.preventDefault();
  if (!state.user) return;
  const password = document.getElementById("deleteAccountPasswordInput")?.value || "";
  const btn = document.getElementById("btnConfirmDeleteAccount");

  if (!password) {
    setFeedback("profileEditFeedback", "Enter your current password to confirm permanent account deletion.", "error");
    return;
  }

  setFeedback("profileEditFeedback", "", "");
  setButtonLoading(btn, true, "Deleting Account & Data...");
  try {
    await reauthAndDeleteAccount(password, deleteAllStudentFirestoreData);
    toggleDeleteAccountPanel(false);
    togglePasswordResetPanel(false);
    hadAuthenticatedSession = false;
    state.user = null;
    state.profile = null;
    state.isAdmin = false;
    state.submissions = [];
    state.editingSubmissionId = null;
    state.todayCount = 0;
    state.adminStudents = [];
    state.adminSubmissions = [];
    syncAppStateGlobals();
    updateVerificationBanner();
    updateAdminWorkspaceVisibility();
    window.clearStudentSessionUi?.({ clearColdMailer: true });
    window.renderActiveAuthWorkspace?.(null, false);
    renderOwnSubmissionsList();
    if (typeof window.renderDailyMailQuota === "function") {
      window.renderDailyMailQuota();
    }
    document.body.classList.remove("account-modal-open");
    document.body.classList.add("auth-gate-active");
    window.switchAuthTab?.("login");
    window.scrollTo({ top: 0, behavior: "smooth" });
    toast("Your account and Firestore student data have been permanently deleted.");
  } catch (err) {
    setFeedback("profileEditFeedback", mapFirebaseError(err), "error");
  } finally {
    setButtonLoading(btn, false);
  }
}

async function logoutStudentAccount(showMsg = true, targetTab = "login") {
  try {
    hadAuthenticatedSession = false;
    await logoutFirebaseUser();
    toggleDeleteAccountPanel(false);
    togglePasswordResetPanel(false);
    window.clearStudentSessionUi?.({ clearColdMailer: true });
    document.body.classList.remove("account-modal-open");
    document.body.classList.add("auth-gate-active");
    window.switchAuthTab?.(targetTab);
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (showMsg) toast("Signed out safely.");
  } catch (err) {
    toast(mapFirebaseError(err));
  }
}

function readColdMailFormPayload(channel = "draft_saved") {
  const strategy = document.querySelector('input[name="emailStrategy"]:checked')?.value || "undergrad";
  return {
    studentName: document.getElementById("studentNameInput")?.value.trim() || state.profile?.name || "Student",
    studentLevel: state.profile?.level || (strategy === "highschool" ? "highschool" : "uni"),
    professorId: window.getSelectedColdMailProfId?.() || "custom",
    professorName: document.getElementById("targetProfInput")?.value.trim() || "Professor",
    university: document.getElementById("targetUniInput")?.value.trim() || "Research University",
    strategy,
    targetPaper: document.getElementById("targetPaperInput")?.value.trim() || "",
    researchSummary: document.getElementById("targetResearchWorkInput")?.value.trim() || "",
    subject: document.getElementById("subjectEditorInput")?.value.trim() || "",
    body: document.getElementById("emailBodyEditor")?.value.trim() || "",
    channel
  };
}

async function resyncQuotaFromServer() {
  if (!state.user) return;
  try {
    state.todayCount = await getTodayQuotaCount(state.user.uid, getTodayDateKey());
    syncAppStateGlobals();
    renderQuotaDisplayFromFirebase();
  } catch {
    // Keep last known count on transient read failures
  }
}

async function commitAtomicSubmissionWithQuota(channel) {
  const payload = readColdMailFormPayload(channel);
  if (state.todayCount >= DAILY_LIMIT) {
    const err = new Error(`Daily submission limit reached (${DAILY_LIMIT} / ${DAILY_LIMIT} today UTC).`);
    err.code = "resource-exhausted";
    throw err;
  }

  const res = await createSubmissionWithDailyQuota(
    state.user,
    state.profile,
    payload,
    getTodayDateKey(),
    DAILY_LIMIT
  );
  state.todayCount = res.count;
  renderQuotaDisplayFromFirebase();
  syncAppStateGlobals();
  state.submissions = await getOwnSubmissions(state.user.uid);
  renderOwnSubmissionsList();
  return res;
}

async function saveColdMailSubmission(channel = "draft_saved") {
  if (!state.user) {
    toast("Sign in with your student account to save outreach submissions in Firestore.");
    window.openStudentPortal?.("login");
    return null;
  }
  if (!state.user.emailVerified) {
    const msg = "Email verification required: verify your email and click Refresh Status before saving or editing outreach submissions.";
    setFeedback("profileEditFeedback", msg, "error");
    toast(msg);
    return null;
  }

  const btn = document.getElementById("btnSaveSubmission");

  if (btn && channel === "draft_saved") {
    setButtonLoading(btn, true, "Saving to Firestore...");
  }
  try {
    if (state.editingSubmissionId && channel === "draft_saved") {
      const payload = readColdMailFormPayload(channel);
      await updateOwnSubmission(state.editingSubmissionId, payload.subject, payload.body);
      state.editingSubmissionId = null;
      state.submissions = await getOwnSubmissions(state.user.uid);
      renderOwnSubmissionsList();
      toast("Updated your saved submission in Firestore (no extra daily quota used).");
      return true;
    }

    const res = await commitAtomicSubmissionWithQuota(channel);
    if (channel === "draft_saved") {
      toast(`Saved draft in Firestore (${res.count} / ${DAILY_LIMIT} daily UTC quota used). Does not schedule or send an email.`);
    }
    return res.submission;
  } catch (err) {
    await resyncQuotaFromServer();
    toast(mapFirebaseError(err));
    return null;
  } finally {
    if (btn && channel === "draft_saved") {
      setButtonLoading(btn, false);
    }
  }
}

function loadSubmissionIntoEditor(submissionId) {
  const sub = state.submissions.find((s) => s.id === submissionId);
  if (!sub) return;

  state.editingSubmissionId = sub.id;
  if (sub.professorId && typeof window.loadProfessorForDraft === "function") {
    const dirSel = document.getElementById("profDirectorySelect");
    if (dirSel && Array.from(dirSel.options).some((o) => o.value === sub.professorId)) {
      window.loadProfessorForDraft(sub.professorId, true);
    }
  }

  document.getElementById("targetProfInput").value = sub.professorName || "";
  document.getElementById("targetUniInput").value = sub.university || "";
  document.getElementById("targetPaperInput").value = sub.targetPaper || "";
  const workEl = document.getElementById("targetResearchWorkInput");
  if (workEl) workEl.value = sub.researchSummary || "";

  const targetStrategy = sub.strategy || "undergrad";
  const radio = Array.from(document.querySelectorAll('input[name="emailStrategy"]')).find(
    (el) => el.value === targetStrategy
  );
  if (radio) radio.checked = true;

  document.getElementById("subjectEditorInput").value = sub.subject || "";
  document.getElementById("emailBodyEditor").value = sub.body || "";
  window.setMailEditorMode?.("edit");
  window.onManualMailEdit?.();
  renderOwnSubmissionsList();
  window.scrollToSection?.("coldMailer");
  toast(`Loaded saved submission for ${sub.professorName}. Edit and click Save Submission to update.`);
}

function cancelSubmissionEditMode() {
  state.editingSubmissionId = null;
  renderOwnSubmissionsList();
}

async function deleteMySubmission(submissionId) {
  if (!state.user || !submissionId) return;
  try {
    await deleteOwnSubmission(submissionId);
    if (state.editingSubmissionId === submissionId) {
      state.editingSubmissionId = null;
    }
    state.submissions = await getOwnSubmissions(state.user.uid);
    renderOwnSubmissionsList();
    toast("Submission deleted from Firestore.");
  } catch (err) {
    toast(mapFirebaseError(err));
  }
}

async function recordOutreachQuotaAndSubmission(channel, onErrorToast = true) {
  if (!state.user) return { ok: false, unauthenticated: true };
  if (!state.user.emailVerified) {
    const msg = "Email verification required: verify your email and click Refresh Status before creating outreach submissions.";
    setFeedback("profileEditFeedback", msg, "error");
    if (onErrorToast) toast(msg);
    return { ok: false, unverified: true };
  }
  try {
    const res = await commitAtomicSubmissionWithQuota(channel);
    return { ok: true, count: res.count, submission: res.submission };
  } catch (err) {
    await resyncQuotaFromServer();
    if (err?.code === "resource-exhausted") {
      if (onErrorToast) toast(err.message);
      return { ok: false, limitReached: true, error: err };
    }
    if (onErrorToast) toast(mapFirebaseError(err));
    throw err;
  }
}

async function handleAdminLoadDashboard(showSuccessToast = true) {
  if (!state.isAdmin) return;
  const btn = document.getElementById("btnRefreshAdminConsole");
  setButtonLoading(btn, true, "Loading...");
  try {
    const [students, submissions] = await Promise.all([
      adminListStudents(),
      adminListSubmissions()
    ]);
    state.adminStudents = students;
    state.adminSubmissions = submissions;
    renderAdminDashboardLists();
    if (showSuccessToast) toast("Admin moderation view refreshed.");
  } catch (err) {
    toast(mapFirebaseError(err));
  } finally {
    setButtonLoading(btn, false);
  }
}

async function adminChangeSubmissionStatus(submissionId, newStatus) {
  if (!state.isAdmin) {
    toast("Admin custom claim required.");
    return;
  }
  try {
    await adminUpdateSubmissionStatus(submissionId, newStatus);
    toast(`Submission status updated to "${newStatus}".`);
    await handleAdminLoadDashboard(false);
  } catch (err) {
    toast(mapFirebaseError(err));
  }
}

window.SeekFirebaseBridge = {
  isReady: true,
  useEmulators: USE_EMULATORS,
  getActiveProfile: () => state.profile,
  isSignedIn: () => Boolean(state.user),
  isEmailVerified: () => Boolean(state.user?.emailVerified),
  getDailyCount: () => state.todayCount,
  handleStudentLogin,
  handleStudentRegister,
  togglePasswordResetPanel,
  handlePasswordReset,
  handleResendVerification,
  handleRefreshVerification,
  saveEditedStudentData,
  toggleDeleteAccountPanel,
  handleConfirmDeleteAccount,
  logoutStudentAccount,
  saveColdMailSubmission,
  loadSubmissionIntoEditor,
  cancelSubmissionEditMode,
  deleteMySubmission,
  recordOutreachQuotaAndSubmission,
  handleAdminLoadDashboard,
  adminChangeSubmissionStatus
};

// Keep inline HTML handlers bound to live module logic
window.handleStudentLogin = handleStudentLogin;
window.handleStudentRegister = handleStudentRegister;
window.togglePasswordResetPanel = togglePasswordResetPanel;
window.handlePasswordReset = handlePasswordReset;
window.handleResendVerification = handleResendVerification;
window.handleRefreshVerification = handleRefreshVerification;
window.saveEditedStudentData = saveEditedStudentData;
window.toggleDeleteAccountPanel = toggleDeleteAccountPanel;
window.handleConfirmDeleteAccount = handleConfirmDeleteAccount;
window.logoutStudentAccount = logoutStudentAccount;
window.saveColdMailSubmission = saveColdMailSubmission;
window.loadSubmissionIntoEditor = loadSubmissionIntoEditor;
window.cancelSubmissionEditMode = cancelSubmissionEditMode;
window.deleteMySubmission = deleteMySubmission;
window.adminLoadDashboard = () => handleAdminLoadDashboard(true);
window.adminChangeSubmissionStatus = adminChangeSubmissionStatus;

subscribeToAuthState((user) => {
  if (user) {
    hydrateSignedInWorkspace(user);
    if (document.body.classList.contains("auth-gate-active")) {
      window.enterMainApp?.("heroStage");
    }
  } else {
    resetSignedOutState();
    document.body.classList.add("auth-gate-active");
  }
});

// Clear any legacy plaintext demo localStorage keys from previous versions
try {
  localStorage.removeItem("seekresearch_student_accounts_v1");
  sessionStorage.removeItem("seekresearch_tab_session_v2");
} catch {
  // Ignore storage restrictions
}
