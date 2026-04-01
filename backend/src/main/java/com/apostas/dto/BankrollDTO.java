package com.apostas.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BankrollDTO {
    
    private Long id;
    
    @NotBlank(message = "Nome da banca é obrigatório")
    private String name;
    
    @NotNull(message = "Saldo inicial é obrigatório")
    @Positive(message = "Saldo inicial deve ser positivo")
    private BigDecimal initialBalance;
    
    private BigDecimal currentBalance;
    
    private String createdAt;
}
