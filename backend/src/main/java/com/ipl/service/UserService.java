package com.ipl.service;

import com.ipl.model.User;
import com.ipl.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Transactional
    public User registerUser(String username, String email, String password, String fullName) {
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists");
        }
        
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setFullName(fullName);
        user.setPoints(0);
        user.setRank(0);
        user.setRole("USER");
        user.setIsActive(true);
        user.setCreatedAt(System.currentTimeMillis());
        
        return userRepository.save(user);
    }
    
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
    
    public List<User> getLeaderboard() {
        return userRepository.findAllByOrderByPointsDesc();
    }
    
    @Transactional
    public void updateUserPoints(Long userId, Integer pointsToAdd) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setPoints(user.getPoints() + pointsToAdd);
        user.setUpdatedAt(System.currentTimeMillis());
        
        updateUserRank(user);
        userRepository.save(user);
    }
    
    @Transactional
    public void updateUserRank(User user) {
        Long usersWithMorePoints = userRepository.countUsersWithMorePoints(user.getPoints());
        user.setRank(usersWithMorePoints.intValue() + 1);
    }
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    @Transactional
    public User updateUser(Long userId, String fullName, String email) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (fullName != null) {
            user.setFullName(fullName);
        }
        if (email != null && !email.equals(user.getEmail())) {
            if (userRepository.existsByEmail(email)) {
                throw new RuntimeException("Email already exists");
            }
            user.setEmail(email);
        }
        
        user.setUpdatedAt(System.currentTimeMillis());
        return userRepository.save(user);
    }
    
    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setIsActive(false);
        user.setUpdatedAt(System.currentTimeMillis());
        userRepository.save(user);
    }
}