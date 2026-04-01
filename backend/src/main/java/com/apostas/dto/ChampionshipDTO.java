package com.apostas.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ChampionshipDTO(
    Long id,
    
    @NotBlank(message = "Nome do campeonato é obrigatório")
    @Size(max = 200, message = "Nome do campeonato deve ter no máximo 200 caracteres")
    String name,
    
    @NotNull(message = "ID do esporte é obrigatório")
    Long sportId,
    
    String sportName,
    Boolean active
) {}
