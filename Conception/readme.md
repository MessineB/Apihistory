# 🎮 GameTrack

GameTrack est une application web permettant aux utilisateurs de **suivre, consulter et analyser les historiques de parties de jeux vidéo multijoueur compétitifs** (comme League of Legends) grâce à des **APIs publiques** (Riot Games API, etc.).

---

## 🚀 Objectif

Fournir une plateforme où les utilisateurs peuvent :
- Suivre leurs propres performances dans un jeu
- Observer plusieurs comptes de joueurs
- Visualiser des statistiques détaillées et des graphiques
- Centraliser l’historique de leurs parties multi-jeux

---

## 👤 Utilisateurs visés

- Joueurs réguliers de jeux compétitifs
- Amateurs d’analyse de performance
- Communautés e-sport ou de suivi statistique

---

## 🧩 Fonctionnalités (MVP)

- 🔐 Authentification sécurisée (Inscription, Connexion, JWT)
- 🎮 Ajout de comptes de jeux (GameAccount)
- 📊 Récupération automatique des parties via API
- 📖 Visualisation des parties : KDA, durée, champion joué
- 📈 Statistiques globales : winrate, performances, etc.
- 🔍 Suivi multi-joueurs 

---

## ✨ Fonctionnalités bonus 

- Comparaison entre joueurs
- Graphiques interactifs (Recharts, etc.)
- Ajout d'autres jeux compatibles API
- Notifications personnalisées
- Classement entre joueurs suivis

---

## ⚙️ Stack technique

| Côté             | Technologie                     |
|------------------|----------------------------------|
| **Frontend**     | React.js + Tailwind CSS          |
| **Backend**      | Node.js               |
| **BDD**          | PostgreSQL + Prisma (ORM)        |
| **API externe**  | Riot Games API (Summoner, Match) |
| **Auth**         | JWT, bcrypt                      |
| **Déploiement**  | Vercel (front) + Render (back)   |

---

## 🧱 Modèle de données (ERD résumé)

### Entités principales :
- **User** : les utilisateurs de l'app
- **GameAccount** : comptes de jeu suivis
- **Match** : parties jouées
- **Champion** : personnages joués
- **UserGameAccount** : table N:N entre User et GameAccount

🔗 Relations :
- User ⟷ GameAccount : many-to-many
- GameAccount ⟶ Match : one-to-many
- Match ⟶ Champion : one-to-one

