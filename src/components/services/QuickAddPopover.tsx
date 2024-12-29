import { useState } from "react";
import { format } from "date-fns";
import { v4 as uuidv4 } from 'uuid';
import { Plus, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Vehicle } from "@/types/vehicle";
import { Driver } from "@/types/driver";
import { BudgetVehicle, DailyType } from "@/types/budget";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";

interface QuickAddPopoverProps {
  vehicle: Vehicle;
  onAdd: (budgetVehicle: BudgetVehicle) => void;
  drivers: Driver[];
  isSelected?: boolean;
}

const DAILY_TYPES = {
  transfer: {
    label: "Transfer",
    regularHours: 0, // Não tem limite de horas regulares
    hasOvertime: false
  },
  disposition_10: {
    label: "Disposição 10 horas",
    regularHours: 10,
    hasOvertime: true
  },
  disposition_12: {
    label: "Disposição 12 horas",
    regularHours: 12,
    hasOvertime: true
  }
} as const;

export function QuickAddPopover({ 
  vehicle, 
  onAdd, 
  drivers,
  isSelected 
}: QuickAddPopoverProps) {
  const [open, setOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>();
  const [selectedDriver, setSelectedDriver] = useState<string>();
  const [dailyRate, setDailyRate] = useState<number>();
  const [overtimeRate, setOvertimeRate] = useState<number>();
  const [dailyType, setDailyType] = useState<DailyType>('disposition_10');

  const handleAdd = () => {
    if (dateRange?.from && dateRange.to && selectedDriver && dailyRate) {
      const selectedDriverDetails = drivers.find(d => d.id === selectedDriver);
      if (!selectedDriverDetails) return;

      // Só validamos hora extra se não for transfer
      if (DAILY_TYPES[dailyType].hasOvertime && !overtimeRate) {
        return;
      }

      onAdd({
        id: uuidv4(),
        vehicleId: vehicle.id,
        vehicleDetails: vehicle,
        startDate: format(dateRange.from, 'yyyy-MM-dd'),
        endDate: format(dateRange.to, 'yyyy-MM-dd'),
        driverId: selectedDriver,
        driverDetails: selectedDriverDetails,
        dailyRate: dailyRate,
        overtimeRate: DAILY_TYPES[dailyType].hasOvertime ? overtimeRate : undefined,
        totalDays: Math.ceil(
          (dateRange.to.getTime() - dateRange.from.getTime()) / 
          (1000 * 60 * 60 * 24)
        ),
        workDays: [],
        regularHours: DAILY_TYPES[dailyType].regularHours,
        dailyType: dailyType
      });

      // Reset form and close popover
      setDateRange(undefined);
      setSelectedDriver(undefined);
      setDailyRate(undefined);
      setOvertimeRate(undefined);
      setDailyType('disposition_10');
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant={isSelected ? "default" : "ghost"} 
          size="sm"
          className={cn(
            "absolute top-2 right-2 z-10",
            isSelected && "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">Adicionar Rápido</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[320px] p-4" 
        align="end" 
        side="right"
        sideOffset={40}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">
              {vehicle.brand} {vehicle.model}
            </h4>
            <div className="text-xs text-muted-foreground">
              {vehicle.plate}
            </div>
          </div>
          
          {/* Período */}
          <div className="space-y-2">
            <Label className="text-xs">Período</Label>
            <DatePickerWithRange
              date={dateRange}
              onDateChange={setDateRange}
              className="w-full [&>button]:w-full [&>button]:justify-start"
            />
          </div>

          {/* Tipo de Diária */}
          <div className="space-y-2">
            <Label className="text-xs">Tipo de Diária</Label>
            <Select value={dailyType} onValueChange={(value: DailyType) => setDailyType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de diária" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(DAILY_TYPES).map(([value, { label }]) => (
                  <SelectItem 
                    key={value} 
                    value={value}
                  >
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Motorista */}
          <div className="space-y-2">
            <Label className="text-xs">Motorista</Label>
            <Select value={selectedDriver} onValueChange={setSelectedDriver}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um motorista" />
              </SelectTrigger>
              <SelectContent>
                {drivers.map(driver => (
                  <SelectItem 
                    key={driver.id} 
                    value={driver.id}
                    className="flex flex-col items-start py-2"
                  >
                    <div className="font-medium">{driver.name}</div>
                    {driver.phone && (
                      <div className="text-xs text-muted-foreground">
                        {driver.phone}
                      </div>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Valores */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs">Diária (R$)</Label>
              <div className="flex gap-1.5">
                <Input
                  type="number"
                  value={dailyRate || ''}
                  onChange={e => setDailyRate(Number(e.target.value))}
                  className="w-full"
                  placeholder="0,00"
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
                        <History className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p className="font-medium text-xs">Últimas diárias:</p>
                      <ul className="text-xs space-y-1 mt-1">
                        <li>R$ 200,00 (15 dias atrás)</li>
                        <li>R$ 180,00 (30 dias atrás)</li>
                      </ul>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {DAILY_TYPES[dailyType].hasOvertime && (
              <div className="space-y-2">
                <Label className="text-xs">Hora Extra (R$)</Label>
                <Input
                  type="number"
                  value={overtimeRate || ''}
                  onChange={e => setOvertimeRate(Number(e.target.value))}
                  className="w-full"
                  placeholder="0,00"
                />
              </div>
            )}
          </div>

          <Button 
            className="w-full"
            onClick={handleAdd}
            disabled={
              !dateRange?.from || 
              !dateRange.to || 
              !selectedDriver || 
              !dailyRate || 
              (DAILY_TYPES[dailyType].hasOvertime && !overtimeRate)
            }
          >
            Adicionar Veículo
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
