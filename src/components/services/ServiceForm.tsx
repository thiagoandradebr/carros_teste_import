import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ServiceFormStepper } from "./ServiceFormStepper";
import { useServiceForm } from "@/hooks/useServiceForm";
import { 
  Service,
  ServiceFormState,
  ServiceFormStep,
  ServiceFormValidations,
  ServiceHistory,
  ExtraCost
} from "@/types/service";
import { 
  BudgetVehicle,
  WorkDay,
  DailyType
} from "@/types/budget";
import { Customer } from "@/types/customer";
import { Vehicle } from "@/types/vehicle";
import { mockCustomers } from "@/mocks/customers";
import { mockVehicles } from "@/mocks/vehicles";
import { formatCurrency } from "@/lib/utils";
import { 
  calculateWorkDayHours,
  validateWorkDayTimes
} from "@/lib/workday-utils";
import { v4 as uuidv4 } from 'uuid';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { ConfirmationStep } from './ConfirmationStep';
import { CustomerSelect } from "./CustomerSelect";
import { VehicleSelect } from "./VehicleSelect";
import { WorkDaysForm } from "./WorkDaysForm";
import { ReviewStep } from "./ReviewStep";
import { VehicleExpensesTable } from './VehicleExpensesTable';
import { format } from 'date-fns';

interface ServiceFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (service: Partial<Service>) => void;
  initialData?: Service;
}

const initialState: ServiceFormState = {
  customerId: '',
  vehicles: [],
  status: 'pending',
  subtotalAmount: 0,
  extraCostsAmount: 0,
  totalAmount: 0,
  overtimeRate: 50,
  extraCosts: [],
  expenses: [],
  selectedVehicleId: '',
  startDate: '',
  endDate: '',
  currentStep: ServiceFormStep.SelectCustomer,
  validations: {
    customerSelected: false,
    vehiclesAdded: false,
    workDaysComplete: false,
    expensesAdded: false
  }
};

