import React, { useState } from "react";
import firebase from "./firebase";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function LoginOrder() {
   let navigate = useNavigate();
    var firebaseui = require('firebaseui');
    // var mobile="";
    // var otp="";

    // const handleChangeMobile = (e) =>{
    //     console.log("mobile",e.target.valueAsNumber);
    //     mobile = e.target.valueAsNumber
    //   }
    // const handleChangeOTP = (e) =>{
    //     console.log("otp",e.target.valueAsNumber);
    //     otp = e.target.valueAsNumber
    // }

    // const configureCaptcha = () =>{
    // window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
    //     'size': 'invisible',
    //     'callback': (response) => {
    //     // reCAPTCHA solved, allow signInWithPhoneNumber.
    //     onSignInSubmit();
    //     console.log("Recaptca varified")
    //     },
    //     defaultCountry: "IN"
    // });
    // }
    // const onSignInSubmit = (e) => {
    // e.preventDefault()
    // //configureCaptcha();
    // const auth = getAuth();
    // window.recaptchaVerifier = new RecaptchaVerifier('sign-in-button', {
    // 'size': 'invisible',
    // 'callback': (response) => {
    //     // reCAPTCHA solved, allow signInWithPhoneNumber.
    //     onSignInSubmit();
    //     console.log("Recaptca varified")
    //     },
    //     defaultCountry: "IN"
    // }, auth);
    // const phoneNumber = "+84" + mobile
    // console.log(phoneNumber)
    // const appVerifier = window.recaptchaVerifier;
    // signInWithPhoneNumber(auth, phoneNumber, appVerifier)
    // .then((confirmationResult) => {
    //         // SMS sent. Prompt user to type the code from the message, then sign the
    //         // user in with confirmationResult.confirm(code).
    //         window.confirmationResult = confirmationResult;
    //         console.log("OTP has been sent")
    //         // ...
    //     }).catch((error) => {
    //         // Error; SMS not sent
    //         // ...
    //         console.log("SMS not sent")
    //     });
    // }

    // const onSubmitOTP = (e) =>{
    // e.preventDefault()
    // const code = otp
    // console.log(code)
    // window.confirmationResult.confirm(code).then((result) => {
    //     // User signed in successfully.
    //     const user = result.user;
    //     console.log(JSON.stringify(user))
    //     alert("User is verified")
    //     // ...
    // }).catch((error) => {
    //     // User couldn't sign in (bad verification code?)
    //     // ...
    // });
    // }

    function getUiConfig() {
        return {
          'callbacks': {
            // Called when the user has been successfully signed in.
            'signInSuccess': function(user, credential, redirectUrl) {
              handleSignedInUser(user);
              // Do not redirect.
              return false;
            }
          },
          // Opens IDP Providers sign-in flow in a popup.
          'signInFlow': 'popup',
          'signInOptions': [
            // The Provider you need for your app. We need the Phone Auth
            //firebase.auth.PhoneAuthProvider.PROVIDER_ID,
            {
              provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
              recaptchaParameters: {
                type: 'image', // another option is 'audio'
                size: 'invisible', // other options are 'normal' or 'compact'
                badge: 'bottomleft' // 'bottomright' or 'inline' applies to invisible.
              },
              defaultCountry: "VN",
              //defaultNationalNumber: '0234567890',
              //loginHint: '+84234567890',
              whitelistedCountries: ['VN', '+84']
            }
          ],
          // Terms of service url.
          'tosUrl': 'https://www.google.com'
        };
      }

    // Initialize the FirebaseUI Widget using Firebase.
    var ui=null;
    ui = new firebaseui.auth.AuthUI(firebase.auth());
    /**
     * Displays the UI for a signed in user.
     * @param {!firebase.User} user
     */
    var handleSignedInUser = function(user) {
      document.getElementById('user-signed-in').style.display = 'block';
      document.getElementById('user-signed-out').style.display = 'none';
    //   document.getElementById('name').textContent = user.displayName;
    //   document.getElementById('email').textContent = user.email;
      document.getElementById('phone').textContent = user.phoneNumber;
      // User signed in successfully.
      console.log(JSON.stringify(user))
      //alert("User is verified");
      localStorage.setItem("phoneNumber",user.phoneNumber.replace('+84', '0'));
      // ...

    //configureCaptcha();
    const auth = getAuth();
    window.recaptchaVerifier = new RecaptchaVerifier('sign-in-button', {
    'size': 'invisible',
    'callback': (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        handleSignedInUser(user);
        console.log("Recaptca varified")
        },
        defaultCountry: "VN",
        whitelistedCountries: ['VN', '+84']
    }, auth);
    const phoneNumber = user.phoneNumber
    console.log("phoneNumber",phoneNumber);
    const appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
    .then((confirmationResult) => {
            // SMS sent. Prompt user to type the code from the message, then sign the
            // user in with confirmationResult.confirm(code).
            window.confirmationResult = confirmationResult;
            console.log("OTP has been sent")
            // ...
        }).catch((error) => {
            // Error; SMS not sent
            // ...
            console.log("SMS not sent")
        });
    };
    /**
     * Displays the UI for a signed out user.
     */
    var handleSignedOutUser = function() {
      document.getElementById('user-signed-in').style.display = 'none';
      document.getElementById('user-signed-out').style.display = 'block';
      ui.start('#firebaseui-container', getUiConfig());
    };
    // Listen to change in auth state so it displays the correct UI for when
    // the user is signed in or not.
    firebase.auth().onAuthStateChanged(function(user) {
      document.getElementById('loading').style.display = 'none';
      document.getElementById('loaded').style.display = 'block';
      user?handleSignedInUser(user) : handleSignedOutUser();
    });
    /**
     * Deletes the user's account.
     */
    var deleteAccount = function() {
      firebase.auth().currentUser.delete().catch(function(error) {
        if (error.code == 'auth/requires-recent-login') {
          // The user's credential is too old. She needs to sign in again.
          firebase.auth().signOut().then(function() {
            // The timeout allows the message to be displayed after the UI has
            // changed to the signed out state.
            setTimeout(function() {
              alert('Please sign in again to delete your account.');
            }, 1);
          });
        }
      });
    };
    /**
     * Initializes the app.
     */
    var initApp = function() {
      document.getElementById('sign-out').addEventListener('click', function() {
        localStorage.removeItem("phoneNumber");
        firebase.auth().signOut();
      });
      // document.getElementById('delete-account').addEventListener(
      //     'click', function() {
      //       localStorage.removeItem("phoneNumber");
      //       deleteAccount();
      //     });
    };
    window.addEventListener('load', initApp);
    return (
        // <div>
        // <h2>Login Form</h2>
        //     <div id="sign-in-button"></div>
        //     <input type="number" name="mobile" placeholder="Mobile number" required onChange={handleChangeMobile}/>
        //     <button type="submit" onClick={onSignInSubmit}>Submit</button>

        // <h2>Enter OTP</h2>
        //     <input type="number" name="otp" placeholder="OTP Number" required onChange={handleChangeOTP}/>
        //     <button type="submit" onClick={onSubmitOTP}>Submit</button>
        // </div>
        <div id="container">
        <h3 className="text-center mb-3">Đăng nhập bằng số điện thoại</h3>
        <div id="loading">Loading...</div>
        <div id="loaded" class="hidden">
        <div id="main">
            <div id="user-signed-in" class="hidden">
            <div id="user-info">
                {/* <div id="name"></div>
                <div id="email"></div> */}
                <h5 className="text-success">Đã đăng nhập thành công</h5>
                <div id="phone"></div>
                <div class="clearfix"></div>
            </div>
            <p>
                <button className="btn btn-danger" id="sign-out">Đăng xuất</button>
                {/* <button id="delete-account">Xóa tài khoản</button> */}
            </p>
            </div>
            <div id="user-signed-out" class="hidden">
            <div id="firebaseui-spa">
                {/* <h3>Nhập số điện thoại:</h3> */}
                <div id="firebaseui-container"></div>
            </div>
            </div>
        </div>
        </div>
    </div>
    )
}
export default LoginOrder