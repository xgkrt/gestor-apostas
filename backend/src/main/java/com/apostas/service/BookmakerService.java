package com.apostas.service;

import com.apostas.dto.BookmakerDTO;
import com.apostas.model.Bookmaker;
import com.apostas.repository.BetRepository;
import com.apostas.repository.BookmakerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookmakerService {
    
    private final BookmakerRepository bookmakerRepository;
    private final BetRepository betRepository;

    public List<BookmakerDTO> findAllActive() {
        return bookmakerRepository.findByActiveOrderByNameAsc(true).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<BookmakerDTO> findAll() {
        return bookmakerRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public BookmakerDTO findById(Long id) {
        Bookmaker bookmaker = bookmakerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Casa de apostas não encontrada"));
        return toDTO(bookmaker);
    }

    @Transactional
    public BookmakerDTO create(BookmakerDTO dto) {
        if (bookmakerRepository.existsByNameIgnoreCase(dto.name())) {
            throw new RuntimeException("Já existe uma casa de apostas com este nome");
        }

        Bookmaker bookmaker = new Bookmaker();
        bookmaker.setName(dto.name());
        bookmaker.setActive(true);

        bookmaker = bookmakerRepository.save(bookmaker);
        return toDTO(bookmaker);
    }

    @Transactional
    public BookmakerDTO update(Long id, BookmakerDTO dto) {
        Bookmaker bookmaker = bookmakerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Casa de apostas não encontrada"));

        if (bookmakerRepository.existsByNameIgnoreCaseAndIdNot(dto.name(), id)) {
            throw new RuntimeException("Já existe uma casa de apostas com este nome");
        }

        bookmaker.setName(dto.name());
        if (dto.active() != null) {
            bookmaker.setActive(dto.active());
        }

        bookmaker = bookmakerRepository.save(bookmaker);
        return toDTO(bookmaker);
    }

    @Transactional
    public void delete(Long id) {
        Bookmaker bookmaker = bookmakerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Casa de apostas não encontrada"));

        if (betRepository.existsByBookmakerId(id)) {
            throw new RuntimeException("Não é possível excluir esta casa de apostas pois existem apostas associadas");
        }

        bookmakerRepository.delete(bookmaker);
    }

    private BookmakerDTO toDTO(Bookmaker bookmaker) {
        return new BookmakerDTO(
                bookmaker.getId(),
                bookmaker.getName(),
                bookmaker.getActive()
        );
    }
}
