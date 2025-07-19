import SummonerSearch from '../../components/LoL/SummonerSearch';
import FavoriteLoLAccounts from '../../components/LoL/FavoritesLolAccount.tsx';

const SummonerSearchPage = () => {
  return (
    <div>
      <h1>Recherche de joueur League of Legends</h1>
      <a href='/'>Retour</a>
      <SummonerSearch />
      <hr />
      <FavoriteLoLAccounts />
    </div>
  );
};

export default SummonerSearchPage;
