import { Container, createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SceneriesPage from './pages/SceneriesPage';
import { useEffect, useState } from 'react';
import Header from './components/Header';
import UploadPage from './pages/UploadPage';
import MyCollectionPage from './pages/MyCollectionPage';
import UpdatePage from './pages/UpdatePage';
import MyUploadPage from './pages/MyUploadPage';
import ErrorPage from './pages/ErrorPage';
import LoadingComponent from './components/LoadingComponent';

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
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/sceneries" element={<SceneriesPage />} />
                <Route path="/about/:Id" element={<AboutPage />} />
                <Route path="mycollection/:Id" element={<MyCollectionPage />} />
                <Route path="myupload/:Id" element={<MyUploadPage />} />
                <Route path="update/:Id" element={<UpdatePage />} />
                <Route path="/upload" element={<UploadPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="*" element={<ErrorPage />} />
              </Routes>
            </Container>
          )}
      </BrowserRouter>
    </ThemeProvider>
  )
}