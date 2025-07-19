import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
  const [email, setEmail] = useState('');
  const [pseudo, setPseudo] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:3001/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, pseudo, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Erreur lors de l’inscription');
      }

      setMessage('✅ Inscription réussie ! Redirection...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    }
  };

  return (
    <div className="register-page">
      <form onSubmit={handleSubmit} className="register-form">
        <h2 className="register-title">Créer un compte</h2>

        <div className="form-group">
          <label htmlFor="email" className="form-label">Adresse Email</label>
          <input
            id="email"
            type="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="pseudo" className="form-label">Pseudo</label>
          <input
            id="pseudo"
            type="text"
            className="form-input"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">Mot de passe</label>
          <input
            id="password"
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="register-button">
          S’inscrire
        </button>
        <p className="register-message text-sm mt-4">
          Deja un compte ?{' '}
          <Link to="/Login" className="text-blue-500 hover:underline">
            Se connecter
          </Link>
        </p>
        {message && (
          <p
            className={`register-message ${message.startsWith('✅') ? 'success' : 'error'
              }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

export default Register;
