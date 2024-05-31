// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCPtRqf7IWiTr-duzal8WWNI7NJjD2-2Dg",
  authDomain: "cinema-100-18624.firebaseapp.com",
  projectId: "cinema-100-18624",
  storageBucket: "cinema-100-18624.appspot.com",
  messagingSenderId: "393652381451",
  appId: "1:393652381451:web:96db82897c3be19cd7240e",
  measurementId: "G-N64F7PJWR9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
