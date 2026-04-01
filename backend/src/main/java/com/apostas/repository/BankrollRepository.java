package com.apostas.repository;

import com.apostas.model.Bankroll;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BankrollRepository extends JpaRepository<Bankroll, Long> {
    List<Bankroll> findAllByOrderByCreatedAtDesc();
}
