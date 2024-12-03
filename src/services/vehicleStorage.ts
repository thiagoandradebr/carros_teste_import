import { Vehicle, NewVehicle } from "@/types/vehicle";

const STORAGE_KEY = "vehicles";

export function getVehicles(): Vehicle[] {
  const storedVehicles = localStorage.getItem(STORAGE_KEY);
  const vehicles = storedVehicles ? JSON.parse(storedVehicles) : [];
  
  // Filtra veículos inválidos
  const validVehicles = vehicles.filter((vehicle: Vehicle) => 
    vehicle &&
    vehicle.id &&
    vehicle.plate &&
    vehicle.brand &&
    vehicle.model &&
    vehicle.year > 0 &&
    vehicle.category &&
    vehicle.status
  );

  // Se houver veículos inválidos, atualiza o storage apenas com os válidos
  if (validVehicles.length !== vehicles.length) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(validVehicles));
  }

  return validVehicles;
}

export function addVehicle(vehicle: NewVehicle): string {
  const vehicles = getVehicles();
  const newVehicle = {
    id: Math.random().toString(36).substr(2, 9),
    brand: vehicle.brand || "",
    model: vehicle.model || "",
    year: vehicle.year || 0,
    plate: vehicle.plate || "",
    color: vehicle.color || "",
    category: vehicle.category,
    status: vehicle.status || "available",
    dailyRate: vehicle.dailyRate || 0,
    supplier: vehicle.supplier || "",
    isArmored: vehicle.isArmored || false,
    updatedAt: new Date().toISOString(),
    vehicleName: vehicle.vehicleName
  } satisfies Vehicle;

  vehicles.push(newVehicle);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
  return newVehicle.id;
}

export function updateVehicle(id: string, vehicle: Partial<Vehicle>): boolean {
  const vehicles = getVehicles();
  const index = vehicles.findIndex((v) => v.id === id);
  if (index === -1) return false;
  vehicles[index] = { ...vehicles[index], ...vehicle };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
  return true;
}

export function deleteVehicle(id: string): boolean {
  const vehicles = getVehicles();
  const index = vehicles.findIndex((v) => v.id === id);
  if (index === -1) return false;
  vehicles.splice(index, 1);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
  return true;
}

export function getVehicleById(id: string): Vehicle | undefined {
  const vehicles = getVehicles();
  return vehicles.find((v) => v.id === id);
}

export function clearVehicles(): void {
  localStorage.removeItem(STORAGE_KEY);
}
