package com.apostas.service;

import com.apostas.dto.BetDTO;
import com.apostas.dto.BetImportCommitResponseDTO;
import com.apostas.dto.BetImportPreviewResponseDTO;
import com.apostas.dto.BetImportPreviewRowDTO;
import com.apostas.dto.BookmakerDTO;
import com.apostas.dto.MarketDTO;
import com.apostas.dto.SportDTO;
import com.apostas.dto.TipsterDTO;
import com.apostas.model.BetStatus;
import com.apostas.repository.BankrollRepository;
import com.apostas.repository.BookmakerRepository;
import com.apostas.repository.MarketRepository;
import com.apostas.repository.SportRepository;
import com.apostas.repository.TipsterRepository;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.text.Normalizer;
import java.time.DateTimeException;
import java.time.LocalDate;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class BetImportService {

    private static final BigDecimal UNIT_VALUE = new BigDecimal("50.00");

    private static final String COL_DAY = "day";
    private static final String COL_TIPSTER = "tipster";
    private static final String COL_BOOKMAKER = "bookmaker";
    private static final String COL_MARKET = "market";
    private static final String COL_EVENT = "event";
    private static final String COL_SPORT = "sport";
    private static final String COL_ODD = "odd";
    private static final String COL_UNIT = "unit";
    private static final String COL_STATUS = "status";
    private static final String COL_RETURN_UNIT = "return_unit";

    private final BetService betService;
    private final BankrollRepository bankrollRepository;
    private final SportRepository sportRepository;
    private final MarketRepository marketRepository;
    private final BookmakerRepository bookmakerRepository;
    private final TipsterRepository tipsterRepository;
    private final SportService sportService;
    private final MarketService marketService;
    private final BookmakerService bookmakerService;
    private final TipsterService tipsterService;

    private final Map<String, StoredPreview> previews = new ConcurrentHashMap<>();

    public BetImportService(
            BetService betService,
            BankrollRepository bankrollRepository,
            SportRepository sportRepository,
            MarketRepository marketRepository,
            BookmakerRepository bookmakerRepository,
            TipsterRepository tipsterRepository,
            SportService sportService,
            MarketService marketService,
            BookmakerService bookmakerService,
            TipsterService tipsterService
    ) {
        this.betService = betService;
        this.bankrollRepository = bankrollRepository;
        this.sportRepository = sportRepository;
        this.marketRepository = marketRepository;
        this.bookmakerRepository = bookmakerRepository;
        this.tipsterRepository = tipsterRepository;
        this.sportService = sportService;
        this.marketService = marketService;
        this.bookmakerService = bookmakerService;
        this.tipsterService = tipsterService;
    }

    public BetImportPreviewResponseDTO preview(MultipartFile file, Long bankrollId, Integer month, Integer year) {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("Arquivo é obrigatório");
        }

        bankrollRepository.findById(bankrollId)
                .orElseThrow(() -> new RuntimeException("Banca não encontrada"));

        validateMonthYear(month, year);

        List<Map<String, String>> rawRows = readRows(file);
        if (rawRows.isEmpty()) {
            throw new RuntimeException("Planilha sem dados para importação");
        }

        List<BetImportPreviewRowDTO> previewRows = new ArrayList<>();
        List<ImportBetData> validRows = new ArrayList<>();

        int rowCursor = 2;
        for (Map<String, String> row : rawRows) {
            BetImportPreviewRowDTO previewRow = parseRow(row, rowCursor, month, year);
            previewRows.add(previewRow);

            if (previewRow.valid()) {
                validRows.add(toImportData(previewRow, bankrollId));
            }
            rowCursor++;
        }

        int totalRows = previewRows.size();
        int validRowsCount = validRows.size();
        int invalidRows = totalRows - validRowsCount;

        String previewId = UUID.randomUUID().toString();
        previews.put(previewId, new StoredPreview(validRows, totalRows));

        return new BetImportPreviewResponseDTO(previewId, totalRows, validRowsCount, invalidRows, previewRows);
    }

    @Transactional
    public BetImportCommitResponseDTO commit(String previewId) {
        StoredPreview stored = previews.get(previewId);
        if (stored == null) {
            throw new RuntimeException("Pré-visualização não encontrada ou expirada");
        }

        int imported = 0;
        for (ImportBetData row : stored.validRows()) {
            BetDTO dto = toBetDTO(row);
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

    private BetImportPreviewRowDTO parseRow(Map<String, String> row, int rowNumber, int month, int year) {
        List<String> warnings = new ArrayList<>();
        List<String> errors = new ArrayList<>();

        String betDate = null;
        Integer day = parseInteger(row.get(COL_DAY));
        if (day == null) {
            errors.add("Dia do Mês inválido");
        } else {
            try {
                LocalDate.of(year, month, day);
                betDate = String.format(Locale.ROOT, "%02d/%02d/%d", day, month, year);
            } catch (DateTimeException ex) {
                errors.add("Dia do Mês não existe para o mês/ano informado");
            }
        }

        String tipster = cleanText(row.get(COL_TIPSTER));
        String bookmaker = cleanText(row.get(COL_BOOKMAKER));
        String market = cleanText(row.get(COL_MARKET));
        String event = cleanText(row.get(COL_EVENT));
        String sport = cleanText(row.get(COL_SPORT));

        if (event == null || event.isBlank()) {
            errors.add("Descrição da Aposta é obrigatória");
        }

        BigDecimal odd = parseDecimal(row.get(COL_ODD));
        if (odd == null || odd.compareTo(new BigDecimal("1.01")) < 0) {
            errors.add("ODD inválida (mínimo 1.01)");
        } else {
            odd = odd.setScale(2, RoundingMode.HALF_UP);
        }

        BigDecimal unit = parseDecimal(row.get(COL_UNIT));
        BigDecimal stake = null;
        if (unit == null || unit.compareTo(BigDecimal.ZERO) <= 0) {
            errors.add("Unidade inválida");
        } else {
            unit = unit.setScale(2, RoundingMode.HALF_UP);
            stake = unit.multiply(UNIT_VALUE).setScale(2, RoundingMode.HALF_UP);
        }

        BigDecimal returnUnit = parseDecimal(row.get(COL_RETURN_UNIT));
        BigDecimal result = null;
        if (returnUnit != null) {
            result = returnUnit.multiply(UNIT_VALUE).setScale(2, RoundingMode.HALF_UP);
        }

        String rawStatus = cleanText(row.get(COL_STATUS));
        BetStatus status = parseStatus(rawStatus);
        if (rawStatus != null && !rawStatus.isBlank() && status == BetStatus.PENDING && !isPendingLike(rawStatus)) {
            warnings.add("Situação não reconhecida, status definido como PENDING");
        }

        return new BetImportPreviewRowDTO(
                rowNumber,
                betDate,
                sport,
                market,
                bookmaker,
                tipster,
                event,
                odd,
                stake,
                result,
                status,
                rawStatus,
                errors.isEmpty(),
                warnings,
                errors
        );
    }

    private ImportBetData toImportData(BetImportPreviewRowDTO row, Long bankrollId) {
        return new ImportBetData(
                bankrollId,
                row.betDate(),
                row.event(),
                row.odd(),
                row.stake(),
                row.status(),
                row.sport(),
                row.market(),
                row.bookmaker(),
                row.tipster()
        );
    }

    private BetDTO toBetDTO(ImportBetData data) {
        Long sportId = getOrCreateSportId(data.sportName());
        Long marketId = getOrCreateMarketId(data.marketName());
        Long bookmakerId = getOrCreateBookmakerId(data.bookmakerName());
        Long tipsterId = getOrCreateTipsterId(data.tipsterName());

        BetDTO dto = new BetDTO();
        setField(dto, "bankrollId", data.bankrollId());
        setField(dto, "betDate", data.betDate());
        setField(dto, "event", data.event());
        setField(dto, "odd", data.odd());
        setField(dto, "stake", data.stake());
        setField(dto, "status", data.status());
        setField(dto, "sportId", sportId);
        setField(dto, "marketId", marketId);
        setField(dto, "bookmakerId", bookmakerId);
        setField(dto, "tipsterId", tipsterId);
        return dto;
    }

    private void setField(Object target, String fieldName, Object value) {
        try {
            Field field = target.getClass().getDeclaredField(fieldName);
            field.setAccessible(true);
            field.set(target, value);
        } catch (NoSuchFieldException | IllegalAccessException ex) {
            throw new RuntimeException("Erro ao definir campo " + fieldName, ex);
        }
    }

    private Long getOrCreateSportId(String sportName) {
        if (sportName == null || sportName.isBlank()) {
            return null;
        }
        return sportRepository.findIdByNameIgnoreCase(sportName)
                .orElseGet(() -> sportService.create(new SportDTO(null, sportName, true)).id());
    }

    private Long getOrCreateMarketId(String marketName) {
        if (marketName == null || marketName.isBlank()) {
            return null;
        }
        return marketRepository.findIdByNameIgnoreCase(marketName)
                .orElseGet(() -> marketService.create(new MarketDTO(null, marketName, true)).id());
    }

    private Long getOrCreateBookmakerId(String bookmakerName) {
        if (bookmakerName == null || bookmakerName.isBlank()) {
            return null;
        }
        return bookmakerRepository.findIdByNameIgnoreCase(bookmakerName)
                .orElseGet(() -> bookmakerService.create(new BookmakerDTO(null, bookmakerName, true)).id());
    }

    private Long getOrCreateTipsterId(String tipsterName) {
        if (tipsterName == null || tipsterName.isBlank()) {
            return null;
        }
        return tipsterRepository.findIdByNameIgnoreCase(tipsterName)
                .orElseGet(() -> tipsterService.create(new TipsterDTO(null, tipsterName, true)).id());
    }

    private List<Map<String, String>> readRows(MultipartFile file) {
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

                if (isRowEmpty(mapped)) {
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
                String mapped = mapColumn(header);
                if (mapped != null) {
                    normalizedHeader.put(header, mapped);
                }
            }

            if (!normalizedHeader.containsValue(COL_DAY)
                    || !normalizedHeader.containsValue(COL_EVENT)
                    || !normalizedHeader.containsValue(COL_ODD)
                    || !normalizedHeader.containsValue(COL_UNIT)
                    || !normalizedHeader.containsValue(COL_STATUS)) {
                return List.of();
            }

            for (CSVRecord record : parser) {
                Map<String, String> mapped = new HashMap<>();
                for (Map.Entry<String, String> entry : normalizedHeader.entrySet()) {
                    mapped.put(entry.getValue(), record.get(entry.getKey()));
                }
                if (isRowEmpty(mapped)) {
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
            String mapped = mapColumn(header);
            if (mapped != null) {
                columnMap.put(i, mapped);
            }
        }
        return columnMap;
    }

    private boolean hasRequiredColumns(Map<Integer, String> columnMap) {
        return columnMap.containsValue(COL_DAY)
                && columnMap.containsValue(COL_EVENT)
                && columnMap.containsValue(COL_ODD)
                && columnMap.containsValue(COL_UNIT)
                && columnMap.containsValue(COL_STATUS);
    }

    private String mapColumn(String rawHeader) {
        String normalized = normalize(rawHeader);

        if (normalized.contains("live") || normalized.contains("pre live") || normalized.contains("prelive")) {
            return null;
        }

        if (normalized.contains("dia do mes") || normalized.equals("dia") || normalized.contains("day")) {
            return COL_DAY;
        }
        if (normalized.contains("tipster")) {
            return COL_TIPSTER;
        }
        if (normalized.contains("casa de aposta") || normalized.contains("bookmaker") || normalized.equals("casa")) {
            return COL_BOOKMAKER;
        }
        if (normalized.contains("tipo de aposta") || normalized.contains("mercado") || normalized.contains("market")) {
            return COL_MARKET;
        }
        if (normalized.contains("descricao da aposta") || normalized.contains("evento") || normalized.contains("event")) {
            return COL_EVENT;
        }
        if (normalized.contains("esporte") || normalized.contains("sport")) {
            return COL_SPORT;
        }
        if (normalized.equals("odd") || normalized.contains("odds")) {
            return COL_ODD;
        }
        if (normalized.contains("unidade") || normalized.contains("units") || normalized.contains("stake")) {
            if (normalized.contains("retorno") || normalized.contains("return")) {
                return COL_RETURN_UNIT;
            }
            return COL_UNIT;
        }
        if ((normalized.contains("retorno") || normalized.contains("return")) && normalized.contains("unidade")) {
            return COL_RETURN_UNIT;
        }
        if (normalized.contains("situacao") || normalized.contains("status") || normalized.contains("resultado")) {
            return COL_STATUS;
        }

        return null;
    }

    private BetStatus parseStatus(String rawStatus) {
        if (rawStatus == null || rawStatus.isBlank()) {
            return BetStatus.PENDING;
        }

        String normalized = normalize(rawStatus);

        if ((normalized.contains("half") || normalized.contains("meio")) && normalized.contains("green")) {
            return BetStatus.HALF_GREEN;
        }
        if ((normalized.contains("half") || normalized.contains("meio")) && normalized.contains("red")) {
            return BetStatus.HALF_RED;
        }
        if (normalized.contains("void") || normalized.contains("reembolso") || normalized.contains("devolvida")) {
            return BetStatus.VOID;
        }
        if (normalized.contains("green") || normalized.contains("ganhou") || normalized.contains("win")) {
            return BetStatus.GREEN;
        }
        if (normalized.contains("red") || normalized.contains("perdeu") || normalized.contains("loss")) {
            return BetStatus.RED;
        }
        if (isPendingLike(rawStatus)) {
            return BetStatus.PENDING;
        }

        return BetStatus.PENDING;
    }

    private boolean isPendingLike(String value) {
        String normalized = normalize(value);
        return normalized.contains("pend") || normalized.contains("open") || normalized.contains("aberta");
    }

    private Integer parseInteger(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        try {
            return Integer.parseInt(value.trim());
        } catch (NumberFormatException ex) {
            return null;
        }
    }

    private BigDecimal parseDecimal(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        String trimmed = value.trim().replace("R$", "").replace(" ", "");

        if (trimmed.contains(",") && trimmed.contains(".")) {
            trimmed = trimmed.replace(".", "").replace(",", ".");
        } else {
            trimmed = trimmed.replace(",", ".");
        }

        try {
            return new BigDecimal(trimmed);
        } catch (NumberFormatException ex) {
            return null;
        }
    }

    private String cleanText(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private String normalize(String value) {
        if (value == null) {
            return "";
        }

        return Normalizer.normalize(value, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9 ]", " ")
                .replaceAll("\\s+", " ")
                .trim();
    }

    private boolean isRowEmpty(Map<String, String> row) {
        return row.values().stream().allMatch(v -> v == null || v.isBlank());
    }

    private void validateMonthYear(Integer month, Integer year) {
        if (month == null || month < 1 || month > 12) {
            throw new RuntimeException("Mês inválido");
        }

        if (year == null || year < 2000 || year > 2100) {
            throw new RuntimeException("Ano inválido");
        }
    }

    private record StoredPreview(List<ImportBetData> validRows, Integer totalRows) {
    }

    private record ImportBetData(
            Long bankrollId,
            String betDate,
            String event,
            BigDecimal odd,
            BigDecimal stake,
            BetStatus status,
            String sportName,
            String marketName,
            String bookmakerName,
            String tipsterName
    ) {
    }
}
