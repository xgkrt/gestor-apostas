package com.apostas.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record BookmakerDTO(
    Long id,
    
    @NotBlank(message = "Nome da casa de apostas é obrigatório")
    @Size(max = 100, message = "Nome da casa de apostas deve ter no máximo 100 caracteres")
    String name,
    
    Boolean active
) {}
