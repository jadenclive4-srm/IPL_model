package com.ipl.controller;

import com.ipl.dto.QuestionDTO;
import com.ipl.dto.UserAnswerDTO;
import com.ipl.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
public class QuestionController {
    
    private final QuestionService questionService;
    
    @GetMapping("/match/{matchId}")
    public ResponseEntity<List<QuestionDTO>> getQuestionsByMatchId(
            @PathVariable Long matchId,
            @RequestParam Long userId) {
        List<QuestionDTO> questions = questionService.getQuestionsByMatchId(matchId, userId);
        return ResponseEntity.ok(questions);
    }
    
    @PostMapping("/answer")
    public ResponseEntity<UserAnswerDTO> submitAnswer(
            @RequestParam Long userId,
            @RequestParam Long questionId,
            @RequestParam String selectedOption) {
        UserAnswerDTO answer = questionService.submitAnswer(userId, questionId, selectedOption);
        return ResponseEntity.ok(answer);
    }
    
    @PostMapping("/answers/batch")
    public ResponseEntity<List<UserAnswerDTO>> submitAnswers(
            @RequestParam Long userId,
            @RequestParam Long matchId,
            @RequestBody List<String> answers,
            @RequestBody List<Long> questionIds) {
        List<UserAnswerDTO> result = questionService.submitAnswers(userId, matchId, answers, questionIds);
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/user/match/{matchId}")
    public ResponseEntity<List<UserAnswerDTO>> getUserAnswers(
            @RequestParam Long userId,
            @PathVariable Long matchId) {
        List<UserAnswerDTO> answers = questionService.getUserAnswersByMatchId(userId, matchId);
        return ResponseEntity.ok(answers);
    }
}