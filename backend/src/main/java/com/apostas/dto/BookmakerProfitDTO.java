package com.apostas.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookmakerProfitDTO {
    private String bookmaker;
    private BigDecimal profit;
}
