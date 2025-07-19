import React from 'react';
import '../../styles/global.css'; // Assure-toi que ce chemin est correct

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Gauche */}
        <div className="footer-left">
          <p className="footer-text">
            🎓 Ce site a été réalisé dans le cadre d’un projet de diplôme.
          </p>
        </div>

        {/* Centre */}
        <div className="footer-center">
          <p>© 2025 MessineCorp Inc.</p>
          <div className="footer-links">
            <a href="#">Conditions d’utilisation</a>
            <a href="#">Terms of Service</a>
            <a href="#">Politique de confidentialité</a>
          </div>
        </div>

        {/* Droite */}
        <div className="footer-right">
          <p className="footer-text">📱 Suivez-moi :</p>
          <div className="footer-icons">
            <a href="https://discord.com" target="_blank" rel="noreferrer">
              <img src="/images/icons/discord.png" alt="Discord" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">
              <img src="/images/icons/twitter.png" alt="Twitter" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <img src="/images/icons/facebook.png" alt="Facebook" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer">
              <img src="/images/icons/youtube.png" alt="YouTube" />
            </a>
            <a href="mailto:messinebelaroussi@gmail.com">
              <img src="/images/icons/gmail.png" alt="Email" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
