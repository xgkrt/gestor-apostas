package com.apostas.service;

import com.apostas.dto.TipsterDTO;
import com.apostas.model.Tipster;
import com.apostas.repository.BetRepository;
import com.apostas.repository.TipsterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TipsterService {
    
    private final TipsterRepository tipsterRepository;
    private final BetRepository betRepository;

    public List<TipsterDTO> findAllActive() {
        return tipsterRepository.findByActiveOrderByNameAsc(true).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<TipsterDTO> findAll() {
        return tipsterRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public TipsterDTO findById(Long id) {
        Tipster tipster = tipsterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tipster não encontrado"));
        return toDTO(tipster);
    }

    @Transactional
    public TipsterDTO create(TipsterDTO dto) {
        if (tipsterRepository.existsByNameIgnoreCase(dto.name())) {
            throw new RuntimeException("Já existe um tipster com este nome");
        }

        Tipster tipster = new Tipster();
        tipster.setName(dto.name());
        tipster.setActive(true);

        tipster = tipsterRepository.save(tipster);
        return toDTO(tipster);
    }

    @Transactional
    public TipsterDTO update(Long id, TipsterDTO dto) {
        Tipster tipster = tipsterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tipster não encontrado"));

        if (tipsterRepository.existsByNameIgnoreCaseAndIdNot(dto.name(), id)) {
            throw new RuntimeException("Já existe um tipster com este nome");
        }

        tipster.setName(dto.name());
        if (dto.active() != null) {
            tipster.setActive(dto.active());
        }

        tipster = tipsterRepository.save(tipster);
        return toDTO(tipster);
    }

    @Transactional
    public void delete(Long id) {
        Tipster tipster = tipsterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tipster não encontrado"));

        if (betRepository.existsByTipsterId(id)) {
            throw new RuntimeException("Não é possível excluir este tipster pois existem apostas associadas");
        }

        tipsterRepository.delete(tipster);
    }

    private TipsterDTO toDTO(Tipster tipster) {
        return new TipsterDTO(
                tipster.getId(),
                tipster.getName(),
                tipster.getActive()
        );
    }
}
