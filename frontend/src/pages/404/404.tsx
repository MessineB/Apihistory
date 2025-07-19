import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="notfound-page">
      <h1 className="notfound-title">404</h1>
      <p className="notfound-text">
        Oups, cette page n’existe pas 😢
      </p>
      <Link to="/" className="btn-primary">
        Retour à l’accueil
      </Link>
    </div>
  );
}
