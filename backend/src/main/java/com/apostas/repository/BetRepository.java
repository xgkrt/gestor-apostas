package com.apostas.repository;

import com.apostas.model.Bet;
import com.apostas.model.BetStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface BetRepository extends JpaRepository<Bet, Long> {
    
    List<Bet> findByBankrollIdOrderByBetDateDesc(Long bankrollId);
    
    @Modifying
    @Query("DELETE FROM Bet b WHERE b.bankroll.id = :bankrollId")
    void deleteByBankrollId(@Param("bankrollId") Long bankrollId);
    
    @Query("SELECT SUM(b.profit) FROM Bet b WHERE b.bankroll.id = :bankrollId AND b.status != 'PENDING'")
    BigDecimal sumProfitByBankrollId(@Param("bankrollId") Long bankrollId);
    
    @Query("SELECT SUM(b.stake) FROM Bet b WHERE b.bankroll.id = :bankrollId AND b.status != 'PENDING'")
    BigDecimal sumStakeByBankrollId(@Param("bankrollId") Long bankrollId);
    
    @Query("SELECT COUNT(b) FROM Bet b WHERE b.bankroll.id = :bankrollId AND b.status = 'GREEN'")
    Long countGreenBets(@Param("bankrollId") Long bankrollId);
    
    @Query("SELECT COUNT(b) FROM Bet b WHERE b.bankroll.id = :bankrollId AND b.status != 'PENDING'")
    Long countFinishedBets(@Param("bankrollId") Long bankrollId);
    
    @Query("SELECT COALESCE(b.bookmaker.name, b.bookmakerOld), SUM(b.profit) FROM Bet b WHERE b.bankroll.id = :bankrollId AND b.status != 'PENDING' GROUP BY COALESCE(b.bookmaker.name, b.bookmakerOld) ORDER BY SUM(b.profit) DESC")
    List<Object[]> sumProfitByBookmaker(@Param("bankrollId") Long bankrollId);
    
    // ========================================
    // QUERIES COM FILTRO DE DATA
    // ========================================
    
    // Buscar apostas filtradas por período
    List<Bet> findByBankrollIdAndBetDateBetweenOrderByBetDateDesc(
        @Param("bankrollId") Long bankrollId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
    
    // Soma de lucro filtrada por período
    @Query("SELECT SUM(b.profit) FROM Bet b WHERE b.bankroll.id = :bankrollId AND b.status != 'PENDING' AND b.betDate BETWEEN :startDate AND :endDate")
    BigDecimal sumProfitByBankrollIdAndBetDateBetween(
        @Param("bankrollId") Long bankrollId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
    
    // Soma de stake filtrada por período
    @Query("SELECT SUM(b.stake) FROM Bet b WHERE b.bankroll.id = :bankrollId AND b.status != 'PENDING' AND b.betDate BETWEEN :startDate AND :endDate")
    BigDecimal sumStakeByBankrollIdAndBetDateBetween(
        @Param("bankrollId") Long bankrollId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
    
    // Contar greens filtradas por período
    @Query("SELECT COUNT(b) FROM Bet b WHERE b.bankroll.id = :bankrollId AND b.status = 'GREEN' AND b.betDate BETWEEN :startDate AND :endDate")
    Long countGreenBetsByBankrollIdAndBetDateBetween(
        @Param("bankrollId") Long bankrollId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
    
    // Contar apostas finalizadas filtradas por período
    @Query("SELECT COUNT(b) FROM Bet b WHERE b.bankroll.id = :bankrollId AND b.status != 'PENDING' AND b.betDate BETWEEN :startDate AND :endDate")
    Long countFinishedBetsByBankrollIdAndBetDateBetween(
        @Param("bankrollId") Long bankrollId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
    
    // Lucro por bookmaker filtrado por período
    @Query("SELECT COALESCE(b.bookmaker.name, b.bookmakerOld), SUM(b.profit) FROM Bet b WHERE b.bankroll.id = :bankrollId AND b.status != 'PENDING' AND b.betDate BETWEEN :startDate AND :endDate GROUP BY COALESCE(b.bookmaker.name, b.bookmakerOld) ORDER BY SUM(b.profit) DESC")
    List<Object[]> sumProfitByBookmakerAndBetDateBetween(
        @Param("bankrollId") Long bankrollId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
    
    // Soma de lucro antes de uma data (para calcular saldo inicial do período)
    @Query("SELECT SUM(b.profit) FROM Bet b WHERE b.bankroll.id = :bankrollId AND b.status != 'PENDING' AND b.betDate < :beforeDate")
    BigDecimal sumProfitByBankrollIdAndBetDateBefore(
        @Param("bankrollId") Long bankrollId,
        @Param("beforeDate") LocalDate beforeDate
    );
    
    // Métodos para validar relacionamentos com configurações
    boolean existsBySportId(Long sportId);
    boolean existsByChampionshipId(Long championshipId);
    boolean existsByMarketId(Long marketId);
    boolean existsByBookmakerId(Long bookmakerId);
    boolean existsByTipsterId(Long tipsterId);
}
