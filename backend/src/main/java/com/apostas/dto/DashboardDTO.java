package com.apostas.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDTO {
    
    private BigDecimal initialBalance;
    private BigDecimal currentBalance;
    private BigDecimal totalProfit;
    private BigDecimal roi; // Percentual
    private BigDecimal winRate; // Percentual
    private Long totalBets;
    private Long greenBets;
    private Long redBets;
    private Long pendingBets;
    private BigDecimal totalInvested;
    
    private List<BookmakerProfitDTO> profitByBookmaker;
    private List<TipsterProfitDTO> profitByTipster;
    private List<BankrollEvolutionDTO> bankrollEvolution;
}
