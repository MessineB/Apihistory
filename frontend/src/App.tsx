import { Routes, Route, Link } from 'react-router-dom';
import SummonerSearchPage from './pages/LoL/SummonerSearchPage';
import PlayerPage from './pages/LoL/PlayerPage';
import './App.css'
import DofusUpload from './components/Dofus/DofusUpload';

function App() {
  return (
    <div>
      <nav>
        <Link to="/Dofus/upload">Dofus</Link> | <Link to="/Lol/recherche">League of Legends</Link> 
      </nav>

      <Routes>
        <Route path="/LoL/joueur/:tagLine/:gameName" element={<PlayerPage />} />
        <Route path="/" element={<p>Bienvenue sur APIHistory !</p>} />
        <Route path="/Lol/recherche" element={<SummonerSearchPage />} />
        <Route path="/Dofus/upload" element={<DofusUpload />} />
      </Routes>
    </div>
  );
}

export default App
