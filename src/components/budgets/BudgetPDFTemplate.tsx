import { Budget } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { mockCustomers } from "@/mocks/customers";
import { mockVehicles } from "@/mocks/vehicles";
import { mockSettings } from "@/mocks/settings";

interface BudgetPDFTemplateProps {
  budget: Budget;
}

export function BudgetPDFTemplate({ budget }: BudgetPDFTemplateProps) {
  const customer = mockCustomers.find((c) => c.id === budget.customerId);
  const settings = mockSettings;

  return (
    <div className="p-8 bg-white" id="budget-pdf">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Orçamento #{budget.id}</h1>
        <p className="text-gray-500">Data: {formatDate(budget.createdAt)}</p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Dados do Cliente</h2>
        <p>Nome: {customer?.name || "Cliente não encontrado"}</p>
        <p>Email: {customer?.email || "N/A"}</p>
        <p>Telefone: {customer?.phone || "N/A"}</p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Veículos</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Veículo</th>
              <th className="text-left py-2">Período</th>
              <th className="text-left py-2">Diária</th>
              <th className="text-right py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {budget.vehicles.map((budgetVehicle) => {
              const vehicle = mockVehicles.find(v => v.id === budgetVehicle.vehicleId);
              return (
                <tr key={budgetVehicle.id} className="border-b">
                  <td className="py-2">
                    {vehicle ? `${vehicle.brand} ${vehicle.model} (${vehicle.plate})` : 'Veículo não encontrado'}
                  </td>
                  <td className="py-2">
                    {formatDate(budgetVehicle.startDate)} - {formatDate(budgetVehicle.endDate)}
                  </td>
                  <td className="py-2">{formatCurrency(budgetVehicle.dailyRate)}</td>
                  <td className="py-2 text-right">{formatCurrency(budgetVehicle.totalAmount)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="text-right mb-8">
        <p className="text-lg font-semibold">
          Valor Total: {formatCurrency(budget.totalAmount)}
        </p>
      </div>

      <div className="border-t pt-8">
        <h2 className="text-xl font-semibold mb-4">Dados da Empresa</h2>
        <div className="text-sm text-gray-600">
          <p className="mb-1">{settings.name}</p>
          <p className="mb-1">CNPJ: {settings.document}</p>
          <p className="mb-1">Email: {settings.email}</p>
          <p className="mb-1">Telefone: {settings.phone}</p>
          <p className="mb-1">Endereço: {settings.address}</p>
        </div>
      </div>
    </div>
  );
}
