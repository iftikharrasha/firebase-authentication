import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);


function App(){
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo: ''
  })
  const provider = new firebase.auth.GoogleAuthProvider();

  const handleSignIn = () => {
    firebase.auth()
    .signInWithPopup(provider)
    .then((res) => {
      const {displayName, photoURL, email} = res.user;

      const signedInUser = {
        isSignedIn: true,
        name: displayName,
        email: email,
        photo: photoURL
      }
      setUser(signedInUser);

      console.log(res);
    }).catch((error) => {
      // Handle Errors here.
      console.log(error);
    });
  }

  const handleSignOut = () => {
    firebase.auth().signOut()
    .then((res) => {
      const signedOutUser = {
        isSignedIn: false,
        name: '',
        email: '',
        photo: ''
      }
      setUser(signedOutUser);
    }).catch((error) => {
      // An error happened.
      console.log(error);
    });
  }

  return (
    <div className="App">
      {
        user.isSignedIn ? <button onClick={handleSignOut}>Sign Out</button> : 
        <button onClick={handleSignIn}>Sign In</button>
      }
      {
        user.isSignedIn &&
        <div>
            <h4>Welcome, {user.name}</h4>
            <img src={user.photo} alt="photo"></img>
            <p>{user.email}</p>
        </div>
      }
    </div>
  );
}

export default App;
