import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import './styles/global.css';
import PlayerPage from './pages/LoL/PlayerPage.tsx';
import DofusUploadPage from './pages/Dofus/Upload.tsx';
import RechercheSummonerPage from './pages/LoL/SummonerSearchPage.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/Lol/recherche" element={<RechercheSummonerPage />} />
        <Route path="/Dofus/Upload" element={<DofusUploadPage />} />
        <Route path="/Lol/joueur/:tagLine/:gameName" element={<PlayerPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
