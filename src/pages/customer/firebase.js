import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
const firebaseConfig = {
    apiKey: "AIzaSyDMYlPsVA-dJrZQ_Kh7rfFxGKrIMyWmLPI",
    authDomain: "fir-react-storage-96f9d.firebaseapp.com",
    projectId: "fir-react-storage-96f9d",
    storageBucket: "fir-react-storage-96f9d.appspot.com",
    messagingSenderId: "641272780622",
    appId: "1:641272780622:web:239644990a4b4324f3b01f"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export default firebase