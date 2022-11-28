import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyBcd7rJPezuvclAMgieVXRIz4hPpCie5SU",
  authDomain: "energy-market-test.firebaseapp.com",
  projectId: "energy-market-test",
  storageBucket: "energy-market-test.appspot.com",
  messagingSenderId: "402433472408",
  appId: "1:402433472408:web:fd756e5f5ae9632d311ded",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore();
