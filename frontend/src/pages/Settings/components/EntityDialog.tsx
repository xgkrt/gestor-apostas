import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { BaseDTO, EntityDialogProps } from "../types";

/**
 * Componente genérico de dialog para criar/editar entidades
 * Recebe os campos do formulário via children (composition pattern)
 * 
 * @template TDto - Tipo do DTO usado no formulário
 */
export function EntityDialog<TDto extends BaseDTO>({
  open,
  onOpenChange,
  title,
  onSubmit,
  onCancel,
  isPending,
  isEditing,
  children,
}: EntityDialogProps<TDto>) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="space-y-4 py-4">
            {children}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Salvar" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
