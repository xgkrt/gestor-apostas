import { useEffect, useMemo, useState } from "react"
import { format, parse, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarRange } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useBankrolls, useBets } from "@/services/queries"

const UNIT_VALUE = 50
const MONTHS = Array.from({ length: 12 }, (_, month) => month)

interface MonthResult {
  month: number
  profit: number
  finishedBets: number
}

function parseBetDate(value: string): Date | null {
  const brDate = parse(value, "dd/MM/yyyy", new Date())
  if (!Number.isNaN(brDate.getTime())) return brDate

  const isoDate = parseISO(value)
  if (!Number.isNaN(isoDate.getTime())) return isoDate

  const fallback = new Date(value)
  if (!Number.isNaN(fallback.getTime())) return fallback

  return null
}

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function formatUnits(value: number): string {
  const units = value / UNIT_VALUE
  const sign = units > 0 ? "+" : ""
  return `${sign}${units.toFixed(2)}u`
}

function formatMonthName(month: number): string {
  return format(new Date(2026, month, 1), "MMMM", { locale: ptBR })
}

function getResultClasses(profit: number, hasMovement: boolean): string {
  if (!hasMovement) return "text-muted-foreground"
  if (profit > 0) return "text-emerald-600 dark:text-emerald-300"
  if (profit < 0) return "text-red-600 dark:text-rose-300"
  return "text-muted-foreground"
}

export default function Annual() {
  const currentYear = new Date().getFullYear()
  const [selectedBankrollId, setSelectedBankrollId] = useState<number | null>(null)
  const [selectedYear, setSelectedYear] = useState<string>(String(currentYear))

  const { data: bankrolls, isLoading: loadingBankrolls } = useBankrolls()
  const { data: bets, isLoading: loadingBets } = useBets(
    selectedBankrollId ?? undefined,
    Boolean(selectedBankrollId)
  )

  useEffect(() => {
    if (selectedBankrollId || !bankrolls || bankrolls.length === 0) return
    setSelectedBankrollId(bankrolls[0].id)
  }, [bankrolls, selectedBankrollId])

  const selectedBankroll = useMemo(
    () => bankrolls?.find((bankroll) => bankroll.id === selectedBankrollId),
    [bankrolls, selectedBankrollId]
  )

  const yearOptions = useMemo(() => {
    const years = new Set<number>([currentYear])

    for (const bet of bets || []) {
      const betDate = parseBetDate(bet.betDate)
      if (betDate) years.add(betDate.getFullYear())
    }

    return Array.from(years).sort((a, b) => b - a)
  }, [bets, currentYear])

  const selectedYearNumber = Number(selectedYear)

  const annualSummary = useMemo(() => {
    const byMonth = new Map<number, { profit: number; finishedBets: number }>()

    for (const bet of bets || []) {
      if (bet.status === "PENDING") continue

      const betDate = parseBetDate(bet.betDate)
      if (!betDate || betDate.getFullYear() !== selectedYearNumber) continue

      const month = betDate.getMonth()
      const current = byMonth.get(month) || { profit: 0, finishedBets: 0 }
      byMonth.set(month, {
        profit: current.profit + bet.profit,
        finishedBets: current.finishedBets + 1,
      })
    }

    const months: MonthResult[] = MONTHS.map((month) => {
      const result = byMonth.get(month)
      return {
        month,
        profit: result?.profit ?? 0,
        finishedBets: result?.finishedBets ?? 0,
      }
    })

    const totalProfit = months.reduce((total, month) => total + month.profit, 0)
    const totalFinishedBets = months.reduce((total, month) => total + month.finishedBets, 0)

    return { months, totalProfit, totalFinishedBets }
  }, [bets, selectedYearNumber])

  if (loadingBankrolls) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">
        Carregando bancas...
      </div>
    )
  }

  if (!bankrolls || bankrolls.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="max-w-md rounded-2xl border border-yellow-200 bg-yellow-50 p-6 text-yellow-800">
          Nenhuma banca encontrada. Crie uma banca na pagina de Bancas para consultar o anual.
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Anual</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Resultado mensal da banca no ano selecionado.
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-[minmax(220px,280px)_minmax(160px,200px)] lg:w-auto">
          <Select
            value={selectedBankrollId?.toString() || ""}
            onValueChange={(value) => setSelectedBankrollId(Number(value))}
          >
            <SelectTrigger className="h-11 rounded-xl border-border bg-card text-foreground" aria-label="Banca">
              <SelectValue placeholder="Selecione uma banca">
                {selectedBankroll?.name}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {bankrolls.map((bankroll) => (
                <SelectItem key={bankroll.id} value={bankroll.id.toString()}>
                  {bankroll.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="h-11 rounded-xl border-border bg-card text-foreground" aria-label="Ano">
              <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent>
              {yearOptions.map((year) => (
                <SelectItem key={year} value={String(year)}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loadingBets ? (
        <div className="flex min-h-[40vh] items-center justify-center text-muted-foreground">
          Carregando apostas...
        </div>
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {annualSummary.months.map((monthResult) => {
              const hasMovement = monthResult.finishedBets > 0
              const resultClasses = getResultClasses(monthResult.profit, hasMovement)

              return (
                <Card
                  key={monthResult.month}
                  className="min-h-[150px] rounded-2xl border-border bg-card p-5 text-card-foreground"
                >
                  <div className="flex h-full flex-col">
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="text-base font-semibold capitalize text-foreground">
                        {formatMonthName(monthResult.month)}
                      </h2>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        {monthResult.finishedBets} apostas
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col items-center justify-center text-center">
                      {hasMovement ? (
                        <>
                          <p className={`text-2xl font-bold impact-money ${resultClasses}`}>
                            {formatCurrency(monthResult.profit)}
                          </p>
                          <p className={`mt-1 text-sm font-semibold impact-value ${resultClasses}`}>
                            {formatUnits(monthResult.profit)}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm font-medium text-muted-foreground">Sem movimento</p>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}
          </section>

          <Card className="rounded-3xl border-border bg-card p-6 text-card-foreground">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-muted p-2 text-muted-foreground">
                  <CalendarRange className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Total de {selectedYear}</h2>
                  <p className="text-sm text-muted-foreground">
                    {annualSummary.totalFinishedBets} apostas finalizadas
                  </p>
                </div>
              </div>

              <div className={`text-center md:text-right ${getResultClasses(annualSummary.totalProfit, annualSummary.totalFinishedBets > 0)}`}>
                <p className="text-3xl font-bold impact-money">{formatCurrency(annualSummary.totalProfit)}</p>
                <p className="mt-1 text-base font-semibold impact-value">{formatUnits(annualSummary.totalProfit)}</p>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  )
}
