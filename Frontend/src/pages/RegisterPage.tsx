import { Avatar, Box, Button, Container, Grid, Paper, SnackbarContent, TextField, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Snackbar from '@mui/material/Snackbar';

export default function RegisterPage() {
  // API URL from environment variables
  const API_URL = import.meta.env.VITE_API_URL;
  // State variables for form data and validation
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [formValid, setFormValid] = useState(false);
  const [registrationError, setRegistrationError] = useState<string[]>([]);
  const navigate = useNavigate();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isUsernameTouched, setIsUsernameTouched] = useState(false);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // Prevent default form submission
    e.preventDefault();

    try {
      // Send register request to the API
      const { userName, email, password } = formData;
      await axios.post(`${API_URL}/Users/Register`, { userName, email, password });
      // Show success message and navigate to login page after a short delay
      setShowSuccessMessage(true);
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error: any) {
      // Handle different error responses from the API
      let errors: string[] = [];
      if (error.response && error.response.status === 404) {
        errors = ["Registration failed: Resource not found"];
      } else if (error.response && error.response.status === 400) {
        errors = ["Registration failed: Please double check your register information"];
      } else {
        errors = [`Registration failed: ${error.message}`];
      }

      setRegistrationError(errors);
    }
  };

  // Handle form input changes
  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));

    setRegistrationError([]);

    // Registration form inputs validation check
    let currentPasswordsMatch = passwordsMatch;

    if (name === 'password') {
      currentPasswordsMatch = value === formData.confirmPassword;
      setPasswordsMatch(currentPasswordsMatch);
    } else if (name === 'confirmPassword') {
      currentPasswordsMatch = value === formData.password;
      setPasswordsMatch(currentPasswordsMatch);
    }

    if (name === 'email') {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/u;
      setIsEmailValid(emailRegex.test(value.trim()));
    }

    let isValid = (
      formData.userName.trim() !== '' &&
      formData.email.trim() !== '' &&
      isEmailValid &&
      formData.password.trim() !== '' &&
      formData.confirmPassword.trim() !== '' &&
      currentPasswordsMatch
    );

    if (name === 'userName') {
      setIsUsernameTouched(true);
      isValid = (
        value.trim() !== '' &&
        formData.email.trim() !== '' &&
        isEmailValid &&
        formData.password.trim() !== '' &&
        formData.confirmPassword.trim() !== '' &&
        currentPasswordsMatch
      );
    }
    setFormValid(isValid);
  };

  return (
    <Container component={Paper} maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
      {/* Avatar icon */}
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}></Avatar>
      {/* Register title */}
      <Typography component="h1" variant="h5">
        Register
      </Typography>
      {/* Register form */}
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <div>
          <TextField margin="normal" fullWidth label="Username" autoFocus name="userName" onChange={handleChange} required autoComplete="current-username" />
          {isUsernameTouched && !formData.userName && (
            <p style={{ color: 'red' }}>Username is required. Please enter a username.</p>
          )}
        </div>
        <div>
          <TextField margin="normal" fullWidth label="Email" name="email" onChange={handleChange} required autoComplete="current-email" />
          {/* Display email validation error message if any */}
          {!isEmailValid && (
            <p style={{ color: 'red' }}>Email format error. Please enter a valid email.</p>
          )}
        </div>
        <TextField margin="normal" fullWidth label="Password" type="password" name="password" onChange={handleChange} required autoComplete="current-password" />
        <div>
          <TextField margin="normal" fullWidth label="Confirm Password" type="password" placeholder="Confirm Password" name="confirmPassword" onChange={handleChange} required autoComplete="current-confirmpassword" />
          {/* Display password validation error message if any */}
          {!passwordsMatch && (
            <p style={{ color: 'red' }}>Passwords do not match. Please enter matching passwords.</p>
          )}
        </div>
        {/* Display registration error message if any */}
        {registrationError && (
          <Typography variant="body2" color="error" paragraph>
            {registrationError}
          </Typography>
        )}
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={!formValid}>
          Register
        </Button>
        {/* Link to the login page */}
        <Grid container>
          <Grid item>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              {"Already have an account? Log In"}
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
          message="Register successful!"
        />
      </Snackbar>
    </Container>
  )
}