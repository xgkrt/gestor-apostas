package com.apostas.service;

import com.apostas.model.BetStatus;

import java.math.BigDecimal;

record BetImportData(
        Long bankrollId,
        String betDate,
        String event,
        BigDecimal odd,
        BigDecimal stake,
        BetStatus status,
        String sportName,
        String marketName,
        String bookmakerName,
        String tipsterName
) {
}
