import "firebase/storage";
import "firebase/firestore";
import "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth/react-native";

const firebaseConfig = {
  apiKey: "AIzaSyBvtdCQGax9w2DVSQH2FT13PJSi0nAW3n4",
  authDomain: "my-project-3e3cd.firebaseapp.com",
  projectId: "my-project-3e3cd",
  storageBucket: "my-project-3e3cd.appspot.com",
  messagingSenderId: "11238885071",
  appId: "1:11238885071:web:4479438610274c7f3e59ba",
  measurementId: "G-QRQDCRGCG9",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
