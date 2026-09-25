import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeFirestore, memoryLocalCache } from "firebase/firestore";

// Import the Firebase configuration
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase SDK
const app = initializeApp(firebaseConfig);

// Initialize Firestore using the default Firestore database
export const db = initializeFirestore(app, {
  localCache: memoryLocalCache(),
  experimentalForceLongPolling: true,
  useFetchStreams: false,
} as any);

const originalAuth = getAuth(app);

export const auth = new Proxy(originalAuth, {
  get(target, prop, receiver) {
    if (prop === "currentUser") {
      const fbUser = target.currentUser;
      if (fbUser) return fbUser;

      // Fallback to local storage session
      try {
        const localSession =
          typeof window !== "undefined"
            ? localStorage.getItem("smartadmi_user_session")
            : null;

        if (localSession) {
          const parsed = JSON.parse(localSession);

          if (parsed && parsed.uid) {
            return {
              uid: parsed.uid,
              email: parsed.email,
              displayName: parsed.fullName || parsed.displayName || "Student",
              providerData: [{ providerId: "local-password-fallback" }],
              emailVerified: true,
              isAnonymous: false,
              tenantId: null,
            };
          }
        }
      } catch (e) {
        console.error("Error in auth Proxy reading local session:", e);
      }
    }

    const value = Reflect.get(target, prop, receiver);

    if (typeof value === "function") {
      return value.bind(target);
    }

    return value;
  },
});

export const googleProvider = new GoogleAuthProvider();

export default app;
