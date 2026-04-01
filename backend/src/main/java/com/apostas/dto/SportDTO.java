package com.apostas.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SportDTO(
    Long id,
    
    @NotBlank(message = "Nome do esporte é obrigatório")
    @Size(max = 100, message = "Nome do esporte deve ter no máximo 100 caracteres")
    String name,
    
    Boolean active
) {}
