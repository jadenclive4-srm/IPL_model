import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import './Leaderboard.css';

// Mock data
const mockLeaderboard = [
  { rank: 1, username: 'CricketKing', avatar: '👑', accuracy: 85, wins: 42, points: 850 },
  { rank: 2, username: 'IPLExpert', avatar: '🏆', accuracy: 82, wins: 38, points: 780 },
  { rank: 3, username: 'WicketMaster', avatar: '🎯', accuracy: 79, wins: 35, points: 720 },
  { rank: 4, username: 'SixerPro', avatar: '⚡', accuracy: 77, wins: 33, points: 680 },
  { rank: 5, username: 'BoundaryKing', avatar: '🏏', accuracy: 75, wins: 30, points: 650 },
  { rank: 6, username: 'PitchPerfect', avatar: '📊', accuracy: 73, wins: 28, points: 620 },
  { rank: 7, username: 'GooglySpin', avatar: '🎰', accuracy: 71, wins: 26, points: 580 },
  { rank: 8, username: 'FastBowler', avatar: '💨', accuracy: 69, wins: 24, points: 540 },
  { rank: 9, username: 'CricketFan2024', avatar: '🔥', accuracy: 67, wins: 22, points: 500 },
  { rank: 10, username: 'MatchPredictor', avatar: '📈', accuracy: 65, wins: 20, points: 460 }
];

const Leaderboard = () => {
  const [users, setUsers] = useState(mockLeaderboard);
  const [activeFilter, setActiveFilter] = useState('accuracy');

  return (
    <div className="leaderboard-page">
      <Navbar />
      
      <div className="leaderboard-container">
        <div className="leaderboard-header">
          <h1 className="page-title">
            🏆 Leaderboard
          </h1>
          <p className="page-subtitle">
            Top predictors in the IPL community
          </p>
        </div>
        
        {/* Top 3 Podium */}
        <div className="podium-section">
          <div className="podium-card second-place">
            <div className="podium-rank">2</div>
            <div className="podium-avatar">{users[1].avatar}</div>
            <div className="podium-name">{users[1].username}</div>
            <div className="podium-accuracy">{users[1].accuracy}%</div>
          </div>
          
          <div className="podium-card first-place">
            <div className="crown">👑</div>
            <div className="podium-rank">1</div>
            <div className="podium-avatar">{users[0].avatar}</div>
            <div className="podium-name">{users[0].username}</div>
            <div className="podium-accuracy">{users[0].accuracy}%</div>
          </div>
          
          <div className="podium-card third-place">
            <div className="podium-rank">3</div>
            <div className="podium-avatar">{users[2].avatar}</div>
            <div className="podium-name">{users[2].username}</div>
            <div className="podium-accuracy">{users[2].accuracy}%</div>
          </div>
        </div>
        
        {/* Filters */}
        <div className="filter-section">
          <button 
            className={`filter-btn ${activeFilter === 'accuracy' ? 'active' : ''}`}
            onClick={() => setActiveFilter('accuracy')}
          >
            Accuracy
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'wins' ? 'active' : ''}`}
            onClick={() => setActiveFilter('wins')}
          >
            Wins
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'points' ? 'active' : ''}`}
            onClick={() => setActiveFilter('points')}
          >
            Points
          </button>
        </div>
        
        {/* Leaderboard Table */}
        <div className="leaderboard-table">
          <div className="table-header">
            <span className="col-rank">#</span>
            <span className="col-user">User</span>
            <span className="col-accuracy">Accuracy</span>
            <span className="col-wins">Wins</span>
            <span className="col-points">Points</span>
          </div>
          
          <div className="table-body">
            {users.slice(0).map((user) => (
              <div 
                key={user.rank} 
                className={`table-row ${user.rank <= 3 ? `rank-${user.rank}` : ''}`}
              >
                <span className="col-rank">
                  {user.rank <= 3 ? (
                    <span className={`medal rank-${user.rank}`}>
                      {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : '🥉'}
                    </span>
                  ) : (
                    user.rank
                  )}
                </span>
                <span className="col-user">
                  <span className="user-avatar">{user.avatar}</span>
                  <span className="user-name">{user.username}</span>
                </span>
                <span className="col-accuracy">
                  <span className="accuracy-value">{user.accuracy}%</span>
                  <div className="accuracy-bar">
                    <div 
                      className="accuracy-fill" 
                      style={{ width: `${user.accuracy}%` }}
                    ></div>
                  </div>
                </span>
                <span className="col-wins">{user.wins}</span>
                <span className="col-points">{user.points}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Your Rank Section */}
        <div className="your-rank-section">
          <div className="your-rank-card">
            <div className="rank-info">
              <span className="rank-label">Your Rank</span>
              <span className="rank-number">#45</span>
            </div>
            <div className="rank-stats">
              <div className="stat">
                <span className="stat-value">68%</span>
                <span className="stat-label">Accuracy</span>
              </div>
              <div className="stat">
                <span className="stat-value">15</span>
                <span className="stat-label">Wins</span>
              </div>
              <div className="stat">
                <span className="stat-value">320</span>
                <span className="stat-label">Points</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
