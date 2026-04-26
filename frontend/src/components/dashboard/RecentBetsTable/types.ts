import type { Bet } from "@/types"

export type RecentBetsStatusFilter = "ALL" | "GREEN" | "RED" | "PENDING" | "VOID"

export interface RecentBetsTableProps {
  bets: Bet[]
  onViewAll?: () => void
}

export interface RecentBetsTableState {
  betToDelete: Bet | null
  searchTerm: string
  statusFilter: RecentBetsStatusFilter
  currentPage: number
  filteredBets: Bet[]
  paginatedBets: Bet[]
  totalPages: number
}

export const PAGE_SIZE = 5
