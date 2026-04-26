import { lazy } from "react"

/**
 * Lazy-loaded chart components for better code splitting
 * These heavy components (recharts library) will only be loaded when needed
 */

export const BankrollEvolutionChart = lazy(() => 
  import("./BankrollEvolutionChart").then(module => ({
    default: module.BankrollEvolutionChart
  }))
)

export const ProfitByBookmaker = lazy(() => 
  import("./ProfitByBookmaker").then(module => ({
    default: module.ProfitByBookmaker
  }))
)

export const ProfitByTipster = lazy(() => 
  import("./ProfitByTipster").then(module => ({
    default: module.ProfitByTipster
  }))
)
