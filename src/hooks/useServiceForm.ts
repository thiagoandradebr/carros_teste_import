import { useState, useCallback } from 'react';
import { 
  Service, 
  Customer, 
  BudgetVehicle, 
  WorkDay,
  ServiceFormStep,
  ServiceFormState,
  ServiceStatus,
  ExtraCost
} from "@/types";
import { 
  generateWorkDays, 
  calculateWorkDayHours, 
  calculateTotalHours,
  validateWorkDay,
  formatDate
} from '@/lib/workday-utils';
import { v4 as uuidv4 } from 'uuid';

interface UseServiceFormProps {
  onSubmit: (serviceData: Service) => void;
}

const initialWorkDay: WorkDay = {
  id: '',
  date: new Date().toISOString(),
  startTime: '',
  endTime: '',
  duration: 0,
  regularHours: 0,
  extraHours: 0,
  hoursWorked: 0,
  overtimeHours: 0,
  overtimeValue: 0,
  notes: ''
};

const initialState: ServiceFormState = {
  // Campos do Service
  id: uuidv4(),
  customerId: '',
  budgetId: undefined,
  vehicles: [],
  status: 'pending' as ServiceStatus,
  extraCosts: [],
  subtotalAmount: 0,
  extraCostsAmount: 0,
  totalAmount: 0,
  history: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  
  // Campos específicos do formulário
  currentStep: ServiceFormStep.SelectCustomer,
  errors: {},
  validations: {
    customerSelected: false,
    vehiclesAdded: false,
    workDaysComplete: false
  },
  selectedVehicleId: '',
  startDate: '',
  endDate: '',
  overtimeRate: 1.1 // 10% de hora extra por padrão
};

export function useServiceForm({ onSubmit }: UseServiceFormProps) {
  const [state, setState] = useState<ServiceFormState>(initialState);

  const setCustomer = useCallback((customer: Customer) => {
    setState(prev => ({
      ...prev,
      customerId: customer.id,
      currentStep: ServiceFormStep.AddVehicles,
      validations: {
        ...prev.validations,
        customerSelected: true
      }
    }));
  }, []);

  const addVehicle = useCallback((vehicle: BudgetVehicle) => {
    setState(prev => {
      const workDays = generateWorkDays(vehicle.startDate, vehicle.endDate).map(date => ({
        ...initialWorkDay,
        id: uuidv4(),
        date,
        startTime: '08:00',
        endTime: '17:00',
        duration: 9,
        regularHours: 8,
        extraHours: 1,
        hoursWorked: 9,
        overtimeHours: 1,
        overtimeValue: prev.overtimeRate
      }));

      const vehicleWithWorkDays: BudgetVehicle = {
        ...vehicle,
        workDays,
        totalRegularHours: workDays.reduce((acc, day) => acc + (day.regularHours || 0), 0),
        totalExtraHours: workDays.reduce((acc, day) => acc + (day.extraHours || 0), 0)
      };

      const updatedVehicles = [...prev.vehicles, vehicleWithWorkDays];
      
      return {
        ...prev,
        vehicles: updatedVehicles,
        currentStep: ServiceFormStep.DefineWorkDays,
        validations: {
          ...prev.validations,
          vehiclesAdded: updatedVehicles.length > 0
        }
      };
    });
  }, []);

  const updateWorkDay = useCallback((vehicleId: string, workDayIndex: number, workDay: Partial<WorkDay>) => {
    setState(prev => {
      const updatedVehicles = prev.vehicles.map(vehicle => {
        if (vehicle.vehicleId === vehicleId) {
          const updatedWorkDays = [...(vehicle.workDays || [])];
          
          if (workDay.startTime && workDay.endTime && 
              !validateWorkDay(workDay.startTime, workDay.endTime)) {
            return {
              ...vehicle,
              errors: {
                ...vehicle.errors,
                [`workDay_${workDayIndex}`]: 'Horário inválido'
              }
            };
          }

          const existingWorkDay = updatedWorkDays[workDayIndex] || { ...initialWorkDay };
          const updatedValues: WorkDay = {
            ...existingWorkDay,
            id: existingWorkDay.id || uuidv4(),
            startTime: workDay.startTime || existingWorkDay.startTime,
            endTime: workDay.endTime || existingWorkDay.endTime,
            date: existingWorkDay.date,
            duration: existingWorkDay.duration,
            regularHours: existingWorkDay.regularHours,
            extraHours: existingWorkDay.extraHours,
            hoursWorked: existingWorkDay.hoursWorked,
            overtimeHours: existingWorkDay.overtimeHours,
            overtimeValue: existingWorkDay.overtimeValue,
            notes: existingWorkDay.notes
          };

          if (updatedValues.startTime && updatedValues.endTime) {
            const hourDetails = calculateWorkDayHours(
              updatedValues.startTime, 
              updatedValues.endTime,
              prev.overtimeRate
            );
            Object.assign(updatedValues, hourDetails);
          }

          updatedWorkDays[workDayIndex] = updatedValues;

          const { totalRegularHours, totalExtraHours } = calculateTotalHours(updatedWorkDays);

          return { 
            ...vehicle, 
            workDays: updatedWorkDays,
            totalRegularHours,
            totalExtraHours,
            errors: {}
          };
        }
        return vehicle;
      });

      return {
        ...prev,
        vehicles: updatedVehicles
      };
    });
  }, []);

  const resetForm = useCallback(() => {
    setState(initialState);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!state.customerId || state.vehicles.length === 0) return;

    const serviceData: Service = {
      id: state.id,
      customerId: state.customerId,
      budgetId: state.budgetId,
      vehicles: state.vehicles,
      status: state.status,
      extraCosts: state.extraCosts,
      subtotalAmount: state.subtotalAmount,
      extraCostsAmount: state.extraCostsAmount,
      totalAmount: state.totalAmount,
      history: state.history,
      createdAt: state.createdAt,
      updatedAt: new Date().toISOString()
    };

    onSubmit(serviceData);
  }, [state, onSubmit]);

  return {
    state,
    setCustomer,
    addVehicle,
    updateWorkDay,
    resetForm,
    handleSubmit
  };
}
