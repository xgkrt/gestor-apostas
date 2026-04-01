package com.apostas.dto;

public record BetImportCommitResponseDTO(
        String previewId,
        Integer importedRows,
        Integer skippedRows,
        Integer totalRows
) {
}
