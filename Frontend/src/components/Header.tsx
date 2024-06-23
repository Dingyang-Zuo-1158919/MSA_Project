import { AppBar, Box, List, ListItem, Switch, Toolbar, Typography } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from '../Redux/Slices/authSlice';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import DropdownMenu from "./DropdownMenu";

const navStyle = { color: 'inherit', textDecoration: 'none', typography: 'h6', '&:hover': { color: 'grey.500' }, '&.active': { color: 'text.secondary' } }

interface Props {
    darkMode: boolean;
    handleThemeChange: () => void;
}

export default function Header({ darkMode, handleThemeChange }: Props) {
    const isLoggedIn = useSelector((state: any) => state.auth.isLoggedIn);
    const userName = useSelector((state: RootState) => state.auth.userName);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const handleLogout = () => {
        dispatch(logout());
        navigate('/homepage')
    };

    return (
        <AppBar sx={{ position: 'static' }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box display='flex' alignItems='center'>
                    <Typography variant='h4' component={NavLink} to="/homepage" sx={navStyle}>Sceneries Sharing</Typography>
                    <Switch checked={darkMode} onChange={handleThemeChange} />
                </Box>

                <List sx={{ display: 'flex' }}>
                    <ListItem component={NavLink} to="/sceneries" key='sceneries' sx={navStyle}>Sceneries</ListItem>
                    <ListItem component={NavLink} to="/upload" key='upload' sx={navStyle}>Upload</ListItem>
                </List>

                <Box display='flex' alignItems='center'>
                    {isLoggedIn ? (
                        <List sx={{ display: 'flex' }}>
                            <ListItem >Welcome&nbsp;back, {userName}</ListItem>
                            <DropdownMenu />
                            <ListItem sx={navStyle} onClick={handleLogout} >Logout</ListItem>
                        </List>
                    ) : (
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