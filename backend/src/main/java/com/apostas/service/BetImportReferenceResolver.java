package com.apostas.service;

import com.apostas.dto.BookmakerDTO;
import com.apostas.dto.MarketDTO;
import com.apostas.dto.SportDTO;
import com.apostas.dto.TipsterDTO;
import com.apostas.repository.BookmakerRepository;
import com.apostas.repository.MarketRepository;
import com.apostas.repository.SportRepository;
import com.apostas.repository.TipsterRepository;
import org.springframework.stereotype.Component;

@Component
public class BetImportReferenceResolver {

    private final SportRepository sportRepository;
    private final MarketRepository marketRepository;
    private final BookmakerRepository bookmakerRepository;
    private final TipsterRepository tipsterRepository;
    private final SportService sportService;
    private final MarketService marketService;
    private final BookmakerService bookmakerService;
    private final TipsterService tipsterService;

    public BetImportReferenceResolver(
            SportRepository sportRepository,
            MarketRepository marketRepository,
            BookmakerRepository bookmakerRepository,
            TipsterRepository tipsterRepository,
            SportService sportService,
            MarketService marketService,
            BookmakerService bookmakerService,
            TipsterService tipsterService
    ) {
        this.sportRepository = sportRepository;
        this.marketRepository = marketRepository;
        this.bookmakerRepository = bookmakerRepository;
        this.tipsterRepository = tipsterRepository;
        this.sportService = sportService;
        this.marketService = marketService;
        this.bookmakerService = bookmakerService;
        this.tipsterService = tipsterService;
    }

    Long getOrCreateSportId(String sportName) {
        if (sportName == null || sportName.isBlank()) {
            return null;
        }
        return sportRepository.findIdByNameIgnoreCase(sportName)
                .orElseGet(() -> sportService.create(new SportDTO(null, sportName, true)).id());
    }

    Long getOrCreateMarketId(String marketName) {
        if (marketName == null || marketName.isBlank()) {
            return null;
        }
        return marketRepository.findIdByNameIgnoreCase(marketName)
                .orElseGet(() -> marketService.create(new MarketDTO(null, marketName, true)).id());
    }

    Long getOrCreateBookmakerId(String bookmakerName) {
        if (bookmakerName == null || bookmakerName.isBlank()) {
            return null;
        }
        return bookmakerRepository.findIdByNameIgnoreCase(bookmakerName)
                .orElseGet(() -> bookmakerService.create(new BookmakerDTO(null, bookmakerName, true)).id());
    }

    Long getOrCreateTipsterId(String tipsterName) {
        if (tipsterName == null || tipsterName.isBlank()) {
            return null;
        }
        return tipsterRepository.findIdByNameIgnoreCase(tipsterName)
                .orElseGet(() -> tipsterService.create(new TipsterDTO(null, tipsterName, true)).id());
    }
}
