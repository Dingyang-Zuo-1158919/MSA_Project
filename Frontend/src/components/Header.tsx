import { AppBar, Box, List, ListItem, Switch, Toolbar, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";


const navStyle = { color: 'inherit', textDecoration: 'none', typography: 'h6', '&:hover': { color: 'grey.500' }, '&.active': { color: 'text.secondary' } }

interface Props {
    darkMode: boolean;
    handleThemeChange: () => void;
}

export default function Header({ darkMode, handleThemeChange }: Props) {

    return (
        <AppBar>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box display='flex' alignItems='center'>
                    <Typography variant='h4' component={NavLink} to="/homepage" sx={navStyle}>Sceneries Sharing</Typography>
                    <Switch checked={darkMode} onChange={handleThemeChange} />
                </Box>

                <List sx={{ display: 'flex' }}>
                    <ListItem component={NavLink} to="/sceneries" key='sceneries' sx={navStyle}>Sceneries</ListItem>
                    <ListItem component={NavLink} to="/about" key='about' sx={navStyle}>About</ListItem>
                    <ListItem component={NavLink} to="/contact" key='contact' sx={navStyle}>Contact</ListItem>
                </List>

                <Box display='flex' alignItems='center'>
                    <List sx={{ display: 'flex' }}>
                        <ListItem component={NavLink} to="/login" key='login' sx={navStyle}>Log in</ListItem>
                        <ListItem component={NavLink} to="/register" key='register' sx={navStyle}>Register</ListItem>
                    </List>
                </Box>
            </Toolbar>
        </AppBar>
    )
}