import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BudgetVehicle } from '@/types/budget';
import { ExtraExpense } from '@/types/service';
import { ExpenseQuickAdd } from './ExpenseQuickAdd';
import { formatCurrency } from '@/lib/utils';

interface VehicleExpensesTableProps {
  vehicles: BudgetVehicle[];
  expenses: ExtraExpense[];
  onAddExpense: (expense: ExtraExpense) => void;
}

export function VehicleExpensesTable({ vehicles, expenses, onAddExpense }: VehicleExpensesTableProps) {
  const [selectedWorkDay, setSelectedWorkDay] = React.useState<{
    workDayId: string;
    vehicleId: string;
  } | null>(null);

  const getExpensesForWorkDay = (workDayId: string) => {
    return expenses.filter(expense => expense.workDayId === workDayId);
  };

  const getTotalExpenses = (workDayId: string) => {
    return getExpensesForWorkDay(workDayId)
      .reduce((sum, expense) => sum + expense.amount, 0);
  };

  const getVehicleTotalExpenses = (vehicleId: string) => {
    return expenses
      .filter(expense => expense.vehicleId === vehicleId)
      .reduce((sum, expense) => sum + expense.amount, 0);
  };

  const expenseTypeToLabel: Record<string, string> = {
    parking: 'Estacionamento',
    washing: 'Lavagem',
    fuel: 'Combustível',
    toll: 'Pedágio',
  };

  return (
    <>
      <Accordion type="single" collapsible className="w-full">
        {vehicles.map(vehicle => (
          <AccordionItem key={vehicle.id} value={vehicle.id}>
            <AccordionTrigger className="hover:no-underline">
              <div className="flex justify-between w-full pr-4">
                <div className="flex flex-col">
                  <span>{vehicle.vehicleName}</span>
                  {vehicle.title && <span className="text-sm text-muted-foreground">{vehicle.title}</span>}
                </div>
                <span>Total: {formatCurrency(getVehicleTotalExpenses(vehicle.id))}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Gastos</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vehicle.workDays.map(workDay => (
                    <TableRow key={workDay.id}>
                      <TableCell>
                        {format(new Date(workDay.date), "dd/MM/yyyy (EEEE)", { locale: ptBR })}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {getExpensesForWorkDay(workDay.id).map(expense => (
                            <div key={expense.id} className="text-sm">
                              {expense.title && <span className="font-semibold mr-2">{expense.title}:</span>}
                              {expenseTypeToLabel[expense.type]}: {formatCurrency(expense.amount)}
                              {expense.description && ` - ${expense.description}`}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(getTotalExpenses(workDay.id))}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedWorkDay({
                            workDayId: workDay.id,
                            vehicleId: vehicle.id,
                          })}
                        >
                          Adicionar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <ExpenseQuickAdd
        open={!!selectedWorkDay}
        onClose={() => setSelectedWorkDay(null)}
        onAdd={onAddExpense}
        workDayId={selectedWorkDay?.workDayId || ''}
        vehicleId={selectedWorkDay?.vehicleId || ''}
      />
    </>
  );
}
