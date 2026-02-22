import React from 'react';

const Login = ({ formData, setFormData, handleLogin, status }) => {
  return (
    <div className="login-form-content">
      <form onSubmit={handleLogin}>
        <input 
          type="text" 
          placeholder="Email or Username" 
          autoComplete="off"
          onChange={(e) => setFormData({...formData, username: e.target.value})} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          onChange={(e) => setFormData({...formData, password: e.target.value})} 
        />
        <button type="submit">Log In</button>
        <div style={{marginTop: '15px', textAlign: 'center', fontSize: '14px', color: status.includes('Invalid') ? '#f4212e' : '#71767b'}}>
          {status}
        </div>
      </form>
    </div>
  );
};

export default Login;
