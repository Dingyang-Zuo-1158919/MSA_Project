import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import App from '../App';
import SceneriesPage from '../pages/SceneriesPage';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';
import ErrorPage from '../pages/ErrorPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import HomePage from '../pages/HomePage';

const router = (
  <Router>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="homepage" element={<HomePage />} />
        <Route path="sceneries" element={<SceneriesPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="error" element={<ErrorPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate replace to="/error" />} />
      </Route>
    </Routes>
  </Router>
);

export default router;