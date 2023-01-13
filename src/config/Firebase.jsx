import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBvZ63roa0CjlIv_IVDUgdVrZQayHUix-M",
  authDomain: "solutech-linkshare.firebaseapp.com",
  projectId: "solutech-linkshare",
  storageBucket: "solutech-linkshare.appspot.com",
  messagingSenderId: "610616974029",
  appId: "1:610616974029:web:e90e79e1a2a559f4346784",
  measurementId: "G-0XJ8FC85XC",
};

const app = initializeApp(firebaseConfig);
// export const analytics = getAnalytics(app);
export const firebaseAuthentication = getAuth(app);
export const firebaseFirestore = getFirestore(app);
export const firebaseStorage = getStorage(app);
