package com.apostas.controller;

import com.apostas.dto.MarketDTO;
import com.apostas.service.MarketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/markets")
@RequiredArgsConstructor
public class MarketController {

    private final MarketService marketService;

    @GetMapping
    public ResponseEntity<List<MarketDTO>> getAll() {
        return ResponseEntity.ok(marketService.findAllActive());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MarketDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(marketService.findById(id));
    }

    @PostMapping
    public ResponseEntity<MarketDTO> create(@Valid @RequestBody MarketDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(marketService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MarketDTO> update(@PathVariable Long id, @Valid @RequestBody MarketDTO dto) {
        return ResponseEntity.ok(marketService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        marketService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
