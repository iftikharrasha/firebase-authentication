import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import firebaseConfig from './firebase.config';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

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

  const handleBlur = (event) => {
    console.log(event.target.name, event.target.value);
    if(event.target.name === 'email'){
      const regexEm = /\S+@\S+\.\S+/;
      const isEmailValid = regexEm.test(event.target.value);
      console.log(isEmailValid);
    }
    if(event.target.name === 'password'){
      const regexPass = /\d{1}/;
      const isPassLength = event.target.value.length > 6;
      const isPassNumber = regexPass.test(event.target.value);
      console.log(isPassLength && isPassNumber); 
    }
  }

  const handleSubmit = () => {

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

      <h1>Our Own authentication</h1>

      <form onSubimit={handleSubmit}>
        <input type="text" onChange={handleBlur} name="email" placeholder="write your email" required/>
        <br />
        <input type="password" onChange={handleBlur} name="password" id="" placeholder="your password" required/>
        <br />
        <input type="submit" value="submit"/>
      </form>
      
      
    </div>
  );
}

export default App;
