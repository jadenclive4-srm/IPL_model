import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import MatchDetails from './pages/MatchDetails';
import PredictionPage from './pages/PredictionPage';
import Leaderboard from './pages/Leaderboard';
import Login from './pages/Login';
import MatchHistory from './pages/MatchHistory';
import Admin from './pages/Admin';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/match" element={<Navigate to="/match/today" replace />} />
          <Route path="/match/today" element={<TodayMatchRedirect />} />
          <Route path="/match/:id" element={<MatchDetails />} />
          <Route path="/prediction/:id" element={<PredictionPage />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/match-history" element={<MatchHistory />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
}

const TodayMatchRedirect = () => {
  const navigate = useNavigate();
  const [matchId, setMatchId] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('http://localhost:8080/api/matches/today')
      .then(res => res.json())
      .then(data => {
        setMatchId(data.id);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  React.useEffect(() => {
    if (!loading && matchId) {
      navigate(`/match/${matchId}`);
    } else if (!loading && !matchId) {
      navigate('/');
    }
  }, [loading, matchId, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return null;
};

export default App;
