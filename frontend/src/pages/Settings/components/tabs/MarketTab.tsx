import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus } from "lucide-react";
import {
  useMarkets,
  useCreateMarket,
  useUpdateMarket,
  useDeleteMarket,
} from "@/services/queries";
import type { Market, MarketDTO } from "@/types";
import { useCrudEntity } from "../../hooks/useCrudEntity";
import { EntityTable } from "../EntityTable";
import { EntityDialog } from "../EntityDialog";
import { DeleteConfirmDialog } from "../DeleteConfirmDialog";

export function MarketTab() {
  const { data: markets, isLoading } = useMarkets();
  const createMarket = useCreateMarket();
  const updateMarket = useUpdateMarket();
  const deleteMarket = useDeleteMarket();

  const {
    dialogOpen,
    editingEntity,
    formData,
    deleteDialogOpen,
    entityToDelete,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleCloseDialog,
    openDeleteDialog,
    setFormData,
    setDialogOpen,
  } = useCrudEntity<Market, MarketDTO>({
    entityName: "mercado",
    entityNamePlural: "mercados",
    data: markets,
    isLoading,
    createMutation: createMarket,
    updateMutation: updateMarket,
    deleteMutation: deleteMarket,
    initialFormData: { name: "" },
    successMessages: {
      create: "Mercado criado com sucesso!",
      update: "Mercado atualizado com sucesso!",
      delete: "Mercado excluído com sucesso!",
    },
    errorMessages: {
      create: "Erro ao criar mercado",
      update: "Erro ao atualizar mercado",
      delete: "Este mercado está sendo usado em apostas",
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Mercados</CardTitle>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Mercado
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <EntityTable
            data={markets}
            columns={[{ key: "name", label: "Nome" }]}
            emptyMessage="Nenhum mercado cadastrado"
            onEdit={handleEdit}
            onDelete={openDeleteDialog}
          />
        </CardContent>
      </Card>

      <EntityDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editingEntity ? "Editar Mercado" : "Novo Mercado"}
        formData={formData}
        onSubmit={handleSubmit}
        onCancel={handleCloseDialog}
        isPending={createMarket.isPending || updateMarket.isPending}
        isEditing={!!editingEntity}
      >
        <div className="space-y-2">
          <Label htmlFor="name">Nome do Mercado</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ name: e.target.value })}
            placeholder="Ex: Resultado Final, Over/Under, Ambas Marcam"
            required
          />
        </div>
      </EntityDialog>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={(open: boolean) => {
          if (!open) handleCloseDialog();
        }}
        entityName="o mercado"
        entityDisplayName={entityToDelete?.name || ""}
        onConfirm={handleDelete}
        onCancel={() => handleCloseDialog()}
        isPending={deleteMarket.isPending}
      />
    </>
  );
}
