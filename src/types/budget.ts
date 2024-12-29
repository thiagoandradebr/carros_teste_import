import { Vehicle } from "./vehicle";
import { Driver } from "./driver";
import { Customer } from "./customer"; // Added import statement for Customer

export type DailyType = 'transfer' | 'disposition_10' | 'disposition_12';

export interface BudgetVehicle {
  id: string;
  vehicleId: string;
  vehicleDetails?: Vehicle;
  vehicleName?: string;
  title?: string; // New field for extra expenses title
  startDate: string;
  endDate: string;
  dailyRate: number;
  overtimeRate?: number;
  driverId?: string;
  driverDetails?: Driver;
  workDays: WorkDay[];
  regularHours?: number;
  totalDays?: number;
  dailyType: DailyType;
}

export interface WorkDay {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  regularHours: number;
  extraHours: number;
  dailyType: DailyType;
  confirmedExtendedShift?: boolean;
}

export interface Budget {
  id: string;
  customerId: string;
  customerDetails?: Customer;
  vehicles: BudgetVehicle[];
  status: BudgetStatus;
  subtotalAmount: number;
  extraCostsAmount: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export type BudgetStatus = 'draft' | 'sent' | 'approved' | 'rejected' | 'cancelled';
