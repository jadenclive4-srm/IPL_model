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
    public ResponseEntity<List<UserAnswerDTO>> submitAnswers(@RequestBody BatchAnswerRequest request) {
        List<UserAnswerDTO> result = questionService.submitAnswers(request.getUserId(), request.getMatchId(), request.getAnswers(), request.getQuestionIds());
        return ResponseEntity.ok(result);
    }
    
    // Inner class for batch answer request
    public static class BatchAnswerRequest {
        private Long userId;
        private Long matchId;
        private List<String> answers;
        private List<Long> questionIds;
        
        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        public Long getMatchId() { return matchId; }
        public void setMatchId(Long matchId) { this.matchId = matchId; }
        public List<String> getAnswers() { return answers; }
        public void setAnswers(List<String> answers) { this.answers = answers; }
        public List<Long> getQuestionIds() { return questionIds; }
        public void setQuestionIds(List<Long> questionIds) { this.questionIds = questionIds; }
    }
    
    @GetMapping("/user/match/{matchId}")
    public ResponseEntity<List<UserAnswerDTO>> getUserAnswers(
            @RequestParam Long userId,
            @PathVariable Long matchId) {
        List<UserAnswerDTO> answers = questionService.getUserAnswersByMatchId(userId, matchId);
        return ResponseEntity.ok(answers);
    }
}