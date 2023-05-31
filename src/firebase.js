
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const firebaseConfig = {
  // Configuración de tu proyecto de Firebase
  apiKey: "AIzaSyARc7-Y13RuQSp8-Trsmp2CzPkTwtnVCj0",
  authDomain: "mi-primer-proyecto-d77ba.firebaseapp.com",
  databaseURL: "https://mi-primer-proyecto-d77ba-default-rtdb.firebaseio.com",
  projectId: "mi-primer-proyecto-d77ba",
  storageBucket: "mi-primer-proyecto-d77ba.appspot.com",
  messagingSenderId: "520988663602",
  appId: "1:520988663602:web:17d3a549a324231b40412b"
};

// Inicializar la aplicación de Firebase
firebase.initializeApp(firebaseConfig);

// Obtener la instancia de Firestore
const db = firebase.firestore();

export { db }; // Exportar la instancia de Firestore

export default firebase; // Exportar la instancia de Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);