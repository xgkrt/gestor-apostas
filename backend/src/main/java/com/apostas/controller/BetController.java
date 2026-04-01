package com.apostas.controller;

import com.apostas.dto.BetDTO;
import com.apostas.dto.BetImportCommitResponseDTO;
import com.apostas.dto.BetImportPreviewResponseDTO;
import com.apostas.service.BetService;
import com.apostas.service.BetImportService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/bets")
public class BetController {
    
    private final BetService betService;
    private final BetImportService betImportService;

    public BetController(BetService betService, BetImportService betImportService) {
        this.betService = betService;
        this.betImportService = betImportService;
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

    @PostMapping("/import/preview")
    public ResponseEntity<BetImportPreviewResponseDTO> previewImport(
            @RequestParam("file") MultipartFile file,
            @RequestParam("bankrollId") Long bankrollId,
            @RequestParam("month") Integer month,
            @RequestParam("year") Integer year) {
        return ResponseEntity.ok(betImportService.preview(file, bankrollId, month, year));
    }

    @PostMapping("/import/commit")
    public ResponseEntity<BetImportCommitResponseDTO> commitImport(@RequestParam("previewId") String previewId) {
        return ResponseEntity.ok(betImportService.commit(previewId));
    }
}
