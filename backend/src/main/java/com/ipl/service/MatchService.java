package com.ipl.service;

import com.ipl.model.Match;
import com.ipl.model.Team;
import com.ipl.repository.MatchRepository;
import com.ipl.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MatchService {
    
    private final MatchRepository matchRepository;
    private final TeamRepository teamRepository;
    
    public List<Match> getAllMatches() {
        return matchRepository.findAll();
    }
    
    public List<Match> getUpcomingMatches() {
        Long currentTime = System.currentTimeMillis();
        return matchRepository.findUpcomingMatches(currentTime);
    }
    
    public List<Match> getCompletedMatches() {
        Long currentTime = System.currentTimeMillis();
        return matchRepository.findCompletedMatches(currentTime);
    }
    
    public Optional<Match> getMatchById(Long id) {
        return matchRepository.findById(id);
    }
    
    public Optional<Match> getTodayMatch() {
        Long currentTime = System.currentTimeMillis();
        return matchRepository.findNextMatch(currentTime);
    }
    
    @Transactional
    public Match createMatch(Long homeTeamId, Long awayTeamId, String venue, Long matchDate, Integer matchNumber, String matchType) {
        Team homeTeam = teamRepository.findById(homeTeamId)
                .orElseThrow(() -> new RuntimeException("Home team not found"));
        Team awayTeam = teamRepository.findById(awayTeamId)
                .orElseThrow(() -> new RuntimeException("Away team not found"));
        
        Match match = new Match();
        match.setHomeTeam(homeTeam);
        match.setAwayTeam(awayTeam);
        match.setVenue(venue);
        match.setMatchDate(matchDate);
        match.setMatchNumber(matchNumber);
        match.setMatchType(matchType);
        match.setMatchStatus("SCHEDULED");
        
        return matchRepository.save(match);
    }
    
    @Transactional
    public Match updateMatchResult(Long matchId, Long winnerId, Integer homeScore, Integer awayScore, String result) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));
        
        if (winnerId != null) {
            Team winner = teamRepository.findById(winnerId)
                    .orElseThrow(() -> new RuntimeException("Winner team not found"));
            match.setWinnerTeam(winner);
        }
        
        match.setHomeTeamScore(homeScore);
        match.setAwayTeamScore(awayScore);
        match.setResult(result);
        match.setMatchStatus("COMPLETED");
        
        return matchRepository.save(match);
    }
    
    public List<Match> getMatchesByTeam(Long teamId) {
        return matchRepository.findMatchesByTeam(teamId);
    }
    
    @Transactional
    public Match updateWinProbability(Long matchId, Integer homeProbability, Integer awayProbability) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));
        
        match.setHomeWinProbability(homeProbability);
        match.setAwayWinProbability(awayProbability);
        
        return matchRepository.save(match);
    }
    
    public List<Match> getMatchesByDateRange(Long startTime, Long endTime) {
        return matchRepository.findMatchesByDateRange(startTime, endTime);
    }
}