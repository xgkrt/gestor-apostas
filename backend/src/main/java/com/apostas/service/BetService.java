package com.apostas.service;

import com.apostas.dto.BetDTO;
import com.apostas.model.*;
import com.apostas.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BetService {
    
    private final BetRepository betRepository;
    private final BankrollRepository bankrollRepository;
    private final SportRepository sportRepository;
    private final ChampionshipRepository championshipRepository;
    private final MarketRepository marketRepository;
    private final BookmakerRepository bookmakerRepository;
    private final TipsterRepository tipsterRepository;
    private final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private final DateTimeFormatter isoDateFormatter = DateTimeFormatter.ISO_LOCAL_DATE;
    private final DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
    
    @Transactional(readOnly = true)
    public List<BetDTO> findAll() {
        return betRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<BetDTO> findByBankrollId(Long bankrollId) {
        return betRepository.findByBankrollIdOrderByBetDateDesc(bankrollId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public BetDTO findById(Long id) {
        Bet bet = betRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aposta não encontrada"));
        return toDTO(bet);
    }
    
    @Transactional
    public BetDTO create(BetDTO dto) {
        Bankroll bankroll = bankrollRepository.findById(dto.getBankrollId())
                .orElseThrow(() -> new RuntimeException("Banca não encontrada"));
        
        Bet bet = new Bet();
        bet.setBankroll(bankroll);
        bet.setBetDate(parseDate(dto.getBetDate()));
        
        // Buscar e setar relacionamentos
        if (dto.getSportId() != null) {
            Sport sport = sportRepository.findById(dto.getSportId())
                    .orElseThrow(() -> new RuntimeException("Esporte não encontrado"));
            bet.setSport(sport);
        }
        
        if (dto.getChampionshipId() != null) {
            Championship championship = championshipRepository.findById(dto.getChampionshipId())
                    .orElseThrow(() -> new RuntimeException("Campeonato não encontrado"));
            bet.setChampionship(championship);
        }
        
        if (dto.getMarketId() != null) {
            Market market = marketRepository.findById(dto.getMarketId())
                    .orElseThrow(() -> new RuntimeException("Mercado não encontrado"));
            bet.setMarket(market);
        }
        
        if (dto.getBookmakerId() != null) {
            Bookmaker bookmaker = bookmakerRepository.findById(dto.getBookmakerId())
                    .orElseThrow(() -> new RuntimeException("Casa de aposta não encontrada"));
            bet.setBookmaker(bookmaker);
        }
        
        if (dto.getTipsterId() != null) {
            Tipster tipster = tipsterRepository.findById(dto.getTipsterId())
                    .orElseThrow(() -> new RuntimeException("Tipster não encontrado"));
            bet.setTipster(tipster);
        }
        
        bet.setEvent(dto.getEvent());
        bet.setOdd(dto.getOdd());
        bet.setStake(dto.getStake());
        bet.setStatus(dto.getStatus());
        
        bet = betRepository.save(bet);
        return toDTO(bet);
    }
    
    @Transactional
    public BetDTO update(Long id, BetDTO dto) {
        Bet bet = betRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aposta não encontrada"));
        
        bet.setBetDate(parseDate(dto.getBetDate()));
        
        // Atualizar relacionamentos
        if (dto.getSportId() != null) {
            Sport sport = sportRepository.findById(dto.getSportId())
                    .orElseThrow(() -> new RuntimeException("Esporte não encontrado"));
            bet.setSport(sport);
        } else {
            bet.setSport(null);
        }
        
        if (dto.getChampionshipId() != null) {
            Championship championship = championshipRepository.findById(dto.getChampionshipId())
                    .orElseThrow(() -> new RuntimeException("Campeonato não encontrado"));
            bet.setChampionship(championship);
        } else {
            bet.setChampionship(null);
        }
        
        if (dto.getMarketId() != null) {
            Market market = marketRepository.findById(dto.getMarketId())
                    .orElseThrow(() -> new RuntimeException("Mercado não encontrado"));
            bet.setMarket(market);
        } else {
            bet.setMarket(null);
        }
        
        if (dto.getBookmakerId() != null) {
            Bookmaker bookmaker = bookmakerRepository.findById(dto.getBookmakerId())
                    .orElseThrow(() -> new RuntimeException("Casa de aposta não encontrada"));
            bet.setBookmaker(bookmaker);
        } else {
            bet.setBookmaker(null);
        }
        
        if (dto.getTipsterId() != null) {
            Tipster tipster = tipsterRepository.findById(dto.getTipsterId())
                    .orElseThrow(() -> new RuntimeException("Tipster não encontrado"));
            bet.setTipster(tipster);
        } else {
            bet.setTipster(null);
        }
        
        bet.setEvent(dto.getEvent());
        bet.setOdd(dto.getOdd());
        bet.setStake(dto.getStake());
        bet.setStatus(dto.getStatus());
        
        bet = betRepository.save(bet);
        return toDTO(bet);
    }
    
    @Transactional
    public void delete(Long id) {
        if (!betRepository.existsById(id)) {
            throw new RuntimeException("Aposta não encontrada");
        }
        betRepository.deleteById(id);
    }
    
    @Transactional
    public BetDTO updateStatus(Long id, String statusStr) {
        Bet bet = betRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aposta não encontrada"));
        
        BetStatus newStatus;
        
        try {
            newStatus = BetStatus.valueOf(statusStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Status inválido: " + statusStr);
        }
        
        // Se o status não mudou, retorna sem fazer nada
        if (bet.getStatus() == newStatus) {
            return toDTO(bet);
        }
        
        // Atualiza o status (isso vai recalcular o profit via @PreUpdate)
        bet.setStatus(newStatus);
        bet = betRepository.save(bet);
        
        // Nota: O currentBalance é calculado dinamicamente como initialBalance + soma dos profits
        // Não é necessário atualizar o initialBalance da banca aqui
        
        return toDTO(bet);
    }
    
    private BetDTO toDTO(Bet bet) {
        BetDTO dto = new BetDTO();
        dto.setId(bet.getId());
        dto.setBankrollId(bet.getBankroll().getId());
        dto.setBetDate(bet.getBetDate().format(dateFormatter));
        
        // Setar IDs e nomes dos relacionamentos
        if (bet.getSport() != null) {
            dto.setSportId(bet.getSport().getId());
            dto.setSportName(bet.getSport().getName());
        }
        
        if (bet.getChampionship() != null) {
            dto.setChampionshipId(bet.getChampionship().getId());
            dto.setChampionshipName(bet.getChampionship().getName());
        }
        
        if (bet.getMarket() != null) {
            dto.setMarketId(bet.getMarket().getId());
            dto.setMarketName(bet.getMarket().getName());
        }
        
        if (bet.getBookmaker() != null) {
            dto.setBookmakerId(bet.getBookmaker().getId());
            dto.setBookmakerName(bet.getBookmaker().getName());
        }
        
        if (bet.getTipster() != null) {
            dto.setTipsterId(bet.getTipster().getId());
            dto.setTipsterName(bet.getTipster().getName());
        }
        
        dto.setEvent(bet.getEvent());
        dto.setOdd(bet.getOdd());
        dto.setStake(bet.getStake());
        dto.setStatus(bet.getStatus());
        dto.setProfit(bet.getProfit());
        dto.setCreatedAt(bet.getCreatedAt().format(dateTimeFormatter));
        return dto;
    }
    
    private LocalDate parseDate(String dateStr) {
        try {
            // Try ISO format first (yyyy-MM-dd)
            return LocalDate.parse(dateStr, isoDateFormatter);
        } catch (Exception e) {
            // Fallback to Brazilian format (dd/MM/yyyy)
            return LocalDate.parse(dateStr, dateFormatter);
        }
    }
}
