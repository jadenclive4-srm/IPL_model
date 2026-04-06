package com.ipl.service;

import com.ipl.dto.HeadToHead;
import com.ipl.model.Match;
import com.ipl.model.HeadToHeadStats;
import com.ipl.model.Team;
import com.ipl.repository.MatchRepository;
import com.ipl.repository.TeamRepository;
import com.ipl.repository.HeadToHeadStatsRepository;
import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvException;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.io.FileReader;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.BufferedReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.io.InputStream;
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
    private final HeadToHeadStatsRepository h2hStatsRepository;
    
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
    
public HeadToHead getHeadToHeadStats(Long team1Id, Long team2Id) {
        List<Match> matches = matchRepository.findHeadToHeadMatches(team1Id, team2Id);
        
        int totalMatches = matches.size();
        int team1Wins = 0;
        int team2Wins = 0;
        
        for (Match match : matches) {
            if (match.getWinnerTeam() != null) {
                if (match.getWinnerTeam().getId().equals(team1Id)) {
                    team1Wins++;
                } else if (match.getWinnerTeam().getId().equals(team2Id)) {
                    team2Wins++;
                }
            }
        }
        
        return new HeadToHead(totalMatches, team1Wins, team2Wins);
    }
 
@Transactional
    public void importMatchesFromExcel(InputStream inputStream) throws IOException, CsvException {
        try (CSVReader reader = new CSVReader(new InputStreamReader(inputStream))) {
            List<String[]> rows = reader.readAll();
            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("M/d/yyyy H:mm");

            for (int i = 1; i < rows.size(); i++) {
                String[] row = rows.get(i);
                if (row.length < 6) continue;

                int matchNumber = Integer.parseInt(row[0]);
                String dateStr = row[1];
                String timeStr = row[2];
                String homeTeamName = row[3];
                String awayTeamName = row[4];
                String venue = row[5];
                String matchType = "LEAGUE";

                LocalDateTime dateTime = LocalDateTime.parse(dateStr + " " + timeStr, dateFormatter);
                long matchDate = dateTime.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();

                Long homeTeamId = getTeamIdByName(homeTeamName);
                Long awayTeamId = getTeamIdByName(awayTeamName);

                createMatch(homeTeamId, awayTeamId, venue, matchDate, matchNumber, matchType);
            }
        }
    }
    
    @Transactional
    public void importMatchesFromExcel(String filePath) throws IOException, CsvException {
        try (CSVReader reader = new CSVReader(new FileReader(filePath))) {
            List<String[]> rows = reader.readAll();
            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("M/d/yyyy H:mm");

            for (int i = 1; i < rows.size(); i++) {
                String[] row = rows.get(i);
                if (row.length < 6) continue;

                int matchNumber = Integer.parseInt(row[0]);
                String dateStr = row[1];
                String timeStr = row[2];
                String homeTeamName = row[3];
                String awayTeamName = row[4];
                String venue = row[5];
                String matchType = "LEAGUE";

                LocalDateTime dateTime = LocalDateTime.parse(dateStr + " " + timeStr, dateFormatter);
                long matchDate = dateTime.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();

                Long homeTeamId = getTeamIdByName(homeTeamName);
                Long awayTeamId = getTeamIdByName(awayTeamName);

createMatch(homeTeamId, awayTeamId, venue, matchDate, matchNumber, matchType);
            }
        }
    }
    
    @Transactional
    public int importMatchesFromExcelFile(InputStream inputStream) throws IOException {
        int importedCount = 0;
        try (XSSFWorkbook workbook = new XSSFWorkbook(inputStream)) {
            XSSFSheet sheet = workbook.getSheetAt(0);
            
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                XSSFRow row = sheet.getRow(i);
                if (row == null) continue;
                
                try {
                    int matchNumber = (int) row.getCell(0).getNumericCellValue();
                    String dateStr = row.getCell(1).getStringCellValue();
                    String timeStr = row.getCell(2).getStringCellValue();
                    String homeTeamName = row.getCell(3).getStringCellValue();
                    String awayTeamName = row.getCell(4).getStringCellValue();
                    String venue = row.getCell(5).getStringCellValue();
                    
                    String matchType = "LEAGUE";
                    if (row.getCell(6) != null && row.getCell(6).getCellType() != CellType.BLANK) {
                        matchType = row.getCell(6).getStringCellValue();
                    }
                    
                    DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("M/d/yyyy H:mm");
                    LocalDateTime dateTime = LocalDateTime.parse(dateStr + " " + timeStr, dateFormatter);
                    long matchDate = dateTime.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();
                    
                    Long homeTeamId = getTeamIdByName(homeTeamName);
                    Long awayTeamId = getTeamIdByName(awayTeamName);
                    
                    Match match = matchRepository.findByMatchNumber(matchNumber).orElse(new Match());
                    match.setHomeTeam(teamRepository.findById(homeTeamId).orElse(null));
                    match.setAwayTeam(teamRepository.findById(awayTeamId).orElse(null));
                    match.setVenue(venue);
                    match.setMatchDate(matchDate);
                    match.setMatchNumber(matchNumber);
                    match.setMatchType(matchType);
                    
                    if (row.getCell(7) != null && row.getCell(7).getCellType() != CellType.BLANK) {
                        String winnerTeamName = row.getCell(7).getStringCellValue();
                        Long winnerId = getTeamIdByName(winnerTeamName);
                        match.setWinnerTeam(teamRepository.findById(winnerId).orElse(null));
                    }
                    
                    if (row.getCell(8) != null && row.getCell(8).getCellType() != CellType.BLANK) {
                        match.setHomeTeamScore((int) row.getCell(8).getNumericCellValue());
                    }
                    if (row.getCell(9) != null && row.getCell(9).getCellType() != CellType.BLANK) {
                        match.setAwayTeamScore((int) row.getCell(9).getNumericCellValue());
                    }
                    if (row.getCell(10) != null && row.getCell(10).getCellType() != CellType.BLANK) {
                        match.setResult(row.getCell(10).getStringCellValue());
                    }
                    
                    if (match.getWinnerTeam() != null) {
                        match.setMatchStatus("COMPLETED");
                    } else {
                        match.setMatchStatus("SCHEDULED");
                    }
                    
                    matchRepository.save(match);
                    importedCount++;
                } catch (Exception e) {
                    System.err.println("Error importing row " + i + ": " + e.getMessage());
                }
            }
        }
        return importedCount;
    }
    
    @Transactional
    public int importH2hStatsFromCsv(String filePath) throws IOException, CsvException {
        int importedCount = 0;
        try (CSVReader reader = new CSVReader(new FileReader(filePath))) {
            List<String[]> rows = reader.readAll();
            
            for (int i = 1; i < rows.size(); i++) {
                String[] row = rows.get(i);
                if (row.length < 5) continue;
                
                try {
                    String team1Name = row[0].trim();
                    String team2Name = row[1].trim();
                    int totalMatches = Integer.parseInt(row[2].trim());
                    int team1Wins = Integer.parseInt(row[3].trim());
                    int team2Wins = Integer.parseInt(row[4].trim());
                    
                    Team team1 = teamRepository.findByShortName(team1Name)
                            .orElseThrow(() -> new RuntimeException("Team not found: " + team1Name));
                    Team team2 = teamRepository.findByShortName(team2Name)
                            .orElseThrow(() -> new RuntimeException("Team not found: " + team2Name));
                    
                    HeadToHeadStats stats = h2hStatsRepository.findByTeamIds(team1.getId(), team2.getId())
                            .orElse(new HeadToHeadStats());
                    
                    stats.setTeam1(team1);
                    stats.setTeam2(team2);
                    stats.setTotalMatches(totalMatches);
                    stats.setTeam1Wins(team1Wins);
                    stats.setTeam2Wins(team2Wins);
                    
                    h2hStatsRepository.save(stats);
                    importedCount++;
                } catch (Exception e) {
                    System.err.println("Error importing h2h row " + i + ": " + e.getMessage());
                }
            }
        }
        return importedCount;
    }
    
    public int importH2hStatsFromClasspath(String classpath) throws IOException {
        int importedCount = 0;
        InputStream is = getClass().getResourceAsStream(classpath);
        if (is == null) {
            throw new IOException("Resource not found: " + classpath);
        }
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(is))) {
            String headerLine = reader.readLine();
            if (headerLine == null) return 0;
            
            String[] teamColumns = headerLine.split(",");
            List<String> teamNames = new ArrayList<>();
            for (int i = 1; i < teamColumns.length; i++) {
                teamNames.add(teamColumns[i].trim());
            }
            
            Map<String, Team> teamMap = new HashMap<>();
            for (String shortName : teamNames) {
                Team team = teamRepository.findByShortName(shortName).orElse(null);
                if (team != null) {
                    teamMap.put(shortName, team);
                } else {
                    System.err.println("Team not found for shortName: " + shortName);
                }
            }
            
            Map<String, Map<String, Integer>> winsMap = new HashMap<>();
            
            String line;
            while ((line = reader.readLine()) != null) {
                String[] parts = line.split(",");
                if (parts.length < 2) continue;
                
                String team1Name = parts[0].trim();
                Map<String, Integer> teamWins = new HashMap<>();
                
                for (int i = 1; i < parts.length && i <= teamNames.size(); i++) {
                    String team2Name = teamNames.get(i - 1);
                    String value = parts[i].trim();
                    if (!value.isEmpty() && !value.equals("-")) {
                        teamWins.put(team2Name, Integer.parseInt(value));
                    }
                }
                winsMap.put(team1Name, teamWins);
            }
            
            for (String team1Name : winsMap.keySet()) {
                Team team1 = teamMap.get(team1Name);
                if (team1 == null) continue;
                
                Map<String, Integer> teamWins = winsMap.get(team1Name);
                
                for (String team2Name : teamWins.keySet()) {
                    if (team1Name.equals(team2Name)) continue;
                    
                    Team team2 = teamMap.get(team2Name);
                    if (team2 == null) continue;
                    
                    int team1WinsVal = teamWins.get(team2Name);
                    
                    Map<String, Integer> opponentWins = winsMap.get(team2Name);
                    int team2WinsVal = (opponentWins != null && opponentWins.get(team1Name) != null) 
                        ? opponentWins.get(team1Name) : 0;
                    
                    int totalMatches = team1WinsVal + team2WinsVal;
                    
                    HeadToHeadStats stats = h2hStatsRepository.findByTeamIds(team1.getId(), team2.getId())
                            .orElseGet(HeadToHeadStats::new);
                    
                    stats.setTeam1(team1);
                    stats.setTeam2(team2);
                    stats.setTotalMatches(totalMatches);
                    stats.setTeam1Wins(team1WinsVal);
                    stats.setTeam2Wins(team2WinsVal);
                    
                    h2hStatsRepository.save(stats);
                    importedCount++;
                }
            }
        } catch (Exception e) {
            System.err.println("Error reading h2h file: " + e.getMessage());
            e.printStackTrace();
            throw new IOException(e);
        }
        return importedCount;
    }
    
    @Transactional
    public int importH2hStatsFromExcel(String filePath) throws IOException {
        int importedCount = 0;
        try (BufferedReader reader = new BufferedReader(new FileReader(filePath))) {
            String headerLine = reader.readLine();
            if (headerLine == null) return 0;
            
            String[] teamColumns = headerLine.split(",");
            List<String> teamNames = new ArrayList<>();
            for (int i = 1; i < teamColumns.length; i++) {
                teamNames.add(teamColumns[i].trim());
            }
            
            Map<String, Team> teamMap = new HashMap<>();
            for (String shortName : teamNames) {
                teamRepository.findByShortName(shortName).ifPresent(team -> {
                    teamMap.put(shortName, team);
                });
            }
            
            String line;
            while ((line = reader.readLine()) != null) {
                String[] parts = line.split(",");
                if (parts.length < 2) continue;
                
                try {
                    String team1Name = parts[0].trim();
                    Team team1 = teamMap.get(team1Name);
                    if (team1 == null) continue;
                    
                    for (int i = 1; i < parts.length && i <= teamNames.size(); i++) {
                        String team2Name = teamNames.get(i - 1);
                        if (team2Name.equals(team1Name)) continue;
                        
                        Team team2 = teamMap.get(team2Name);
                        if (team2 == null) continue;
                        
                        String value = parts[i].trim();
                        if (value.isEmpty() || value.equals("-")) continue;
                        
                        int team1Wins = Integer.parseInt(value);
                        
                        HeadToHeadStats stats = h2hStatsRepository.findByTeamIds(team1.getId(), team2.getId())
                                .orElse(new HeadToHeadStats());
                        
                        stats.setTeam1(team1);
                        stats.setTeam2(team2);
                        stats.setTotalMatches(team1Wins);
                        stats.setTeam1Wins(team1Wins);
                        stats.setTeam2Wins(team1Wins);
                        
                        h2hStatsRepository.save(stats);
                        importedCount++;
                    }
                } catch (Exception e) {
                    System.err.println("Error importing h2h row: " + e.getMessage());
                }
            }
        } catch (Exception e) {
            System.err.println("Error reading h2h file: " + e.getMessage());
            throw new IOException(e);
        }
        return importedCount;
    }
    
    public HeadToHead getHeadToHeadFromDb(Long team1Id, Long team2Id) {
        return h2hStatsRepository.findByTeamIds(team1Id, team2Id)
                .map(h2h -> {
                    if (h2h.getTeam1().getId().equals(team1Id)) {
                        return new HeadToHead(h2h.getTotalMatches(), h2h.getTeam1Wins(), h2h.getTeam2Wins());
                    } else {
                        return new HeadToHead(h2h.getTotalMatches(), h2h.getTeam2Wins(), h2h.getTeam1Wins());
                    }
                })
                .orElse(null);
    }
    
    private Long getTeamIdByName(String teamName) {
        return teamRepository.findByShortName(teamName)
                .orElseThrow(() -> new RuntimeException("Team not found: " + teamName))
                .getId();
    }
}