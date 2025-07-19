import { Link } from 'react-router-dom';
import './App.css';

export default function App() {
  return (
    <div className="homepage">
      <h1 className="homepage-title">Bienvenue sur GAMERTRACK</h1>
      <img
        src="/images/logos/logo-png.png"
        alt="Logo Gamertrack"
        className="homepage-logo"
      />
      <p className="homepage-subtitle">Choisissez un jeu pour voir votre progression :</p>

      <div className="game-grid">
        <Link to="/Dofus/Achivement" className="game-card">
          <img src="/images/logos/dofus.png" alt="Dofus" />
          <span>Dofus</span>
        </Link>
        <Link to="/Lol/recherche" className="game-card">
          <img src="/images/logos/lol.png" alt="League of Legends" />
          <span>League of Legends</span>
        </Link>
        <div className="game-card relative wip">
          <img src="/images/logos/Hearthstone.png" alt="Hearthstone" />
          <span>Hearthstone</span>
        </div>
        <div className="game-card relative wip">
          <img src="/images/logos/Valorant.png" alt="League of Legends" />
          <span>Valorant</span>
        </div>
      </div>
    </div>
  );
}
