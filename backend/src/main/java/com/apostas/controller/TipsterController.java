package com.apostas.controller;

import com.apostas.dto.TipsterDTO;
import com.apostas.service.TipsterService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tipsters")
@RequiredArgsConstructor
public class TipsterController {

    private final TipsterService tipsterService;

    @GetMapping
    public ResponseEntity<List<TipsterDTO>> getAll() {
        return ResponseEntity.ok(tipsterService.findAllActive());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TipsterDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(tipsterService.findById(id));
    }

    @PostMapping
    public ResponseEntity<TipsterDTO> create(@Valid @RequestBody TipsterDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(tipsterService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TipsterDTO> update(@PathVariable Long id, @Valid @RequestBody TipsterDTO dto) {
        return ResponseEntity.ok(tipsterService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        tipsterService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
