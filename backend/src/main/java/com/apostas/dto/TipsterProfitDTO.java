package com.apostas.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TipsterProfitDTO {
    private String tipster;
    private BigDecimal profit;
}
