package com.apostas.dto;

import java.util.List;

public record BetImportPreviewResponseDTO(
        String previewId,
        Integer totalRows,
        Integer validRows,
        Integer invalidRows,
        List<BetImportPreviewRowDTO> rows
) {
}
