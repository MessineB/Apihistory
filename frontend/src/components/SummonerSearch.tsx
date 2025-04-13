import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';


const SummonerSearch = () => {
  const navigate = useNavigate();
  const [gameName, setGameName] = useState('');
  const [tagLine, setTagLine] = useState('EUW');
  const [data, setData] = useState<any>(null);
  const [masteries, setMasteries] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [championData, setChampionData] = useState<any>(null);
  const [version, setVersion] = useState<string>('');

  // Récupère la version et les données des champions depuis Data Dragon
  useEffect(() => {
    const fetchVersionAndChampions = async () => {
      try {
        const versionRes = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
        const versions = await versionRes.json();
        const latestVersion = versions[0];
        setVersion(latestVersion);

        const champsRes = await fetch(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion.json`);
        const champs = await champsRes.json();
        setChampionData(champs);
      } catch (err) {
        console.error('Erreur lors du chargement des données des champions:', err);
      }
    };

    fetchVersionAndChampions();
  }, []);

  // Map championId numérique → objet champion (nom, image...)
  const championMap = useMemo(() => {
    const map: Record<number, any> = {};
    if (championData?.data) {
      Object.values(championData.data).forEach((champ: any) => {
        map[parseInt(champ.key)] = champ;
      });
    }
    return map;
  }, [championData]);

  const handleSearch = async () => {
    try {
      const res = await fetch(`http://localhost:3001/riot/summoner/${encodeURIComponent(gameName)}/${tagLine}`);
      if (!res.ok) throw new Error('Erreur lors de la récupération du joueur');

      const result = await res.json();
      setData(result.summoner);
      setError(null);

      const puuid = result.account?.puuid;
      if (puuid) {
        const masteryRes = await fetch(`http://localhost:3001/riot/mastery/${puuid}`);
        if (!masteryRes.ok) throw new Error('Erreur lors de la récupération des maîtrises');

        const masteryData = await masteryRes.json();
        setMasteries(masteryData.slice(0, 5));
      } else {
        throw new Error('PUUID introuvable dans la réponse');
      }
    } catch (err: any) {
      setError(err.message || 'Erreur inconnue');
      setData(null);
      setMasteries([]);
    }
  };
  console.log(data)
  const regions = [
    'NA', 'ME', 'EUW', 'EUNE', 'OCE', 'KR', 'JP', 'BR',
    'LAS', 'LAN', 'RU', 'TUR', 'SEA', 'TR', 'TW', 'VN',
  ];

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Recherche de joueur</h2>

      <input
        type="text"
        value={gameName}
        onChange={(e) => setGameName(e.target.value)}
        placeholder="Nom du joueur"
        style={{ marginRight: '1rem' }}
      />

      <select value={tagLine} onChange={(e) => setTagLine(e.target.value)}>
        {regions.map((region) => (
          <option key={region} value={region}>{region}</option>
        ))}
      </select>

      <button onClick={handleSearch} style={{ marginLeft: '1rem' }}>Rechercher</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
        
      {data && (
        <div style={{ marginTop: '1rem' }}>
          <h3>{gameName}</h3>
          <p>Niveau : {data.summonerLevel}</p>
          <img
            src={`http://ddragon.leagueoflegends.com/cdn/13.6.1/img/profileicon/${data.profileIconId}.png`}
            alt="Icône de profil"
            width={64}
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(`/joueur/${tagLine}/${gameName}`)}
          />
        </div>
      )}

      {masteries.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h4>Top 5 Maîtrises de Champions</h4>
          <ul>
            {masteries.map((champ, i) => {
              const champInfo = championMap[champ.championId];
              return (
                <li key={i} style={{ marginBottom: '1rem' }}>
                  {champInfo ? (
                    <>
                      <img
                        src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champInfo.image.full}`}
                        alt={champInfo.name}
                        width={48}
                        style={{ verticalAlign: 'middle', marginRight: 10 }}
                      />
                      {champInfo.name} — Niveau: {champ.championLevel}, Points: {champ.championPoints}
                    </>
                  ) : (
                    <>Champion ID: {champ.championId}</>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SummonerSearch;
