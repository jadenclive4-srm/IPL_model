package com.ipl.controller;

import com.ipl.dto.UserDTO;
import com.ipl.model.User;
import com.ipl.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/leaderboard")
@RequiredArgsConstructor
public class LeaderboardController {
    
    private final UserService userService;
    
    @GetMapping
    public ResponseEntity<List<UserDTO>> getLeaderboard() {
        List<UserDTO> users = userService.getLeaderboard().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/top/{count}")
    public ResponseEntity<List<UserDTO>> getTopUsers(@PathVariable Integer count) {
        List<UserDTO> users = userService.getLeaderboard().stream()
                .limit(count)
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/user/{userId}/rank")
    public ResponseEntity<UserDTO> getUserRank(@PathVariable Long userId) {
        return userService.findById(userId)
                .map(user -> ResponseEntity.ok(convertToDTO(user)))
                .orElse(ResponseEntity.notFound().build());
    }
    
    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setPoints(user.getPoints());
        dto.setRank(user.getRank());
        dto.setRole(user.getRole());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }
}