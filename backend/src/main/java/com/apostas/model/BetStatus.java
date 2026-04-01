package com.apostas.model;

public enum BetStatus {
    PENDING("Pendente"),
    GREEN("Green - Ganhou"),
    RED("Red - Perdeu"),
    VOID("Void - Reembolsada"),
    HALF_GREEN("Meio Green"),
    HALF_RED("Meio Red");
    
    private final String description;
    
    BetStatus(String description) {
        this.description = description;
    }
    
    public String getDescription() {
        return description;
    }
}
