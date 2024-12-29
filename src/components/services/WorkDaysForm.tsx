import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { BudgetVehicle, WorkDay } from "@/types/budget";
import { calculateWorkDayHours } from "@/lib/workday-utils";
import { ExtendedShiftConfirmation } from "./ExtendedShiftConfirmation";
import { AlertCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TimeInputProps {
  value: string;
  onChange: (value: string) => void;
}

const TimeInput: React.FC<TimeInputProps> = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    if (newValue.length === 5) {
      onChange(newValue);
    }
  };

  return (
    <Input
      type="text"
      placeholder="00:00"
      maxLength={5}
      value={inputValue}
      onChange={handleChange}
      onBlur={() => {
        if (inputValue.length === 5) {
          onChange(inputValue);
        }
      }}
      className="w-24"
    />
  );
};

interface WorkDaysFormProps {
  vehicles: BudgetVehicle[];
  onUpdateVehicle: (vehicleId: string, workDayIndex: number, workDay: WorkDay) => void;
  onNext: () => void;
  onBack: () => void;
}

interface ExtendedShiftConfirmationState {
  isOpen: boolean;
  vehicleId: string;
  dayIndex: number;
  workDay: WorkDay;
}

export function WorkDaysForm({ 
  vehicles, 
  onUpdateVehicle, 
  onNext, 
  onBack 
}: WorkDaysFormProps) {
  const [workDays, setWorkDays] = useState<Record<string, WorkDay[]>>({});
  const [extendedShiftConfirmation, setExtendedShiftConfirmation] = useState<ExtendedShiftConfirmationState>({
    isOpen: false,
    vehicleId: '',
    dayIndex: -1,
    workDay: {} as WorkDay
  });

  useEffect(() => {
    const initialWorkDays: Record<string, WorkDay[]> = {};
    
    vehicles.forEach((vehicle) => {
      const startDate = vehicle.startDate ? new Date(vehicle.startDate) : new Date();
      const endDate = vehicle.endDate ? new Date(vehicle.endDate) : new Date();
      
      const days: WorkDay[] = [];
      let currentDate = startDate;
      
      while (currentDate <= endDate) {
        const existingWorkDay = vehicle.workDays?.find(
          wd => new Date(wd.date).toDateString() === currentDate.toDateString()
        );

        days.push({
          id: `${vehicle.vehicleId}-${currentDate.toISOString()}`,
          date: currentDate.toISOString(),
          startTime: existingWorkDay?.startTime || '',
          endTime: existingWorkDay?.endTime || '',
          duration: existingWorkDay?.duration || 0,
          regularHours: vehicle.regularHours || 0,
          extraHours: existingWorkDay?.extraHours || 0,
          dailyType: vehicle.dailyType,
          confirmedExtendedShift: existingWorkDay?.confirmedExtendedShift
        });
        
        currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
      }

      initialWorkDays[vehicle.vehicleId] = days;
    });

    setWorkDays(initialWorkDays);
  }, [vehicles]);

  const updateWorkDay = useCallback((
    vehicleId: string,
    dayIndex: number,
    workDay: WorkDay
  ) => {
    setWorkDays(prev => {
      const updatedWorkDays = { ...prev };
      const vehicleDays = [...(prev[vehicleId] || [])];
      vehicleDays[dayIndex] = workDay;
      updatedWorkDays[vehicleId] = vehicleDays;
      return updatedWorkDays;
    });
    onUpdateVehicle(vehicleId, dayIndex, workDay);
  }, [onUpdateVehicle]);

  const handleTimeChange = useCallback((
    vehicleId: string,
    dayIndex: number,
    field: 'startTime' | 'endTime',
    value: string
  ) => {
    setWorkDays(prev => {
      const updatedWorkDays = { ...prev };
      const vehicleDays = [...(prev[vehicleId] || [])];
      const updatedDay = { ...vehicleDays[dayIndex] };
      const vehicle = vehicles.find(v => v.vehicleId === vehicleId);

      if (!vehicle) return prev;

      updatedDay[field] = value;

      if (updatedDay.startTime && updatedDay.endTime) {
        const hourDetails = calculateWorkDayHours(
          updatedDay.startTime, 
          updatedDay.endTime,
          vehicle.dailyType,
          vehicle.regularHours || 0
        );

        const newWorkDay: WorkDay = {
          ...updatedDay,
          duration: hourDetails.duration,
          regularHours: hourDetails.regularHours,
          extraHours: hourDetails.extraHours,
        };

        // Se a duração for maior que 24 horas e não estiver confirmada
        if (hourDetails.duration >= 24 && !updatedDay.confirmedExtendedShift) {
          setExtendedShiftConfirmation({
            isOpen: true,
            vehicleId,
            dayIndex,
            workDay: newWorkDay
          });
          return prev; // Não atualiza até confirmar
        }

        updateWorkDay(vehicleId, dayIndex, newWorkDay);
      }

      vehicleDays[dayIndex] = updatedDay;
      updatedWorkDays[vehicleId] = vehicleDays;

      return updatedWorkDays;
    });
  }, [vehicles, updateWorkDay]);

  const handleConfirmExtendedShift = () => {
    const { vehicleId, dayIndex, workDay } = extendedShiftConfirmation;
    updateWorkDay(vehicleId, dayIndex, {
      ...workDay,
      confirmedExtendedShift: true
    });
    setExtendedShiftConfirmation(prev => ({ ...prev, isOpen: false }));
  };

  const handleCancelExtendedShift = () => {
    setExtendedShiftConfirmation(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="space-y-4">
      <ExtendedShiftConfirmation
        isOpen={extendedShiftConfirmation.isOpen}
        onConfirm={handleConfirmExtendedShift}
        onCancel={handleCancelExtendedShift}
        date={extendedShiftConfirmation.workDay.date || ''}
        startTime={extendedShiftConfirmation.workDay.startTime || ''}
        endTime={extendedShiftConfirmation.workDay.endTime || ''}
        duration={extendedShiftConfirmation.workDay.duration || 0}
      />

      {vehicles.map((vehicle) => (
        <Card key={vehicle.vehicleId}>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  {vehicle.vehicleDetails?.model || vehicle.vehicleName || 'Veículo'} 
                  {vehicle.vehicleDetails?.plate && 
                    <span className="text-sm text-muted-foreground">
                      ({vehicle.vehicleDetails.plate})
                    </span>
                  }
                </h3>
                <div className="text-sm text-muted-foreground">
                  {vehicle.dailyType === 'transfer' ? 'Transfer' : 
                   vehicle.dailyType === 'disposition_10' ? 'Disposição 10h' : 
                   'Disposição 12h'}
                </div>
              </div>
                
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span>Motorista:</span>
                  <span className="font-medium">
                    {vehicle.driverDetails?.name || 'Não definido'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Período:</span>
                  <span className="font-medium">
                    {format(new Date(vehicle.startDate), "dd/MM/yyyy", { locale: ptBR })} 
                    {' - '} 
                    {format(new Date(vehicle.endDate), "dd/MM/yyyy", { locale: ptBR })}
                  </span>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Valor Diária</TableHead>
                    <TableHead>Hora Início</TableHead>
                    <TableHead>Hora Fim</TableHead>
                    <TableHead>Total Horas</TableHead>
                    {vehicle.dailyType !== 'transfer' && (
                      <>
                        <TableHead>Horas Extras</TableHead>
                        <TableHead>Valor H.E.</TableHead>
                      </>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workDays[vehicle.vehicleId]?.map((day, index) => (
                    <TableRow key={day.id}>
                      <TableCell>
                        {format(new Date(day.date), "dd/MM/yyyy", { locale: ptBR })}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(vehicle.dailyRate)}
                      </TableCell>
                      <TableCell>
                        <TimeInput
                          value={day.startTime}
                          onChange={(value) => handleTimeChange(vehicle.vehicleId, index, 'startTime', value)}
                        />
                      </TableCell>
                      <TableCell>
                        <TimeInput
                          value={day.endTime}
                          onChange={(value) => handleTimeChange(vehicle.vehicleId, index, 'endTime', value)}
                        />
                      </TableCell>
                      <TableCell className="flex items-center gap-1">
                        {day.duration.toFixed(1)}h
                        {day.confirmedExtendedShift && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <AlertCircle 
                                  size={16} 
                                  className="text-yellow-500"
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Jornada extendida confirmada</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </TableCell>
                      {vehicle.dailyType !== 'transfer' && (
                        <>
                          <TableCell>
                            {day.extraHours.toFixed(1)}h
                          </TableCell>
                          <TableCell>
                            {formatCurrency(day.extraHours * (vehicle.overtimeRate || 0))}
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack}>
          Voltar
        </Button>
        <Button onClick={onNext}>
          Continuar
        </Button>
      </div>
    </div>
  );
}
