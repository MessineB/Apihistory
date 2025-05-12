import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth-context';

export default function Layout() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      <nav className="flex gap-4 p-4 bg-gray-200 justify-between items-center">
        <div className="flex gap-4">
          <Link to="/">Accueil</Link>
          <Link to="/Dofus/upload">Dofus</Link>
          <Link to="/Lol/recherche">League of Legends</Link>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="text-green-600 font-semibold">Connecté ✅</span>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <Link to="/Login" className="text-blue-600 hover:underline">Se connecter</Link>
          )}
        </div>
      </nav>

      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}
