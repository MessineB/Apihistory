import { Routes, Route, Link } from 'react-router-dom';
import SummonerSearchPage from './pages/SummonerSearchPage';
import PlayerPage from './pages/PlayerPage';
import './App.css'

function App() {
  return (
    <div>
      <nav>
        <Link to="/">Accueil</Link> | <Link to="/recherche">Recherche</Link> 
      </nav>

      <Routes>
      <Route path="/joueur/:tagLine/:gameName" element={<PlayerPage />} />
        <Route path="/" element={<p>Bienvenue sur APIHistory !</p>} />
        <Route path="/recherche" element={<SummonerSearchPage />} />
      </Routes>
    </div>
  );
}

export default App
