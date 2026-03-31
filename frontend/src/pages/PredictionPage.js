import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProbabilityBar from '../components/ProbabilityBar';
import './PredictionPage.css';

// Mock data
const mockMatch = {
  id: 1,
  team1: 'Mumbai Indians',
  team2: 'Chennai Super Kings',
  team1Logo: '🔵',
  team2Logo: '🟡',
  venue: 'Wankhede Stadium, Mumbai',
  date: new Date().toISOString()
};

const mockProbabilities = {
  team1: 65,
  team2: 35
};

const mockInsights = [
  'Better recent form - Won 4 of last 5 matches',
  'Strong batting lineup with in-form openers',
  'Historical advantage at this venue'
];

const PredictionPage = () => {
  const { id } = useParams();
  const [match, setMatch] = useState(mockMatch);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [probabilities, setProbabilities] = useState(mockProbabilities);
  const [insights] = useState(mockInsights);

  useEffect(() => {
    // In real app, fetch match and probability data from API
  }, [id]);

  const handleTeamSelect = (team) => {
    setSelectedTeam(team);
    setShowResult(true);
  };

  const getSelectedPercentage = () => {
    if (!selectedTeam) return 0;
    return selectedTeam === match.team1 ? probabilities.team1 : probabilities.team2;
  };

  return (
    <div className="prediction-page">
      <Navbar />
      
      <div className="prediction-container">
        {/* Header */}
        <div className="prediction-header">
          <Link to={`/match/${id}`} className="back-btn">
            ← Back to Match Details
          </Link>
          <h1 className="page-title">Predict the Winner 🏆</h1>
        </div>
        
        {/* Match Display */}
        <div className="match-display">
          <div className="match-teams">
            <div className="team">
              <span className="team-logo">{match.team1Logo}</span>
              <span className="team-name">{match.team1}</span>
            </div>
            
            <div className="vs-divider">
              <span>VS</span>
            </div>
            
            <div className="team">
              <span className="team-logo">{match.team2Logo}</span>
              <span className="team-name">{match.team2}</span>
            </div>
          </div>
          
          <div className="match-venue">
            📍 {match.venue}
          </div>
        </div>
        
        {/* Team Selection */}
        <div className="selection-section">
          <h2 className="selection-title">Select Winner:</h2>
          
          <div className="team-buttons">
            <button 
              className={`team-select-btn team1 ${selectedTeam === match.team1 ? 'selected' : ''}`}
              onClick={() => handleTeamSelect(match.team1)}
              disabled={showResult}
            >
              <span className="btn-logo">{match.team1Logo}</span>
              <span className="btn-name">{match.team1}</span>
            </button>
            
            <button 
              className={`team-select-btn team2 ${selectedTeam === match.team2 ? 'selected' : ''}`}
              onClick={() => handleTeamSelect(match.team2)}
              disabled={showResult}
            >
              <span className="btn-logo">{match.team2Logo}</span>
              <span className="btn-name">{match.team2}</span>
            </button>
          </div>
        </div>
        
        {/* Results Section */}
        {showResult && (
          <div className="result-section">
            <div className="winning-probability">
              <ProbabilityBar 
                team1Name={match.team1}
                team1Prob={probabilities.team1}
                team2Name={match.team2}
                team2Prob={probabilities.team2}
              />
            </div>
            
            <div className="prediction-result">
              <div className="result-header">
                <h3>Your Prediction</h3>
                {selectedTeam === (probabilities.team1 > probabilities.team2 ? match.team1 : match.team2) ? (
                  <span className="hot-pick-badge">🔥 Hot Pick</span>
                ) : null}
              </div>
              
              <div className="selected-team-result">
                <span className="selected-logo">
                  {selectedTeam === match.team1 ? match.team1Logo : match.team2Logo}
                </span>
                <span className="selected-name">{selectedTeam}</span>
                <span className="confidence-meter">
                  {getSelectedPercentage()}% confidence
                </span>
              </div>
            </div>
            
            <div className="prediction-insights">
              <h3>📊 Why this prediction?</h3>
              <ul className="insights-list">
                {insights.map((insight, index) => (
                  <li key={index} className="insight-item">
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="prediction-actions">
              <button className="save-prediction-btn">
                💾 Save Prediction
              </button>
              <Link to="/" className="back-dashboard-btn">
                Back to Dashboard
              </Link>
            </div>
          </div>
        )}
        
        {/* Win Confidence Meter */}
        {showResult && (
          <div className="confidence-section">
            <h3>⚡ Win Confidence Meter</h3>
            <div className="confidence-bar">
              <div 
                className="confidence-fill"
                style={{ width: `${getSelectedPercentage()}%` }}
              ></div>
            </div>
            <div className="confidence-labels">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionPage;
