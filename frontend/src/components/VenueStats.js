import React from 'react';

const VenueStats = ({ venueName, venueInfo }) => {
  const displayValue = (value) => value !== undefined && value !== null && value !== '' ? value : 'N/A';

  // Check if city is already in venue name to avoid duplication
  const shouldShowCity = venueInfo.city && venueName && !venueName.toLowerCase().includes(venueInfo.city.toLowerCase());
  const displayName = shouldShowCity ? `${venueName} (${venueInfo.city})` : venueName;

  return (
    <div className="venue-section">
      <div className="venue-card">
        <h3>📍 Venue Stats: {displayName}</h3>
        <div className="venue-grid">
          <div className="venue-stat">
            <span className="venue-value">{displayValue(venueInfo.totalMatches)}</span>
            <span className="venue-label">Matches Played</span>
          </div>

          <div className="venue-stat">
            <span className="venue-value">{displayValue(venueInfo.firstInningsAverage)}</span>
            <span className="venue-label">First Innings Avg</span>
          </div>

          <div className="venue-stat">
            <span className="venue-value">{displayValue(venueInfo.secondInningsAverage)}</span>
            <span className="venue-label">Second Innings Avg</span>
          </div>

          <div className="venue-stat">
            <span className="venue-value">{displayValue(venueInfo.winsBattingFirst)}</span>
            <span className="venue-label">Wins Batting First</span>
          </div>

          <div className="venue-stat">
            <span className="venue-value">{displayValue(venueInfo.winsBattingSecond)}</span>
            <span className="venue-label">Wins Batting Second</span>
          </div>

          <div className="venue-stat">
            <span className="venue-value">{displayValue(venueInfo.noResult)}</span>
            <span className="venue-label">No Result</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueStats;
