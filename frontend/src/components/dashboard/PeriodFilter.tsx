import { useEffect, useState } from "react"
import { addMonths, format, endOfMonth, startOfMonth, subDays, subMonths } from "date-fns"
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type PeriodValue =
  | "today"
  | "7d"
  | "all"
  | "custom"
  | `month-${number}`

export interface DashboardDateFilter {
  period: PeriodValue
  startDate?: string
  endDate?: string
}

interface PeriodFilterProps {
  defaultPeriod?: PeriodValue
  onChange: (filter: DashboardDateFilter) => void
}

const monthNames = [
  "Janeiro",
  "Fevereiro",
  "Marco",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
]

function getCurrentYear() {
  return new Date().getFullYear()
}

function getCurrentMonthPeriod(): PeriodValue {
  return `month-${new Date().getMonth() + 1}` as PeriodValue
}

function getMonthOptions(): Array<{ value: PeriodValue; label: string }> {
  const currentYear = getCurrentYear()

  return monthNames.map((monthName, index) => ({
    value: `month-${index + 1}` as PeriodValue,
    label: `${monthName} de ${currentYear}`,
  }))
}

function toApiDate(date: Date) {
  return format(date, "yyyy-MM-dd")
}

function getRange(
  period: PeriodValue,
  customStartDate: string,
  customEndDate: string
): { startDate?: string; endDate?: string } {
  const today = new Date()

  if (period === "all") {
    return {}
  }

  if (period === "today") {
    const date = toApiDate(today)
    return { startDate: date, endDate: date }
  }

  if (period === "7d") {
    return { startDate: toApiDate(subDays(today, 6)), endDate: toApiDate(today) }
  }

  if (period.startsWith("month-")) {
    const monthNumber = Number(period.split("-")[1])
    const monthDate = new Date(getCurrentYear(), monthNumber - 1, 1)

    return {
      startDate: toApiDate(startOfMonth(monthDate)),
      endDate: toApiDate(endOfMonth(monthDate)),
    }
  }

  if (period === "custom") {
    if (!customStartDate || !customEndDate) {
      return {}
    }

    if (customStartDate <= customEndDate) {
      return { startDate: customStartDate, endDate: customEndDate }
    }

    return { startDate: customEndDate, endDate: customStartDate }
  }

  return {}
}

function getSelectedMonthDate(period: PeriodValue): Date | null {
  if (!period.startsWith("month-")) {
    return null
  }

  const monthNumber = Number(period.split("-")[1])
  return new Date(getCurrentYear(), monthNumber - 1, 1)
}

export function getDefaultDashboardDateFilter(): DashboardDateFilter {
  const period = getCurrentMonthPeriod()
  const range = getRange(period, "", "")

  return {
    period,
    startDate: range.startDate,
    endDate: range.endDate,
  }
}

export function PeriodFilter({ defaultPeriod = getCurrentMonthPeriod(), onChange }: PeriodFilterProps) {
  const [period, setPeriod] = useState<PeriodValue>(defaultPeriod)
  const [customStartDate, setCustomStartDate] = useState("")
  const [customEndDate, setCustomEndDate] = useState("")

  useEffect(() => {
    const range = getRange(period, customStartDate, customEndDate)
    onChange({
      period,
      startDate: range.startDate,
      endDate: range.endDate,
    })
  }, [period, customStartDate, customEndDate, onChange])

  const selectedMonthDate = getSelectedMonthDate(period)
  const canNavigateMonths = Boolean(selectedMonthDate)
  const selectedMonthNumber = selectedMonthDate ? selectedMonthDate.getMonth() + 1 : null
  const canNavigatePreviousMonth = canNavigateMonths && selectedMonthNumber !== 1
  const canNavigateNextMonth = canNavigateMonths && selectedMonthNumber !== 12

  const handlePreviousMonth = () => {
    if (!selectedMonthDate || !canNavigatePreviousMonth) return

    const previousMonth = subMonths(selectedMonthDate, 1)
    setPeriod(`month-${previousMonth.getMonth() + 1}` as PeriodValue)
  }

  const handleNextMonth = () => {
    if (!selectedMonthDate || !canNavigateNextMonth) return

    const nextMonth = addMonths(selectedMonthDate, 1)
    setPeriod(`month-${nextMonth.getMonth() + 1}` as PeriodValue)
  }

  return (
    <div className="flex flex-wrap items-end gap-2">
      <div className="grid w-full min-w-[320px] grid-cols-[44px_minmax(220px,1fr)_44px] items-center overflow-hidden rounded-xl border border-border bg-card text-foreground shadow-sm sm:w-auto">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handlePreviousMonth}
          disabled={!canNavigatePreviousMonth}
          className="h-11 rounded-none border-r border-border"
          aria-label="Mes anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Select value={period} onValueChange={(value) => setPeriod(value as PeriodValue)}>
          <SelectTrigger
            className="h-11 rounded-none border-0 bg-card px-3 text-foreground shadow-none focus:ring-0"
            aria-label="Periodo"
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />
              <SelectValue placeholder="Selecione o periodo" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tudo</SelectItem>
            <SelectItem value="today">Hoje</SelectItem>
            <SelectItem value="7d">Ultimos 7 dias</SelectItem>
            {getMonthOptions().map((month) => (
              <SelectItem key={month.value} value={month.value}>
                {month.label}
              </SelectItem>
            ))}
            <SelectItem value="custom">Personalizado</SelectItem>
          </SelectContent>
        </Select>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleNextMonth}
          disabled={!canNavigateNextMonth}
          className="h-11 rounded-none border-l border-border"
          aria-label="Proximo mes"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {period === "custom" && (
        <>
          <div className="w-[150px]">
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Inicio
            </label>
            <Input
              type="date"
              value={customStartDate}
              onChange={(event) => setCustomStartDate(event.target.value)}
              className="h-10 rounded-xl border-border bg-card text-foreground"
            />
          </div>

          <div className="w-[150px]">
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Fim
            </label>
            <Input
              type="date"
              value={customEndDate}
              onChange={(event) => setCustomEndDate(event.target.value)}
              className="h-10 rounded-xl border-border bg-card text-foreground"
            />
          </div>
        </>
      )}
    </div>
  )
}
