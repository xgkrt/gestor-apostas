package com.apostas.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TipsterDTO(
    Long id,
    
    @NotBlank(message = "Nome do tipster é obrigatório")
    @Size(max = 100, message = "Nome do tipster deve ter no máximo 100 caracteres")
    String name,
    
    Boolean active
) {}
