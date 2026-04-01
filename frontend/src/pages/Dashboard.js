import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import MatchCard from '../components/MatchCard';
import './Dashboard.css';

// Mock data for demonstration
const mockStats = {
  accuracy: 72,
  totalMatches: 48,
  wins: 35
};

const mockTodayMatch = {
  id: 1,
  team1: 'Mumbai Indians',
  team2: 'Chennai Super Kings',
  team1Logo: '🔵',
  team2Logo: '🟡',
  date: new Date().toISOString(),
  venue: 'Wankhede Stadium, Mumbai',
  status: 'Upcoming'
};

const mockUpcomingMatches = [
  {
    id: 2,
    team1: 'Royal Challengers Bangalore',
    team2: 'Kolkata Knight Riders',
    team1Logo: '🔴',
    team2Logo: '🟣',
    date: new Date(Date.now() + 86400000).toISOString(),
    venue: 'M. Chinnaswamy Stadium, Bangalore',
    status: 'Upcoming'
  },
  {
    id: 3,
    team1: 'Delhi Capitals',
    team2: 'Punjab Kings',
    team1Logo: '🔵',
    team2Logo: '🟠',
    date: new Date(Date.now() + 172800000).toISOString(),
    venue: 'Arun Jaitley Stadium, Delhi',
    status: 'Upcoming'
  },
  {
    id: 4,
    team1: 'Sunrisers Hyderabad',
    team2: 'Rajasthan Royals',
    team1Logo: '🟠',
    team2Logo: '🟡',
    date: new Date(Date.now() + 259200000).toISOString(),
    venue: 'Rajiv Gandhi International Cricket Stadium',
    status: 'Upcoming'
  }
];

const Dashboard = () => {
  const [stats] = useState(mockStats);
  const [todayMatch] = useState(mockTodayMatch);
  const [upcomingMatches] = useState(mockUpcomingMatches);

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
