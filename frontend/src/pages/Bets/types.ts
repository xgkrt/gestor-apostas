import type { Bet, BetDTO, BetStatus, Bookmaker, Market, Sport, Tipster } from "@/types"

export type BetsStatusFilter = "ALL" | "GREEN" | "RED" | "PENDING" | "VOID"

/**
 * Estado do hook useBetsPage
 */
export interface BetsPageState {
  // Estados do dialog de edição
  editDialogOpen: boolean
  betToEdit: Bet | null
  editFormData: Partial<BetDTO>
  
  // Estados de deleção
  deleteConfirmOpen: boolean
  betToDelete: number | null
  
  // Estados de filtros e paginação
  searchTerm: string
  statusFilter: BetsStatusFilter
  sportFilter: string
  marketFilter: string
  bookmakerFilter: string
  tipsterFilter: string
  startDate: string
  endDate: string
  currentPage: number
  
  // Dados computados
  filteredBets: Bet[]
  paginatedBets: Bet[]
  totalPages: number
}

/**
 * Handlers retornados pelo hook useBetsPage
 */
export interface BetsPageHandlers {
  // Edição
  handleEditClick: (bet: Bet) => void
  handleEditDialogChange: (open: boolean) => void
  handleSaveEdit: (event: React.FormEvent) => Promise<void>
  setEditFormData: React.Dispatch<React.SetStateAction<Partial<BetDTO>>>
  
  // Deleção
  handleDeleteClick: (id: number) => void
  handleConfirmDelete: () => Promise<void>
  setDeleteConfirmOpen: React.Dispatch<React.SetStateAction<boolean>>
  
  // Status
  handleStatusChange: (betId: number, status: BetStatus) => void
  
  // Filtros e paginação
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>
  setStatusFilter: React.Dispatch<React.SetStateAction<BetsStatusFilter>>
  setSportFilter: React.Dispatch<React.SetStateAction<string>>
  setMarketFilter: React.Dispatch<React.SetStateAction<string>>
  setBookmakerFilter: React.Dispatch<React.SetStateAction<string>>
  setTipsterFilter: React.Dispatch<React.SetStateAction<string>>
  setStartDate: React.Dispatch<React.SetStateAction<string>>
  setEndDate: React.Dispatch<React.SetStateAction<string>>
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
}

/**
 * Props para o componente BetsTable
 */
export interface BetsTableProps {
  paginatedBets: Bet[]
  filteredBets: Bet[]
  currentPage: number
  totalPages: number
  isLoading: boolean
  onEditClick: (bet: Bet) => void
  onDeleteClick: (id: number) => void
  onStatusChange: (betId: number, status: BetStatus) => void
  onPageChange: (page: number) => void
  isUpdatingStatus: boolean
  isUpdatingBet: boolean
}

/**
 * Props para o componente BetEditDialog
 */
export interface BetEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  betToEdit: Bet | null
  formData: Partial<BetDTO>
  setFormData: React.Dispatch<React.SetStateAction<Partial<BetDTO>>>
  onSubmit: (event: React.FormEvent) => Promise<void>
  isPending: boolean
}

/**
 * Props para o componente BetsFilters
 */
export interface BetsFiltersProps {
  searchTerm: string
  statusFilter: BetsStatusFilter
  sportFilter: string
  marketFilter: string
  bookmakerFilter: string
  tipsterFilter: string
  startDate: string
  endDate: string
  sports?: Sport[]
  markets?: Market[]
  bookmakers?: Bookmaker[]
  tipsters?: Tipster[]
  onSearchChange: (value: string) => void
  onStatusFilterChange: (value: BetsStatusFilter) => void
  onSportFilterChange: (value: string) => void
  onMarketFilterChange: (value: string) => void
  onBookmakerFilterChange: (value: string) => void
  onTipsterFilterChange: (value: string) => void
  onStartDateChange: (value: string) => void
  onEndDateChange: (value: string) => void
}

/**
 * Constantes
 */
export const PAGE_SIZE = 10

export const STATUS_LABELS: Record<BetStatus, string> = {
  PENDING: "Pending",
  GREEN: "Green",
  RED: "Red",
  VOID: "Void",
  HALF_GREEN: "Half Green",
  HALF_RED: "Half Red",
}

export const ALL_STATUSES: BetStatus[] = [
  "PENDING",
  "GREEN",
  "RED",
  "VOID",
  "HALF_GREEN",
  "HALF_RED",
]
