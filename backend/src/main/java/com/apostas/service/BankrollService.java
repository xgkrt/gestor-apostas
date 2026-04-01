package com.apostas.service;

import com.apostas.dto.BankrollDTO;
import com.apostas.model.Bankroll;
import com.apostas.repository.BankrollRepository;
import com.apostas.repository.BetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BankrollService {
    
    private final BankrollRepository bankrollRepository;
    private final BetRepository betRepository;
    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
    
    @Transactional(readOnly = true)
    public List<BankrollDTO> findAll() {
        return bankrollRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public BankrollDTO findById(Long id) {
        Bankroll bankroll = bankrollRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Banca não encontrada"));
        return toDTO(bankroll);
    }
    
    @Transactional
    public BankrollDTO create(BankrollDTO dto) {
        Bankroll bankroll = new Bankroll();
        bankroll.setName(dto.getName());
        bankroll.setInitialBalance(dto.getInitialBalance());
        
        bankroll = bankrollRepository.save(bankroll);
        return toDTO(bankroll);
    }
    
    @Transactional
    public BankrollDTO update(Long id, BankrollDTO dto) {
        Bankroll bankroll = bankrollRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Banca não encontrada"));
        
        bankroll.setName(dto.getName());
        bankroll.setInitialBalance(dto.getInitialBalance());
        
        bankroll = bankrollRepository.save(bankroll);
        return toDTO(bankroll);
    }
    
    @Transactional
    public void delete(Long id) {
        if (!bankrollRepository.existsById(id)) {
            throw new RuntimeException("Banca não encontrada");
        }
        
        // Deletar todas as apostas associadas à banca antes de deletar a banca
        betRepository.deleteByBankrollId(id);
        
        // Agora podemos deletar a banca
        bankrollRepository.deleteById(id);
    }
    
    private BankrollDTO toDTO(Bankroll bankroll) {
        BankrollDTO dto = new BankrollDTO();
        dto.setId(bankroll.getId());
        dto.setName(bankroll.getName());
        dto.setInitialBalance(bankroll.getInitialBalance());
        dto.setCreatedAt(bankroll.getCreatedAt().format(formatter));
        
        // Calcular banca atual
        BigDecimal totalProfit = betRepository.sumProfitByBankrollId(bankroll.getId());
        if (totalProfit == null) {
            totalProfit = BigDecimal.ZERO;
        }
        dto.setCurrentBalance(bankroll.getInitialBalance().add(totalProfit));
        
        return dto;
    }
}
