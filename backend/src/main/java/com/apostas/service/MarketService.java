package com.apostas.service;

import com.apostas.dto.MarketDTO;
import com.apostas.model.Market;
import com.apostas.repository.BetRepository;
import com.apostas.repository.MarketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MarketService {
    
    private final MarketRepository marketRepository;
    private final BetRepository betRepository;

    public List<MarketDTO> findAllActive() {
        return marketRepository.findByActiveOrderByNameAsc(true).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<MarketDTO> findAll() {
        return marketRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public MarketDTO findById(Long id) {
        Market market = marketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mercado não encontrado"));
        return toDTO(market);
    }

    @Transactional
    public MarketDTO create(MarketDTO dto) {
        if (marketRepository.existsByNameIgnoreCase(dto.name())) {
            throw new RuntimeException("Já existe um mercado com este nome");
        }

        Market market = new Market();
        market.setName(dto.name());
        market.setActive(true);

        market = marketRepository.save(market);
        return toDTO(market);
    }

    @Transactional
    public MarketDTO update(Long id, MarketDTO dto) {
        Market market = marketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mercado não encontrado"));

        if (marketRepository.existsByNameIgnoreCaseAndIdNot(dto.name(), id)) {
            throw new RuntimeException("Já existe um mercado com este nome");
        }

        market.setName(dto.name());
        if (dto.active() != null) {
            market.setActive(dto.active());
        }

        market = marketRepository.save(market);
        return toDTO(market);
    }

    @Transactional
    public void delete(Long id) {
        Market market = marketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mercado não encontrado"));

        if (betRepository.existsByMarketId(id)) {
            throw new RuntimeException("Não é possível excluir este mercado pois existem apostas associadas");
        }

        marketRepository.delete(market);
    }

    private MarketDTO toDTO(Market market) {
        return new MarketDTO(
                market.getId(),
                market.getName(),
                market.getActive()
        );
    }
}
