'use strict';

let getFormFields = require('../../lib/get-form-fields.js');

// jquery shorthand for $(document).ready

$(() => {
  const baseUrl = 'http://localhost:3000';

// we know this is a handler due to the 'on' naming convention. this is a error
// handler that's going to be passed as a callback
  const onError = (error) => {
    console.error(error);
  };

// event handler for sign up success

  const onSignUp = (response) => {
    // this is where your signUp related logic would usually go
    console.log(response);
    console.log('Signed up');
  };

// event handler for sign in success
  const onSignIn = (response) => {
    console.log(response);
    console.log('Signed in');
  };

// this handler will do either a sign up or a sign in, since the two requests
// only differ by the path. (the part of the URL after the slash).
// the path is passed as a parameter (i.e. /sign-up or /sign-in)

// credentials: an object, possibly created by getFormFields, used for data
// path: the part of the URL after the slash which determines which auth action
// to take
// onFulfilled is how we refer to the passed in success handler
// onRejected is how we refer to the passed in error handler

  const signUpOrIn = (credentials, path, onFulfilled, onRejected) => {
      // XMLHttpRequest is a constructor function (it starts with a capital)
    let xhr = new XMLHttpRequest();
    // adding a handler for 'load'. load event is what fires once we have response object
    xhr.addEventListener('load', () => {
      // look at the status code and if it is successful,
      if (xhr.status >= 200 && xhr.status < 300) {
        // fire the handler we passed in for success, and pass it the data
        // you may want to parse it, if its json you can do that here or in
        // your handler, where it makes sense.
        onFulfilled(xhr.response);
      } else {

        // otherwise i want you to file the handler for failure and pass it the entire
        // request object. we pass the whole object down so we can dispatch different errors depending on the status type.
        onRejected(xhr);
      }
    });
        // this is handling any errors before the ajax call is made, for instance if your client origin is incorrect.
    xhr.addEventListener('error', () => onRejected(xhr));
    // start the request
    xhr.open('POST', baseUrl + path);
    xhr.setRequestHeader('Content-Type', 'application/json');
    // don't forget to actaully do the request and send the data.
    xhr.send(JSON.stringify(credentials));
  };

// define a function which calls signUporIn with the approporiate path for signIn (aka method delegation)
// this might be related to 'partial application' (google it)
  const signIn = (credentials, onFulfilled, onRejected) =>
    signUpOrIn(credentials, '/sign-in', onFulfilled, onRejected);

// same story, just use /sign-up instead
  const signUp = (credentials, onFulfilled, onRejected) =>
    signUpOrIn(credentials, '/sign-up', onFulfilled, onRejected);

  const submitHandler = function (event) {
      event.preventDefault();
      let data = getFormFields(event.target);
      // the original success handler we defined at the top of the file
      const onSignUpSuccess = function (response) {
        onSignUp(response);
        // but we don't just want to console.log the success, we also want to
        // trigger another event. (callback chain)
        signIn(data, onSignIn, onError);
      };
// look here first. onSignUpSuccess is the 'onfulfilled' arg we pass into the signUp and signIn functions above
      signUp(data, onSignUpSuccess, onError);
    };

// attach a handler to the '#sign-up' form
  $('#sign-up').on('submit', submitHandler);
});
