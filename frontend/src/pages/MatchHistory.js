import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import MatchCard from '../components/MatchCard';
import './MatchHistory.css';

// Mock data
const mockMatchHistory = [
  {
    id: 101,
    team1: 'Gujarat Titans',
    team2: 'Lucknow Super Giants',
    team1Logo: '🟠',
    team2Logo: '🟢',
    date: new Date(Date.now() - 86400000).toISOString(),
    venue: 'Narendra Modi Stadium, Ahmedabad',
    status: 'Completed',
    winner: 'Gujarat Titans',
    prediction: 'Gujarat Titans',
    isCorrect: true
  },
  {
    id: 102,
    team1: 'Royal Challengers Bangalore',
    team2: 'Delhi Capitals',
    team1Logo: '🔴',
    team2Logo: '🔵',
    date: new Date(Date.now() - 172800000).toISOString(),
    venue: 'M. Chinnaswamy Stadium, Bangalore',
    status: 'Completed',
    winner: 'Delhi Capitals',
    prediction: 'Royal Challengers Bangalore',
    isCorrect: false
  },
  {
    id: 103,
    team1: 'Kolkata Knight Riders',
    team2: 'Sunrisers Hyderabad',
    team1Logo: '🟣',
    team2Logo: '🟠',
    date: new Date(Date.now() - 259200000).toISOString(),
    venue: 'Eden Gardens, Kolkata',
    status: 'Completed',
    winner: 'Kolkata Knight Riders',
    prediction: 'Kolkata Knight Riders',
    isCorrect: true
  },
  {
    id: 104,
    team1: 'Punjab Kings',
    team2: 'Mumbai Indians',
    team1Logo: '🟠',
    team2Logo: '🔵',
    date: new Date(Date.now() - 345600000).toISOString(),
    venue: 'IS Bindra Stadium, Mohali',
    status: 'Completed',
    winner: 'Mumbai Indians',
    prediction: 'Mumbai Indians',
    isCorrect: true
  },
  {
    id: 105,
    team1: 'Rajasthan Royals',
    team2: 'Chennai Super Kings',
    team1Logo: '🟡',
    team2Logo: '🟡',
    date: new Date(Date.now() - 432000000).toISOString(),
    venue: 'Sawai Mansingh Stadium, Jaipur',
    status: 'Completed',
    winner: 'Chennai Super Kings',
    prediction: 'Rajasthan Royals',
    isCorrect: false
  }
];

const MatchHistory = () => {
  const [matches, setMatches] = useState(mockMatchHistory);
  const [filter, setFilter] = useState('all');

  const correctPredictions = matches.filter(m => m.isCorrect).length;
  const accuracy = Math.round((correctPredictions / matches.length) * 100);

  const filteredMatches = filter === 'all' 
    ? matches 
    : filter === 'correct' 
      ? matches.filter(m => m.isCorrect)
      : matches.filter(m => !m.isCorrect);

  return (
    <div className="match-history-page">
      <Navbar />
      
      <div className="match-history-container">
        <div className="history-header">
          <h1 className="page-title">📜 Match History</h1>
          <p className="page-subtitle">
            Your predictions vs actual results
          </p>
        </div>
        
        {/* Stats Overview */}
        <div className="history-stats">
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <span className="stat-value">{accuracy}%</span>
              <span className="stat-label">Accuracy</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <span className="stat-value">{correctPredictions}</span>
              <span className="stat-label">Correct Predictions</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <span className="stat-value">{matches.length}</span>
              <span className="stat-label">Total Predictions</span>
            </div>
          </div>
        </div>
        
        {/* Filter Buttons */}
        <div className="filter-section">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`filter-btn ${filter === 'correct' ? 'active' : ''}`}
            onClick={() => setFilter('correct')}
          >
            ✓ Correct
          </button>
          <button 
            className={`filter-btn ${filter === 'incorrect' ? 'active' : ''}`}
            onClick={() => setFilter('incorrect')}
          >
            ✗ Incorrect
          </button>
        </div>
        
        {/* Match History List */}
        <div className="history-list">
          {filteredMatches.map(match => (
            <div key={match.id} className="history-item">
              <Link to={`/match/${match.id}`} className="match-link">
                <MatchCard 
                  match={match}
                  isToday={false}
                  showPredictButton={false}
                />
              </Link>
              
              <div className="prediction-result">
                <div className="result-badge">
                  {match.isCorrect ? (
                    <span className="correct">✓ Correct</span>
                  ) : (
                    <span className="incorrect">✗ Incorrect</span>
                  )}
                </div>
                <div className="prediction-details">
                  <span className="label">Your Prediction:</span>
                  <span className="prediction-team">{match.prediction}</span>
                </div>
                <div className="actual-result">
                  <span className="label">Actual Winner:</span>
                  <span className="winner-team">{match.winner}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredMatches.length === 0 && (
          <div className="empty-state">
            <span className="empty-icon">😔</span>
            <h3>No matches found</h3>
            <p>Try a different filter</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchHistory;
