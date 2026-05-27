export interface Highlight {
  label: string
  value: number
}

export interface SportResult {
  sport: string
  profit: number
}

export interface HighestGreenOdd {
  event: string
  odd: number
  stake: number
  profit: number
}

export interface MonthlyClosingBet {
  betDate: string
  event: string
  odd: number
  profit: number
  stake: number
  status: string
  sport?: string
  sportName?: string
}

export interface MonthlySummary {
  initialBalance: number
  finalBalance: number
  periodProfit: number
  roi: number
  totalInvested: number
  totalBets: number
  finishedBets: number
  averagePeriodOdd: number | null
  averageTotalOdd: number | null
  highestGreenOddBet: HighestGreenOdd | null
  bestDay: Highlight | null
  worstDay: Highlight | null
  sportResults: SportResult[]
}
