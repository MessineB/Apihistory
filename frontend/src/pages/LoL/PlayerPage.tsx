import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/global.css';

function formatMatchDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "à l’instant";
  if (diffMinutes < 60) return `il y a ${diffMinutes} min`;
  if (diffHours < 24) return `il y a ${diffHours}h`;
  if (diffDays < 7) return `il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;

  // Sinon date complète
  return `le ${date.toLocaleDateString('fr-FR')} à ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
}



const PlayerPage = () => {
  const { gameName, tagLine } = useParams();
  const [matches, setMatches] = useState<any[]>([]);
  const [puuid, setPuuid] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [championData, setChampionData] = useState<any>(null);
  const [version, setVersion] = useState<string>('');
  const navigate = useNavigate();


  const handlePlayerClick = (name: string, taglinePlayer: string) => {
    if (tagLine) navigate(`/Lol/joueur/${taglinePlayer}/${name}`);
  };

  useEffect(() => {
    const fetchChampions = async () => {
      try {
        const versionRes = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
        const versions = await versionRes.json();
        const latestVersion = versions[0];
        setVersion(latestVersion);

        const champsRes = await fetch(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion.json`);
        const champs = await champsRes.json();
        setChampionData(champs);
      } catch (err) {
        console.error('Erreur chargement champions', err);
      }
    };
    fetchChampions();
  }, []);

  const championMap = useMemo(() => {
    const map: Record<number, any> = {};
    if (championData?.data) {
      Object.values(championData.data).forEach((champ: any) => {
        map[parseInt(champ.key)] = champ;
      });
    }
    return map;
  }, [championData]);

  useEffect(() => {
    const fetchData = async () => {
      if (!gameName || !tagLine) {
        setError("GameName ou tagLine manquant dans l'URL");
        setLoading(false);
        return;
      }

      try {
        const summonerRes = await fetch(`http://localhost:3001/riot/summoner/${encodeURIComponent(gameName)}/${tagLine}`);
        if (!summonerRes.ok) throw new Error("Erreur lors de la récupération du joueur");
        const summonerData = await summonerRes.json();
        const puuid = summonerData.account?.puuid;
        if (!puuid) throw new Error('PUUID introuvable');
        setPuuid(puuid);

        const matchIdsRes = await fetch(`http://localhost:3001/riot/matches/${puuid}`);
        if (!matchIdsRes.ok) throw new Error('Erreur matchIds');

        const matchIds: string[] = await matchIdsRes.json();

        const matchDetails = await Promise.all(
          matchIds.map((id) =>
            fetch(`http://localhost:3001/riot/match/${id}`).then((res) => {
              if (!res.ok) throw new Error(`Erreur sur le match ${id}`);
              return res.json();
            })
          )
        );

        setMatches(matchDetails);
      } catch (err: any) {
        setError(err.message || 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [gameName, tagLine]);

  return (
    
    <div className="page-container">
      {!loading && !error && puuid && (
        <div className="mb-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            onClick={async () => {
              try {
                const token = localStorage.getItem('token');
                if (!token) {
                  alert('Vous devez être connecté pour ajouter un favori.');
                  return;
                }

                const res = await fetch('http://localhost:3001/riot/favorite', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                  },
                  body: JSON.stringify({ gameName, tagLine, puuid }),
                });

                if (!res.ok) {
                  const err = await res.json();
                  throw new Error(err.message || 'Erreur lors de l’ajout du favori');
                }

                alert('Joueur ajouté aux favoris !');
              } catch (err: any) {
                console.error(err);
                alert(`Erreur : ${err.message}`);
              }
            }}
          >
            ⭐ Ajouter aux favoris
          </button>
        </div>
      )}
      <h2>Historique de : {gameName}</h2>
      
      <p className="back-to-search">
        <a href="/Lol/recherche">← Revenir à la recherche</a>
      </p>
      {loading && <p>Chargement...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && matches.length > 0 && puuid && (
        <ul className="match-list">
          {matches.map((match, index) => {
            const player = match.info.participants.find((p: any) => p.puuid === puuid);
            const result = player?.win ? "✅ Victoire" : "❌ Défaite";
            const matchDate = formatMatchDate(match.info.gameStartTimestamp);
            const champId = player?.championId;
            const champ = championMap[champId];

            const isArena = match.info.gameMode === 'CHERRY';

            return (
              <li key={index} className="match-entry">
                <h3>Match {index + 1}</h3>
                <p><strong>Date :</strong> {matchDate}</p>
                <p><strong>Mode :</strong> {match.info.gameMode}</p>
                <p><strong>Résultat :</strong> {result}</p>
                <p><strong>Champion :</strong>
                  {champ ? (
                    <>
                      <img src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champ.image.full}`} alt={champ.name} width={32} className="champ-icon" />
                      {champ.name}
                    </>
                  ) : `ID ${champId}`}
                </p>
                <p><strong>KDA :</strong> {player?.kills}/{player?.deaths}/{player?.assists}</p>
                <p><strong>Durée :</strong> {Math.floor(match.info.gameDuration / 60)} min</p>

                {isArena ? (

                  <div className="teams-container">

                    <div className="arena-duos-grid">
                      {[0, 1].map((colIndex) => (
                        <div key={colIndex} className="arena-column">
                          {[...Array(4)].map((_, i) => {
                            const placementIndex = colIndex * 4 + i;
                            const duo = match.info.participants.filter((p: any) => p.placement === placementIndex + 1);

                            return (
                              <div
                                key={placementIndex}
                                className={`arena-duo-card ${placementIndex === 0
                                  ? 'placement-gold'
                                  : placementIndex >= 1 && placementIndex <= 3
                                    ? 'placement-green'
                                    : 'placement-red'
                                  }`}
                              >
                                <h5>Placement #{placementIndex + 1}</h5>
                                <ul>
                                  {duo.map((p: any, i: number) => {
                                    const champInfo = championMap[p.championId];
                                    const isMainPlayer = p.puuid === puuid;

                                    return (
                                      <li key={i} className={`participant-entry ${isMainPlayer ? 'highlight' : ''}`}>
                                        <div className="participant-row">
                                          {champInfo && (
                                            <img
                                              src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champInfo.image.full}`}
                                              alt={champInfo.name}
                                              width={32}
                                            />
                                          )}
                                          <span
                                            onClick={() => handlePlayerClick(p.riotIdGameName || p.summonerName, p.riotIdTagline)}
                                            className="participant-name"
                                          >
                                            {p.riotIdGameName || p.summonerName}
                                          </span>
                                          <span className="tagline">#{p.riotIdTagline}</span>
                                        </div>

                                        {/* ✅ Objets */}
                                        <div className="items-row">
                                          {[...Array(7)].map((_, idx) => {
                                            const itemId = p[`item${idx}`];
                                            return itemId ? (
                                              <img
                                                key={idx}
                                                src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${itemId}.png`}
                                                alt={`Item ${idx}`}
                                                width={24}
                                                height={24}
                                              />
                                            ) : null;
                                          })}
                                        </div>

                                        {/* ✅ Stats */}
                                        <div className="stats-row">
                                          <p>KDA : {p.kills}/{p.deaths}/{p.assists}</p>
                                          <p>Dégâts infligés : {p.totalDamageDealtToChampions.toLocaleString()}</p>
                                        </div>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="teams-container">
                    {[100, 200].map((teamId) => {
                      const team = match.info.participants.filter((p: any) => p.teamId === teamId);
                      const teamWon = team[0]?.win;

                      return (
                        <div key={teamId} className={`team-card ${teamWon ? 'win' : 'lose'}`}>
                          <h4>
                            Équipe {teamId === 100 ? '1' : '2'} {teamWon ? '🏆 Victoire' : '❌ Défaite'}
                          </h4>
                          <ul>
                            {team.map((p: any, i: number) => {
                              const champInfo = championMap[p.championId];
                              const isMainPlayer = p.puuid === puuid;

                              return (
                                <li key={i} className={`participant-entry ${isMainPlayer ? 'highlight' : ''}`}>
                                  <div className="participant-row">
                                    {champInfo && (
                                      <img
                                        src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champInfo.image.full}`}
                                        alt={champInfo.name}
                                        width={32}
                                      />
                                    )}
                                    <span
                                      onClick={() => handlePlayerClick(p.riotIdGameName || p.summonerName, p.riotIdTagline)}
                                      className="participant-name"
                                    >
                                      {p.riotIdGameName || p.summonerName}
                                    </span>
                                    <span className="tagline">#{p.riotIdTagline}</span> — {champInfo?.name}
                                    {p.teamPosition && match.info.gameMode !== 'ARAM' && (
                                      <span className={`role-badge role-${p.teamPosition.toLowerCase()}`}>
                                        {p.teamPosition.toUpperCase()}
                                      </span>
                                    )}
                                  </div>

                                  {/* 🧱 Objets */}
                                  <div className="items-row">
                                    {[...Array(7)].map((_, idx) => {
                                      const itemId = p[`item${idx}`];
                                      return itemId ? (
                                        <img
                                          key={idx}
                                          src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${itemId}.png`}
                                          alt={`Item ${idx}`}
                                          width={24}
                                          height={24}
                                        />
                                      ) : null;
                                    })}
                                  </div>

                                  {/* 📊 Statistiques */}
                                  <div className="stats-row">
                                    <p>KDA : {p.kills}/{p.deaths}/{p.assists}</p>
                                    <p>Dégâts infligés : {p.totalDamageDealtToChampions.toLocaleString()}</p>
                                    <p>Or gagné : {p.goldEarned.toLocaleString()}</p>
                                    <p>CS : {p.totalMinionsKilled + p.neutralMinionsKilled}</p>
                                    <p>Vision : {p.visionScore}</p>
                                  </div>
                                </li>

                              );
                            })}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
      

      {!loading && !error && matches.length === 0 && (
        <p>Aucun match trouvé pour ce joueur.</p>
      )}
    </div>
  );
};

export default PlayerPage;
