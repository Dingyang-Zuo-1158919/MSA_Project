import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SceneriesPage from '../pages/SceneriesPage';
import AboutPage from '../pages/AboutPage';
import ErrorPage from '../pages/ErrorPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import HomePage from '../pages/HomePage';
import UploadPage from '../pages/UploadPage';
import UpdatePage from '../pages/UpdatePage';
import App from '../App';
import MyCollectionPage from '../pages/MyCollectionPage';
import MyUploadPage from '../pages/MyUploadPage';

const router = (
  <Router>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="homepage" element={<HomePage />} />
        <Route path="sceneries" element={<SceneriesPage />} />
        <Route path="about/:Id" element={<AboutPage />} />
        <Route path="upload" element={<UploadPage />} />
        <Route path="update/:Id" element={<UpdatePage />} />
        <Route path="mycollection/:Id" element={<MyCollectionPage />} />
        <Route path="myupload/:Id" element={<MyUploadPage />} />
        <Route path="error" element={<ErrorPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Route>
    </Routes>
  </Router>
);

export default router;