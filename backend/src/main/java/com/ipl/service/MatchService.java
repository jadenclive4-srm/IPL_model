package com.ipl.service;

import com.ipl.model.Match;
import com.ipl.model.Team;
import com.ipl.repository.MatchRepository;
import com.ipl.repository.TeamRepository;
import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MatchService {
    
    private final MatchRepository matchRepository;
    private final TeamRepository teamRepository;
    
    public List<Match> getAllMatches() {
        return matchRepository.findAllOrderedByMatchNumber();
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
        LocalDate today = LocalDate.now();
        Long startOfDay = today.atStartOfDay(ZoneId.systemDefault()).toInstant().toEpochMilli();
        Long endOfDay = today.atTime(LocalTime.MAX).atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();
        
        List<Match> todayMatches = matchRepository.findMatchesForToday(startOfDay, endOfDay);
        return todayMatches.isEmpty() ? Optional.empty() : Optional.of(todayMatches.get(0));
    }
    
    @Transactional
    public Match createMatch(Long homeTeamId, Long awayTeamId, String venue, Long matchDate, Integer matchNumber, String matchType) {
        Team homeTeam = teamRepository.findById(homeTeamId)
                .orElseThrow(() -> new RuntimeException("Home team not found"));
        Team awayTeam = teamRepository.findById(awayTeamId)
                .orElseThrow(() -> new RuntimeException("Away team not found"));
        
        // Check if match with this number already exists
        Match match = matchRepository.findByMatchNumber(matchNumber)
                .orElse(new Match());
        
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

    @Transactional
    public void importMatchesFromExcel(InputStream inputStream) throws IOException, CsvException {
        try (CSVReader reader = new CSVReader(new InputStreamReader(inputStream))) {
            List<String[]> rows = reader.readAll();
            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("M/d/yyyy H:mm");

            for (int i = 1; i < rows.size(); i++) { // assuming first row is header
                String[] row = rows.get(i);
                if (row.length < 6) continue;

                int matchNumber = Integer.parseInt(row[0]);
                String dateStr = row[1];
                String timeStr = row[2];
                String homeTeamName = row[3];
                String awayTeamName = row[4];
                String venue = row[5];
                String matchType = "LEAGUE"; // default

                LocalDateTime dateTime = LocalDateTime.parse(dateStr + " " + timeStr, dateFormatter);
                long matchDate = dateTime.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();

                Long homeTeamId = getTeamIdByName(homeTeamName);
                Long awayTeamId = getTeamIdByName(awayTeamName);

                createMatch(homeTeamId, awayTeamId, venue, matchDate, matchNumber, matchType);
            }
        }
    }

    private Long getTeamIdByName(String teamName) {
        return teamRepository.findByShortName(teamName)
                .orElseThrow(() -> new RuntimeException("Team not found: " + teamName))
                .getId();
    }
}