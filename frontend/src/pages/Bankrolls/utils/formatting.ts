import { format, parse } from "date-fns"

/**
 * Formata uma data de banca (dd/MM/yyyy ou ISO) para exibição
 */
export const formatBankrollDate = (dateStr: string): string => {
  try {
    // Try parsing as dd/MM/yyyy format first (backend format)
    const parsedDate = parse(dateStr, "dd/MM/yyyy", new Date())
    if (!isNaN(parsedDate.getTime())) {
      return format(parsedDate, "dd/MM/yyyy")
    }

    // Fallback: try ISO format
    const isoDate = new Date(dateStr)
    if (!isNaN(isoDate.getTime())) {
      return format(isoDate, "dd/MM/yyyy")
    }

    // If both fail, return the original string
    return dateStr
  } catch (error) {
    console.error("Error parsing date:", dateStr, error)
    return dateStr
  }
}
