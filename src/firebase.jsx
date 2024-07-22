import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCPwBpYgEybSu-OQRZ4upTlfd--VcgEJNE",
    authDomain: "linkedin-clone-82b40.firebaseapp.com",
    projectId: "linkedin-clone-82b40",
    storageBucket: "linkedin-clone-82b40.appspot.com",
    messagingSenderId: "848237254802",
    appId: "1:848237254802:web:c6fd1f67ab2a720426ee4b",
    measurementId: "G-8YZGMF9CGE"
  };

const firebaseApp = firebase.initializeApp(firebaseConfig);

//database
const db = firebaseApp.fireStore();

//authentication
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

//photo storage
const storage = firebase.storage();

export { auth, provider, storage }
export default db
