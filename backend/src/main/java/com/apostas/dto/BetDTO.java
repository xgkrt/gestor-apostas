package com.apostas.dto;

import com.apostas.model.BetStatus;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BetDTO {
    
    private Long id;
    
    @NotNull(message = "ID da banca é obrigatório")
    private Long bankrollId;
    
    @NotBlank(message = "Data da aposta é obrigatória")
    private String betDate;
    
    // Novos campos com relacionamentos (IDs e nomes)
    private Long sportId;
    private String sportName;
    
    private Long championshipId;
    private String championshipName;
    
    private Long marketId;
    private String marketName;
    
    private Long bookmakerId;
    private String bookmakerName;
    
    private Long tipsterId;
    private String tipsterName;
    
    @NotBlank(message = "Evento é obrigatório")
    private String event;
    
    @NotNull(message = "Odd é obrigatória")
    @DecimalMin(value = "1.01", message = "Odd deve ser maior que 1.00")
    private BigDecimal odd;
    
    @NotNull(message = "Valor apostado é obrigatório")
    @Positive(message = "Valor apostado deve ser positivo")
    private BigDecimal stake;
    
    @NotNull(message = "Status é obrigatório")
    private BetStatus status;
    
    private BigDecimal profit;
    
    private String createdAt;
}
