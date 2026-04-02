package com.ipl.controller;

import com.ipl.dto.MatchDTO;
import com.ipl.model.Match;
import com.ipl.model.Team;
import com.ipl.service.MatchService;
import com.ipl.service.TeamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
public class MatchController {
    
    private final MatchService matchService;
    private final TeamService teamService;
    
    @GetMapping
    public ResponseEntity<List<MatchDTO>> getAllMatches() {
        List<MatchDTO> matches = matchService.getAllMatches().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(matches);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<MatchDTO> getMatchById(@PathVariable Long id) {
        return matchService.getMatchById(id)
                .map(match -> ResponseEntity.ok(convertToDTO(match)))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/today")
    public ResponseEntity<MatchDTO> getTodayMatch() {
        return matchService.getTodayMatch()
                .map(match -> ResponseEntity.ok(convertToDTO(match)))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/upcoming")
    public ResponseEntity<List<MatchDTO>> getUpcomingMatches() {
        List<MatchDTO> matches = matchService.getUpcomingMatches().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(matches);
    }

    @PostMapping("/import")
    public ResponseEntity<String> importMatches() {
        try {
            matchService.importMatchesFromExcel("..\\data\\matches.csv");
            return ResponseEntity.ok("Matches imported successfully");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to import matches: " + e.getMessage());
        }
    }
    
    @GetMapping("/completed")
    public ResponseEntity<List<MatchDTO>> getCompletedMatches() {
        List<MatchDTO> matches = matchService.getCompletedMatches().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(matches);
    }
    
    @PostMapping
    public ResponseEntity<MatchDTO> createMatch(@RequestBody MatchDTO matchDTO) {
        Match match = matchService.createMatch(
                getTeamIdByName(matchDTO.getHomeTeamName()),
                getTeamIdByName(matchDTO.getAwayTeamName()),
                matchDTO.getVenue(),
                matchDTO.getMatchDate(),
                matchDTO.getMatchNumber(),
                matchDTO.getMatchType()
        );
        return ResponseEntity.ok(convertToDTO(match));
    }
    
    @PutMapping("/{id}/result")
    public ResponseEntity<MatchDTO> updateMatchResult(
            @PathVariable Long id,
            @RequestBody MatchDTO matchDTO) {
        Long winnerId = null;
        if (matchDTO.getWinnerTeamName() != null) {
            winnerId = getTeamIdByName(matchDTO.getWinnerTeamName());
        }
        
        Match match = matchService.updateMatchResult(
                id,
                winnerId,
                matchDTO.getHomeTeamScore(),
                matchDTO.getAwayTeamScore(),
                matchDTO.getResult()
        );
        return ResponseEntity.ok(convertToDTO(match));
    }
    
    @GetMapping("/team/{teamId}")
    public ResponseEntity<List<MatchDTO>> getMatchesByTeam(@PathVariable Long teamId) {
        List<MatchDTO> matches = matchService.getMatchesByTeam(teamId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(matches);
    }
    
    private Long getTeamIdByName(String teamName) {
        return teamService.getTeamByName(teamName)
                .map(Team::getId)
                .orElse(null);
    }
    
    private MatchDTO convertToDTO(Match match) {
        MatchDTO dto = new MatchDTO();
        dto.setId(match.getId());
        dto.setHomeTeamName(match.getHomeTeam().getTeamName());
        dto.setAwayTeamName(match.getAwayTeam().getTeamName());
        dto.setHomeTeamShortName(match.getHomeTeam().getShortName());
        dto.setAwayTeamShortName(match.getAwayTeam().getShortName());
        dto.setVenue(match.getVenue());
        dto.setMatchDate(match.getMatchDate());
        dto.setMatchNumber(match.getMatchNumber());
        dto.setMatchStatus(match.getMatchStatus());
        dto.setMatchType(match.getMatchType());
        dto.setHomeTeamScore(match.getHomeTeamScore());
        dto.setAwayTeamScore(match.getAwayTeamScore());
        dto.setHomeTeamOvers(match.getHomeTeamOvers());
        dto.setAwayTeamOvers(match.getAwayTeamOvers());
        dto.setResult(match.getResult());
        
        if (match.getWinnerTeam() != null) {
            dto.setWinnerTeamName(match.getWinnerTeam().getTeamName());
        }
        
        dto.setHomeWinProbability(match.getHomeWinProbability());
        dto.setAwayWinProbability(match.getAwayWinProbability());
        
        return dto;
    }
}