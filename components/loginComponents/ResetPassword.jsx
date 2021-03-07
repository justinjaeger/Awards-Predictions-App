import React, { useState, useEffect } from "react";
import axios from 'axios';

function ResetPassword(props) {

  const { setLoginMessage, setErrorMessage, email, login } = props;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function validateForm() {
    return password.length > 0 && confirmPassword.length > 0;
  };

  function handleSubmit(event) {
    const payload = {
      email,
      password,
      confirmPassword
    };
    axios.post('/api/login/resetPassword', payload)
      .then(res => {
        if (res.data.error) return setErrorMessage(res.data.error);
        login(res.data); // log user in & send user data
      })
      .catch(err => {
        console.log('something broke - did not log user in after changing password', err.response);
      })

    event.preventDefault(); /* prevents it from refreshing */
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="login-form">

        <div className="login-form-label">Password</div>
        <input
          className="login-form-input"
          autoFocus
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

        <button disabled={!validateForm()} className="submit-button" >Reset Password</button>
      
      </form>
    </>
  );
};

export default ResetPassword;
