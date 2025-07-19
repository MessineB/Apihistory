import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import './styles/global.css';

import App from './App.tsx';
import PlayerPage from './pages/LoL/PlayerPage.tsx';
import DofusUploadPage from './pages/Dofus/Upload.tsx';
import DofusAchivementPage from './pages/Dofus/Achivement.tsx';
import RechercheSummonerPage from './pages/LoL/SummonerSearchPage.tsx';
import RegisterPage from './pages/Register/RegisterPages.tsx';
import LoginPage from './pages/Login/LoginPages.tsx';
import ProfilPage from "./pages/Profil/ProfilPage.tsx";
import NotfoundPage from "./pages/404/404.tsx";
import { AuthProvider } from './context/auth-context';
import Layout from '../src/components/Layout/Layout.tsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<App />} />
            <Route path="/Lol/recherche" element={<RechercheSummonerPage />} />
            <Route path="/Dofus/Upload" element={<DofusUploadPage />} />
            <Route path="/Lol/joueur/:tagLine/:gameName" element={<PlayerPage />} />
            <Route path="/Sign-up" element={<RegisterPage />} />
            <Route path="/Login" element={<LoginPage />} />
            <Route path="/Dofus/Achivement" element={<DofusAchivementPage />} />
            <Route path="/profil" element={<ProfilPage />} />
            <Route path="*" element={<NotfoundPage />} />
          </Route> 
        </Routes>
        <ToastContainer position="top-center" autoClose={3000} />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
