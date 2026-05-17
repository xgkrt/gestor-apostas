export type BetStatus = 
  | "PENDING"
  | "GREEN"
  | "RED"
  | "VOID"
  | "HALF_GREEN"
  | "HALF_RED";

export interface Bankroll {
  id: number;
  name: string;
  initialBalance: number;
  currentBalance: number;
  createdAt: string;
}

export interface Bet {
  id: number;
  bankrollId: number;
  betDate: string;
  // Novos campos com relacionamentos
  sportId?: number;
  sportName?: string;
  marketId?: number;
  marketName?: string;
  bookmakerId?: number;
  bookmakerName?: string;
  tipsterId?: number;
  tipsterName?: string;
  // Campos legados (manter temporariamente)
  sport?: string;
  market?: string;
  bookmaker?: string;
  tipster?: string;
  event: string;
  odd: number;
  stake: number;
  status: BetStatus;
  profit: number;
  createdAt: string;
}

export interface BookmakerProfit {
  bookmaker: string;
  profit: number;
}

export interface TipsterProfit {
  tipster: string;
  profit: number;
}

export interface BankrollEvolution {
  date: string;
  balance: number;
}

export interface Dashboard {
  initialBalance: number;
  currentBalance: number;
  totalProfit: number;
  roi: number;
  winRate: number;
  totalBets: number;
  greenBets: number;
  redBets: number;
  pendingBets: number;
  totalInvested: number;
  profitByBookmaker: BookmakerProfit[];
  profitByTipster: TipsterProfit[];
  bankrollEvolution: BankrollEvolution[];
}

export interface BankrollDTO {
  name: string;
  initialBalance: number;
}

export interface BetDTO {
  bankrollId: number;
  betDate: string;
  // Novos campos com IDs
  sportId?: number;
  marketId?: number;
  bookmakerId?: number;
  tipsterId?: number;
  // Campos legados (manter temporariamente)
  sport?: string;
  market?: string;
  bookmaker?: string;
  tipster?: string;
  event: string;
  odd: number;
  stake: number;
  status: BetStatus;
}

// =====================================================
// CONFIGURAÇÕES - Novas Interfaces
// =====================================================

export interface Sport {
  id: number;
  name: string;
  active: boolean;
}

export interface Championship {
  id: number;
  name: string;
  sportId: number;
  sportName: string;
  active: boolean;
}

export interface Market {
  id: number;
  name: string;
  active: boolean;
}

export interface Bookmaker {
  id: number;
  name: string;
  active: boolean;
}

export interface Tipster {
  id: number;
  name: string;
  active: boolean;
}

// DTOs para criação/atualização

export interface SportDTO {
  name: string;
}

export interface ChampionshipDTO {
  name: string;
  sportId: number;
}

export interface MarketDTO {
  name: string;
}

export interface BookmakerDTO {
  name: string;
}

export interface TipsterDTO {
  name: string;
}

// Aliases for backward compatibility
export type CreateBankrollDTO = BankrollDTO;
export type CreateBetDTO = BetDTO;
