import { Container, createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import { BrowserRouter } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from './components/Header';
import LoadingComponent from './components/LoadingComponent';
import router from './router/Routes';
import AuthWrapper from './components/AuthWrapper';

export default function App() {
  // State to manage loading status
  const [loading, setLoading] = useState(false);
  // State to manage theme mode (dark/light)
  const [darkMode, setDarkMode] = useState(false);
  // Determine the palette type based on darkMode state
  const paletteType = darkMode ? 'dark' : 'light';
  // Create a theme object with dynamic palette mode and background color
  const theme = createTheme({
    palette: {
      mode: paletteType,
      background: {
        default: paletteType === 'light' ? '#eaeaea' : '#121212'
      }
    }
  });
  // useEffect hook to set loading to false when the component mounts
  useEffect(() => {
    setLoading(false);
  }, [])
  // Function to handle theme change
  function handleThemeChange() {
    setDarkMode(!darkMode);
  }

  return (
    // ThemeProvider to apply the theme to the entire app
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        {/* Header component with light/dark mode and theme change handler */}
        <Header darkMode={darkMode} handleThemeChange={handleThemeChange} isLoggedIn />
        {/* Conditional rendering to show loading component or the main content */}
        {loading ? (<LoadingComponent message="Initializing app..." />)
          : (
            <Container sx={{ mt: 4 }}>
              {/* AuthWrapper to check log-in status */}
              <AuthWrapper>
                {router}
              </AuthWrapper>
            </Container>
          )}
      </BrowserRouter>
    </ThemeProvider>
  )
}