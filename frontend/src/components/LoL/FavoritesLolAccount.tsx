import { useEffect, useState } from 'react';
import { toast } from 'react-toastify'; // ✅ Import

interface LoLAccount {
  id: string;
  summonerName: string;
  tagLine: string;
  level: number;
  rank: string;
  profileIconId: number | null;
}

const FavoriteLoLAccounts = () => {
  const [accounts, setAccounts] = useState<LoLAccount[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3001/riot/favorites/detailed', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setAccounts(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des favoris :', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem('token');
    try {
      await fetch('http://localhost:3001/riot/favorite/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      setAccounts((prev) => prev.filter((acc) => acc.id !== id));
      toast.success("Favori supprimé avec succès ✅"); // ✅ Toast ici
    } catch (err) {
      console.error('Erreur lors de la suppression du favori :', err);
      toast.error("Échec de la suppression ❌");
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  if (loading) return <p>Chargement des favoris...</p>;

  if (!accounts.length) return (
    <p>
      Aucun joueur LoL en favori pour le moment. <br />
      Ajoutez-en un depuis la recherche.
    </p>
  );

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Vos joueurs LoL favoris</h2>
      <ul className="space-y-3">
        {accounts.map((account) => (
          <li
            key={account.id}
            className="flex items-center justify-between p-3 border rounded"
          >
            <div className="flex items-center gap-4">
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
                className="font-medium hover:underline"
              >
                {account.summonerName}#{account.tagLine}
              </a>
              <span>– Niveau {account.level} – {account.rank}</span>
            </div>
            <button
              onClick={() => handleDelete(account.id)}
              className="text-red-600 font-semibold hover:underline"
            >
              🗑️ Supprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FavoriteLoLAccounts;
