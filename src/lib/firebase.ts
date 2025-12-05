// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCqq2n2IvW9pTr8-oVcTRheIQccdk7Ci7c",
  authDomain: "falconry-journal.firebaseapp.com",
  projectId: "falconry-journal",
  storageBucket: "falconry-journal.appspot.com",
  messagingSenderId: "383208156265",
  appId: "1:383208156265:web:102fe908ba808d623746f8"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
