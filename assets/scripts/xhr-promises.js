'use strict';

const getFormFields = require('../../lib/get-form-fields');

$(() => {
  // // console methods require `this` to be `console`
  // // promise function are called with `this === undefined`
  // let clog = console.log.bind(console);
  // let elog = console.error.bind(console);

  const baseUrl = 'http://localhost:3000/';

  const onError = (error) => {
    console.error(error);
  };

  const onSignIn = (response) => {
    console.log(response);
    console.log('Signed in');
  };

  const onSignUp = (response) => {
    console.log(response);
    console.log('Signed up');
  };

// this is an implicit promise return bc there's not curly brace after the first fat arrow
  const signUpOrIn = (credentials, path) =>
     new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response); // we can't resolve the promise until we've received the status response. load is what gives us the data
        } else {
          reject(xhr);
        }
      });
      xhr.addEventListener('error', () => reject(xhr));
      xhr.open('POST', baseUrl + path);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(credentials));
    });

// the promise maintains the success of the initial callback and reject takes the place of our initial failure callback, ie the resolve and reject so we don't have to pass them in here
  const signIn = (credentials) => signUpOrIn(credentials, '/sign-in');

  const signUp = (credentials) => signUpOrIn(credentials, '/sign-up');

  const submitHandler = function (event) {
    // // console methods require `this` to be `console`
    // // promise function are called with `this === undefined`
    // let clog = console.log.bind(console);
    // let elog = console.error.bind(console);
    event.preventDefault();
    let data = getFormFields(event.target);
    signUp(data)
    .then(onSignUp)
    .then(() => signIn(data)) // 👀 here it's important that we define the function signIn here, not invoke it (.then(signIn(data))).
    // if we invoked it then we would have a race condition bc signIn could try to run before signUp. 
    .then(onSignIn)
    .catch(onError);
  };

  $('#sign-up-promise').on('submit', submitHandler);
});
