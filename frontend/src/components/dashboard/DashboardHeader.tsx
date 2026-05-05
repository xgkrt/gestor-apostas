import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { ReactNode } from "react"

interface DashboardHeaderProps {
  onNewBet?: () => void
  rightContent?: ReactNode
}

export function DashboardHeader({ onNewBet, rightContent }: DashboardHeaderProps) {
  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">
          Visão Geral da Banca
        </h2>
      </div>

      <div className="flex w-full flex-wrap items-center justify-end gap-3 lg:w-auto">
        {rightContent}

        {onNewBet && (
          <Button
            onClick={onNewBet}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all duration-200 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">Nova Aposta</span>
          </Button>
        )}
      </div>
    </header>
  )
}
