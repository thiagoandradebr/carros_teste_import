export interface Address {
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface Trip {
  id: string;
  date: string;
  destination: string;
  distance: number;
  rating: number;
  notes?: string;
}

export type DriverStatus = 'active' | 'inactive' | 'training' | 'suspended';
export type CustomerStatus = 'active' | 'inactive' | 'blocked';
export type VehicleStatus = 'available' | 'rented' | 'maintenance' | 'reserved';
export type RentalStatus = 'pending' | 'active' | 'completed' | 'cancelled';
export type BudgetStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'converted';
export type ServiceStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface Driver {
  id: string;
  name: string;
  cpf: string;
  cnh: string;
  cnhValidity: string;
  cnhPoints: number;
  cnhDocument?: string;
  phone: string;
  photo?: string;
  notes?: string;
  status: DriverStatus;
  address: Address;
  trips?: Trip[];
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  address: {
    cep: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
  };
  notes?: string;
  status: "active" | "inactive";
  rentals: string[];
  updatedAt: string;
}

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  plate: string;
  color: string;
  mileage?: number;
  photo?: string;
  status: VehicleStatus;
  category: string;
  dailyRate: number;
  supplier: string;
  isArmored: boolean;
  documents?: string[];
  notes?: string;
  maintenanceHistory?: {
    id: string;
    date: string;
    type: string;
    description: string;
    cost: number;
  }[];
  updatedAt: string;
}

export interface Rental {
  id: string;
  customerId: string;
  vehicleId: string;
  driverId?: string;
  startDate: string;
  endDate: string;
  status: RentalStatus;
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  notes?: string;
  history: {
    id: string;
    date: string;
    action: string;
    description: string;
    userId: string;
  }[];
  updatedAt: string;
}

export interface BudgetVehicle {
  vehicleName: ReactNode;
  id: string;
  vehicleId: string;
  startDate: string;
  endDate: string;
  dailyRate: number;
  totalDays: number;
  totalAmount: number;
  notes?: string;
}

export interface Budget {
  id: string;
  customerId: string;
  vehicles: BudgetVehicle[];
  status: BudgetStatus;
  totalAmount: number;
  notes?: string;
  history: {
    id: string;
    date: string;
    action: string;
    description: string;
    userId: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface ExtraCost {
  id: string;
  type: 'extra_hours' | 'other';
  description: string;
  quantity?: number;
  unitValue: number;
  totalValue: number;
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
  history: {
    id: string;
    date: string;
    action: string;
    description: string;
    userId: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface ServiceWithDetails extends Omit<Service, 'vehicles'> {
  customer: Customer;
  budget: Budget | null;
  vehicles: Array<{
    id: string;
    vehicleId: string;
    vehicle: Vehicle | null;
    startDate: string;
    endDate: string;
    dailyRate: number;
    totalDays: number;
    totalAmount: number;
    notes?: string;
  }>;
}

export interface Stats {
  total: number;
  trend: number;
  description?: string;
}

export interface CompanySettings {
  id: string;
  name: string;
  document: string;
  email: string;
  phone: string;
  website?: string;
  logo?: string;
  address: string;
  socialMedia: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
  };
  bankInfo: {
    bank: string;
    agency: string;
    account: string;
    pixKey?: string;
  };
  updatedAt: string;
}
