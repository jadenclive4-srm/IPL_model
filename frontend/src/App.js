import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import MatchDetails from './pages/MatchDetails';
import PredictionPage from './pages/PredictionPage';
import Leaderboard from './pages/Leaderboard';
import Login from './pages/Login';
import MatchHistory from './pages/MatchHistory';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/match/:id" element={<MatchDetails />} />
          <Route path="/prediction/:id" element={<PredictionPage />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/match-history" element={<MatchHistory />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
