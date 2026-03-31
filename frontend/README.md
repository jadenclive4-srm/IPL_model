# IPL Predictor - Frontend

A React-based frontend application for predicting IPL match winners and competing with fans.

## 🏏 Features

- **Dashboard** - View today's match, upcoming matches, and quick insights
- **Match Details** - Detailed statistics including head-to-head, form, venue stats, and key players
- **Prediction** - Predict winners with probability visualization and confidence meter
- **Leaderboard** - Compete with other fans and track rankings
- **Match History** - View past predictions vs actual results
- **Login/Register** - User authentication

## 🚀 Tech Stack

- React 18
- React Router v6
- CSS3 with custom properties
- Responsive design

## 📦 Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## 🛠️ Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

## ▶️ Running the Application

### Development Mode
```bash
npm start
```
This will start the development server at [http://localhost:3000](http://localhost:3000)

### Production Build
```bash
npm run build
```
This creates an optimized production build in the `build` folder.

## 📁 Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.js
│   │   ├── MatchCard.js
│   │   ├── TeamStatsCard.js
│   │   ├── ProbabilityBar.js
│   │   └── PlayerCard.js
│   ├── pages/
│   │   ├── Dashboard.js
│   │   ├── MatchDetails.js
│   │   ├── PredictionPage.js
│   │   ├── Leaderboard.js
│   │   ├── Login.js
│   │   └── MatchHistory.js
│   ├── services/
│   ├── utils/
│   ├── App.js
│   ├── App.css
│   └── index.js
├── package.json
└── README.md
```

## 🎨 UI Theme

- **Primary Color**: #0A1F44 (Deep Blue)
- **Accent Color**: #FF6B00 (Vibrant Orange)
- **Background**: Dark gradient
- **Font**: Inter (Google Fonts)

## 🔗 Related Projects

- Backend API: [../backend/README.md](../backend/README.md)
- Database: [../database/README.md](../database/README.md)

## 📄 License

This project is for educational purposes.
