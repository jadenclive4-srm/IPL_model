import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Admin.css';

const Admin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'ADMIN') {
      navigate('/');
    }
  }, [navigate]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [winner, setWinner] = useState('');
  const [homeScore, setHomeScore] = useState('');
  const [awayScore, setAwayScore] = useState('');
  const [result, setResult] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/matches/upcoming');
      if (response.ok) {
        const data = await response.json();
        data.sort((a, b) => a.matchDate - b.matchDate);
        setMatches(data);
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImportMatches = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/matches/import', {
        method: 'POST',
      });
      if (response.ok) {
        setMessage('Matches imported successfully!');
        fetchMatches();
      } else {
        setMessage('Failed to import matches.');
      }
    } catch (error) {
      console.error('Error importing matches:', error);
      setMessage('Error importing matches.');
    }
  };

  const handleUpdateResult = async (matchId) => {
    const updateData = {
      winnerTeamName: winner || null,
      homeTeamScore: parseInt(homeScore) || null,
      awayTeamScore: parseInt(awayScore) || null,
      result: result || null
    };

    try {
      const response = await fetch(`http://localhost:8080/api/matches/${matchId}/result`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        setMessage('Match result updated successfully!');
        fetchMatches();
        setSelectedMatch(null);
        setWinner('');
        setHomeScore('');
        setAwayScore('');
        setResult('');
      } else {
        setMessage('Failed to update match result.');
      }
    } catch (error) {
      console.error('Error updating match:', error);
      setMessage('Error updating match result.');
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <Navbar />
        <div className="admin-container">
          <div className="loading">Loading matches...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <Navbar />
      <div className="admin-container">
        <h1 className="admin-title">Admin Panel - Upcoming Matches</h1>

        {message && (
          <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <div className="import-section">
          <button className="import-btn" onClick={handleImportMatches}>
            Import Matches from Excel
          </button>
        </div>

        <div className="matches-list">
          {matches.map(match => (
            <div key={match.id} className="match-card">
              <div className="match-info">
                <h3>{match.homeTeamName} vs {match.awayTeamName}</h3>
                <p>{new Date(match.matchDate).toLocaleDateString()}</p>
                <p>Status: {match.status}</p>
              </div>

              {selectedMatch === match.id ? (
                <div className="update-form">
                  <div className="form-group">
                    <label>Winner:</label>
                    <select value={winner} onChange={(e) => setWinner(e.target.value)}>
                      <option value="">Select Winner</option>
                      <option value={match.homeTeamName}>{match.homeTeamName}</option>
                      <option value={match.awayTeamName}>{match.awayTeamName}</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Home Team Score:</label>
                    <input
                      type="number"
                      value={homeScore}
                      onChange={(e) => setHomeScore(e.target.value)}
                      placeholder="Home score"
                    />
                  </div>

                  <div className="form-group">
                    <label>Away Team Score:</label>
                    <input
                      type="number"
                      value={awayScore}
                      onChange={(e) => setAwayScore(e.target.value)}
                      placeholder="Away score"
                    />
                  </div>

                  <div className="form-group">
                    <label>Result:</label>
                    <input
                      type="text"
                      value={result}
                      onChange={(e) => setResult(e.target.value)}
                      placeholder="Result description"
                    />
                  </div>

                  <div className="form-actions">
                    <button
                      className="update-btn"
                      onClick={() => handleUpdateResult(match.id)}
                    >
                      Update Result
                    </button>
                    <button
                      className="cancel-btn"
                      onClick={() => setSelectedMatch(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className="edit-btn"
                  onClick={() => setSelectedMatch(match.id)}
                >
                  Update Result
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;