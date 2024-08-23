import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB_AZv0KHbuaGuJtEBdAc9-R7Gr7INa3qI",
  authDomain: "phonebook-c7bb4.firebaseapp.com",
  projectId: "phonebook-c7bb4",
  storageBucket: "phonebook-c7bb4.appspot.com",
  messagingSenderId: "178282285874",
  appId: "1:178282285874:web:e32b7e84f54fde9c5f652b",
  measurementId: "G-J8R772P0QB",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };