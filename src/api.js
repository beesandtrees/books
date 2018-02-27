// src/firebase.js
import firebase from 'firebase';
const config = {
  apiKey: "AIzaSyByU_-S3YMdq3tqNKea83Q_3vckcem7PkA",
  authDomain: "books-57e70.firebaseapp.com",
  databaseURL: "https://books-57e70.firebaseio.com",
  projectId: "books-57e70",
  storageBucket: "books-57e70.appspot.com",
  messagingSenderId: "395771768065"
};
firebase.initializeApp(config);
export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export default firebase;