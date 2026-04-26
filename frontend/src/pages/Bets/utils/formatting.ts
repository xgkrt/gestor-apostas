import { format, parse } from "date-fns"
import type { BetStatus } from "@/types"

/**
 * Formata uma data de aposta (dd/MM/yyyy ou ISO) para exibição
 */
export const formatBetDate = (dateStr: string): string => {
  try {
    const parsedDate = parse(dateStr, "dd/MM/yyyy", new Date())
    if (!isNaN(parsedDate.getTime())) {
      return format(parsedDate, "dd/MM/yyyy")
    }

    const isoDate = new Date(dateStr)
    if (!isNaN(isoDate.getTime())) {
      return format(isoDate, "dd/MM/yyyy")
    }

    return dateStr
  } catch (error) {
    console.error("Error parsing date:", dateStr, error)
    return dateStr
  }
}

/**
 * Retorna classes CSS para o badge de status
 */
export const getStatusClasses = (status: BetStatus): string => {
  if (status === "GREEN" || status === "HALF_GREEN") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:text-emerald-300 impact-status"
  }

  if (status === "PENDING") {
    return "border-yellow-200 bg-yellow-50 text-yellow-700 dark:text-yellow-300 impact-status"
  }

  if (status === "VOID") {
    return "border-border bg-muted text-muted-foreground impact-status"
  }

  return "border-red-200 bg-red-50 text-red-700 dark:text-rose-300 impact-status"
}

/**
 * Retorna classes CSS para o texto de lucro
 */
export const getProfitClasses = (profit: number): string => {
  return profit >= 0 
    ? "text-sm impact-money text-emerald-600 dark:text-emerald-300" 
    : "text-sm impact-money text-red-600 dark:text-rose-300"
}
