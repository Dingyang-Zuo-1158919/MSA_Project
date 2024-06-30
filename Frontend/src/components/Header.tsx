import { AppBar, Box, List, ListItem, Switch, Toolbar, Typography } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from '../Redux/Slices/authSlice';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import DropdownMenu from "./DropdownMenu";

// Styles for navigation links
const navStyle = { color: 'inherit', textDecoration: 'none', typography: 'h6', '&:hover': { color: 'grey.500' }, '&.active': { color: 'text.secondary' } }

export interface HeaderProps {
    darkMode: boolean;
    handleThemeChange: () => void;
    isLoggedIn: boolean;
}

export default function Header({ darkMode, handleThemeChange }: HeaderProps) {
    // Get user information from Redux store
    const isLoggedIn = useSelector((state: any) => state.auth.isLoggedIn);
    const userName = useSelector((state: RootState) => state.auth.userName);
    // Hook for dispatching actions to Redux store
    const dispatch = useDispatch();
    // Hook for navigation
    const navigate = useNavigate();

    // Function to handle logout
    const handleLogout = () => {
        // Dispatching logout action
        dispatch(logout());
        // Navigating to home page after logout
        navigate('/')
    };

    return (
        <AppBar sx={{ position: 'static' }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Left side of the header with website name and theme switch */}
                <Box display='flex' alignItems='center'>
                    <Typography variant='h4' component={NavLink} to="/" sx={navStyle}>Sceneries Sharing</Typography>
                    <Switch checked={darkMode} data-testid="dark-mode-switch" onChange={handleThemeChange} />
                </Box>
                {/* Middle section with navigation links */}
                <List sx={{ display: 'flex' }}>
                    <ListItem component={NavLink} to="/sceneries" key='sceneries' sx={navStyle}>Sceneries</ListItem>
                    <ListItem component={NavLink} to="/upload" key='upload' sx={navStyle}>Upload</ListItem>
                </List>
                {/* Right side of the header with user authentication options */}
                <Box display='flex' alignItems='center'>
                    {isLoggedIn ? (
                        // Displayed when user is logged in
                        <List sx={{ display: 'flex' }}>
                            <ListItem >Welcome&nbsp;back, {userName}</ListItem>
                            <DropdownMenu />
                            <ListItem sx={navStyle} onClick={handleLogout} >Logout</ListItem>
                        </List>
                    ) : (
                        // Displayed when user is not logged in
                        <List sx={{ display: 'flex' }}>
                            <ListItem component={NavLink} to="/login" key='login' sx={navStyle}>Log in</ListItem>
                            <ListItem component={NavLink} to="/register" key='register' sx={navStyle}>Register</ListItem>
                        </List>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    )
}