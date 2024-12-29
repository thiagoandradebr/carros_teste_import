import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Customer } from "@/types/customer";

interface CustomerDashboardProps {
  customers: Customer[];
}

export function CustomerDashboard({ customers }: CustomerDashboardProps) {
  // Cálculo de métricas
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'active').length;
  const pfCustomers = customers.filter(c => c.type === 'pf').length;
  const pjCustomers = customers.filter(c => c.type === 'pj').length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCustomers}</div>
          <p className="text-xs text-muted-foreground">
            Clientes cadastrados no sistema
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeCustomers}</div>
          <p className="text-xs text-muted-foreground">
            {((activeCustomers / totalCustomers) * 100).toFixed(1)}% do total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pessoa Física</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pfCustomers}</div>
          <p className="text-xs text-muted-foreground">
            {((pfCustomers / totalCustomers) * 100).toFixed(1)}% do total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pessoa Jurídica</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pjCustomers}</div>
          <p className="text-xs text-muted-foreground">
            {((pjCustomers / totalCustomers) * 100).toFixed(1)}% do total
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
