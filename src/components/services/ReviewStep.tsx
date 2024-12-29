import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ServiceFormState } from '@/types';
import { mockCustomers } from '@/mocks/customers';
import { formatCurrency } from '@/lib/utils';

interface ReviewStepProps {
  state: ServiceFormState;
  onNext: () => void;
  onBack: () => void;
}

export function ReviewStep({ state, onNext, onBack }: ReviewStepProps) {
  const customer = mockCustomers.find(c => c.id === state.customerId);

  if (!customer) return null;

  const calculateTotals = () => {
    return state.vehicles.reduce((acc, vehicle) => {
      // Use the actual number of workdays instead of calculating from date range
      const dailyAmount = vehicle.dailyRate * (vehicle.workDays?.length || 0);
      
      // Soma das horas extras
      const overtimeAmount = vehicle.workDays?.reduce((sum, day) => {
        return sum + (day.overtimeValue || 0);
      }, 0) || 0;

      return {
        dailyTotal: acc.dailyTotal + dailyAmount,
        overtimeTotal: acc.overtimeTotal + overtimeAmount,
        get total() {
          return this.dailyTotal + this.overtimeTotal;
        }
      };
    }, { dailyTotal: 0, overtimeTotal: 0, total: 0 });
  };

  const totals = calculateTotals();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Revisão do Serviço</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Cliente</h3>
            <p>{customer.name}</p>
            <p className="text-sm text-gray-600">{customer.email}</p>
            <p className="text-sm text-gray-600">{customer.phone}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Veículos</h3>
            <div className="space-y-2">
              {state.vehicles.map((vehicle) => {
                const vehicleOvertimeTotal = vehicle.workDays?.reduce((sum, day) => {
                  return sum + (day.overtimeValue || 0);
                }, 0) || 0;

                return (
                  <div key={vehicle.id} className="border p-2 rounded">
                    <p className="font-medium">{vehicle.vehicleName}</p>
                    <p className="text-sm text-gray-600">
                      Período: {new Date(vehicle.startDate).toLocaleDateString()} - {new Date(vehicle.endDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      Diária: {formatCurrency(vehicle.dailyRate)}
                    </p>
                    {vehicle.workDays && vehicle.workDays.length > 0 && (
                      <div className="mt-2 space-y-1">
                        <p className="text-sm font-medium">Horas Extras:</p>
                        {vehicle.workDays.map((day, index) => (
                          day.overtimeValue > 0 && (
                            <p key={index} className="text-sm text-gray-600 ml-2">
                              {new Date(day.date).toLocaleDateString()}: {day.extraHours}h ({formatCurrency(day.overtimeValue)})
                            </p>
                          )
                        ))}
                        <p className="text-sm text-gray-600 font-medium">
                          Total Horas Extras: {formatCurrency(vehicleOvertimeTotal)}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold mb-2">Resumo dos Valores</h3>
            <p className="text-sm">Valor das Diárias: {formatCurrency(totals.dailyTotal)}</p>
            <p className="text-sm">Valor das Horas Extras: {formatCurrency(totals.overtimeTotal)}</p>
            <p className="text-lg font-semibold mt-2">
              Valor Total: {formatCurrency(totals.total)}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Voltar
        </Button>
        <Button onClick={onNext}>
          Prosseguir
        </Button>
      </div>
    </div>
  );
}
