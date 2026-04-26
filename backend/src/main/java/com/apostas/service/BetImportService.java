package com.apostas.service;

import com.apostas.dto.BetDTO;
import com.apostas.dto.BetImportCommitResponseDTO;
import com.apostas.dto.BetImportPreviewResponseDTO;
import com.apostas.dto.BetImportPreviewRowDTO;
import com.apostas.repository.BankrollRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class BetImportService {

    private final BetService betService;
    private final BankrollRepository bankrollRepository;
    private final BetImportReader importReader;
    private final BetImportParser importParser;
    private final BetImportBetMapper betMapper;

    private final Map<String, BetImportStoredPreview> previews = new ConcurrentHashMap<>();

    public BetImportService(
            BetService betService,
            BankrollRepository bankrollRepository,
            BetImportReader importReader,
            BetImportParser importParser,
            BetImportBetMapper betMapper
    ) {
        this.betService = betService;
        this.bankrollRepository = bankrollRepository;
        this.importReader = importReader;
        this.importParser = importParser;
        this.betMapper = betMapper;
    }

    public BetImportPreviewResponseDTO preview(MultipartFile file, Long bankrollId, Integer month, Integer year) {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("Arquivo é obrigatório");
        }

        bankrollRepository.findById(bankrollId)
                .orElseThrow(() -> new RuntimeException("Banca não encontrada"));

        validateMonthYear(month, year);

        List<Map<String, String>> rawRows = importReader.readRows(file);
        if (rawRows.isEmpty()) {
            throw new RuntimeException("Planilha sem dados para importação");
        }

        List<BetImportPreviewRowDTO> previewRows = new ArrayList<>();
        List<BetImportData> validRows = new ArrayList<>();

        int rowCursor = 2;
        for (Map<String, String> row : rawRows) {
            BetImportPreviewRowDTO previewRow = importParser.parseRow(row, rowCursor, month, year);
            previewRows.add(previewRow);

            if (previewRow.valid()) {
                validRows.add(importParser.toImportData(previewRow, bankrollId));
            }
            rowCursor++;
        }

        int totalRows = previewRows.size();
        int validRowsCount = validRows.size();
        int invalidRows = totalRows - validRowsCount;

        String previewId = UUID.randomUUID().toString();
        previews.put(previewId, new BetImportStoredPreview(validRows, totalRows));

        return new BetImportPreviewResponseDTO(previewId, totalRows, validRowsCount, invalidRows, previewRows);
    }

    @Transactional
    public BetImportCommitResponseDTO commit(String previewId) {
        BetImportStoredPreview stored = previews.get(previewId);
        if (stored == null) {
            throw new RuntimeException("Pré-visualização não encontrada ou expirada");
        }

        int imported = 0;
        for (BetImportData row : stored.validRows()) {
            BetDTO dto = betMapper.toBetDTO(row);
            betService.create(dto);
            imported++;
        }

        previews.remove(previewId);

        return new BetImportCommitResponseDTO(
                previewId,
                imported,
                stored.totalRows() - imported,
                stored.totalRows()
        );
    }

    private void validateMonthYear(Integer month, Integer year) {
        if (month == null || month < 1 || month > 12) {
            throw new RuntimeException("Mês inválido");
        }

        if (year == null || year < 2000 || year > 2100) {
            throw new RuntimeException("Ano inválido");
        }
    }
}
