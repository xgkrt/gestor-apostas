import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBankrolls } from "@/services/queries";
import { DASHBOARD_PREFERRED_BANKROLL_KEY } from "@/constants/dashboard";
import { SportTab } from "./Settings/components/tabs/SportTab";
import { ChampionshipTab } from "./Settings/components/tabs/ChampionshipTab";
import { MarketTab } from "./Settings/components/tabs/MarketTab";
import { BookmakerTab } from "./Settings/components/tabs/BookmakerTab";
import { TipsterTab } from "./Settings/components/tabs/TipsterTab";

/**
 * Página de Configurações
 * Container principal que organiza as 5 abas de gerenciamento de entidades
 * 
 * Arquitetura:
 * - Container pattern: Este componente apenas monta o layout
 * - Lógica de negócio: Delegada para custom hook useCrudEntity
 * - UI Components: Componentizados em EntityTable, EntityDialog, DeleteConfirmDialog
 * - Tabs: Cada entidade tem seu próprio componente de tab
 */
const Settings = () => {
  const { data: bankrolls } = useBankrolls();
  const [preferredBankrollId, setPreferredBankrollId] = useState("");

  useEffect(() => {
    if (!bankrolls || bankrolls.length === 0) {
      setPreferredBankrollId("");
      return;
    }

    const storedValue = window.localStorage.getItem(DASHBOARD_PREFERRED_BANKROLL_KEY);
    const hasStoredValidBankroll = storedValue
      ? bankrolls.some((bankroll) => bankroll.id === Number(storedValue))
      : false;

    if (storedValue && hasStoredValidBankroll) {
      setPreferredBankrollId(storedValue);
      return;
    }

    const fallbackId = String(bankrolls[0].id);
    setPreferredBankrollId(fallbackId);
    window.localStorage.setItem(DASHBOARD_PREFERRED_BANKROLL_KEY, fallbackId);
  }, [bankrolls]);

  const handlePreferredBankrollChange = (value: string) => {
    setPreferredBankrollId(value);
    window.localStorage.setItem(DASHBOARD_PREFERRED_BANKROLL_KEY, value);
  };

  return (
    <div className="p-0">
      <h1 className="mb-4 text-2xl font-bold sm:mb-6 sm:text-3xl">Configurações</h1>

      <div className="mb-6 rounded-2xl border border-border bg-card p-4 text-card-foreground">
        <p className="text-sm font-semibold text-foreground">Preferências do Dashboard</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Define qual banca será usada por padrão no Dashboard.
        </p>

        <div className="mt-4 w-full max-w-sm space-y-2">
          <Label htmlFor="settings-dashboard-bankroll" className="text-xs font-semibold text-muted-foreground">
            Banca padrão do Dashboard
          </Label>
          <Select
            value={preferredBankrollId}
            onValueChange={handlePreferredBankrollChange}
            disabled={!bankrolls || bankrolls.length === 0}
          >
            <SelectTrigger id="settings-dashboard-bankroll" className="bg-card border-border text-foreground">
              <SelectValue placeholder="Selecione uma banca" />
            </SelectTrigger>
            <SelectContent>
              {bankrolls?.map((bankroll) => (
                <SelectItem key={bankroll.id} value={String(bankroll.id)}>
                  {bankroll.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs defaultValue="sports" className="space-y-4">
        <div className="overflow-x-auto pb-1">
        <TabsList className="grid min-w-[720px] grid-cols-5 sm:min-w-0 sm:w-full">
          <TabsTrigger value="sports">Esportes</TabsTrigger>
          <TabsTrigger value="championships">Campeonatos</TabsTrigger>
          <TabsTrigger value="markets">Mercados</TabsTrigger>
          <TabsTrigger value="bookmakers">Casas de Apostas</TabsTrigger>
          <TabsTrigger value="tipsters">Tipsters</TabsTrigger>
        </TabsList>
        </div>
        
        <TabsContent value="sports">
          <SportTab />
        </TabsContent>
        
        <TabsContent value="championships">
          <ChampionshipTab />
        </TabsContent>
        
        <TabsContent value="markets">
          <MarketTab />
        </TabsContent>
        
        <TabsContent value="bookmakers">
          <BookmakerTab />
        </TabsContent>
        
        <TabsContent value="tipsters">
          <TipsterTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
