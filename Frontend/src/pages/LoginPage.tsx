import { Avatar, Box, Button, Container, Grid, Paper, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useDispatch } from 'react-redux';
import { login } from '../Redux/Slices/authSlice';
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        userName: '',
        password: '',
        rememberMe: false
    });
    const [loginError, setLoginError] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${API_URL}/Users/Login`, formData);
            localStorage.setItem('userId', response.data.userId);
            localStorage.setItem('userName', response.data.userName);
            localStorage.setItem('accessToken', response.data.token.result);
            dispatch(login({
                userId: response.data.userId,
                userName: response.data.userName,
                token: response.data.token.result
            }));
            navigate('/homepage');
        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                setLoginError("Login failed: User not found");
            } else if (error.response && error.response.status === 400) {
                setLoginError("Login failed: incorrect user information ");
            } else {
                setLoginError(`Login failed: ${error.message}`);
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name!]: value });
    };

    return (
        <Container
            component={Paper} maxWidth="sm"
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
            <Avatar sx={{ m: 5, bgcolor: 'success.main' }}></Avatar>
            <Typography component="h1" variant="h4" >
                Log in
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField margin="normal" fullWidth label="Username" autoFocus name="userName" onChange={handleChange} autoComplete="current-username"/>
                <TextField margin="normal" fullWidth label="Password" type="password" name="password" onChange={handleChange} autoComplete="current-password"/>
                {loginError && (
                    <Typography variant="body2" color="error" paragraph>
                        {loginError}
                    </Typography>
                )}
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                    Sign In
                </Button>
                <Grid container>
                    <Grid item>
                        <Link to="/register" style={{ textDecoration: 'none' }}>
                            {"Don't have an account? Sign Up"}
                        </Link>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    )
}