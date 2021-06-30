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
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo: '',
    pass: ''
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
        photo: '',
        success: false,
        error: ''
      }
      setUser(signedOutUser);
    }).catch((error) => {
      // An error happened.
      console.log(error);
    });
  }

  const handleBlur = (event) => {
    // console.log(event.target.name, event.target.value);
    let isFormValid;

    if(event.target.name === 'email'){
      const regexEm = /\S+@\S+\.\S+/;
      isFormValid = regexEm.test(event.target.value);
      // console.log(isFormValid);
    }
    if(event.target.name === 'password'){
      const regexPass = /\d{1}/;
      const isPassNumber = regexPass.test(event.target.value);
      const isPassLength = event.target.value.length > 6;

      isFormValid = isPassLength && isPassNumber;
    }
    if(isFormValid){
      const newUserInfo = {...user};
      newUserInfo[event.target.name] = event.target.value;
      setUser(newUserInfo);
    }
  }

  const handleSubmit = (event) => {
    if(newUser && user.email && user.password){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then((res) => {

          // Signed in 
          const newUserInfo = {...user};
          newUserInfo.error = '';
          newUserInfo.success = true;
          setUser(newUserInfo);
        })
        .catch((error) => {
          const newUserInfo = {...user};
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
        });
    }
    if(!newUser && user.email && user.password){
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then((res) => {
            const newUserInfo = {...user};
            newUserInfo.error = '';
            newUserInfo.success = true;
            setUser(newUserInfo);
        })
        .catch((error) => {
            const newUserInfo = {...user};
            newUserInfo.error = error.message;
            newUserInfo.success = false;
            setUser(newUserInfo);
        });
    }
    event.preventDefault(); //preventing reloading the page
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
      <input type="checkbox" name="newUser" onChange={() => setNewUser(!newUser)}/>
      <label for="newUser">New User Sign Up</label>
      <form onSubmit={handleSubmit}>
        {newUser && <input type="text" name="name" placeholder="write your name" required/>}
        <br />
        <input type="text" onChange={handleBlur} name="email" placeholder="write your email" required/>
        <br />
        <input type="password" onChange={handleBlur} name="password" id="" placeholder="your password" required/>
        <br />
        <input type="submit" value="submit"/>
      </form>
      
      <p style={{color: 'red'}}>{user.error}</p>
      { user.success && <p style={{color: 'green'}}>User {newUser ? 'Created' : 'Logged in' } Successfully!</p> }

      <div>
            <p>{user.email}</p>
      </div>
      
    </div>
  );
}

export default App;
