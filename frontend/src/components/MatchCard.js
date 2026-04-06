import React from 'react';
import { Link } from 'react-router-dom';
import './MatchCard.css';

const MatchCard = ({ 
  match, 
  isToday = false, 
  onPredict,
  showPredictButton = true 
}) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMatchStatus = () => {
    if (match.status === 'Live') return '🔴 LIVE';
    if (match.status === 'Completed') return '✅ Completed';
    return '⏰ Upcoming';
  };

  return (
    <div className={`match-card ${isToday ? 'today-match' : 'upcoming-match'}`}>
      <div className="match-header">
        <span className="match-date">{formatDate(match.date)}</span>
        <span className="match-status">{getMatchStatus()}</span>
      </div>
      
      <div className="match-teams">
        <div className="team team-left">
          <div className="team-logo">{match.team1Logo || '🇮🇳'}</div>
          <span className="team-name">{match.team1}</span>
        </div>
        
        <div className="vs-container">
          <span className="vs-text">VS</span>
          {match.score && (
            <div className="match-score">
              <span>{match.score.team1Score}</span>
              <span>-</span>
              <span>{match.score.team2Score}</span>
            </div>
          )}
        </div>
        
        <div className="team team-right">
          <div className="team-logo">{match.team2Logo || '🇮🇳'}</div>
          <span className="team-name">{match.team2}</span>
        </div>
      </div>
      
      <div className="match-venue">
        📍 {match.venue}
      </div>
      
      {showPredictButton && match.status !== 'Completed' && (
        <div className="match-actions">
          <Link to={`/match/${match.id}`} className="predict-btn">
            {isToday ? 'Predict Winner 🔥' : 'Predict'}
          </Link>
        </div>
      )}
      
      {match.winner && match.status === 'Completed' && (
        <div className="match-result">
          🏆 Winner: {match.winner}
        </div>
      )}
    </div>
  );
};

export default MatchCard;
