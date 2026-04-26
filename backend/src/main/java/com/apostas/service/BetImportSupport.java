package com.apostas.service;

import com.apostas.model.BetStatus;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.text.Normalizer;
import java.util.Locale;
import java.util.Map;

@Component
public class BetImportSupport {

    Integer parseInteger(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        try {
            return Integer.parseInt(value.trim());
        } catch (NumberFormatException ex) {
            return null;
        }
    }

    BigDecimal parseDecimal(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        String trimmed = value.trim().replace("R$", "").replace(" ", "");

        if (trimmed.contains(",") && trimmed.contains(".")) {
            trimmed = trimmed.replace(".", "").replace(",", ".");
        } else {
            trimmed = trimmed.replace(",", ".");
        }

        try {
            return new BigDecimal(trimmed);
        } catch (NumberFormatException ex) {
            return null;
        }
    }

    String cleanText(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    String normalize(String value) {
        if (value == null) {
            return "";
        }

        return Normalizer.normalize(value, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9 ]", " ")
                .replaceAll("\\s+", " ")
                .trim();
    }

    String mapColumn(String rawHeader) {
        String normalized = normalize(rawHeader);

        if (normalized.contains("live") || normalized.contains("pre live") || normalized.contains("prelive")) {
            return null;
        }

        if (normalized.contains("dia do mes") || normalized.equals("dia") || normalized.contains("day")) {
            return BetImportColumns.COL_DAY;
        }
        if (normalized.contains("tipster")) {
            return BetImportColumns.COL_TIPSTER;
        }
        if (normalized.contains("casa de aposta") || normalized.contains("bookmaker") || normalized.equals("casa")) {
            return BetImportColumns.COL_BOOKMAKER;
        }
        if (normalized.contains("tipo de aposta") || normalized.contains("mercado") || normalized.contains("market")) {
            return BetImportColumns.COL_MARKET;
        }
        if (normalized.contains("descricao da aposta") || normalized.contains("evento") || normalized.contains("event")) {
            return BetImportColumns.COL_EVENT;
        }
        if (normalized.contains("esporte") || normalized.contains("sport")) {
            return BetImportColumns.COL_SPORT;
        }
        if (normalized.equals("odd") || normalized.contains("odds")) {
            return BetImportColumns.COL_ODD;
        }
        if (normalized.contains("unidade") || normalized.contains("units") || normalized.contains("stake")) {
            if (normalized.contains("retorno") || normalized.contains("return")) {
                return BetImportColumns.COL_RETURN_UNIT;
            }
            return BetImportColumns.COL_UNIT;
        }
        if ((normalized.contains("retorno") || normalized.contains("return")) && normalized.contains("unidade")) {
            return BetImportColumns.COL_RETURN_UNIT;
        }
        if (normalized.contains("situacao") || normalized.contains("status") || normalized.contains("resultado")) {
            return BetImportColumns.COL_STATUS;
        }

        return null;
    }

    BetStatus parseStatus(String rawStatus) {
        if (rawStatus == null || rawStatus.isBlank()) {
            return BetStatus.PENDING;
        }

        String normalized = normalize(rawStatus);

        if ((normalized.contains("half") || normalized.contains("meio")) && normalized.contains("green")) {
            return BetStatus.HALF_GREEN;
        }
        if ((normalized.contains("half") || normalized.contains("meio")) && normalized.contains("red")) {
            return BetStatus.HALF_RED;
        }
        if (normalized.contains("void") || normalized.contains("reembolso") || normalized.contains("devolvida")) {
            return BetStatus.VOID;
        }
        if (normalized.contains("green") || normalized.contains("ganhou") || normalized.contains("win")) {
            return BetStatus.GREEN;
        }
        if (normalized.contains("red") || normalized.contains("perdeu") || normalized.contains("loss")) {
            return BetStatus.RED;
        }
        if (isPendingLike(rawStatus)) {
            return BetStatus.PENDING;
        }

        return BetStatus.PENDING;
    }

    boolean isPendingLike(String value) {
        String normalized = normalize(value);
        return normalized.contains("pend") || normalized.contains("open") || normalized.contains("aberta");
    }

    boolean isRowEmpty(Map<String, String> row) {
        return row.values().stream().allMatch(v -> v == null || v.isBlank());
    }
}
