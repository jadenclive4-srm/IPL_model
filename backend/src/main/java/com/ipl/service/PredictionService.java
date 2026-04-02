package com.ipl.service;

import com.ipl.model.Match;
import com.ipl.model.Prediction;
import com.ipl.model.Team;
import com.ipl.model.User;
import com.ipl.repository.MatchRepository;
import com.ipl.repository.PredictionRepository;
import com.ipl.repository.TeamRepository;
import com.ipl.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PredictionService {
    
    private final PredictionRepository predictionRepository;
    private final MatchRepository matchRepository;
    private final TeamRepository teamRepository;
    private final UserRepository userRepository;
    @Autowired
    @Lazy
    private UserService userService;
    
    @Transactional
    public Prediction createPrediction(Long userId, Long matchId, Long predictedWinnerId, Integer homeProbability, Integer awayProbability) {
        if (predictionRepository.existsByUserIdAndMatchId(userId, matchId)) {
            throw new RuntimeException("Prediction already exists for this match");
        }
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));
        
        Team predictedWinner = null;
        if (predictedWinnerId != null) {
            predictedWinner = teamRepository.findById(predictedWinnerId)
                    .orElseThrow(() -> new RuntimeException("Team not found"));
        }
        
        Prediction prediction = new Prediction();
        prediction.setUser(user);
        prediction.setMatch(match);
        prediction.setPredictedWinner(predictedWinner);
        prediction.setHomeProbability(homeProbability);
        prediction.setAwayProbability(awayProbability);
        prediction.setIsCorrect(false);
        prediction.setPointsEarned(0);
        prediction.setCreatedAt(System.currentTimeMillis());
        
        return predictionRepository.save(prediction);
    }
    
    public List<Prediction> getUserPredictions(Long userId) {
        return predictionRepository.findUserPredictions(userId);
    }
    
    public List<Prediction> getMatchPredictions(Long matchId) {
        return predictionRepository.findMatchPredictions(matchId);
    }
    
    public Optional<Prediction> getUserMatchPrediction(Long userId, Long matchId) {
        return predictionRepository.findByUserIdAndMatchId(userId, matchId);
    }
    
    @Transactional
    public void evaluatePredictions(Long matchId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));
        
        if (match.getWinnerTeam() == null) {
            throw new RuntimeException("Match winner not determined");
        }
        
        List<Prediction> predictions = predictionRepository.findMatchPredictions(matchId);
        Team winner = match.getWinnerTeam();
        
        for (Prediction prediction : predictions) {
            boolean isCorrect = false;
            int pointsEarned = 0;
            
            if (prediction.getPredictedWinner() != null && 
                prediction.getPredictedWinner().getId().equals(winner.getId())) {
                isCorrect = true;
                pointsEarned = calculatePoints(prediction.getHomeProbability(), prediction.getAwayProbability());
            }
            
            prediction.setIsCorrect(isCorrect);
            prediction.setPointsEarned(pointsEarned);
            predictionRepository.save(prediction);
            
            if (isCorrect) {
                userService.updateUserPoints(prediction.getUser().getId(), pointsEarned);
            }
        }
    }
    
    private int calculatePoints(Integer homeProbability, Integer awayProbability) {
        int confidence = Math.max(homeProbability != null ? homeProbability : 50, 
                                awayProbability != null ? awayProbability : 50);
        
        if (confidence >= 80) {
            return 20;
        } else if (confidence >= 60) {
            return 15;
        } else if (confidence >= 50) {
            return 10;
        } else {
            return 5;
        }
    }
    
    public Long getCorrectPredictionCount(Long userId) {
        return predictionRepository.countCorrectPredictions(userId);
    }
    
    public Long getTotalPoints(Long userId) {
        Long points = predictionRepository.sumPointsByUser(userId);
        return points != null ? points : 0L;
    }
}