import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button, InputAdornment, IconButton, Divider } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import GoogleIcon from '@mui/icons-material/Google';
import './login.css';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../config/firebase-config';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loginMessage, setLoginMessage] = useState('');
    const history = useHistory();

    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const handleEmailAndPasswordLogin = async () => {
        try {
          await signInWithEmailAndPassword(auth, email, password);
          const user = auth.currentUser;
          if (user) {
            console.log('User ID:', user.uid);
            setLoginMessage('Login successful');
          }
        } catch (error) {
          console.error('Error signing in:', error.message);
          setError(error.message);
          setLoginMessage('');
        }
      };

    const handleGoogleSignIn = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            history.push('/');
        } catch (error) {
            console.error('Error signing in with Google:', error);
        }
    };

    return (
        <div className="container">
            <div className="paper-style">
                <Box sx={{ mb: 2 }}>
                    <h1 className="text-center">
                        <b>Login</b>
                    </h1>
                </Box>
                <Box
                    component="form"
                    sx={{
                        '& > :not(style)': { m: 1 },
                    }}
                    noValidate
                    autoComplete="off"
                >
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
                    <Button variant="contained" className='full-width-button' onClick={handleEmailAndPasswordLogin}>Login</Button>
                    <Box className="google-sign-in">
                    <div className="separator">
                        <div className="line"></div>
                        <span className="or-text">or sign in using Google</span>
                        <div className="line"></div>
                    </div>
                    <div className="google-button">
                        <GoogleIcon onClick={handleGoogleSignIn}/>
                    </div>
                    {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                    {!error && loginMessage && <p style={{ color: 'green', textAlign: 'center' }}>{loginMessage}</p>}
                    
                </Box>
                <p style={{ textAlign: 'center', marginTop: '30px', marginBottom: '-100px' }}>Don't have an account? <Link to="/signup">Register now</Link></p>
                </Box>
            </div>
        </div>
    );
}
