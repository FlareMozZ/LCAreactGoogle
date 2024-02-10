import React from 'react';
import { GoogleLogin } from 'react-google-login';
import axios from 'axios';

function Login() {
  const responseGoogle = (response) => {
    console.log(response);
    // Send the user's Google ID token to your backend
    axios.post('/api/verify', {
      idToken: response.tokenId,
    }).then(res => {
      console.log(res);
    }).catch(err => {
      console.error(err);
    });
  }

  return (
    <div>
      <GoogleLogin
        clientId="149909023249-chnggqc1ekl5829ebnlsqorma48p8l9f.apps.googleusercontent.com"
        buttonText="Login with Google"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
      />
    </div>
  );
}

export default Login;