package com.apostas.service;

import com.apostas.dto.BankrollEvolutionDTO;
import com.apostas.dto.BookmakerProfitDTO;
import com.apostas.dto.DashboardDTO;
import com.apostas.dto.TipsterProfitDTO;
import com.apostas.model.Bankroll;
import com.apostas.model.Bet;
import com.apostas.model.BetStatus;
import com.apostas.repository.BankrollRepository;
import com.apostas.repository.BetRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class DashboardService {
    
    private final BankrollRepository bankrollRepository;
    private final BetRepository betRepository;
    @Transactional(readOnly = true)
    public DashboardDTO getDashboard(Long bankrollId, LocalDate startDate, LocalDate endDate) {
        log.info("getDashboard called with bankrollId={}, startDate={}, endDate={}", bankrollId, startDate, endDate);
        
        // Determinar se deve usar filtro de data
        boolean useDateFilter = (startDate != null && endDate != null);
        log.info("useDateFilter={}", useDateFilter);
        
        // Buscar banca
        Bankroll bankroll = bankrollRepository.findById(bankrollId)
                .orElseThrow(() -> new RuntimeException("Banca não encontrada"));
        
        DashboardDTO dashboard = new DashboardDTO();
        
        // 1. BUSCAR APOSTAS (para evolução da banca)
        List<Bet> allBets;
        if (useDateFilter) {
            allBets = betRepository.findByBankrollIdAndBetDateBetweenOrderByBetDateDesc(
                bankrollId, startDate, endDate);
        } else {
            allBets = betRepository.findByBankrollIdOrderByBetDateDesc(bankrollId);
        }
        
        // 2. CONTAR GREENS (filtrado)
        Long greenCount;
        if (useDateFilter) {
            greenCount = betRepository.countGreenBetsByBankrollIdAndBetDateBetween(
                bankrollId, startDate, endDate);
        } else {
            greenCount = betRepository.countGreenBets(bankrollId);
        }
        greenCount = greenCount != null ? greenCount : 0L;
        
        // 3. SOMAR STAKE (filtrado)
        BigDecimal totalStake;
        if (useDateFilter) {
            totalStake = betRepository.sumStakeByBankrollIdAndBetDateBetween(
                bankrollId, startDate, endDate);
        } else {
            totalStake = betRepository.sumStakeByBankrollId(bankrollId);
        }
        totalStake = totalStake != null ? totalStake : BigDecimal.ZERO;
        
        // 4. SOMAR LUCRO (filtrado)
        BigDecimal totalProfit;
        if (useDateFilter) {
            totalProfit = betRepository.sumProfitByBankrollIdAndBetDateBetween(
                bankrollId, startDate, endDate);
        } else {
            totalProfit = betRepository.sumProfitByBankrollId(bankrollId);
        }
        totalProfit = totalProfit != null ? totalProfit : BigDecimal.ZERO;
        
        // 5. CALCULAR MÉTRICAS
        // Banca atual - Para cálculo, usar initialBalance + todos os lucros históricos
        // Nota: Bankroll não tem getCurrentBalance, então calculamos
        BigDecimal allTimeProfit = betRepository.sumProfitByBankrollId(bankrollId);
        allTimeProfit = allTimeProfit != null ? allTimeProfit : BigDecimal.ZERO;
        BigDecimal currentBalance = bankroll.getInitialBalance().add(allTimeProfit);
        dashboard.setCurrentBalance(currentBalance);
        
        // Lucro total (filtrado)
        dashboard.setTotalProfit(totalProfit);
        
        // ROI (filtrado)
        BigDecimal roi = BigDecimal.ZERO;
        if (totalStake.compareTo(BigDecimal.ZERO) > 0) {
            roi = totalProfit.divide(totalStake, 4, RoundingMode.HALF_UP)
                    .multiply(new BigDecimal("100"));
        }
        dashboard.setRoi(roi);
        
        // Win Rate (filtrado)
        Long totalFinished;
        if (useDateFilter) {
            totalFinished = betRepository.countFinishedBetsByBankrollIdAndBetDateBetween(
                bankrollId, startDate, endDate);
        } else {
            totalFinished = betRepository.countFinishedBets(bankrollId);
        }
        totalFinished = totalFinished != null ? totalFinished : 0L;
        
        BigDecimal winRate = BigDecimal.ZERO;
        if (totalFinished > 0) {
            winRate = new BigDecimal(greenCount)
                    .divide(new BigDecimal(totalFinished), 4, RoundingMode.HALF_UP)
                    .multiply(new BigDecimal("100"));
        }
        dashboard.setWinRate(winRate);
        
        // Initial Balance
        dashboard.setInitialBalance(bankroll.getInitialBalance());
        
        // Total Bets, Green Bets, Red Bets (filtrado)
        dashboard.setTotalBets((long) allBets.size());
        dashboard.setGreenBets(greenCount);
        
        Long redCount = totalFinished - greenCount;
        dashboard.setRedBets(redCount);
        
        // Pending Bets (filtrado)
        Long pendingCount = (long) allBets.stream()
            .filter(bet -> bet.getStatus() == BetStatus.PENDING)
            .count();
        dashboard.setPendingBets(pendingCount);
        
        // Total Invested (filtrado)
        dashboard.setTotalInvested(totalStake);
        
        // 6. EVOLUÇÃO DA BANCA (filtrado)
        List<BankrollEvolutionDTO> evolution = new ArrayList<>();
        BigDecimal runningBalance;
        
        // Se há filtro de data, calcular saldo até a data inicial do filtro
        if (useDateFilter && startDate != null) {
            BigDecimal profitBeforeStart = betRepository.sumProfitByBankrollIdAndBetDateBefore(
                bankrollId, startDate);
            profitBeforeStart = profitBeforeStart != null ? profitBeforeStart : BigDecimal.ZERO;
            runningBalance = bankroll.getInitialBalance().add(profitBeforeStart);
        } else {
            runningBalance = bankroll.getInitialBalance();
        }
        
        // Ordenar apostas por data (mais antiga primeiro)
        List<Bet> sortedBets = new ArrayList<>(allBets);
        sortedBets.sort(Comparator.comparing(Bet::getBetDate));
        
        for (Bet bet : sortedBets) {
            if (bet.getStatus() != BetStatus.PENDING) {
                runningBalance = runningBalance.add(bet.getProfit());
                evolution.add(new BankrollEvolutionDTO(
                    bet.getBetDate().toString(),
                    runningBalance
                ));
            }
        }
        dashboard.setBankrollEvolution(evolution);

        // 7. LUCRO POR BOOKMAKER (filtrado)
        List<Object[]> bookmakerResults;
        if (useDateFilter) {
            bookmakerResults = betRepository.sumProfitByBookmakerAndBetDateBetween(
                bankrollId, startDate, endDate);
        } else {
            bookmakerResults = betRepository.sumProfitByBookmaker(bankrollId);
        }
        
        List<BookmakerProfitDTO> bookmakerProfits = bookmakerResults.stream()
            .map(result -> new BookmakerProfitDTO(
                (String) result[0],
                (BigDecimal) result[1]
            ))
            .collect(Collectors.toList());
        dashboard.setProfitByBookmaker(bookmakerProfits);

        // 8. LUCRO POR TIPSTER (filtrado)
        List<Object[]> tipsterResults;
        if (useDateFilter) {
            tipsterResults = betRepository.sumProfitByTipsterAndBetDateBetween(
                bankrollId, startDate, endDate);
        } else {
            tipsterResults = betRepository.sumProfitByTipster(bankrollId);
        }

        List<TipsterProfitDTO> tipsterProfits = tipsterResults.stream()
            .map(result -> new TipsterProfitDTO(
                (String) result[0],
                (BigDecimal) result[1]
            ))
            .collect(Collectors.toList());
        dashboard.setProfitByTipster(tipsterProfits);

        log.info(
            "dashboard result: totalBets={}, greenBets={}, redBets={}, pendingBets={}, totalProfit={}, totalInvested={}, evolutionPoints={}, bookmakers={}, tipsters={}",
            dashboard.getTotalBets(),
            dashboard.getGreenBets(),
            dashboard.getRedBets(),
            dashboard.getPendingBets(),
            dashboard.getTotalProfit(),
            dashboard.getTotalInvested(),
            evolution.size(),
            bookmakerProfits.size(),
            tipsterProfits.size()
        );
        
        return dashboard;
    }
    

}
