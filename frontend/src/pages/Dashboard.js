import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import MatchCard from '../components/MatchCard';
import './Dashboard.css';

// Team logos mapping
const teamLogos = {
  'Royal Challengers Bangalore': '🔴',
  'Sunrisers Hyderabad': '🟠',
  'Mumbai Indians': '🔵',
  'Kolkata Knight Riders': '🟣',
  'Rajasthan Royals': '🟡',
  'Chennai Super Kings': '🟡',
  'Punjab Kings': '🟠',
  'Gujarat Titans': '🔵',
  'Lucknow Super Giants': '🟢',
  'Delhi Capitals': '🔵'
};

// Function to transform API match data to frontend format
const transformMatch = (matchDTO) => {
  return {
    id: matchDTO.id,
    team1: matchDTO.homeTeamName,
    team2: matchDTO.awayTeamName,
    team1Logo: teamLogos[matchDTO.homeTeamName] || '🇮🇳',
    team2Logo: teamLogos[matchDTO.awayTeamName] || '🇮🇳',
    date: new Date(matchDTO.matchDate).toISOString(),
    venue: matchDTO.venue,
    status: matchDTO.matchStatus === 'SCHEDULED' ? 'Upcoming' : matchDTO.matchStatus,
    winner: matchDTO.winnerTeamName
  };
};

const Dashboard = () => {
  const [stats] = useState({
    accuracy: 72,
    totalMatches: 48,
    wins: 35
  });
  const [todayMatch, setTodayMatch] = useState(null);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Fetching today match...');
        // Fetch today's match
        const todayResponse = await fetch('http://localhost:8080/api/matches/today');
        console.log('Today response:', todayResponse.status);
        if (todayResponse.ok) {
          const todayData = await todayResponse.json();
          console.log('Today data:', todayData);
          setTodayMatch(transformMatch(todayData));
        } else {
          setTodayMatch(null);
        }

        console.log('Fetching upcoming matches...');
        // Fetch upcoming matches
        const upcomingResponse = await fetch('http://localhost:8080/api/matches/upcoming');
        console.log('Upcoming response:', upcomingResponse.status);
        if (upcomingResponse.ok) {
          const upcomingData = await upcomingResponse.json();
          console.log('Upcoming data:', upcomingData);
          setUpcomingMatches(upcomingData.map(transformMatch));
        } else {
          setUpcomingMatches([]);
        }
      } catch (err) {
        setError('Failed to load match data');
        console.error('Error fetching match data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard">
        <Navbar />
        <div className="dashboard-container">
          <div className="loading">Loading match data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <Navbar />
        <div className="dashboard-container">
          <div className="error">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Navbar />

      <div className="dashboard-container">
        {/* Stats Cards Section */}
        <section className="stats-section">
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <span className="stat-value">{stats.accuracy}%</span>
              <span className="stat-label">Prediction Accuracy</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🏏</div>
            <div className="stat-content">
              <span className="stat-value">{stats.totalMatches}</span>
              <span className="stat-label">Total Matches</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-content">
              <span className="stat-value">{stats.wins}</span>
              <span className="stat-label">Total Wins</span>
            </div>
          </div>
        </section>

        {/* Today's Match Section */}
        {todayMatch && (
          <section className="today-match-section">
            <h2 className="section-title">
              <span className="title-icon">⚡</span>
              Today's Match
            </h2>
            <MatchCard
              match={todayMatch}
              isToday={true}
              showPredictButton={true}
             />
          </section>
        )}
        
        {/* Upcoming Matches Section */}
        <section className="upcoming-section">
          <h2 className="section-title">
            <span className="title-icon">📅</span>
            Upcoming Matches
          </h2>
          <div className="upcoming-matches-grid">
            {upcomingMatches.map(match => (
              <MatchCard 
                key={match.id}
                match={match}
                isToday={false}
                showPredictButton={true}
              />
            ))}
          </div>
        </section>
        
        {/* Quick Insights Section */}
        <section className="insights-section">
          <h2 className="section-title">
            <span className="title-icon">📊</span>
            Quick Insights
          </h2>
          <div className="insights-grid">
            <div className="insight-card">
              <div className="insight-header">
                <span className="insight-icon">🔥</span>
                <span className="insight-title">Hot Pick</span>
              </div>
              <p className="insight-text">
                Mumbai Indians have won 4 of their last 5 matches against CSK at Wankhede!
              </p>
            </div>
            
            <div className="insight-card">
              <div className="insight-header">
                <span className="insight-icon">🎯</span>
                <span className="insight-title">Toss Impact</span>
              </div>
              <p className="insight-text">
                Teams winning toss have a 58% win rate at this venue.
              </p>
            </div>
            
            <div className="insight-card">
              <div className="insight-header">
                <span className="insight-icon">⚡</span>
                <span className="insight-title">Key Battle</span>
              </div>
              <p className="insight-text">
                Rohit Sharma vs Ravindra Jadeja - Head to head: Sharma dominates!
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
