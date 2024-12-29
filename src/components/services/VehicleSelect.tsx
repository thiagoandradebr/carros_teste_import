import { useState } from "react";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDrivers } from "@/contexts/DriversContext";
import { useVehicles } from "@/contexts/VehiclesContext";
import { useModals } from "@/contexts/ModalsContext";
import { BudgetVehicle } from "@/types/budget";
import { formatCurrency } from "@/lib/utils";
import { QuickAddPopover } from "./QuickAddPopover";

interface VehicleSelectProps {
  vehicles: BudgetVehicle[];
  onAddVehicle?: (vehicle: BudgetVehicle) => void;
  onRemoveVehicle: (vehicleId: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function VehicleSelect({
  vehicles,
  onAddVehicle,
  onRemoveVehicle,
  onNext,
  onBack,
}: VehicleSelectProps) {
  const { drivers } = useDrivers();
  const { vehicles: availableVehicles } = useVehicles();
  const { openNewVehicle } = useModals();
  const [searchTerm, setSearchTerm] = useState("");

  // Filtra veículos disponíveis que não foram adicionados ainda
  const filteredVehicles = availableVehicles.filter(
    (vehicle) =>
      !vehicles.some(v => v.vehicleId === vehicle.id) &&
      (
        vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div className="space-y-6">
      {/* Seção de Seleção de Veículo */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Selecionar Veículo</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={openNewVehicle}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Novo Veículo
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                placeholder="Buscar por marca, modelo ou placa"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          <ScrollArea className="h-[300px] pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredVehicles.length > 0 ? (
                filteredVehicles.map((vehicle) => (
                  <Card
                    key={vehicle.id}
                    className="relative"
                  >
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {vehicle.brand} {vehicle.model}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Placa: {vehicle.plate}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Ano: {vehicle.year}
                        </div>
                      </div>
                      <QuickAddPopover
                        vehicle={vehicle}
                        onAdd={onAddVehicle!}
                        drivers={drivers}
                      />
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  Nenhum veículo encontrado com os critérios de busca.
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Lista de Veículos Selecionados */}
      {vehicles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Veículos Selecionados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vehicles.map((budgetVehicle) => (
                <Card key={budgetVehicle.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="font-medium">
                          {budgetVehicle.vehicleDetails.brand} {budgetVehicle.vehicleDetails.model}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Placa: {budgetVehicle.vehicleDetails.plate}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Motorista: {budgetVehicle.driverDetails.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Período: {format(new Date(budgetVehicle.startDate), "dd/MM/yyyy")} - {format(new Date(budgetVehicle.endDate), "dd/MM/yyyy")}
                        </div>
                        <div className="text-sm font-medium">
                          Diária: {formatCurrency(budgetVehicle.dailyRate)}
                        </div>
                        <div className="text-sm font-medium">
                          Hora Extra: {formatCurrency(budgetVehicle.overtimeRate)}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveVehicle(budgetVehicle.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        Remover
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={onBack}>
                  Voltar
                </Button>
                <Button onClick={onNext} disabled={vehicles.length === 0}>
                  Continuar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
