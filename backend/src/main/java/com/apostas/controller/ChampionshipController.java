package com.apostas.controller;

import com.apostas.dto.ChampionshipDTO;
import com.apostas.service.ChampionshipService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/championships")
@RequiredArgsConstructor
public class ChampionshipController {

    private final ChampionshipService championshipService;

    @GetMapping
    public ResponseEntity<List<ChampionshipDTO>> getAll() {
        return ResponseEntity.ok(championshipService.findAllActive());
    }

    @GetMapping("/sport/{sportId}")
    public ResponseEntity<List<ChampionshipDTO>> getBySport(@PathVariable Long sportId) {
        return ResponseEntity.ok(championshipService.findBySportId(sportId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChampionshipDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(championshipService.findById(id));
    }

    @PostMapping
    public ResponseEntity<ChampionshipDTO> create(@Valid @RequestBody ChampionshipDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(championshipService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ChampionshipDTO> update(@PathVariable Long id, @Valid @RequestBody ChampionshipDTO dto) {
        return ResponseEntity.ok(championshipService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        championshipService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
