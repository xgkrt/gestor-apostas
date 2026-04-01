package com.apostas.controller;

import com.apostas.dto.BankrollDTO;
import com.apostas.service.BankrollService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bankrolls")
@RequiredArgsConstructor
public class BankrollController {
    
    private final BankrollService bankrollService;
    
    @GetMapping
    public ResponseEntity<List<BankrollDTO>> findAll() {
        return ResponseEntity.ok(bankrollService.findAll());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<BankrollDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(bankrollService.findById(id));
    }
    
    @PostMapping
    public ResponseEntity<BankrollDTO> create(@Valid @RequestBody BankrollDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bankrollService.create(dto));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<BankrollDTO> update(@PathVariable Long id, @Valid @RequestBody BankrollDTO dto) {
        return ResponseEntity.ok(bankrollService.update(id, dto));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        bankrollService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
