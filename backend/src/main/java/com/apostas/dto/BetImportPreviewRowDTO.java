package com.apostas.dto;

import com.apostas.model.BetStatus;

import java.math.BigDecimal;
import java.util.List;

public record BetImportPreviewRowDTO(
        Integer rowNumber,
        String betDate,
        String sport,
        String market,
        String bookmaker,
        String tipster,
        String event,
        BigDecimal odd,
        BigDecimal stake,
        BigDecimal result,
        BetStatus status,
        String statusSource,
        boolean valid,
        List<String> warnings,
        List<String> errors
) {
}
