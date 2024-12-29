import { Vehicle } from "./vehicle";
import { BudgetVehicle, WorkDay } from "./index";

export type ServiceType = "with_budget" | "direct";
export type ServicePriority = "low" | "medium" | "high";
export type BudgetStatus = "pending" | "approved" | "rejected";
export type DocumentType = "photo" | "document" | "invoice" | "report";

export type ServiceStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

// Módulo Base
export interface ServiceBase {
  id: string;
  type: ServiceType;
  status: ServiceStatus;
  createdAt: string;
  vehicle: Vehicle;
  responsible: string;
  priority: ServicePriority;
  tags: string[];
  updatedAt: string;
}

// Módulo de Orçamento
export interface BudgetItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface BudgetDetails {
  id: string;
  serviceId: string;
  budgetNumber: string;
  validUntil: string;
  items: BudgetItem[];
  paymentTerms: string;
  status: BudgetStatus;
  notes?: string;
  total: number;
  createdAt: string;
  updatedAt: string;
}

// Módulo de Execução
export interface ExecutionItem {
  id: string;
  description: string;
  quantity: number;
  actualPrice: number;
  total: number;
}

export interface UsedMaterial {
  id: string;
  name: string;
  quantity: number;
  cost: number;
}

export interface ExecutionDetails {
  id: string;
  serviceId: string;
  startDate: string;
  endDate?: string;
  team: string[];
  items: ExecutionItem[];
  workedHours: number;
  materials: UsedMaterial[];
  warranty?: string;
  notes?: string;
  total: number;
  createdAt: string;
  updatedAt: string;
}

// Módulo de Documentos
export interface ServiceDocument {
  id: string;
  serviceId: string;
  type: DocumentType;
  uploadedAt: string;
  category: string;
  tags: string[];
  metadata: Record<string, unknown>;
  url: string;
  filename: string;
}

// Tipo completo do Serviço
export interface Service extends ServiceBase {
  budget?: BudgetDetails;
  execution?: ExecutionDetails;
  documents: ServiceDocument[];
}

export interface ServiceHistory {
  id: string;
  date: string;
  description: string;
  status: ServiceStatus;
}

export enum ServiceFormStep {
  SelectCustomer = 'customer',
  AddVehicles = 'vehicles',
  DefineWorkDays = 'workdays',
  Expenses = 'expenses',
  Review = 'review',
  Confirmation = 'confirmation'
}

export type ExtraExpenseType = 'parking' | 'washing' | 'fuel' | 'toll';

export interface ExtraExpense {
  id: string;
  workDayId: string;
  vehicleId: string;
  type: ExtraExpenseType;
  amount: number;
  title?: string;
  description?: string;
  receipt?: string;
}

export interface ExtraCost {
  id: string;
  type: 'extra_hours' | 'other';
  description: string;
  quantity?: number;
  unitValue: number;
  totalValue: number;
}

export interface ServiceFormValidations {
  customerSelected: boolean;
  vehiclesAdded: boolean;
  workDaysComplete: boolean;
  expensesAdded: boolean;
}

export interface ServiceFormState {
  id?: string;
  customerId: string;
  vehicles: BudgetVehicle[];
  status: ServiceStatus;
  subtotalAmount: number;
  extraCostsAmount: number;
  totalAmount: number;
  overtimeRate: number;
  extraCosts: ExtraCost[];
  expenses: ExtraExpense[];
  selectedVehicleId: string;
  startDate: string;
  endDate: string;
  currentStep: ServiceFormStep;
  validations: ServiceFormValidations;
}

export interface Service {
  id: string;
  customerId: string;
  budgetId?: string;
  vehicles: BudgetVehicle[];
  status: ServiceStatus;
  extraCosts: ExtraCost[];
  subtotalAmount: number;
  extraCostsAmount: number;
  totalAmount: number;
  history: ServiceHistory[];
  createdAt: string;
  updatedAt: string;
}
