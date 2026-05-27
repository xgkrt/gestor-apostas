import type { ReactNode } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: ReactNode
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  variant?: "default" | "destructive"
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  variant = "default",
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border-slate-200 text-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-slate-900 text-xl font-bold">
            {variant === "destructive" && (
              <AlertTriangle className="h-6 w-6 text-red-600" />
            )}
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 text-slate-700">
          {description}
        </div>

        <DialogFooter className="gap-2 sm:flex-row sm:gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 bg-transparent border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl h-11"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            className={
              variant === "destructive"
                ? "flex-1 bg-red-600 text-white hover:bg-red-700 rounded-xl h-11 font-semibold"
                : "flex-1 bg-blue-600 text-white hover:bg-blue-700 rounded-xl h-11 font-semibold"
            }
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
