import { Container, createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import { BrowserRouter } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from './components/Header';
import LoadingComponent from './components/LoadingComponent';
import router from './router/Routes';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const paletteType = darkMode ? 'dark' : 'light';
  const theme = createTheme({
    palette: {
      mode: paletteType,
      background: {
        default: paletteType === 'light' ? '#eaeaea' : '#121212'
      }
    }
  })

  useEffect(() => {
    setLoading(false);
  }, [])

  function handleThemeChange() {
    setDarkMode(!darkMode);
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Header darkMode={darkMode} handleThemeChange={handleThemeChange} />
        {loading ? (<LoadingComponent message="Initializing app..." />)
          : (
            <Container sx={{ mt: 4 }}>
              {router}
            </Container>
          )}
      </BrowserRouter>
    </ThemeProvider>
  )
}