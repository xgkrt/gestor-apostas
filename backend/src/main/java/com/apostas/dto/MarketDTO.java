package com.apostas.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record MarketDTO(
    Long id,
    
    @NotBlank(message = "Nome do mercado é obrigatório")
    @Size(max = 200, message = "Nome do mercado deve ter no máximo 200 caracteres")
    String name,
    
    Boolean active
) {}
