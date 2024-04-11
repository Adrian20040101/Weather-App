import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../../config/firebase-config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Container, Paper, Button, InputAdornment, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import './signup.css';

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [signupMessage, setSignupMessage] = useState('');
    const [error, setError] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevConfirmShowPassword) => !prevConfirmShowPassword);
  };

  const handleSignup = async () => {
    try {
      if (!email || !password || !confirmPassword) {
        throw new Error("All fields are required");
      }

      if (password !== confirmPassword) {
        throw new Error("Passwords don't match");
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User signed up:', user);
      setSignupMessage('Signup successful! You can now login.');
      setError('');
    } catch (error) {
      console.error('Error signing up:', error.message);
      setSignupMessage('');
      setError(error.message);
    }
  };

  return (
    <div className="container">
      <div className="paper-style">
        <Box sx={{ mb: 2 }}>
          <h1 style={{ color: 'black', textAlign: 'center' }}>
            <b>Sign Up</b>
          </h1>
        </Box>
        <Box component="form" className="form" noValidate autoComplete="off">
          <TextField
            id="email"
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            id="password"
            label="Password"
            variant="outlined"
            fullWidth
            value={password}
            type={showPassword ? 'text' : 'password'}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end">
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            id="confirm-password"
            label="Confirm Password"
            variant="outlined"
            fullWidth
            value={confirmPassword}
            disabled={!password}
            type={showConfirmPassword ? 'text' : 'password'}
            onChange={(e) => setConfirmPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={toggleConfirmPasswordVisibility} edge="end">
                    {showConfirmPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button variant="contained" className="submit-button" onClick={handleSignup}>Sign Up</Button>
        </Box>
        {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '50px' }}>{error}</p>}
        {!error && signupMessage && <p style={{ color: 'green', textAlign: 'center', marginBottom: '50px' }}>{signupMessage}</p>}
        <p className="login-redirect">Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}
