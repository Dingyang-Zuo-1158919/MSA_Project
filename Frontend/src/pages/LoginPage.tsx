import { Avatar, Box, Button, CircularProgress, Container, Grid, Paper, Snackbar, SnackbarContent, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useDispatch } from 'react-redux';
import { login } from '../Redux/Slices/authSlice';
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
    // API URL from environment variables
    const API_URL = import.meta.env.VITE_API_URL;
    // Hook for navigation
    const navigate = useNavigate();
    // Hook for dispatching actions to Redux store
    const dispatch = useDispatch();
    // State for loading indicator
    const [loading, setLoading] = useState(false);
    // State variables for form data
    const [formData, setFormData] = useState({
        userName: '',
        password: '',
        rememberMe: false
    });
    // State to store login error messages
    const [loginError, setLoginError] = useState('');
    // State to control success Snackbar visibility
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    // State to check if account name and password are not empty
    const [formValid, setFormValid] = useState(false);

    // Handler for form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        // Prevent default form submission
        e.preventDefault();

        // Set loading state to true to show CircularProgress
        setLoading(true);

        try {
            // Send login request to the API
            const response = await axios.post(`${API_URL}/Users/Login`, formData);

            // Save user data in localStorage
            localStorage.setItem('userId', response.data.userId);
            localStorage.setItem('userName', response.data.userName);
            localStorage.setItem('accessToken', response.data.token.result);
            dispatch(login({
                userId: response.data.userId,
                userName: response.data.userName,
                token: response.data.token.result
            }));

            // Show success message and navigate to homepage after a short delay
            setShowSuccessMessage(true);
            setTimeout(() => {
                navigate('/');
            }, 1000);
            
        } catch (error: any) {
            // Handle different error responses from the API
            if (error.response && error.response.status === 404) {
                setLoginError("Login failed: User not found");
            } else if (error.response && error.response.status === 400) {
                setLoginError("Login failed: incorrect user information ");
            } else {
                setLoginError("Login failed: incorrect user information");
            }
        } finally {
            setLoading(false);
        }
    };

    // Handler for input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name!]: value });

        // Login form validation check
        let isValid = (
            formData.userName.trim() !== '' &&
            formData.password.trim() !== ''
        );
        setFormValid(isValid);
    };

    return (
        <Container
            component={Paper} maxWidth="sm"
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>

            {/* Display CircularProgress if loading */}
            {loading && <CircularProgress style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />}

            {/* Avatar icon */}
            <Avatar sx={{ m: 5, bgcolor: 'success.main' }}></Avatar>
            {/* Login title */}
            <Typography component="h1" variant="h4">
                Log in
            </Typography>
            {/* Login form */}
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField required margin="normal" fullWidth label="Username" autoFocus name="userName" onChange={handleChange} autoComplete="current-username" />
                <TextField required margin="normal" fullWidth label="Password" type="password" name="password" onChange={handleChange} autoComplete="current-password" />
                {/* Display login error message if any */}
                {loginError && (
                    <Typography variant="body2" color="error" paragraph>
                        {loginError}
                    </Typography>
                )}
                <Button type="submit" fullWidth disabled={!formValid} variant="contained" sx={{ mt: 3, mb: 2 }}>
                    Sign In
                </Button>
                {/* Link to the registration page */}
                <Grid container>
                    <Grid item>
                        <Link to="/register" style={{ textDecoration: 'none' }}>
                            {"Don't have an account? Sign Up"}
                        </Link>
                    </Grid>
                </Grid>
            </Box>
            {/* Success Snackbar */}
            <Snackbar
                open={showSuccessMessage}
                autoHideDuration={3000}
                onClose={() => setShowSuccessMessage(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <SnackbarContent
                    sx={{ backgroundColor: 'success.main' }}
                    message="Login successful!"
                />
            </Snackbar>
        </Container>
    )
}