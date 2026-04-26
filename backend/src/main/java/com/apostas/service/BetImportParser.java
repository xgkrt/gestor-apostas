package com.apostas.service;

import com.apostas.dto.BetImportPreviewRowDTO;
import com.apostas.model.BetStatus;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.DateTimeException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Component
public class BetImportParser {

    private static final BigDecimal UNIT_VALUE = new BigDecimal("50.00");

    private final BetImportSupport support;

    public BetImportParser(BetImportSupport support) {
        this.support = support;
    }

    BetImportPreviewRowDTO parseRow(Map<String, String> row, int rowNumber, int month, int year) {
        List<String> warnings = new ArrayList<>();
        List<String> errors = new ArrayList<>();

        String betDate = null;
        Integer day = support.parseInteger(row.get(BetImportColumns.COL_DAY));
        if (day == null) {
            errors.add("Dia do Mês inválido");
        } else {
            try {
                LocalDate.of(year, month, day);
                betDate = String.format(Locale.ROOT, "%02d/%02d/%d", day, month, year);
            } catch (DateTimeException ex) {
                errors.add("Dia do Mês não existe para o mês/ano informado");
            }
        }

        String tipster = support.cleanText(row.get(BetImportColumns.COL_TIPSTER));
        String bookmaker = support.cleanText(row.get(BetImportColumns.COL_BOOKMAKER));
        String market = support.cleanText(row.get(BetImportColumns.COL_MARKET));
        String event = support.cleanText(row.get(BetImportColumns.COL_EVENT));
        String sport = support.cleanText(row.get(BetImportColumns.COL_SPORT));

        if (event == null || event.isBlank()) {
            errors.add("Descrição da Aposta é obrigatória");
        }

        BigDecimal odd = support.parseDecimal(row.get(BetImportColumns.COL_ODD));
        if (odd == null || odd.compareTo(new BigDecimal("1.01")) < 0) {
            errors.add("ODD inválida (mínimo 1.01)");
        } else {
            odd = odd.setScale(2, RoundingMode.HALF_UP);
        }

        BigDecimal unit = support.parseDecimal(row.get(BetImportColumns.COL_UNIT));
        BigDecimal stake = null;
        if (unit == null || unit.compareTo(BigDecimal.ZERO) <= 0) {
            errors.add("Unidade inválida");
        } else {
            unit = unit.setScale(2, RoundingMode.HALF_UP);
            stake = unit.multiply(UNIT_VALUE).setScale(2, RoundingMode.HALF_UP);
        }

        BigDecimal returnUnit = support.parseDecimal(row.get(BetImportColumns.COL_RETURN_UNIT));
        BigDecimal result = null;
        if (returnUnit != null) {
            result = returnUnit.multiply(UNIT_VALUE).setScale(2, RoundingMode.HALF_UP);
        }

        String rawStatus = support.cleanText(row.get(BetImportColumns.COL_STATUS));
        BetStatus status = support.parseStatus(rawStatus);
        if (rawStatus != null && !rawStatus.isBlank() && status == BetStatus.PENDING && !support.isPendingLike(rawStatus)) {
            warnings.add("Situação não reconhecida, status definido como PENDING");
        }

        return new BetImportPreviewRowDTO(
                rowNumber,
                betDate,
                sport,
                market,
                bookmaker,
                tipster,
                event,
                odd,
                stake,
                result,
                status,
                rawStatus,
                errors.isEmpty(),
                warnings,
                errors
        );
    }

    BetImportData toImportData(BetImportPreviewRowDTO row, Long bankrollId) {
        return new BetImportData(
                bankrollId,
                row.betDate(),
                row.event(),
                row.odd(),
                row.stake(),
                row.status(),
                row.sport(),
                row.market(),
                row.bookmaker(),
                row.tipster()
        );
    }
}