export function ServiceForm({
  open,
  onClose,
  onSubmit,
  initialData,
}: ServiceFormProps) {
  const [state, setState] = useState<ServiceFormState>(initialState);

  const resetForm = () => {
    setState(initialState);
    onClose();
  };

  const handleClose = () => {
    // Resetar todo o estado para o estado inicial
    setState(initialState);
    
    // Resetar o passo atual para o primeiro passo
    setCurrentStep(ServiceFormStep.SelectCustomer);
    
    // Chamar a função onClose passada como prop
    onClose();
  };

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  
  const [selectedVehicle, setSelectedVehicle] = useState<{
    vehicleId: string;
    startDate: string;
    endDate: string;
  }>({
    vehicleId: "",
    startDate: "",
    endDate: "",
  });

  const [currentWorkDay, setCurrentWorkDay] = useState<WorkDay>({
    id: '',
    date: "",
    startTime: "",
    endTime: "",
    duration: 0,
    regularHours: 0,
    extraHours: 0,
    dailyType: "disposition_12"
  });

  const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false);
  const [selectedVehicleToRemove, setSelectedVehicleToRemove] = useState<string | null>(null);

  const handleRemoveVehicle = (vehicleId: string) => {
    setSelectedVehicleToRemove(vehicleId);
    setShowRemoveConfirmation(true);
  };

  const confirmRemoveVehicle = () => {
    if (selectedVehicleToRemove) {
      setState(prevState => ({
        ...prevState,
        vehicles: prevState.vehicles.filter(vehicle => vehicle.vehicleId !== selectedVehicleToRemove),
      }));
      setShowRemoveConfirmation(false);
      setSelectedVehicleToRemove(null);
    }
  };

  const cancelRemoveVehicle = () => {
    setShowRemoveConfirmation(false);
    setSelectedVehicleToRemove(null);
  };

  const addVehicle = (
    vehicleInput?: string | BudgetVehicle, 
    startDate?: string, 
    endDate?: string,
    driverId?: string,
    title?: string
  ) => {
    if (vehicleInput && typeof vehicleInput !== 'string') {
      setState(prevState => ({
        ...prevState,
        vehicles: [...prevState.vehicles, vehicleInput],
      }));
      return;
    }

    const selectedId = vehicleInput || state.selectedVehicleId;
    const selectedStartDate = startDate || state.startDate;
    const selectedEndDate = endDate || state.endDate;
    const selectedDriver = driverId || '';

    const selectedVehicle = mockVehicles.find(v => v.id === selectedId);
    if (selectedVehicle && selectedStartDate && selectedEndDate) {
      const vehicleToAdd: BudgetVehicle = {
        id: uuidv4(),
        vehicleId: selectedVehicle.id,
        vehicleName: `${selectedVehicle.brand} ${selectedVehicle.model} - ${selectedVehicle.plate}`,
        title: `${selectedVehicle.brand} ${selectedVehicle.model} - ${selectedVehicle.plate}`, // Título gerado automaticamente
        startDate: selectedStartDate,
        endDate: selectedEndDate,
        dailyRate: selectedVehicle.dailyRate || 0,
        driverId: selectedDriver,
        workDays: [],
        dailyType: "disposition_12"
      };
      setState(prevState => ({
        ...prevState,
        vehicles: [...prevState.vehicles, vehicleToAdd],
        selectedVehicleId: '',
        startDate: '',
        endDate: ''
      }));
    }
  };

  const updateWorkDay = (vehicleId: string, workDayIndex: number, workDay: WorkDay) => {
    setState(prevState => {
      const updatedVehicles = prevState.vehicles.map(vehicle => {
        if (vehicle.vehicleId === vehicleId) {
          const updatedWorkDays = [...vehicle.workDays];
          updatedWorkDays[workDayIndex] = workDay;
          return {
            ...vehicle,
            workDays: updatedWorkDays
          };
        }
        return vehicle;
      });

      return {
        ...prevState,
        vehicles: updatedVehicles
      };
    });
  };

  const removeWorkDay = (vehicleId: string, workDayIndex: number) => {
    setState(prevState => {
      const vehicleIndex = prevState.vehicles.findIndex(vehicle => vehicle.vehicleId === vehicleId);
      if (vehicleIndex !== -1) {
        const updatedVehicle = {
          ...prevState.vehicles[vehicleIndex],
          workDays: prevState.vehicles[vehicleIndex].workDays.filter((workDay, index) => index !== workDayIndex),
        };
        return {
          ...prevState,
          vehicles: prevState.vehicles.map((vehicle, index) => {
            if (index === vehicleIndex) {
              return updatedVehicle;
            }
            return vehicle;
          }),
        };
      }
      return prevState;
    });
  };

  const addWorkDay = (vehicleId: string, workDay: WorkDay) => {
    setState(prevState => {
      const vehicleIndex = prevState.vehicles.findIndex(vehicle => vehicle.vehicleId === vehicleId);
      if (vehicleIndex !== -1) {
        const updatedVehicle = {
          ...prevState.vehicles[vehicleIndex],
          workDays: [...prevState.vehicles[vehicleIndex].workDays, workDay],
        };
        return {
          ...prevState,
          vehicles: prevState.vehicles.map((vehicle, index) => {
            if (index === vehicleIndex) {
              return updatedVehicle;
            }
            return vehicle;
          }),
        };
      }
      return prevState;
    });
  };

  const calculateExtraHours = (workDay: WorkDay) => {
    const startTime = new Date(`2000-01-01T${workDay.startTime}`);
    const endTime = new Date(`2000-01-01T${workDay.endTime}`);
    
    const totalHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
    const defaultContractedHours = 8; // Standard work day
    const extraHours = Math.max(0, totalHours - defaultContractedHours);
    
    return {
      ...workDay,
      extraHours: extraHours,
      overtimeValue: extraHours * state.overtimeRate
    };
  };

  const calculateWorkDayDetails = (startTime: string, endTime: string) => {
    return calculateWorkDayHours(startTime, endTime, "disposition_12", 12);
  };

  const handleAddWorkDay = (vehicleId: string, date: string, startTime: string, endTime: string) => {
    if (!startTime || !endTime || !date) {
      alert('Preencha todos os campos');
      return;
    }

    if (!validateWorkDayTimes(startTime, endTime)) {
      alert('Horário inválido. Hora de início deve ser anterior à hora de término.');
      return;
    }

    const workDayDetails = calculateWorkDayHours(startTime, endTime, "disposition_12", 12);

    const newWorkDay: WorkDay = {
      id: uuidv4(),
      date,
      startTime,
      endTime,
      duration: workDayDetails.duration,
      regularHours: workDayDetails.regularHours,
      extraHours: workDayDetails.extraHours,
      dailyType: "disposition_12"
    };

    addWorkDay(vehicleId, newWorkDay);

    // Reset form
    setCurrentWorkDay({
      id: '',
      date: '',
      startTime: '',
      endTime: '',
      duration: 0,
      regularHours: 0,
      extraHours: 0,
      dailyType: "disposition_12"
    });
  };

  const handleUpdateWorkDay = (vehicleId: string, workDayIndex: number, date: string, startTime: string, endTime: string) => {
    if (!startTime || !endTime || !date) {
      alert('Preencha todos os campos');
      return;
    }

    if (!validateWorkDayTimes(startTime, endTime)) {
      alert('Horário inválido. Hora de início deve ser anterior à hora de término.');
      return;
    }

    const workDayDetails = calculateWorkDayHours(startTime, endTime, "disposition_12", 12);

    const updatedWorkDay: WorkDay = {
      id: uuidv4(),
      date,
      startTime,
      endTime,
      duration: workDayDetails.duration,
      regularHours: workDayDetails.regularHours,
      extraHours: workDayDetails.extraHours,
      dailyType: "disposition_12"
    };

    updateWorkDay(vehicleId, workDayIndex, updatedWorkDay);

    // Reset form
    setCurrentWorkDay({
      id: '',
      date: '',
      startTime: '',
      endTime: '',
      duration: 0,
      regularHours: 0,
      extraHours: 0,
      dailyType: "disposition_12"
    });
    setSelectedVehicle(null);
  };

  const handleRemoveWorkDay = (vehicleId: string, workDayIndex: number) => {
    removeWorkDay(vehicleId, workDayIndex);
  };

  const handleAddVehicle = (vehicle: BudgetVehicle) => {
    setState(prevState => ({
      ...prevState,
      vehicles: [...prevState.vehicles, vehicle],
    }));
  };

  const calculateVehicleTotal = (vehicle: BudgetVehicle) => {
    const dailyTotal = vehicle.dailyRate * (vehicle.workDays?.length || 0);
    const overtimeTotal = vehicle.workDays?.reduce((sum, day) => 
      sum + (day.extraHours * state.overtimeRate), 0) || 0;
    return dailyTotal + overtimeTotal;
  };

  const calculateTotals = () => {
    const dailyTotal = state.vehicles.reduce((sum, vehicle) => {
      return sum + (vehicle.dailyRate * (vehicle.workDays?.length || 0));
    }, 0);

    const overtimeTotal = state.vehicles.reduce((sum, vehicle) => {
      return sum + (vehicle.workDays?.reduce((acc, day) => 
        acc + (day.extraHours * state.overtimeRate), 0) || 0);
    }, 0);

    return {
      dailyTotal,
      overtimeTotal,
      total: dailyTotal + overtimeTotal
    };
  };

  const getExtraCosts = () => {
    const totals = calculateTotals();

    return [
      {
        id: uuidv4(),
        type: 'extra_hours' as const,
        description: 'Horas Extras',
        quantity: state.vehicles.reduce((sum, vehicle) => 
          sum + (vehicle.workDays?.reduce((acc, day) => acc + (day.extraHours || 0), 0) || 0), 0),
        unitValue: state.overtimeRate,
        totalValue: totals.overtimeTotal
      }
    ];
  };

  const handleSubmit = () => {
    if (!state.customerId || state.vehicles.length === 0) return;

    const finalState: Partial<Service> = {
      ...state,
      subtotalAmount: calculateTotals().dailyTotal,
      extraCostsAmount: calculateTotals().overtimeTotal,
      totalAmount: calculateTotals().total,
      extraCosts: getExtraCosts()
    };

    onSubmit(finalState);
    onClose();
  };

  const [currentStep, setCurrentStep] = useState<ServiceFormStep>(ServiceFormStep.SelectCustomer);

  const updateValidations = (updates: Partial<ServiceFormValidations>) => {
    setState(prev => ({
      ...prev,
      validations: {
        ...prev.validations,
        ...updates
      }
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case ServiceFormStep.SelectCustomer:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="hidden">
                  <label className="text-sm font-medium mb-1 block">
                    Valor da Hora Extra
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">R$</span>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={state.overtimeRate}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        setState(prev => ({
                          ...prev,
                          overtimeRate: value
                        }));
                      }}
                      className="w-24"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Valor por hora extra trabalhada
                  </p>
                </div>
              </div>
            </div>

            <CustomerSelect
              onSelect={(customer: Customer) => setState(prevState => ({ 
                ...prevState, 
                customerId: customer.id,
                validations: {
                  ...prevState.validations,
                  customerSelected: true
                }
              }))}
              selectedCustomer={state.customerId ? mockCustomers.find(customer => customer.id === state.customerId) : null}
              onNext={() => setCurrentStep(ServiceFormStep.AddVehicles)}
            />
          </div>
        );
      case ServiceFormStep.AddVehicles:
        return (
          <VehicleSelect
            vehicles={state.vehicles}
            onAddVehicle={handleAddVehicle}
            onRemoveVehicle={handleRemoveVehicle}
            onNext={() => setCurrentStep(ServiceFormStep.DefineWorkDays)}
            onBack={() => setCurrentStep(ServiceFormStep.SelectCustomer)}
          />
        );
      case ServiceFormStep.DefineWorkDays:
        return (
          <WorkDaysForm
            vehicles={state.vehicles}
            onUpdateVehicle={updateWorkDay}
            onNext={() => setCurrentStep(ServiceFormStep.Expenses)}
            onBack={() => setCurrentStep(ServiceFormStep.AddVehicles)}
          />
        );
      case ServiceFormStep.Expenses:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Gastos Extras</h2>
            </div>
            {state.vehicles.map((vehicle, index) => (
              <div key={vehicle.id} className="space-y-2">
                <Input 
                  placeholder="Título para gastos extras deste veículo" 
                  value={vehicle.title || ''} 
                  onChange={(e) => {
                    const updatedVehicles = [...state.vehicles];
                    updatedVehicles[index] = {
                      ...updatedVehicles[index],
                      title: e.target.value
                    };
                    setState(prev => ({
                      ...prev,
                      vehicles: updatedVehicles
                    }));
                  }}
                  className="w-full"
                />
              </div>
            ))}
            <VehicleExpensesTable
              vehicles={state.vehicles}
              expenses={state.expenses}
              onAddExpense={(expense) => {
                setState(prev => ({
                  ...prev,
                  expenses: [...prev.expenses, expense]
                }));
              }}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCurrentStep(ServiceFormStep.DefineWorkDays)}>
                Voltar
              </Button>
              <Button onClick={() => setCurrentStep(ServiceFormStep.Review)}>
                Continuar
              </Button>
            </div>
          </div>
        );
      case ServiceFormStep.Review:
        return (
          <ReviewStep
            state={state}
            onNext={() => setCurrentStep(ServiceFormStep.Confirmation)}
            onBack={() => setCurrentStep(ServiceFormStep.Expenses)}
          />
        );
      case ServiceFormStep.Confirmation:
        return (
          <ConfirmationStep
            state={state}
            onBack={() => setCurrentStep(ServiceFormStep.Review)}
            onConfirm={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  const selectedVehicleForWorkDays = useMemo(() => {
    return state.vehicles.find(v => v.vehicleId === selectedVehicle.vehicleId);
  }, [state.vehicles, selectedVehicle.vehicleId]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[120%] w-[90%] h-[80vh] flex flex-col mx-auto">
        <DialogHeader>
          <DialogTitle>Novo Serviço</DialogTitle>
          <DialogDescription>
            Preencha os detalhes do serviço passo a passo
          </DialogDescription>
        </DialogHeader>

        <ServiceFormStepper
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          validations={state.validations}
          steps={[
            { id: ServiceFormStep.SelectCustomer, label: 'Cliente' },
            { id: ServiceFormStep.AddVehicles, label: 'Veículos' },
            { id: ServiceFormStep.DefineWorkDays, label: 'Dias de Trabalho' },
            { id: ServiceFormStep.Expenses, label: 'Gastos Extras' },
            { id: ServiceFormStep.Review, label: 'Revisão' }
          ]}
        />

        <div className="flex-1 overflow-y-auto">
          {renderStepContent()}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={handleClose}>Fechar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>

      {/* Diálogo de confirmação para remover veículo */}
      <AlertDialog open={showRemoveConfirmation} onOpenChange={setShowRemoveConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Veículo</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover este veículo? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelRemoveVehicle}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemoveVehicle}>Remover</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
