package com.apostas.service;

import com.apostas.dto.SportDTO;
import com.apostas.model.Sport;
import com.apostas.repository.BetRepository;
import com.apostas.repository.SportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SportService {
    
    private final SportRepository sportRepository;
    private final BetRepository betRepository;

    public List<SportDTO> findAllActive() {
        return sportRepository.findByActiveOrderByNameAsc(true).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<SportDTO> findAll() {
        return sportRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public SportDTO findById(Long id) {
        Sport sport = sportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Esporte não encontrado"));
        return toDTO(sport);
    }

    @Transactional
    public SportDTO create(SportDTO dto) {
        // Validar se já existe
        if (sportRepository.existsByNameIgnoreCase(dto.name())) {
            throw new RuntimeException("Já existe um esporte com este nome");
        }

        Sport sport = new Sport();
        sport.setName(dto.name());
        sport.setActive(true);

        sport = sportRepository.save(sport);
        return toDTO(sport);
    }

    @Transactional
    public SportDTO update(Long id, SportDTO dto) {
        Sport sport = sportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Esporte não encontrado"));

        // Validar se já existe outro com mesmo nome
        if (sportRepository.existsByNameIgnoreCaseAndIdNot(dto.name(), id)) {
            throw new RuntimeException("Já existe um esporte com este nome");
        }

        sport.setName(dto.name());
        if (dto.active() != null) {
            sport.setActive(dto.active());
        }

        sport = sportRepository.save(sport);
        return toDTO(sport);
    }

    @Transactional
    public void delete(Long id) {
        Sport sport = sportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Esporte não encontrado"));

        // Validar se está em uso
        if (betRepository.existsBySportId(id)) {
            throw new RuntimeException("Não é possível excluir este esporte pois existem apostas associadas");
        }

        sportRepository.delete(sport);
    }

    private SportDTO toDTO(Sport sport) {
        return new SportDTO(
                sport.getId(),
                sport.getName(),
                sport.getActive()
        );
    }
}
