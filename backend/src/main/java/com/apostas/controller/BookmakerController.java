package com.apostas.controller;

import com.apostas.dto.BookmakerDTO;
import com.apostas.service.BookmakerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookmakers")
@RequiredArgsConstructor
public class BookmakerController {

    private final BookmakerService bookmakerService;

    @GetMapping
    public ResponseEntity<List<BookmakerDTO>> getAll() {
        return ResponseEntity.ok(bookmakerService.findAllActive());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookmakerDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(bookmakerService.findById(id));
    }

    @PostMapping
    public ResponseEntity<BookmakerDTO> create(@Valid @RequestBody BookmakerDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bookmakerService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookmakerDTO> update(@PathVariable Long id, @Valid @RequestBody BookmakerDTO dto) {
        return ResponseEntity.ok(bookmakerService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        bookmakerService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
