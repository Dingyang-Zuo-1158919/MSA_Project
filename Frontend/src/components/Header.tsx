import { Accordion, AccordionDetails, AccordionSummary, AppBar, Box, IconButton, List, ListItem, Switch, Toolbar, Typography, useMediaQuery, useTheme } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from '../Redux/Slices/authSlice';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import DropdownMenu from "./DropdownMenu";
import { useState } from "react";

// Styles for navigation links
const navStyle = { color: 'inherit', textDecoration: 'none', typography: 'h6', '&:hover': { color: 'grey.500' }, '&.active': { color: 'text.secondary' } }

export interface HeaderProps {
    darkMode: boolean;
    handleThemeChange: () => void;
    isLoggedIn: boolean;
}

export default function Header({ darkMode, handleThemeChange }: HeaderProps) {
    // Responsive styling
    const theme = useTheme();
    const isMobileOrPad = useMediaQuery(theme.breakpoints.down('md'));
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

    // State to manage the selected item
    const [selectedItem, setSelectedItem] = useState('Scenery');

    // Function to handle item selection
    const handleItemClick = (item: string) => {
        setSelectedItem(item);
    };

    return (
        <AppBar sx={{ position: 'static' }}>
            {isMobileOrPad ? (
                // Mobile view with accordion menu
                <Toolbar sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
                    {/* Left side of the header with website name and theme switch */}
                    <Box display='flex' alignItems='center' sx={{ width: '100%', mb:'20px' }}>
                        <Typography variant='h4' component={NavLink} to="/" sx={navStyle}>Sceneries Sharing</Typography>
                        <Switch checked={darkMode} data-testid="dark-mode-switch" onChange={handleThemeChange} />
                    </Box>
                    {/* Middle section with navigation links */}

                    <Accordion sx={{ width: '100%', mb:'10px' }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <IconButton>
                                <MenuIcon />
                                {selectedItem}
                            </IconButton>
                        </AccordionSummary>
                        <AccordionDetails>
                            <List>
                                <ListItem component={NavLink} to="/sceneries" key='sceneries' sx={navStyle} onClick={() => handleItemClick('Sceneries')}>Sceneries</ListItem>
                                <ListItem component={NavLink} to="/upload" key='upload' sx={[navStyle, {mb:'5px'}]} onClick={() => handleItemClick('Upload')}>Upload</ListItem>
                                {isLoggedIn ? (
                                    <>
                                        <ListItem >Welcome back, {userName}</ListItem>
                                        <DropdownMenu onItemClick={handleItemClick}/>
                                        <ListItem sx={navStyle} onClick={() => { handleLogout(); handleItemClick(''); }}>Logout</ListItem>
                                    </>
                                ) : (
                                    <>
                                        <ListItem component={NavLink} to="/login" key='login' sx={navStyle} onClick={() => handleItemClick('Log in')}>Log in</ListItem>
                                        <ListItem component={NavLink} to="/register" key='register' sx={navStyle} onClick={() => handleItemClick('Register')}>Register</ListItem>
                                    </>
                                )}
                            </List>
                        </AccordionDetails>
                    </Accordion>
                </Toolbar>
            ) : (
                // Desktop and tablet view
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {/* Left side of the header with website name and theme switch */}
                    <Box display='flex' alignItems='center'>
                        <Typography variant='h4' component={NavLink} to="/" sx={navStyle}>Sceneries Sharing</Typography>
                        <Switch checked={darkMode} data-testid="dark-mode-switch" onChange={handleThemeChange} />
                    </Box>
                    {/* Middle section with navigation links */}
                    <Box display='flex' alignItems='center' sx={{ flexGrow: 1, justifyContent: 'space-between' }}>
                        {/* Middle section with navigation links */}
                        <List sx={{ display: 'flex' }}>
                            <ListItem component={NavLink} to="/sceneries" key='sceneries' sx={navStyle}>Sceneries</ListItem>
                            <ListItem component={NavLink} to="/upload" key='upload' sx={navStyle}>Upload</ListItem>
                        </List>
                        {/* Right side of the header with user authentication options */}
                        <Box display='flex' alignItems='center'>
                            {isLoggedIn ? (
                                <List sx={{ display: 'flex' }}>
                                    <ListItem >Welcome back, {userName}</ListItem>
                                    <DropdownMenu onItemClick={handleItemClick}/>
                                    <ListItem sx={navStyle} onClick={handleLogout}>Logout</ListItem>
                                </List>
                            ) : (
                                <List sx={{ display: 'flex' }}>
                                    <ListItem component={NavLink} to="/login" key='login' sx={navStyle}>Log in</ListItem>
                                    <ListItem component={NavLink} to="/register" key='register' sx={navStyle}>Register</ListItem>
                                </List>
                            )}
                        </Box>
                    </Box>
                </Toolbar>
            )}
        </AppBar>
    )
}