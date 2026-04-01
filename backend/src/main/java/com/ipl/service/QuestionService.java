package com.ipl.service;

import com.ipl.dto.QuestionDTO;
import com.ipl.dto.UserAnswerDTO;
import com.ipl.model.Question;
import com.ipl.model.User;
import com.ipl.model.UserAnswer;
import com.ipl.repository.QuestionRepository;
import com.ipl.repository.UserAnswerRepository;
import com.ipl.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class QuestionService {
    
    private final QuestionRepository questionRepository;
    private final UserAnswerRepository userAnswerRepository;
    private final UserRepository userRepository;
    
    public List<QuestionDTO> getQuestionsByMatchId(Long matchId, Long userId) {
        List<Question> questions = questionRepository.findActiveQuestionsByMatchId(matchId);
        List<QuestionDTO> questionDTOs = new ArrayList<>();
        
        for (Question question : questions) {
            QuestionDTO dto = convertToDTO(question);
            
            // Check if user has already answered this question
            Optional<UserAnswer> existingAnswer = userAnswerRepository.findByUserIdAndQuestionId(userId, question.getId());
            if (existingAnswer.isPresent()) {
                dto.setHasAnswered(true);
                dto.setUserAnswer(existingAnswer.get().getSelectedOption());
            } else {
                dto.setHasAnswered(false);
            }
            
            questionDTOs.add(dto);
        }
        
        return questionDTOs;
    }
    
    @Transactional
    public UserAnswerDTO submitAnswer(Long userId, Long questionId, String selectedOption) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));
        
        // Check if user already answered this question
        Optional<UserAnswer> existingAnswer = userAnswerRepository.findByUserIdAndQuestionId(userId, questionId);
        
        UserAnswer userAnswer;
        if (existingAnswer.isPresent()) {
            // Update existing answer
            userAnswer = existingAnswer.get();
            userAnswer.setSelectedOption(selectedOption);
        } else {
            // Create new answer
            userAnswer = new UserAnswer();
            userAnswer.setUser(user);
            userAnswer.setQuestion(question);
            userAnswer.setSelectedOption(selectedOption);
            userAnswer.setAnsweredAt(System.currentTimeMillis());
        }
        
        // Check if answer is correct
        boolean isCorrect = selectedOption.equalsIgnoreCase(question.getCorrectOption());
        userAnswer.setIsCorrect(isCorrect);
        
        if (isCorrect) {
            userAnswer.setPointsEarned(question.getPointsValue());
        } else {
            userAnswer.setPointsEarned(0);
        }
        
        userAnswer = userAnswerRepository.save(userAnswer);
        
        return convertAnswerToDTO(userAnswer);
    }
    
    @Transactional
    public List<UserAnswerDTO> submitAnswers(Long userId, Long matchId, List<String> answers, List<Long> questionIds) {
        List<UserAnswerDTO> result = new ArrayList<>();
        
        for (int i = 0; i < questionIds.size(); i++) {
            UserAnswerDTO answer = submitAnswer(userId, questionIds.get(i), answers.get(i));
            result.add(answer);
        }
        
        return result;
    }
    
    public List<UserAnswerDTO> getUserAnswersByMatchId(Long userId, Long matchId) {
        List<UserAnswer> answers = userAnswerRepository.findByUserIdAndMatchId(userId, matchId);
        return answers.stream()
                .map(this::convertAnswerToDTO)
                .collect(java.util.stream.Collectors.toList());
    }
    
    private QuestionDTO convertToDTO(Question question) {
        QuestionDTO dto = new QuestionDTO();
        dto.setId(question.getId());
        dto.setMatchId(question.getMatch().getId());
        dto.setQuestionText(question.getQuestionText());
        dto.setOptionA(question.getOptionA());
        dto.setOptionB(question.getOptionB());
        dto.setOptionC(question.getOptionC());
        dto.setOptionD(question.getOptionD());
        dto.setCorrectOption(question.getCorrectOption());
        dto.setPointsValue(question.getPointsValue());
        dto.setIsActive(question.getIsActive());
        dto.setQuestionType(question.getQuestionType());
        dto.setCreatedAt(question.getCreatedAt());
        return dto;
    }
    
    private UserAnswerDTO convertAnswerToDTO(UserAnswer answer) {
        UserAnswerDTO dto = new UserAnswerDTO();
        dto.setId(answer.getId());
        dto.setUserId(answer.getUser().getId());
        dto.setUsername(answer.getUser().getUsername());
        dto.setQuestionId(answer.getQuestion().getId());
        dto.setSelectedOption(answer.getSelectedOption());
        dto.setIsCorrect(answer.getIsCorrect());
        dto.setPointsEarned(answer.getPointsEarned());
        dto.setAnsweredAt(answer.getAnsweredAt());
        return dto;
    }
}