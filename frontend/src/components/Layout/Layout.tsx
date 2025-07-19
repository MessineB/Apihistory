import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth-context';
import Footer from './Footer.tsx';
import { useEffect, useState } from 'react';

export default function Layout() {
  const { isAuthenticated, logout, pseudo } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('dark') === 'true';
  });

  // Appliquer la classe sur le <body>
  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('dark', darkMode.toString());
  }, [darkMode]);

  return (
    <div>
      <nav className="navbar">
        <div className="nav-links">
          <Link to="/" className="nav-link">
            <span className="nav-label">Accueil</span>
          </Link>

          <Link to="/Dofus/Achivement" className="nav-link">
            <img src="/images/logos/dofus.png" alt="Dofus" className="nav-icon" />
          </Link>

          <Link to="/Lol/recherche" className="nav-link">
            <img src="/images/logos/lol.png" alt="LoL" className="nav-icon" />
          </Link>
        </div>

        <div className="nav-actions">
          {/* 🌙 Bouton mode nuit */}
          <button
            onClick={() => setDarkMode((prev) => !prev)}
            className="btn-primary"
            title="Changer de thème"
          >
            {darkMode ? '☀️ Mode clair' : '🌙 Mode nuit'}
          </button>

          {isAuthenticated ? (
            <>
              <div className="profile-link">
                <Link to="/Profil" className="btn-primary">Mon Profil 👤</Link>
              </div>
              <div className="profile-link">
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="btn-logout"
                >
                  Déconnexion
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-1">
              <Link to="/Login" className="btn-login">Se connecter</Link>
              <Link to="/Sign-up" className="text-sm text-blue-400 hover:underline">Créer un compte</Link>
            </div>
          )}
        </div>
      </nav>

      <main className="main-wrapper">
        <div className="container">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}
