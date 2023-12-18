import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCObEQoRgJgmsxRpTnMUhQVAvy8riP_ht0",
  authDomain: "reliable-calendar.firebaseapp.com",
  projectId: "reliable-calendar",
  storageBucket: "reliable-calendar.appspot.com",
  messagingSenderId: "356876199963",
  appId: "1:356876199963:web:a80fe054c8a5157cf0b0be",
  measurementId: "G-JB628WHGX0"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);