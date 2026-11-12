import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  deleteUser
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { auth } from "./firebase-config.js";

/**
 * Translate raw Firebase Auth & Firestore error codes into clear UI messages.
 */
export function mapFirebaseError(error) {
  const code = error?.code || "";
  switch (code) {
    case "auth/email-already-in-use":
      return "An account with this email already exists. Switch to Login or reset your password.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Incorrect email or password. Please verify your credentials or reset your password.";
    case "auth/weak-password":
      return "Password is too weak. Please choose at least 6 characters.";
    case "auth/too-many-requests":
      return "Too many attempts right now. Please wait a moment before trying again.";
    case "auth/network-request-failed":
      return "Network error connecting to Firebase. Check your internet connection and try again.";
    case "auth/requires-recent-login":
      return "For security, please enter your current password to confirm account deletion.";
    case "auth/operation-not-allowed":
      return "Email/Password sign-in is not enabled yet in Firebase Authentication console.";
    case "auth/user-disabled":
      return "This account has been disabled by an administrator.";
    case "permission-denied":
      return "Access denied by Firestore security rules. You can only access your own records.";
    case "resource-exhausted":
      return "Rate limit exceeded. Please try again later.";
    default:
      return error?.message || "An unexpected authentication error occurred. Please try again.";
  }
}

/**
 * Register a new student account in Firebase Auth (never saves password in Firestore)
 * and run the profile creation callback with the newly authenticated user.
 */
export async function registerStudentAccount(email, password, profileData, createProfileFn) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const user = credential.user;

  try {
    if (profileData?.name) {
      await updateProfile(user, { displayName: profileData.name });
    }
    await createProfileFn(user, profileData);
  } catch (profileErr) {
    try {
      await deleteUser(user);
    } catch {
      // Best-effort rollback if profile creation failed immediately after signup
    }
    throw profileErr;
  }

  let verificationSent = false;
  try {
    await sendEmailVerification(user);
    verificationSent = true;
  } catch {
    // Do not block initial account registration if local emulator or dispatch fails temporarily;
    // Firestore rules continue enforcing email verification on protected operations.
  }

  return { user, verificationSent };
}

/**
 * Sign in an existing student or admin using Firebase Email & Password Auth.
 */
export async function loginStudentAccount(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

/**
 * Send or resend verification email to the signed-in user.
 */
export async function resendVerificationEmail(user = auth.currentUser) {
  if (!user) throw new Error("No authenticated user found.");
  await sendEmailVerification(user);
}

/**
 * Reload user and refresh ID token so emailVerified / custom claims reflect immediately.
 */
export async function refreshAuthUserState(user = auth.currentUser) {
  if (!user) return { user: null, emailVerified: false, claims: {} };
  await user.reload();
  const refreshedUser = auth.currentUser || user;
  const tokenResult = await refreshedUser.getIdTokenResult(true);
  return {
    user: refreshedUser,
    emailVerified: Boolean(refreshedUser.emailVerified),
    claims: tokenResult.claims || {}
  };
}

/**
 * Resolve role from server-issued Firebase Auth Custom Claims ONLY.
 */
export async function getUserClaims(user = auth.currentUser) {
  if (!user) return { role: "student", isAdmin: false, claims: {} };
  const tokenResult = await user.getIdTokenResult();
  const claims = tokenResult.claims || {};
  const hasAdminClaim = claims.role === "admin" || claims.admin === true;
  const isAdmin = Boolean(user.emailVerified && hasAdminClaim);
  return {
    role: isAdmin ? "admin" : "student",
    isAdmin,
    claims
  };
}

/**
 * Send password reset email.
 */
export async function sendStudentPasswordReset(email) {
  await sendPasswordResetEmail(auth, email);
}

/**
 * Re-authenticate with password, delete Firestore student records first while token is valid,
 * then permanently delete the Firebase Auth account.
 */
export async function reauthAndDeleteAccount(currentPassword, cleanupFirestoreFn) {
  const user = auth.currentUser;
  if (!user || !user.email) {
    throw new Error("You must be signed in to delete your account.");
  }

  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);
  await cleanupFirestoreFn(user.uid);
  await deleteUser(user);
}

export async function logoutFirebaseUser() {
  await signOut(auth);
}

export function subscribeToAuthState(callback) {
  return onAuthStateChanged(auth, callback);
}
