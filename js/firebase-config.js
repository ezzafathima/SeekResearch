import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, connectAuthEmulator } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, connectFirestoreEmulator } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { initializeAppCheck, ReCaptchaV3Provider } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app-check.js";

/**
 * Public Firebase Web App configuration for project "seekresearch-ab96e".
 * No admin credentials, service account keys, or private secrets belong here.
 */
export const firebaseConfig = {
  apiKey: "AIzaSyCCw2Kc9SLd5K4HQNk9fSQssNS5ZxtCa3I",
  authDomain: "seekresearch-ab96e.firebaseapp.com",
  projectId: "seekresearch-ab96e",
  storageBucket: "seekresearch-ab96e.firebasestorage.app",
  messagingSenderId: "800934832345",
  appId: "1:800934832345:web:35251c05148c14d18bb6c8",
  measurementId: "G-G24C7WXERT"
};

/**
 * Firebase App Check preparation (add your public reCAPTCHA v3 site key before enforcement).
 * Keep empty until App Check + reCAPTCHA are registered in Firebase Console.
 */
const APP_CHECK_SITE_KEY = "";

const isLocalhost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

const isHostingEmulatorPort =
  typeof window !== "undefined" && window.location.port === "5000";

const urlParams =
  typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();

export const USE_EMULATORS =
  isLocalhost &&
  (urlParams.get("emulator") === "1" ||
    (isHostingEmulatorPort && urlParams.get("prod") !== "1"));

if (isLocalhost && urlParams.get("appCheckDebug") === "1") {
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}

const activeFirebaseConfig = USE_EMULATORS
  ? { ...firebaseConfig, projectId: "demo-seekresearch-local" }
  : firebaseConfig;

export const app = initializeApp(activeFirebaseConfig);

export let appCheck = null;
if (APP_CHECK_SITE_KEY.trim().length > 0) {
  appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(APP_CHECK_SITE_KEY.trim()),
    isTokenAutoRefreshEnabled: true
  });
}

export const auth = getAuth(app);
export const db = getFirestore(app);

if (USE_EMULATORS) {
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
}

// Automatic Firebase Analytics initialization is disabled for this prototype.
export const analytics = null;
export const analyticsPromise = Promise.resolve(null);
