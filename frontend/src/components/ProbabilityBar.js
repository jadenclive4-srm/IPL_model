import React, { useEffect, useState } from 'react';
import './ProbabilityBar.css';

const ProbabilityBar = ({ team1Name, team1Prob, team2Name, team2Prob, animate = true }) => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (animate) {
      setTimeout(() => setAnimated(true), 100);
    } else {
      setAnimated(true);
    }
  }, [animate]);

  return (
    <div className="probability-container">
      <div className="probability-header">
        <h3>Winning Probability</h3>
      </div>
      
      <div className="probability-bars">
        <div className="team-probability team-1">
          <div className="team-info">
            <span className="team-name">{team1Name}</span>
            <span className="team-percentage">{animated ? team1Prob : 0}%</span>
          </div>
          <div className="progress-track">
            <div 
              className="progress-fill team-1-fill"
              style={{ width: animated ? `${team1Prob}%` : '0%' }}
            >
              <div className="progress-glow"></div>
            </div>
          </div>
        </div>
        
        <div className="team-probability team-2">
          <div className="team-info">
            <span className="team-name">{team2Name}</span>
            <span className="team-percentage">{animated ? team2Prob : 0}%</span>
          </div>
          <div className="progress-track">
            <div 
              className="progress-fill team-2-fill"
              style={{ width: animated ? `${team2Prob}%` : '0%' }}
            >
              <div className="progress-glow"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="probability-insights">
        <div className="insight-item">
          <span className="insight-icon">🔥</span>
          <span className="insight-text">Hot Pick: {team1Prob > team2Prob ? team1Name : team2Name}</span>
        </div>
      </div>
    </div>
  );
};

export default ProbabilityBar;
