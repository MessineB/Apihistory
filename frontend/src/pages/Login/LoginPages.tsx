import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Erreur lors de la connexion');
      }

      localStorage.setItem('token', data.token);

      setMessage('✅ Connexion réussie ! Redirection...');
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    }
  };

  return (
    <div className="register-page">
      <form onSubmit={handleSubmit} className="register-form">
        <h2 className="register-title">Connexion</h2>

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
          Se connecter
        </button>

        {message && (
          <p className={`register-message ${message.startsWith('✅') ? 'success' : 'error'}`}>
            {message}
          </p>
        )}

        <p className="register-message text-sm mt-4">
          Pas encore de compte ?{' '}
          <Link to="/Sign-up" className="text-blue-500 hover:underline">
            Créer un compte
          </Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
