import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
    apiKey: "AIzaSyDMYlPsVA-dJrZQ_Kh7rfFxGKrIMyWmLPI",
    authDomain: "fir-react-storage-96f9d.firebaseapp.com",
    projectId: "fir-react-storage-96f9d",
    storageBucket: "fir-react-storage-96f9d.appspot.com",
    messagingSenderId: "641272780622",
    appId: "1:641272780622:web:239644990a4b4324f3b01f"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);