import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBgKz-57TToh8DqCl_4OqvrQiGC8vcNPqc",
  authDomain: "lomboktravelia-93d61.firebaseapp.com",
  projectId: "lomboktravelia-93d61",
  storageBucket: "lomboktravelia-93d61.appspot.com",
  messagingSenderId: "378263941578",
  appId: "1:378263941578:web:3c842325ee3edcb9fbdf33",
  measurementId: "G-B12P7KBCGC",
};

export const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("result", result);
    const user = result.user;
    return user;
  } catch (error) {
    console.log(error.message);
  }
};

export default signInWithGoogle;