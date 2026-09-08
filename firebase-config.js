import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDWznR6b8_2_z_BGQvGL15OEq8lY2FcZDM",
  authDomain: "jeeva-portfolio-1072.firebaseapp.com",
  databaseURL: "https://jeeva-portfolio-1072-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "jeeva-portfolio-1072",
  storageBucket: "jeeva-portfolio-1072.appspot.com",
  messagingSenderId: "546375811798",
  appId: "1:546375811798:web:3b2c2f9f7faf183e1eff77",
  measurementId: "G-HT5XCRMRVL"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export {
  db,
  storage,
  doc,
  getDoc,
  setDoc,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
};