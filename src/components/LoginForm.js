import React, { useState } from 'react';
import { authService } from '../services/authService';

const LoginForm = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError('');
  
      try {
        const data = await authService.login(email, password);
        
        if (data.logged_in) {
          onLogin(data.user); // Tell parent component user is logged in
          alert('Login successful!');
        } else {
          setError(data.error || 'Login failed');
        }
      } catch (error) {
        setError('Login failed. Please try again.');
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className="login-form">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email or Username:</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          {error && <div className="error">{error}</div>}
          
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    );
  };
  
  export default LoginForm;