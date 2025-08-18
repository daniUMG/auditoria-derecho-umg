import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAlyYXOz57oEwy6dL1XU_Fh-_V0bdkGJek",
  authDomain: "proyectoingsis.firebaseapp.com",
  databaseURL: "https://proyectoingsis.firebaseapp.com",
  projectId: "proyectoingsis",
  storageBucket: "proyectoingsis.appspot.com",
  messagingSenderId: "1014049652750",
  appId: "1:1014049652750:web:5d9b718d1b03a768d3bc5f"
};

firebase.initializeApp(firebaseConfig);

const secondaryApp = firebase.initializeApp(firebaseConfig, 'Secondary')

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const realtime = firebase.database();


export {firebase,db,auth,storage,realtime,secondaryApp}