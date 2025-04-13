import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import './styles/global.css';
import PlayerPage from './pages/PlayerPage.tsx';
import RechercheSummonerPage from './pages/SummonerSearchPage.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/recherche" element={<RechercheSummonerPage />} />
        <Route path="/joueur/:tagLine/:gameName" element={<PlayerPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
