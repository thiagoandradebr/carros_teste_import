export type VehicleOwnership = "own" | "third-party";

export type VehicleBrand = "JEEP" | "CITROEN" | "BYD" | "TOYOTA" | "MERCEDES";

export type VehicleModel = "COMMANDER" | "JUMPY" | "SONG PLUS" | "COROLLA" | "VITO";

export const vehicleBrands: { value: VehicleBrand; label: string }[] = [
  { value: "JEEP", label: "Jeep" },
  { value: "CITROEN", label: "Citroën" },
  { value: "BYD", label: "BYD" },
  { value: "TOYOTA", label: "Toyota" },
  { value: "MERCEDES", label: "Mercedes" },
];

export const vehicleModelsByBrand: Record<VehicleBrand, { value: VehicleModel; label: string }[]> = {
  JEEP: [{ value: "COMMANDER", label: "Commander" }],
  CITROEN: [{ value: "JUMPY", label: "Jumpy" }],
  BYD: [{ value: "SONG PLUS", label: "Song Plus" }],
  TOYOTA: [{ value: "COROLLA", label: "Corolla" }],
  MERCEDES: [{ value: "VITO", label: "Vito" }],
};

export type VehicleCategory = 
  | "SUV"
  | "SEDAN"
  | "MINIVAN"
  | "VAN"
  | "LUXO";

export type VehicleStatus = "active" | "maintenance" | "inactive";

const vehicleStatusConfig = {
  active: { color: "bg-green-100 text-green-800", label: "Ativo" },
  maintenance: { color: "bg-yellow-100 text-yellow-800", label: "Manutenção" },
  inactive: { color: "bg-red-100 text-red-800", label: "Inativo" },
} as const;

export type VehicleDocumentType = "crlv" | "ipva" | "seguro" | "laudo" | "outro";

export interface MaintenanceRecord {
  id: string;
  date: string;
  type: string;
  description: string;
  cost: number;
}

export interface VehicleDocument {
  id: string;
  name: string;
  type: VehicleDocumentType;
  url: string;
  uploadedAt: string;
  expirationDate?: string;
}

export interface VehiclePhoto {
  id: string;
  url: string;
  description?: string;
  uploadedAt: string;
  isPrimary: boolean;
}

export interface VehicleRentalHistory {
  id: string;
  startDate: string;
  endDate: string;
  customerName: string;
  customerId: string;
  status: "active" | "completed" | "cancelled";
  totalAmount: number;
  notes?: string;
}

export type VehicleColor = "PRETO" | "CINZA" | "PRATA" | "AZUL" | "BRANCO";

export interface Vehicle {
  id: string;
  ownership: VehicleOwnership;
  brand: VehicleBrand;
  model: VehicleModel;
  year: number;
  plate: string;
  color: VehicleColor;
  category: VehicleCategory;
  supplier?: string;
  isArmored: boolean;
  status: VehicleStatus;
  mileage?: number;
  lastMaintenance?: string;
  nextMaintenance?: string;
  maintenanceHistory?: MaintenanceRecord[];
  updatedAt: string;
  photos: VehiclePhoto[];
  documents: VehicleDocument[];
  notes: string;
  rentalHistory: VehicleRentalHistory[];
  rentals?: VehicleRentalHistory[];
  dailyRate: number;
}

// Campos que não devem ser incluídos ao criar um novo veículo
type ExcludedFields = 
  | "id" 
  | "updatedAt" 
  | "photos" 
  | "documents" 
  | "rentalHistory" 
  | "rentals"
  | "maintenanceHistory";

export type NewVehicle = Omit<Vehicle, ExcludedFields> & {
  photos?: VehiclePhoto[];
  documents?: VehicleDocument[];
  rentalHistory?: VehicleRentalHistory[];
  rentals?: VehicleRentalHistory[];
  maintenanceHistory?: MaintenanceRecord[];
};
