
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyAvp1Wc86Q0uUwPNGvyNVaYN6AcrAP6rJ0",
  authDomain: "lab1-e1c1a.firebaseapp.com",
  projectId: "lab1-e1c1a",
  storageBucket: "lab1-e1c1a.appspot.com",
  messagingSenderId: "570279513682",
  appId: "1:570279513682:web:914ac238c991f86702998b",
  measurementId: "G-253ZV3R8PN"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
export{db};