import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TeamStatsCard from '../components/TeamStatsCard';
import PlayerCard from '../components/PlayerCard';
import './MatchDetails.css';

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

const MatchDetails = () => {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [activeTab, setActiveTab] = useState('headtohead');
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const userId = localStorage.getItem('userId') || '1';

        const matchResponse = await fetch(`http://localhost:8080/api/matches/${id}`);
        if (!matchResponse.ok) {
          throw new Error('Match not found');
        }
        const matchData = await matchResponse.json();

        const questionsResponse = await fetch(`http://localhost:8080/api/questions/match/${id}?userId=${userId}`);
        if (questionsResponse.ok) {
          const questionsData = await questionsResponse.json();
          setQuestions(questionsData);
        }

        const h2hResponse = await fetch(`http://localhost:8080/api/matches/h2h?team1Name=${encodeURIComponent(matchData.homeTeamName)}&team2Name=${encodeURIComponent(matchData.awayTeamName)}`);
        let headToHeadData = { totalMatches: 0, team1Wins: 0, team2Wins: 0 };
        if (h2hResponse.ok) {
          const h2hData = await h2hResponse.json();
          headToHeadData = h2hData;
        }

        const transformedMatch = {
          id: matchData.id,
          team1: matchData.homeTeamName,
          team2: matchData.awayTeamName,
          team1Logo: teamLogos[matchData.homeTeamName] || '🇮🇳',
          team2Logo: teamLogos[matchData.awayTeamName] || '🇮🇳',
          date: matchData.matchDate,
          venue: matchData.venue,
          status: matchData.matchStatus,
          winner: matchData.winnerTeamName,
          homeWinProbability: matchData.homeWinProbability,
          awayWinProbability: matchData.awayWinProbability,
          headToHead: headToHeadData,
          team1Stats: { wins: 6, losses: 4, recentForm: ['W', 'W', 'L', 'W', 'W'] },
          team2Stats: { wins: 5, losses: 5, recentForm: ['W', 'L', 'W', 'L', 'W'] },
          venueInfo: { totalMatches: 12, team1Wins: 8, team2Wins: 4, avgScore: 165, pitch: 'Batting friendly' },
          team1Players: [
            { name: 'Rohit Sharma', role: 'Batsman', isKeyPlayer: true },
            { name: 'Jasprit Bumrah', role: 'Bowler', isKeyPlayer: true },
            { name: 'Hardik Pandya', role: 'All-rounder', isKeyPlayer: false }
          ],
          team2Players: [
            { name: 'Ravindra Jadeja', role: 'All-rounder', isKeyPlayer: true },
            { name: 'Ruturaj Gaikwad', role: 'Batsman', isKeyPlayer: true },
            { name: 'Deepak Chahar', role: 'Bowler', isKeyPlayer: false }
          ]
        };

        setMatch(transformedMatch);
      } catch (err) {
        setError(err.message || 'Failed to load match data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAnswerSelect = (questionId, answer) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = async () => {
    const unanswered = questions.filter(q => !selectedAnswers[q.id] && !q.hasAnswered);
    if (unanswered.length > 0) {
      setSubmitMessage('Please answer all questions before submitting.');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    const userId = localStorage.getItem('userId') || '1';
    const answersToSubmit = questions
      .filter(q => selectedAnswers[q.id] && !q.hasAnswered)
      .map(question => ({
        questionId: question.id,
        selectedOption: selectedAnswers[question.id],
        answeredAt: Date.now()
      }));

    if (answersToSubmit.length === 0) {
      setSubmitMessage('You have already answered all questions!');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/questions/answers/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: parseInt(userId),
          matchId: parseInt(id),
          answers: answersToSubmit.map(a => a.selectedOption),
          questionIds: answersToSubmit.map(a => a.questionId)
        })
      });

      if (response.ok) {
        setSubmitMessage('Answers submitted successfully!');
        // Clear selections or redirect
      } else {
        setSubmitMessage('Failed to submit answers. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting answers:', error);
      setSubmitMessage('Error submitting answers. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="match-details-page">
        <Navbar />
        <div className="match-details-container">
          <div className="loading">Loading match data...</div>
        </div>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="match-details-page">
        <Navbar />
        <div className="match-details-container">
          <Link to="/" className="back-btn">← Back to Dashboard</Link>
          <div className="error">{error || 'Match not found'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="match-details-page">
      <Navbar />
      
      <div className="match-details-container">
        {/* Match Header */}
        <div className="match-header-section">
          <Link to="/" className="back-btn">
            ← Back to Dashboard
          </Link>
          
          <div className="match-teams-header">
            <div className="team-display">
              <span className="team-logo-large">{match.team1Logo}</span>
              <h1 className="team-name">{match.team1}</h1>
            </div>
            
            <div className="vs-indicator">
              <span>VS</span>
            </div>
            
            <div className="team-display">
              <span className="team-logo-large">{match.team2Logo}</span>
              <h1 className="team-name">{match.team2}</h1>
            </div>
          </div>
          
          <div className="match-info">
            <span className="venue">📍 {match.venue}</span>
            <span className="date">📅 {new Date(match.date).toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric',
              year: 'numeric'
            })}</span>
          </div>
        </div>
        
        {/* Predict & Earn Bonus Points Card */}
        <div className="bonus-points-card">
          <div className="bonus-card-content">
            <div className="bonus-icon">🎁</div>
            <div className="bonus-text">
              <h3>Predict & Earn Bonus Points</h3>
              <p>Make your predictions and win exciting bonus points!</p>
            </div>
          </div>
         </div>

         {/* Quiz Questions Section */}
         <div className="match-questions-section">
           <h3 className="quiz-title">Predict & Earn Bonus Points!</h3>
           <div className="questions-grid">
             {questions.map((question, index) => (
               <div key={question.id} className="question-card">
                 <div className="question-number">Q{index + 1}</div>
                 <div className="question-content">
                   <p className="question-text">{question.questionText}</p>
                   <div className="question-options">
                     {question.optionA && (
                       <button
                         className={`option-btn ${selectedAnswers[question.id] === 'A' ? 'selected' : ''}`}
                         onClick={() => handleAnswerSelect(question.id, 'A')}
                       >
                         {question.optionA}
                       </button>
                     )}
                     {question.optionB && (
                       <button
                         className={`option-btn ${selectedAnswers[question.id] === 'B' ? 'selected' : ''}`}
                         onClick={() => handleAnswerSelect(question.id, 'B')}
                       >
                         {question.optionB}
                       </button>
                     )}
                     {question.optionC && (
                       <button
                         className={`option-btn ${selectedAnswers[question.id] === 'C' ? 'selected' : ''}`}
                         onClick={() => handleAnswerSelect(question.id, 'C')}
                       >
                         {question.optionC}
                       </button>
                     )}
                     {question.optionD && (
                       <button
                         className={`option-btn ${selectedAnswers[question.id] === 'D' ? 'selected' : ''}`}
                         onClick={() => handleAnswerSelect(question.id, 'D')}
                       >
                         {question.optionD}
                       </button>
                     )}
                   </div>
                   <span className="points-badge">{question.pointsValue} pts</span>
                 </div>
               </div>
             ))}
           </div>
         </div>

         {/* Submit Button */}
         <div className="submit-section">
           <button
             className="submit-answers-btn"
             onClick={handleSubmit}
             disabled={isSubmitting}
           >
             {isSubmitting ? 'Submitting...' : 'Submit Answers'}
           </button>
           {submitMessage && (
             <p className="submit-message">{submitMessage}</p>
           )}
         </div>

         {/* Stats Tabs */}
        <div className="stats-tabs">
          <button 
            className={`tab-btn ${activeTab === 'headtohead' ? 'active' : ''}`}
            onClick={() => setActiveTab('headtohead')}
          >
            Head-to-Head
          </button>
          <button 
            className={`tab-btn ${activeTab === 'form' ? 'active' : ''}`}
            onClick={() => setActiveTab('form')}
          >
            Recent Form
          </button>
          <button 
            className={`tab-btn ${activeTab === 'venue' ? 'active' : ''}`}
            onClick={() => setActiveTab('venue')}
          >
            Venue Stats
          </button>
        </div>
        
        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'headtohead' && (
            <div className="head-to-head-section">
              <div className="h2h-overview">
                <div className="h2h-stat">
                  <span className="h2h-value">{match.headToHead.totalMatches}</span>
                  <span className="h2h-label">Total Matches</span>
                </div>
                <div className="h2h-team">
                  <span className="h2h-team-name">{match.team1}</span>
                  <span className="h2h-wins">{match.headToHead.team1Wins} wins</span>
                </div>
                <div className="h2h-vs">VS</div>
                <div className="h2h-team">
                  <span className="h2h-team-name">{match.team2}</span>
                  <span className="h2h-wins">{match.headToHead.team2Wins} wins</span>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'form' && (
            <div className="form-section">
              <div className="form-cards">
                <TeamStatsCard 
                  teamName={match.team1}
                  logo={match.team1Logo}
                  wins={match.team1Stats.wins}
                  losses={match.team1Stats.losses}
                  recentForm={match.team1Stats.recentForm}
                />
                <TeamStatsCard 
                  teamName={match.team2}
                  logo={match.team2Logo}
                  wins={match.team2Stats.wins}
                  losses={match.team2Stats.losses}
                  recentForm={match.team2Stats.recentForm}
                />
              </div>
            </div>
          )}
          
          {activeTab === 'venue' && (
            <div className="venue-section">
              <div className="venue-card">
                <h3>📍 Venue Stats: {match.venue}</h3>
                <div className="venue-grid">
                  <div className="venue-stat">
                    <span className="venue-value">{match.venueInfo.totalMatches}</span>
                    <span className="venue-label">Matches Played</span>
                  </div>
                  <div className="venue-stat">
                    <span className="venue-value">{match.venueInfo.avgScore}</span>
                    <span className="venue-label">Avg Score</span>
                  </div>
                  <div className="venue-stat">
                    <span className="venue-value">{match.venueInfo.pitch}</span>
                    <span className="venue-label">Pitch Type</span>
                  </div>
                </div>
                <div className="venue-wins">
                  <div className="venue-win team1">
                    <span>{match.team1}</span>
                    <span className="win-count">{match.venueInfo.team1Wins} wins</span>
                  </div>
                  <div className="venue-win team2">
                    <span>{match.team2}</span>
                    <span className="win-count">{match.venueInfo.team2Wins} wins</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Predict Button */}
        <div className="predict-section">
          <Link to={`/prediction/${match.id}`} className="predict-winner-btn">
            🎯 Predict Winner
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MatchDetails;
