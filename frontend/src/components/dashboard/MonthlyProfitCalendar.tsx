import { useMemo, useState } from "react"
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  parse,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Bet } from "@/types"

interface MonthlyProfitCalendarProps {
  bets: Bet[]
}

interface CalendarDay {
  date: Date
  profit: number
  hasBets: boolean
  isCurrentMonth: boolean
}

const WEEK_DAYS = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"]
const UNIT_VALUE = 50

function parseBetDate(value: string): Date | null {
  const brDate = parse(value, "dd/MM/yyyy", new Date())
  if (!Number.isNaN(brDate.getTime())) {
    return brDate
  }

  const isoDate = parseISO(value)
  if (!Number.isNaN(isoDate.getTime())) {
    return isoDate
  }

  const fallback = new Date(value)
  if (!Number.isNaN(fallback.getTime())) {
    return fallback
  }

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

export function MonthlyProfitCalendar({ bets }: MonthlyProfitCalendarProps) {
  const [visibleMonth, setVisibleMonth] = useState<Date>(startOfMonth(new Date()))

  const dailyProfitMap = useMemo(() => {
    const map = new Map<string, { profit: number; count: number }>()

    for (const bet of bets) {
      if (bet.status === "PENDING") {
        continue
      }

      const parsedDate = parseBetDate(bet.betDate)
      if (!parsedDate) {
        continue
      }

      const key = format(parsedDate, "yyyy-MM-dd")
      const current = map.get(key)

      if (current) {
        map.set(key, { profit: current.profit + bet.profit, count: current.count + 1 })
      } else {
        map.set(key, { profit: bet.profit, count: 1 })
      }
    }

    return map
  }, [bets])

  const days = useMemo(() => {
    const monthStart = startOfMonth(visibleMonth)
    const monthEnd = endOfMonth(visibleMonth)
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 })
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })

    const output: CalendarDay[] = []
    let cursor = gridStart

    while (cursor <= gridEnd) {
      const key = format(cursor, "yyyy-MM-dd")
      const dayData = dailyProfitMap.get(key)

      output.push({
        date: cursor,
        profit: dayData?.profit ?? 0,
        hasBets: Boolean(dayData),
        isCurrentMonth: isSameMonth(cursor, visibleMonth),
      })

      cursor = addDays(cursor, 1)
    }

    return output
  }, [dailyProfitMap, visibleMonth])

  return (
    <Card className="rounded-2xl border border-border bg-card text-card-foreground p-4 sm:rounded-3xl sm:p-6 md:p-8">
      <div className="mb-4 flex items-center justify-between gap-3 sm:mb-6 sm:gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-muted p-2 text-muted-foreground">
            <CalendarDays className="h-5 w-5" />
          </div>
          <h4 className="text-base font-semibold text-foreground capitalize sm:text-xl">
            {format(visibleMonth, "MMMM yyyy", { locale: ptBR })}
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setVisibleMonth((month) => subMonths(month, 1))}
            className="h-9 w-9 rounded-xl sm:h-10 sm:w-10"
            aria-label="Mes anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setVisibleMonth((month) => addMonths(month, 1))}
            className="h-9 w-9 rounded-xl sm:h-10 sm:w-10"
            aria-label="Proximo mes"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border">
        <div className="grid grid-cols-7 bg-muted/50">
          {WEEK_DAYS.map((day) => (
            <div
              key={day}
              className="h-9 border-r border-border text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground last:border-r-0 flex items-center justify-center sm:h-11 sm:text-xs"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            const isLastColumn = index % 7 === 6
            const isLastRow = index >= days.length - 7
            const profitPositive = day.profit > 0
            const profitNegative = day.profit < 0
            const dayBackgroundClass = !day.isCurrentMonth
              ? "bg-muted/40 dark:bg-muted/30"
              : day.hasBets && profitPositive
                ? "bg-emerald-50 dark:bg-emerald-950/45"
                : day.hasBets && profitNegative
                  ? "bg-red-50 dark:bg-rose-950/45"
                  : "bg-card"

            return (
              <div
                key={format(day.date, "yyyy-MM-dd")}
                className={[
                  "min-h-[74px] p-1.5 sm:min-h-[98px] sm:p-2 md:p-3",
                  !isLastColumn ? "border-r border-border" : "",
                  !isLastRow ? "border-b border-border" : "",
                  dayBackgroundClass,
                ].join(" ")}
              >
                <div className="flex h-full flex-col">
                  <div
                    className={day.isCurrentMonth ? "text-xs font-semibold text-foreground sm:text-sm" : "text-xs font-semibold text-muted-foreground sm:text-sm"}
                  >
                    {format(day.date, "d")}
                  </div>

                  {day.isCurrentMonth && day.hasBets ? (
                    <div className="mt-1 flex flex-1 flex-col items-center justify-center space-y-0.5 text-center sm:mt-2 sm:space-y-1">
                      <p
                        className={[
                          "max-w-full truncate text-[11px] impact-money sm:text-base",
                          profitPositive ? "text-emerald-700 dark:text-emerald-300" : "",
                          profitNegative ? "text-red-700 dark:text-rose-300" : "",
                          !profitPositive && !profitNegative ? "text-muted-foreground" : "",
                        ].join(" ")}
                      >
                        {profitPositive ? "+" : ""}
                        {formatCurrency(day.profit)}
                      </p>
                      <p
                        className={[
                          "max-w-full truncate text-[10px] impact-value sm:text-xs",
                          profitPositive ? "text-emerald-700 dark:text-emerald-300" : "",
                          profitNegative ? "text-red-700 dark:text-rose-300" : "",
                          !profitPositive && !profitNegative ? "text-muted-foreground" : "",
                        ].join(" ")}
                      >
                        {formatUnits(day.profit)}
                      </p>
                    </div>
                  ) : day.isCurrentMonth ? (
                    <div className="mt-2 flex flex-1 items-center justify-center text-xs text-muted-foreground/60">-</div>
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}
