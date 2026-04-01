package com.ipl.controller;

import com.ipl.dto.PredictionDTO;
import com.ipl.model.Prediction;
import com.ipl.service.PredictionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/predictions")
@RequiredArgsConstructor
public class PredictionController {
    
    private final PredictionService predictionService;
    
    @PostMapping
    public ResponseEntity<PredictionDTO> createPrediction(@RequestBody PredictionDTO predictionDTO) {
        Prediction prediction = predictionService.createPrediction(
                predictionDTO.getUserId(),
                predictionDTO.getMatchId(),
                predictionDTO.getPredictedWinnerId(),
                predictionDTO.getHomeProbability(),
                predictionDTO.getAwayProbability()
        );
        return ResponseEntity.ok(convertToDTO(prediction));
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PredictionDTO>> getUserPredictions(@PathVariable Long userId) {
        List<PredictionDTO> predictions = predictionService.getUserPredictions(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(predictions);
    }
    
    @GetMapping("/match/{matchId}")
    public ResponseEntity<List<PredictionDTO>> getMatchPredictions(@PathVariable Long matchId) {
        List<PredictionDTO> predictions = predictionService.getMatchPredictions(matchId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(predictions);
    }
    
    @GetMapping("/user/{userId}/match/{matchId}")
    public ResponseEntity<PredictionDTO> getUserMatchPrediction(
            @PathVariable Long userId,
            @PathVariable Long matchId) {
        return predictionService.getUserMatchPrediction(userId, matchId)
                .map(prediction -> ResponseEntity.ok(convertToDTO(prediction)))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/evaluate/{matchId}")
    public ResponseEntity<Void> evaluatePredictions(@PathVariable Long matchId) {
        predictionService.evaluatePredictions(matchId);
        return ResponseEntity.ok().build();
    }
    
    private PredictionDTO convertToDTO(Prediction prediction) {
        PredictionDTO dto = new PredictionDTO();
        dto.setId(prediction.getId());
        dto.setUserId(prediction.getUser().getId());
        dto.setUsername(prediction.getUser().getUsername());
        dto.setMatchId(prediction.getMatch().getId());
        
        if (prediction.getPredictedWinner() != null) {
            dto.setPredictedWinnerId(prediction.getPredictedWinner().getId());
            dto.setPredictedWinnerName(prediction.getPredictedWinner().getTeamName());
        }
        
        dto.setIsCorrect(prediction.getIsCorrect());
        dto.setPointsEarned(prediction.getPointsEarned());
        dto.setCreatedAt(prediction.getCreatedAt());
        dto.setHomeProbability(prediction.getHomeProbability());
        dto.setAwayProbability(prediction.getAwayProbability());
        
        return dto;
    }
}