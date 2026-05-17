package com.apostas.controller;

import com.apostas.dto.BetDTO;
import com.apostas.service.BetService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bets")
public class BetController {
    
    private final BetService betService;

    public BetController(BetService betService) {
        this.betService = betService;
    }
    
    @GetMapping
    public ResponseEntity<List<BetDTO>> findAll() {
        return ResponseEntity.ok(betService.findAll());
    }
    
    @GetMapping("/bankroll/{bankrollId}")
    public ResponseEntity<List<BetDTO>> findByBankrollId(@PathVariable Long bankrollId) {
        return ResponseEntity.ok(betService.findByBankrollId(bankrollId));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<BetDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(betService.findById(id));
    }
    
    @PostMapping
    public ResponseEntity<BetDTO> create(@Valid @RequestBody BetDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(betService.create(dto));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<BetDTO> update(@PathVariable Long id, @Valid @RequestBody BetDTO dto) {
        return ResponseEntity.ok(betService.update(id, dto));
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<BetDTO> updateStatus(
            @PathVariable Long id, 
            @RequestParam String status) {
        return ResponseEntity.ok(betService.updateStatus(id, status));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        betService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
