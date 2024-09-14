import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBgKz-57TToh8DqCl_4OqvrQiGC8vcNPqc",
  authDomain: "lomboktravelia-93d61.firebaseapp.com",
  projectId: "lomboktravelia-93d61",
  storageBucket: "lomboktravelia-93d61.appspot.com",
  messagingSenderId: "378263941578",
  appId: "1:378263941578:web:3c842325ee3edcb9fbdf33",
  measurementId: "G-B12P7KBCGC"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app); 