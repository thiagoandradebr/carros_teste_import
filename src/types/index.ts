export * from './vehicle';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

export type VehicleStatus = "available" | "unavailable" | "maintenance";

export interface Vehicle {
  id: string;
  vehicleName: string;
  brand: string;
  model: string;
  year: number;
  plate: string;
  color: string;
  category: "HATCH" | "SEDAN" | "SUV" | "LUXURY" | "TRUCK" | "MOTORCYCLE";
  status: VehicleStatus;
  dailyRate: number;
  supplier: string;
  isArmored: boolean;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  notes?: string;
  status: "active" | "blocked" | "vip";
  updatedAt?: string;
}

export interface Rental {
  id: string;
  vehicleId: string;
  customerId: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'active' | 'completed';
  dailyRate: number;
  totalAmount: number;
}

export interface Driver {
  id: string;
  name: string;
  cpf: string;
  cnh: string;
  cnhValidity: string;
  cnhPoints?: number;
  phone: string;
  photo?: string;
  cnhDocument?: string;
  notes?: string;
  status: "active" | "inactive" | "training" | "suspended";
  address: {
    cep: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
  };
  trips?: {
    id: string;
    date: string;
    destination: string;
    distance: number;
    rating?: number;
    notes?: string;
  }[];
  updatedAt?: string;
}

export interface BudgetVehicle {
  id: string;
  vehicleId: string;
  vehicleName: string;
  startDate: string;
  endDate: string;
  dailyRate: number;
  totalDays: number;
  totalAmount: number;
  notes?: string;
}

export interface Budget {
  id: string;
  customerId?: string;
  vehicles: BudgetVehicle[];
  totalAmount: number;
  status: "draft" | "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
  history: {
    id: string;
    date: string;
    action: string;
    description: string;
    userId: string;
  }[];
}

export interface CompanySettings {
  name: string;
  document: string; // CNPJ
  email: string;
  phone: string;
  address: string;
  logo?: string; // URL da logo
  website?: string;
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
  };
  bankInfo?: {
    bank: string;
    agency: string;
    account: string;
    pixKey?: string;
  };
}
