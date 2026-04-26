package com.apostas.service;

import com.apostas.dto.BetDTO;
import org.springframework.stereotype.Component;

import java.lang.reflect.Field;

@Component
public class BetImportBetMapper {

    private final BetImportReferenceResolver referenceResolver;

    public BetImportBetMapper(BetImportReferenceResolver referenceResolver) {
        this.referenceResolver = referenceResolver;
    }

    BetDTO toBetDTO(BetImportData data) {
        Long sportId = referenceResolver.getOrCreateSportId(data.sportName());
        Long marketId = referenceResolver.getOrCreateMarketId(data.marketName());
        Long bookmakerId = referenceResolver.getOrCreateBookmakerId(data.bookmakerName());
        Long tipsterId = referenceResolver.getOrCreateTipsterId(data.tipsterName());

        BetDTO dto = new BetDTO();
        setField(dto, "bankrollId", data.bankrollId());
        setField(dto, "betDate", data.betDate());
        setField(dto, "event", data.event());
        setField(dto, "odd", data.odd());
        setField(dto, "stake", data.stake());
        setField(dto, "status", data.status());
        setField(dto, "sportId", sportId);
        setField(dto, "marketId", marketId);
        setField(dto, "bookmakerId", bookmakerId);
        setField(dto, "tipsterId", tipsterId);
        return dto;
    }

    private void setField(Object target, String fieldName, Object value) {
        try {
            Field field = target.getClass().getDeclaredField(fieldName);
            field.setAccessible(true);
            field.set(target, value);
        } catch (NoSuchFieldException | IllegalAccessException ex) {
            throw new RuntimeException("Erro ao definir campo " + fieldName, ex);
        }
    }
}
