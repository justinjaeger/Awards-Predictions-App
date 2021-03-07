import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SignUp(props) {

  const { 
    actualSetEmail, actualSetUsername,
    setNotification, 
    setLoginDropdown, 
    setErrorMessage
  } = props;

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState(props.username);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  console.log('username in signup', username)

  function validateForm() {
    return email.length > 0 && password.length > 0;
  };

  function handleSubmit(event) {

    const payload = {
      email,
      username,
      password,
      confirmPassword
    };
    
    console.log('submitting payload', payload)

    /* NOTE: The /signup POST request will send the user a verification email, so it won't return anything back except a message */
    axios.post('/api/signup', payload)
      .then(res => {
        if (res.data.error) return setErrorMessage(res.data.error);   
        console.log('signup suvvsssful') 
        actualSetEmail(email);   
        actualSetUsername(username);
        setNotification('please verify email');
        setLoginDropdown(false);
      })
      .catch(err => {
        console.log('error in signup', err.response);
      })

    event.preventDefault(); /* prevents it from refreshing */
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="login-form">

        <div className="login-form-label">Email</div>
        <input
          className="login-form-input"
          autoFocus
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)} /* so it updates visually when you type */
        />

        <div className="login-form-label">Username</div>          
        <input
          className="login-form-input"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <div className="login-form-label">Password</div>          
        <input
          className="login-form-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="login-form-label">Confirm Password</div>          
        <input
          className="login-form-input"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button disabled={!validateForm()} className="submit-button">Create Account</button>

      </form> 
    </>
  );
};

export default SignUp;
