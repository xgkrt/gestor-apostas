import { useEffect, useMemo, useState } from "react"
import { format, endOfMonth, startOfMonth, subDays } from "date-fns"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"

type PeriodValue =
  | "today"
  | "7d"
  | "15d"
  | "30d"
  | "90d"
  | "this_month"
  | "this_year"
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

const monthOptions: Array<{ value: PeriodValue; label: string }> = [
  { value: "month-1", label: "Janeiro" },
  { value: "month-2", label: "Fevereiro" },
  { value: "month-3", label: "Marco" },
  { value: "month-4", label: "Abril" },
  { value: "month-5", label: "Maio" },
  { value: "month-6", label: "Junho" },
  { value: "month-7", label: "Julho" },
  { value: "month-8", label: "Agosto" },
  { value: "month-9", label: "Setembro" },
  { value: "month-10", label: "Outubro" },
  { value: "month-11", label: "Novembro" },
  { value: "month-12", label: "Dezembro" },
]

function toApiDate(date: Date) {
  return format(date, "yyyy-MM-dd")
}

function getRange(
  period: PeriodValue,
  selectedYear: number,
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

  if (period === "15d") {
    return { startDate: toApiDate(subDays(today, 14)), endDate: toApiDate(today) }
  }

  if (period === "30d") {
    return { startDate: toApiDate(subDays(today, 29)), endDate: toApiDate(today) }
  }

  if (period === "90d") {
    return { startDate: toApiDate(subDays(today, 89)), endDate: toApiDate(today) }
  }

  if (period === "this_month") {
    return {
      startDate: toApiDate(startOfMonth(today)),
      endDate: toApiDate(endOfMonth(today)),
    }
  }

  if (period === "this_year") {
    return {
      startDate: `${today.getFullYear()}-01-01`,
      endDate: `${today.getFullYear()}-12-31`,
    }
  }

  if (period.startsWith("month-")) {
    const monthNumber = Number(period.split("-")[1])
    const monthDate = new Date(selectedYear, monthNumber - 1, 1)

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

export function getDefaultDashboardDateFilter(): DashboardDateFilter {
  const period: PeriodValue = "this_month"
  const range = getRange(period, new Date().getFullYear(), "", "")

  return {
    period,
    startDate: range.startDate,
    endDate: range.endDate,
  }
}

export function PeriodFilter({ defaultPeriod = "this_month", onChange }: PeriodFilterProps) {
  const [period, setPeriod] = useState<PeriodValue>(defaultPeriod)
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const [customStartDate, setCustomStartDate] = useState("")
  const [customEndDate, setCustomEndDate] = useState("")

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear()
    return Array.from({ length: 8 }, (_, index) => currentYear - 4 + index)
  }, [])

  useEffect(() => {
    const range = getRange(period, selectedYear, customStartDate, customEndDate)
    onChange({
      period,
      startDate: range.startDate,
      endDate: range.endDate,
    })
  }, [period, selectedYear, customStartDate, customEndDate, onChange])

  return (
    <div className="flex flex-wrap items-end gap-2">
      <div className="w-[210px]">
        <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Periodo
        </label>
        <Select value={period} onValueChange={(value) => setPeriod(value as PeriodValue)}>
          <SelectTrigger className="h-10 rounded-xl border-border bg-card text-foreground">
            <SelectValue placeholder="Selecione o periodo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Hoje</SelectItem>
            <SelectItem value="7d">Ultimos 7 dias</SelectItem>
            <SelectItem value="15d">Ultimos 15 dias</SelectItem>
            <SelectItem value="30d">Ultimos 30 dias</SelectItem>
            <SelectItem value="90d">Ultimos 90 dias</SelectItem>
            <SelectItem value="this_month">Este mes</SelectItem>
            <SelectItem value="this_year">Este ano</SelectItem>
            {monthOptions.map((month) => (
              <SelectItem key={month.value} value={month.value}>
                {month.label}
              </SelectItem>
            ))}
            <SelectItem value="all">Tudo</SelectItem>
            <SelectItem value="custom">Personalizado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {period.startsWith("month-") && (
        <div className="w-[110px]">
          <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Ano
          </label>
          <Select value={String(selectedYear)} onValueChange={(value) => setSelectedYear(Number(value))}>
            <SelectTrigger className="h-10 rounded-xl border-border bg-card text-foreground">
              <SelectValue />
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
      )}

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
