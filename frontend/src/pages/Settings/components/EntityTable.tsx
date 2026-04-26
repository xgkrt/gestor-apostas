import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import type { BaseEntity, EntityTableProps } from "../types";

/**
 * Componente genérico de tabela para exibir entidades CRUD
 * Renderiza colunas dinâmicas + ações de editar e excluir
 * 
 * @template TEntity - Tipo da entidade a ser exibida
 */
export function EntityTable<TEntity extends BaseEntity>({
  data,
  columns,
  emptyMessage,
  onEdit,
  onDelete,
}: EntityTableProps<TEntity>) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column, index) => (
            column.label && (
              <TableHead key={index}>{column.label}</TableHead>
            )
          ))}
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((entity) => (
          <TableRow key={entity.id}>
            {columns.map((column, index) => (
              <TableCell 
                key={index} 
                className={index === 0 ? "font-medium" : ""}
              >
                {column.render 
                  ? column.render(entity) 
                  : String(entity[column.key as keyof TEntity])}
              </TableCell>
            ))}
            <TableCell className="text-right space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(entity)}
                aria-label={`Editar ${entity.name}`}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(entity)}
                aria-label={`Excluir ${entity.name}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
        {!data?.length && (
          <TableRow>
            <TableCell 
              colSpan={columns.length + 1} 
              className="text-center text-muted-foreground"
            >
              {emptyMessage}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
