import { useEffect, useState } from 'react';

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

  useEffect(() => {
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

    fetchFavorites();
  }, []);

  if (loading) return <p>Chargement des favoris...</p>;

  if (!accounts.length) return <p>Aucun joueur LoL en favori pour le moment.</p>;

  return (
    <div>
      <h2>Vos joueurs LoL favoris</h2>
      <ul>
        {accounts.map((account) => (
          <li key={account.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            {account.profileIconId !== null && (
              <img
                src={`https://ddragon.leagueoflegends.com/cdn/14.9.1/img/profileicon/${account.profileIconId}.png`}
                alt="Icon"
                width={40}
                height={40}
              />
            )}
            <a href={`/Lol/joueur/${account.tagLine}/${encodeURIComponent(account.summonerName)}`}>
              {account.summonerName}#{account.tagLine}
            </a>
            &nbsp; - Niveau {account.level} - {account.rank}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FavoriteLoLAccounts;
