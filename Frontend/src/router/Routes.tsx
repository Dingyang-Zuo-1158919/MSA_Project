import { Routes, Route } from 'react-router-dom';
import SceneriesPage from '../pages/SceneriesPage';
import AboutPage from '../pages/AboutPage';
import ErrorPage from '../pages/ErrorPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import HomePage from '../pages/HomePage';
import UploadPage from '../pages/UploadPage';
import UpdatePage from '../pages/UpdatePage';
import MyCollectionPage from '../pages/MyCollectionPage';
import MyUploadPage from '../pages/MyUploadPage';

const router = (
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
);

export default router;