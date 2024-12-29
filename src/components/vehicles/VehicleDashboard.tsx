import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Vehicle, VehicleStatus } from "@/types/vehicle";
import { useVehicles } from "@/contexts/VehiclesContext";

export function VehicleDashboard() {
  const { vehicles } = useVehicles();

  // Cálculo de métricas
  const totalVehicles = vehicles.length;
  const activeVehicles = vehicles.filter(v => v.status === 'active').length;
  const maintenanceVehicles = vehicles.filter(v => v.status === 'maintenance').length;
  const inactiveVehicles = vehicles.filter(v => v.status === 'inactive').length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Veículos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalVehicles}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ativos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeVehicles}</div>
          <p className="text-xs text-muted-foreground">
            {((activeVehicles / totalVehicles) * 100).toFixed(1)}% da frota
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Em Manutenção</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{maintenanceVehicles}</div>
          <p className="text-xs text-muted-foreground">
            {((maintenanceVehicles / totalVehicles) * 100).toFixed(1)}% da frota
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Inativos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{inactiveVehicles}</div>
          <p className="text-xs text-muted-foreground">
            {((inactiveVehicles / totalVehicles) * 100).toFixed(1)}% da frota
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
