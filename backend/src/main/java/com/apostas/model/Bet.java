package com.apostas.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "bets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Bet {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bankroll_id", nullable = false)
    private Bankroll bankroll;
    
    @Column(nullable = false)
    private LocalDate betDate;
    
    // Novos relacionamentos com entidades de configuração
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sport_id")
    private Sport sport;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "championship_id")
    private Championship championship;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "market_id")
    private Market market;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bookmaker_id")
    private Bookmaker bookmaker;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tipster_id")
    private Tipster tipster;
    
    // Campos antigos mantidos temporariamente para migração
    @Column(name = "sport_old", length = 100)
    private String sportOld;
    
    @Column(name = "championship_old", length = 100)
    private String championshipOld;
    
    @Column(name = "market_old", length = 100)
    private String marketOld;
    
    @Column(name = "bookmaker_old", length = 100)
    private String bookmakerOld;
    
    @Column(name = "tipster_old", length = 100)
    private String tipsterOld;
    
    @Column(nullable = false, length = 200)
    private String event;
    
    @Column(nullable = false, precision = 6, scale = 2)
    private BigDecimal odd;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal stake;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private BetStatus status;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal profit;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    @PreUpdate
    private void calculateProfit() {
        if (status == null) {
            this.profit = BigDecimal.ZERO;
            return;
        }
        
        switch (status) {
            case GREEN:
                // Lucro = (Stake * Odd) - Stake
                this.profit = stake.multiply(odd).subtract(stake);
                break;
            case RED:
                // Prejuízo = -Stake
                this.profit = stake.negate();
                break;
            case VOID:
                // Reembolso = 0
                this.profit = BigDecimal.ZERO;
                break;
            case HALF_GREEN:
                // Meio lucro = ((Stake * Odd) - Stake) / 2
                this.profit = stake.multiply(odd).subtract(stake).divide(new BigDecimal("2"));
                break;
            case HALF_RED:
                // Meio prejuízo = -Stake / 2
                this.profit = stake.negate().divide(new BigDecimal("2"));
                break;
            case PENDING:
            default:
                this.profit = BigDecimal.ZERO;
                break;
        }
    }
}
