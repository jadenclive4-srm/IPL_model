import React from 'react';
import './PlayerCard.css';

const PlayerCard = ({ player, role, stats }) => {
  const getRoleIcon = (role) => {
    switch (role?.toLowerCase()) {
      case 'batsman':
        return '🏏';
      case 'bowler':
        return '🎯';
      case 'all-rounder':
        return '⚡';
      case 'wicket-keeper':
        return '🧤';
      default:
        return '👤';
    }
  };

  return (
    <div className="player-card">
      <div className="player-header">
        <div className="player-avatar">
          <span className="avatar-emoji">🎽</span>
        </div>
        <div className="player-info">
          <h4 className="player-name">{player.name}</h4>
          <span className="player-role">
            {getRoleIcon(player.role)} {player.role}
          </span>
        </div>
      </div>
      
      {stats && (
        <div className="player-stats">
          {stats.batting && (
            <div className="stat-group">
              <span className="stat-group-title">🏏 Batting</span>
              <div className="stat-row">
                <span className="stat-label">Runs</span>
                <span className="stat-value">{stats.batting.runs}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">SR</span>
                <span className="stat-value">{stats.batting.strikeRate}</span>
              </div>
            </div>
          )}
          
          {stats.bowling && (
            <div className="stat-group">
              <span className="stat-group-title">🎯 Bowling</span>
              <div className="stat-row">
                <span className="stat-label">Wickets</span>
                <span className="stat-value">{stats.bowling.wickets}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Eco</span>
                <span className="stat-value">{stats.bowling.economy}</span>
              </div>
            </div>
          )}
        </div>
      )}
      
      {player.isKeyPlayer && (
        <div className="key-player-badge">
          🔥 Key Player
        </div>
      )}
    </div>
  );
};

export default PlayerCard;
