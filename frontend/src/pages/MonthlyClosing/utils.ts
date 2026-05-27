import { endOfMonth, format, parse, parseISO, startOfMonth } from "date-fns"
import { ptBR } from "date-fns/locale"

import type { Highlight, HighestGreenOdd, MonthlyClosingBet, MonthlySummary, SportResult } from "./types"

const UNIT_VALUE = 50

export const ALL_PERIODS = "ALL"
export const METRIC_CARD_CLASS = "min-h-[132px] sm:h-[150px]"

export function parseBetDate(value: string): Date | null {
  const brDate = parse(value, "dd/MM/yyyy", new Date())
  if (!Number.isNaN(brDate.getTime())) return brDate

  const isoDate = parseISO(value)
  if (!Number.isNaN(isoDate.getTime())) return isoDate

  const fallback = new Date(value)
  if (!Number.isNaN(fallback.getTime())) return fallback

  return null
}

export function parseMonthValue(month: string): Date {
  const parsedMonth = parse(`${month}-01`, "yyyy-MM-dd", new Date())
  return Number.isNaN(parsedMonth.getTime()) ? startOfMonth(new Date()) : parsedMonth
}

export function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function formatPercent(value: number): string {
  return `${value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}%`
}

export function formatUnits(value: number): string {
  const units = value / UNIT_VALUE
  const sign = units > 0 ? "+" : ""
  return `${sign}${units.toFixed(2)}u`
}

export function formatOdd(value: number | null): string {
  if (value === null) return "--"

  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function formatMonthLabel(month: string): string {
  return format(parseMonthValue(month), "MMMM 'de' yyyy", { locale: ptBR })
}

export function formatPeriodLabel(period: string): string {
  return period === ALL_PERIODS ? "Todos os meses" : formatMonthLabel(period)
}

function getBestAndWorst(map: Map<string, number>): { best: Highlight | null; worst: Highlight | null } {
  const entries = Array.from(map.entries())
  if (entries.length === 0) return { best: null, worst: null }

  const sorted = entries.sort((a, b) => b[1] - a[1])

  return {
    best: { label: sorted[0][0], value: sorted[0][1] },
    worst: { label: sorted[sorted.length - 1][0], value: sorted[sorted.length - 1][1] },
  }
}

function getSportName(bet: Pick<MonthlyClosingBet, "sportName" | "sport">): string {
  return bet.sportName || bet.sport || "Sem esporte"
}

function getAverageOdd(bets: Pick<MonthlyClosingBet, "odd">[]): number | null {
  if (bets.length === 0) return null

  const totalOdds = bets.reduce((total, bet) => total + bet.odd, 0)
  return totalOdds / bets.length
}

function getHighestGreenOddBet(bets: MonthlyClosingBet[]): HighestGreenOdd | null {
  const greenBets = bets.filter((bet) => bet.status === "GREEN")
  if (greenBets.length === 0) return null

  const highestGreenBet = greenBets.reduce((highest, bet) => (bet.odd > highest.odd ? bet : highest))
  return {
    event: highestGreenBet.event,
    odd: highestGreenBet.odd,
    stake: highestGreenBet.stake,
    profit: highestGreenBet.profit,
  }
}

export function buildMonthlySummary({
  bets,
  selectedPeriod,
  initialBankrollBalance,
}: {
  bets: MonthlyClosingBet[]
  selectedPeriod: string
  initialBankrollBalance: number
}): MonthlySummary {
  const isAllPeriods = selectedPeriod === ALL_PERIODS
  const parsedMonth = isAllPeriods ? null : parseMonthValue(selectedPeriod)
  const monthStart = parsedMonth ? startOfMonth(parsedMonth) : null
  const monthEnd = parsedMonth ? endOfMonth(parsedMonth) : null

  const finishedBeforePeriod = isAllPeriods
    ? []
    : bets.filter((bet) => {
        if (bet.status === "PENDING") return false

        const betDate = parseBetDate(bet.betDate)
        return Boolean(monthStart && betDate && betDate < monthStart)
      })

  const periodBets = isAllPeriods
    ? bets
    : bets.filter((bet) => {
        const betDate = parseBetDate(bet.betDate)
        return Boolean(monthStart && monthEnd && betDate && betDate >= monthStart && betDate <= monthEnd)
      })

  const finishedPeriodBets = periodBets.filter((bet) => bet.status !== "PENDING")
  const profitBeforePeriod = finishedBeforePeriod.reduce((total, bet) => total + bet.profit, 0)
  const periodProfit = finishedPeriodBets.reduce((total, bet) => total + bet.profit, 0)
  const totalInvested = finishedPeriodBets.reduce((total, bet) => total + bet.stake, 0)
  const initialBalance = initialBankrollBalance + profitBeforePeriod
  const finalBalance = initialBalance + periodProfit
  const roi = totalInvested > 0 ? (periodProfit / totalInvested) * 100 : 0
  const dailyProfitMap = new Map<string, number>()
  const sportProfitMap = new Map<string, number>()

  for (const bet of finishedPeriodBets) {
    const betDate = parseBetDate(bet.betDate)
    if (!betDate) continue

    const dayLabel = format(betDate, "dd/MM/yyyy")
    dailyProfitMap.set(dayLabel, (dailyProfitMap.get(dayLabel) || 0) + bet.profit)

    const sportName = getSportName(bet)
    sportProfitMap.set(sportName, (sportProfitMap.get(sportName) || 0) + bet.profit)
  }

  const dayHighlights = getBestAndWorst(dailyProfitMap)
  const sportResults: SportResult[] = Array.from(sportProfitMap.entries())
    .map(([sport, profit]) => ({ sport, profit }))
    .sort((a, b) => b.profit - a.profit)

  return {
    initialBalance,
    finalBalance,
    periodProfit,
    roi,
    totalInvested,
    totalBets: periodBets.length,
    finishedBets: finishedPeriodBets.length,
    averagePeriodOdd: getAverageOdd(periodBets),
    averageTotalOdd: getAverageOdd(bets),
    highestGreenOddBet: getHighestGreenOddBet(periodBets),
    bestDay: dayHighlights.best,
    worstDay: dayHighlights.worst,
    sportResults,
  }
}
