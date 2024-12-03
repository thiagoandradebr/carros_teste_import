import { BudgetVehicle } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface BudgetSummaryProps {
  vehicles: BudgetVehicle[];
  onRemove?: (vehicleId: string) => void;
}

export function BudgetSummary({ vehicles, onRemove }: BudgetSummaryProps) {
  const total = vehicles.reduce((acc, vehicle) => acc + vehicle.totalAmount, 0);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-4">
                  <span className="font-medium">{vehicle.vehicleName}</span>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(vehicle.startDate), "dd 'de' MMMM", { locale: ptBR })} - {format(new Date(vehicle.endDate), "dd 'de' MMMM", { locale: ptBR })}
                  </span>
                  <span className="text-sm">
                    {vehicle.totalDays} {vehicle.totalDays === 1 ? "dia" : "dias"}
                  </span>
                  <span className="font-medium">
                    {formatCurrency(vehicle.dailyRate)}/dia
                  </span>
                  <span className="font-semibold">
                    Total: {formatCurrency(vehicle.totalAmount)}
                  </span>
                </div>
                {vehicle.notes && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {vehicle.notes}
                  </p>
                )}
              </div>
              {onRemove && (
                <button
                  onClick={() => onRemove(vehicle.id)}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Remover
                </button>
              )}
            </div>
          ))}
        </div>

        {vehicles.length > 0 && (
          <div className="mt-6 pt-4 border-t flex justify-between items-center">
            <span className="font-medium">Total do Orçamento:</span>
            <span className="text-lg font-semibold">
              {formatCurrency(total)}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
