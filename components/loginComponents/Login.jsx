import React, { useState, useEffect } from "react";
import axios from 'axios';

function Login(props) {

  const { 
    login, 
    setLoginMessage, 
    setErrorMessage, setRoute, 
    setResendEmailLink,
  } = props;
  
  const [emailOrUsername, setEmailOrUsername] = useState(props.username);
  const [password, setPassword] = useState("");

  function validateForm() {
    return emailOrUsername.length > 0 && password.length > 0;
  };

  function handleSubmit(event) {

    const payload = {
      emailOrUsername,
      password,
    };

    axios.post('/api/login', payload)
      .then(res => {
        if (res.data.error) return setErrorMessage(res.data.error);

        /* If email is in the body, it means user is not authenticated - reminds them to check email */
        if (res.data.email) {
          console.log('not authenticated...')
          setRoute('/blank');
          setResendEmailLink({ email: res.data.email, username: res.data.username });
          setLoginMessage(res.data.message); // "please verify the email sent to..."
          return;
        };
        return login(res.data); /* log user in & send user data */
      })
      .catch(err => {
        if (err) console.log('something went wrong trying to log user in', err);
      })

    event.preventDefault(); /** prevents it from refreshing */
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="login-form">

        <div className="login-form-label">Email or Username</div>
        <input
          className="login-form-input"
          autoFocus
          type="text"
          value={emailOrUsername}
          onChange={(e) => setEmailOrUsername(e.target.value)}
        />

        <div className="login-form-label">Password</div>
        <input
          className="login-form-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />  
        
        <button disabled={!validateForm()} className="submit-button" >Submit</button>
        
        <button onClick={() => setRoute('/forgotPassword')} className="forgot-password-button">Forgot your password?</button>
      
      </form>
    </>
  );
}

export default Login;
