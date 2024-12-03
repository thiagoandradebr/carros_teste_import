export type VehicleCategory = "HATCH" | "SEDAN" | "SUV" | "LUXURY" | "TRUCK" | "MOTORCYCLE";
export type VehicleStatus = "available" | "unavailable" | "maintenance";

export interface Vehicle {
  id: string;
  vehicleName: string;
  brand: string;
  model: string;
  year: number;
  plate: string;
  color: string;
  category: VehicleCategory;
  status: VehicleStatus;
  dailyRate: number;
  supplier: string;
  isArmored: boolean;
  updatedAt: string;
}

export interface NewVehicle {
  vehicleName: string;
  brand?: string;
  model?: string;
  year?: number;
  plate?: string;
  color?: string;
  category: VehicleCategory;
  status?: VehicleStatus;
  dailyRate?: number;
  supplier?: string;
  isArmored?: boolean;
}
