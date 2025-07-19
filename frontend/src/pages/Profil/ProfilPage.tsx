import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "../../styles/global.css";

interface DofusItem {
  id: string;
  dofusName: string;
  obtained: boolean;
  questAchieved: number;
}

interface LoLAccount {
  id: string;
  summonerName: string;
  tagLine: string;
  level: number;
  rank: string;
  profileIconId: number | null;
}

export default function ProfilPage() {
  const { isAuthenticated } = useAuth();
  const [dofusList, setDofusList] = useState<DofusItem[]>([]);
  const [lolAccounts, setLolAccounts] = useState<LoLAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const [dofusRes, lolRes] = await Promise.all([
          fetch("http://localhost:3001/dofus/my", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:3001/riot/favorites/detailed", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const [dofusData, lolData] = await Promise.all([
          dofusRes.json(),
          lolRes.json(),
        ]);

        setDofusList(dofusData);
        setLolAccounts(lolData);
      } catch (err) {
        console.error("Erreur chargement progression :", err);
        toast.error("Erreur lors du chargement des données !");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");
    try {
      await fetch("http://localhost:3001/riot/favorite/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      setLolAccounts((prev) => prev.filter((acc) => acc.id !== id));
      toast.success("Favori supprimé avec succès ✅");
    } catch (err) {
      console.error("Erreur lors de la suppression du favori :", err);
      toast.error("Échec de la suppression ❌");
    }
  };

  if (!isAuthenticated) {
    return (
      <p className="text-red-600 text-center">
        Vous devez être connecté pour voir votre profil.{" "}
        <Link to="/Login" className="text-blue-600 underline">Se connecter</Link>
      </p>
    );
  }

  if (loading) return <p className="text-center animate-fade-in">Chargement de vos données...</p>;

  return (
    <div className="profil-container">
      <h1 className="profil-title">👤 Mon Profil</h1>

      {/* Dofus Section */}
      <section className="profil-section">
        <h2 className="section-title">Progression Dofus</h2>

        {!dofusList.length ? (
          <div className="empty-section">
            <p className="empty-text">📭 Aucune progression Dofus trouvée.</p>
            <Link to="/Dofus/Upload" className="btn-primary">Importer ma progression</Link>
          </div>
        ) : (
          <>
            <div className="mb-3">
              <Link to="/Dofus/Upload" className="btn-primary">Mettre à jour ma progression</Link>
            </div>
            <div className="data-box">
              <ul>
                {dofusList.map((dofus) => (
                  <li key={dofus.id} className="data-entry">
                    <div className="data-content">
                      <img
                        src={`/images/dofus/${dofus.dofusName.toLowerCase().replace("dofus ", "").replace(/\s+/g, "-")}.png`}
                        alt={dofus.dofusName}
                        className="icon-sm"
                      />
                      <div>
                        <p className="entry-title">{dofus.dofusName}</p>
                        <p className="entry-sub">Quêtes faites : {dofus.questAchieved}</p>
                      </div>
                    </div>
                    <span className="entry-status">{dofus.obtained ? "✅ Obtenu" : "❌ Non obtenu"}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </section>

      {/* League of Legends Section */}
      <section className="profil-section">
        <h2 className="section-title">Vos joueurs LoL favoris</h2>
        <div className="mb-4">
          <Link to="/Lol/recherche" className="btn-primary">Rechercher un joueur à ajouter</Link>
        </div>
        {!lolAccounts.length ? (
          <p>
            Aucun joueur LoL en favori pour le moment. <br />
            <Link to="/Lol/recherche" className="text-blue-600 underline">Ajouter un favori</Link>
          </p>
        ) : (
          <div className="data-box">
            <ul>
              {lolAccounts.map((account) => (
                <li key={account.id} className="data-entry">
                  <div className="data-content">
                    {account.profileIconId !== null && (
                      <img
                        src={`https://ddragon.leagueoflegends.com/cdn/14.9.1/img/profileicon/${account.profileIconId}.png`}
                        alt="Icon"
                        width={40}
                        height={40}
                        className="rounded"
                      />
                    )}
                    <a
                      href={`/Lol/joueur/${account.tagLine}/${encodeURIComponent(account.summonerName)}`}
                      className="entry-title hover:underline"
                    >
                      {account.summonerName}#{account.tagLine}
                    </a>
                    <span className="entry-sub">– Niveau {account.level} – {account.rank}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(account.id)}
                    className="entry-action"
                  >
                    🗑️ Supprimer
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}
