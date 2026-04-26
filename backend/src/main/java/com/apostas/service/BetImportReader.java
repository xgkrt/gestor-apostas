package com.apostas.service;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

@Component
public class BetImportReader {

    private final BetImportSupport support;

    public BetImportReader(BetImportSupport support) {
        this.support = support;
    }

    List<Map<String, String>> readRows(MultipartFile file) {
        String filename = Optional.ofNullable(file.getOriginalFilename()).orElse("").toLowerCase(Locale.ROOT);
        try {
            if (filename.endsWith(".xlsx")) {
                return readExcelRows(file.getInputStream());
            }

            if (filename.endsWith(".csv")) {
                return readCsvRows(file.getInputStream());
            }
        } catch (IOException e) {
            throw new RuntimeException("Erro ao ler arquivo de importação", e);
        }

        throw new RuntimeException("Formato de arquivo não suportado. Use .xlsx ou .csv");
    }

    private List<Map<String, String>> readExcelRows(InputStream inputStream) throws IOException {
        List<Map<String, String>> result = new ArrayList<>();
        DataFormatter formatter = new DataFormatter();

        try (Workbook workbook = new XSSFWorkbook(inputStream)) {
            Sheet sheet = workbook.getNumberOfSheets() > 0 ? workbook.getSheetAt(0) : null;
            if (sheet == null) {
                return result;
            }

            Row headerRow = sheet.getRow(0);
            if (headerRow == null) {
                return result;
            }

            Map<Integer, String> columnMap = mapColumns(headerRow, formatter);
            if (!hasRequiredColumns(columnMap)) {
                throw new RuntimeException("Não foi possível identificar todas as colunas obrigatórias na planilha");
            }

            int lastRow = sheet.getLastRowNum();
            for (int i = 1; i <= lastRow; i++) {
                Row row = sheet.getRow(i);
                if (row == null) {
                    continue;
                }

                Map<String, String> mapped = new HashMap<>();
                for (Map.Entry<Integer, String> entry : columnMap.entrySet()) {
                    Cell cell = row.getCell(entry.getKey());
                    String value = cell == null ? "" : formatter.formatCellValue(cell);
                    mapped.put(entry.getValue(), value);
                }

                if (support.isRowEmpty(mapped)) {
                    continue;
                }
                result.add(mapped);
            }
        }

        return result;
    }

    private List<Map<String, String>> readCsvRows(InputStream inputStream) throws IOException {
        byte[] bytes = inputStream.readAllBytes();

        List<Map<String, String>> semicolonRows = parseCsvWithDelimiter(new ByteArrayInputStream(bytes), ';');
        if (!semicolonRows.isEmpty()) {
            return semicolonRows;
        }

        List<Map<String, String>> commaRows = parseCsvWithDelimiter(new ByteArrayInputStream(bytes), ',');
        if (!commaRows.isEmpty()) {
            return commaRows;
        }

        throw new RuntimeException("Não foi possível identificar todas as colunas obrigatórias na planilha");
    }

    private List<Map<String, String>> parseCsvWithDelimiter(InputStream inputStream, char delimiter) throws IOException {
        List<Map<String, String>> result = new ArrayList<>();

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8));
             CSVParser parser = CSVFormat.DEFAULT
                     .builder()
                     .setHeader()
                     .setSkipHeaderRecord(true)
                     .setDelimiter(delimiter)
                     .setIgnoreEmptyLines(true)
                     .setTrim(true)
                     .build()
                     .parse(reader)) {

            Map<String, Integer> headerMap = parser.getHeaderMap();
            Map<String, String> normalizedHeader = new HashMap<>();
            for (String header : headerMap.keySet()) {
                String mapped = support.mapColumn(header);
                if (mapped != null) {
                    normalizedHeader.put(header, mapped);
                }
            }

            if (!normalizedHeader.containsValue(BetImportColumns.COL_DAY)
                    || !normalizedHeader.containsValue(BetImportColumns.COL_EVENT)
                    || !normalizedHeader.containsValue(BetImportColumns.COL_ODD)
                    || !normalizedHeader.containsValue(BetImportColumns.COL_UNIT)
                    || !normalizedHeader.containsValue(BetImportColumns.COL_STATUS)) {
                return List.of();
            }

            for (CSVRecord record : parser) {
                Map<String, String> mapped = new HashMap<>();
                for (Map.Entry<String, String> entry : normalizedHeader.entrySet()) {
                    mapped.put(entry.getValue(), record.get(entry.getKey()));
                }
                if (support.isRowEmpty(mapped)) {
                    continue;
                }
                result.add(mapped);
            }
        }

        return result;
    }

    private Map<Integer, String> mapColumns(Row headerRow, DataFormatter formatter) {
        Map<Integer, String> columnMap = new HashMap<>();
        short lastCell = headerRow.getLastCellNum();
        for (int i = 0; i < lastCell; i++) {
            Cell cell = headerRow.getCell(i);
            String header = cell == null ? "" : formatter.formatCellValue(cell);
            String mapped = support.mapColumn(header);
            if (mapped != null) {
                columnMap.put(i, mapped);
            }
        }
        return columnMap;
    }

    private boolean hasRequiredColumns(Map<Integer, String> columnMap) {
        return columnMap.containsValue(BetImportColumns.COL_DAY)
                && columnMap.containsValue(BetImportColumns.COL_EVENT)
                && columnMap.containsValue(BetImportColumns.COL_ODD)
                && columnMap.containsValue(BetImportColumns.COL_UNIT)
                && columnMap.containsValue(BetImportColumns.COL_STATUS);
    }
}
