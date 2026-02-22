import React from 'react';

const Signup = ({ formData, setFormData, handleSignup }) => {
  return (
    <div className="login-form-content">
      <form onSubmit={handleSignup}>
        <input 
          type="text" 
          placeholder="Username" 
          onChange={(e) => setFormData({...formData, username: e.target.value})} 
        />
        <input 
          type="email" 
          placeholder="Email address" 
          onChange={(e) => setFormData({...formData, email: e.target.value})} 
        />
        <input 
          type="password" 
          placeholder="New password" 
          onChange={(e) => setFormData({...formData, password: e.target.value})} 
        />
        <button type="submit" style={{background: '#1d9bf0', color: '#fff'}}>Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
