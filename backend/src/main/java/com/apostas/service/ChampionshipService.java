package com.apostas.service;

import com.apostas.dto.ChampionshipDTO;
import com.apostas.model.Championship;
import com.apostas.model.Sport;
import com.apostas.repository.BetRepository;
import com.apostas.repository.ChampionshipRepository;
import com.apostas.repository.SportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChampionshipService {
    
    private final ChampionshipRepository championshipRepository;
    private final SportRepository sportRepository;
    private final BetRepository betRepository;

    @Transactional(readOnly = true)
    public List<ChampionshipDTO> findAllActive() {
        return championshipRepository.findByActiveOrderByNameAsc(true).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ChampionshipDTO> findBySportId(Long sportId) {
        return championshipRepository.findBySportIdAndActiveOrderByNameAsc(sportId, true).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ChampionshipDTO> findAll() {
        return championshipRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public ChampionshipDTO findById(Long id) {
        Championship championship = championshipRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Campeonato não encontrado"));
        return toDTO(championship);
    }

    @Transactional
    public ChampionshipDTO create(ChampionshipDTO dto) {
        Sport sport = sportRepository.findById(dto.sportId())
                .orElseThrow(() -> new RuntimeException("Esporte não encontrado"));

        // Validar se já existe
        if (championshipRepository.existsByNameIgnoreCaseAndSportId(dto.name(), dto.sportId())) {
            throw new RuntimeException("Já existe um campeonato com este nome para este esporte");
        }

        Championship championship = new Championship();
        championship.setName(dto.name());
        championship.setSport(sport);
        championship.setActive(true);

        championship = championshipRepository.save(championship);
        return toDTO(championship);
    }

    @Transactional
    public ChampionshipDTO update(Long id, ChampionshipDTO dto) {
        Championship championship = championshipRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Campeonato não encontrado"));

        Sport sport = sportRepository.findById(dto.sportId())
                .orElseThrow(() -> new RuntimeException("Esporte não encontrado"));

        // Validar se já existe outro com mesmo nome no mesmo esporte
        if (championshipRepository.existsByNameIgnoreCaseAndSportIdAndIdNot(dto.name(), dto.sportId(), id)) {
            throw new RuntimeException("Já existe um campeonato com este nome para este esporte");
        }

        championship.setName(dto.name());
        championship.setSport(sport);
        if (dto.active() != null) {
            championship.setActive(dto.active());
        }

        championship = championshipRepository.save(championship);
        return toDTO(championship);
    }

    @Transactional
    public void delete(Long id) {
        Championship championship = championshipRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Campeonato não encontrado"));

        // Validar se está em uso
        if (betRepository.existsByChampionshipId(id)) {
            throw new RuntimeException("Não é possível excluir este campeonato pois existem apostas associadas");
        }

        championshipRepository.delete(championship);
    }

    private ChampionshipDTO toDTO(Championship championship) {
        return new ChampionshipDTO(
                championship.getId(),
                championship.getName(),
                championship.getSport().getId(),
                championship.getSport().getName(),
                championship.getActive()
        );
    }
}
