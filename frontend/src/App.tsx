import { Routes, Route, Link,useNavigate  } from 'react-router-dom';
import SummonerSearchPage from './pages/LoL/SummonerSearchPage';
import PlayerPage from './pages/LoL/PlayerPage';
import DofusUpload from './components/Dofus/DofusUpload';
import './App.css';

import { useAuth } from './context/auth-context'; // ⬅️ importe le hook

function App() {
  return <p className="p-4">Bienvenue sur APIHistory !</p>;
}

export default App;
