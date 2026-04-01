package com.apostas.controller;

import com.apostas.dto.SportDTO;
import com.apostas.service.SportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sports")
@RequiredArgsConstructor
public class SportController {

    private final SportService sportService;

    @GetMapping
    public ResponseEntity<List<SportDTO>> getAll() {
        return ResponseEntity.ok(sportService.findAllActive());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SportDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(sportService.findById(id));
    }

    @PostMapping
    public ResponseEntity<SportDTO> create(@Valid @RequestBody SportDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(sportService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SportDTO> update(@PathVariable Long id, @Valid @RequestBody SportDTO dto) {
        return ResponseEntity.ok(sportService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        sportService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
