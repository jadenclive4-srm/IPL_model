import React from 'react';
import './TeamStatsCard.css';

const TeamStatsCard = ({ teamName, logo, wins, losses, recentForm, title }) => {
  const getFormEmoji = (result) => {
    if (result === 'W') return '✅';
    if (result === 'L') return '❌';
    return '➖';
  };

  return (
    <div className="team-stats-card">
      <div className="stats-header">
        <span className="stats-logo">{logo}</span>
        <h3 className="team-title">{title || teamName}</h3>
      </div>
      
      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-value wins">{wins}</span>
          <span className="stat-label">Wins</span>
        </div>
        <div className="stat-item">
          <span className="stat-value losses">{losses}</span>
          <span className="stat-label">Losses</span>
        </div>
        <div className="stat-item">
          <span className="stat-value win-rate">
            {Math.round((wins / (wins + losses)) * 100)}%
          </span>
          <span className="stat-label">Win Rate</span>
        </div>
      </div>
      
      {recentForm && (
        <div className="recent-form">
          <span className="form-label">Recent Form:</span>
          <div className="form-results">
            {recentForm.map((result, index) => (
              <span key={index} className={`form-item ${result.toLowerCase()}`}>
                {getFormEmoji(result)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamStatsCard;
