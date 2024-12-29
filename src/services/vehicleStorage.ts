import { Vehicle, NewVehicle } from "@/types/vehicle";
import { saveItem, getItem, removeItem, getAllItems } from "./storage";

// Função auxiliar para validar campos opcionais
function validateOptionalFields(vehicle: Vehicle): Vehicle {
  return {
    ...vehicle,
    mileage: vehicle.mileage ? Number(vehicle.mileage) : null,
    documents: Array.isArray(vehicle.documents) ? vehicle.documents : [],
    notes: typeof vehicle.notes === 'string' ? vehicle.notes : '',
    maintenanceHistory: Array.isArray(vehicle.maintenanceHistory) 
      ? vehicle.maintenanceHistory.map(item => ({
          id: String(item.id),
          date: String(item.date),
          type: String(item.type),
          description: String(item.description),
          cost: Number(item.cost)
        }))
      : []
  };
}

// Função auxiliar para validar campos obrigatórios
function isValidVehicle(vehicle: any): vehicle is Vehicle {
  return (
    vehicle &&
    typeof vehicle.id === 'string' &&
    typeof vehicle.brand === 'string' &&
    typeof vehicle.model === 'string' &&
    typeof vehicle.year === 'number' &&
    vehicle.year > 1900 &&
    typeof vehicle.plate === 'string' &&
    /^[A-Z]{3}[0-9][0-9A-Z][0-9]{2}$/.test(vehicle.plate) &&
    typeof vehicle.color === 'string' &&
    typeof vehicle.category === 'string' &&
    typeof vehicle.status === 'string' &&
    ["active", "maintenance", "inactive"].includes(vehicle.status) &&
    typeof vehicle.supplier === 'string' &&
    typeof vehicle.isArmored === 'boolean'
  );
}

export async function loadVehicles(): Promise<Vehicle[]> {
  try {
    const vehicles = await getAllItems<Vehicle>('vehicles');
    return vehicles.map(validateOptionalFields).filter(isValidVehicle);
  } catch (error) {
    console.error('Error loading vehicles:', error);
    return [];
  }
}

export async function saveVehicle(vehicle: Vehicle): Promise<void> {
  try {
    const validatedVehicle = validateOptionalFields(vehicle);
    if (!isValidVehicle(validatedVehicle)) {
      throw new Error('Invalid vehicle data');
    }
    await saveItem('vehicles', validatedVehicle.id, validatedVehicle);
  } catch (error) {
    console.error('Error saving vehicle:', error);
    throw error;
  }
}

export async function addVehicle(vehicle: NewVehicle): Promise<string> {
  try {
    const validatedVehicle = validateOptionalFields(vehicle as Vehicle);
    if (!isValidVehicle(validatedVehicle)) {
      throw new Error('Invalid vehicle data');
    }
    await saveItem('vehicles', validatedVehicle.id, validatedVehicle);
    return validatedVehicle.id;
  } catch (error) {
    console.error('Error adding vehicle:', error);
    throw error;
  }
}

export async function removeVehicle(id: string): Promise<void> {
  try {
    await removeItem('vehicles', id);
  } catch (error) {
    console.error('Error removing vehicle:', error);
    throw error;
  }
}

export async function updateVehicle(id: string, updates: Partial<Vehicle>): Promise<void> {
  try {
    const existingVehicle = await getItem<Vehicle>('vehicles', id);
    if (!existingVehicle) {
      throw new Error('Vehicle not found');
    }

    const updatedVehicle = validateOptionalFields({
      ...existingVehicle,
      ...updates,
      updatedAt: new Date().toISOString()
    });

    if (!isValidVehicle(updatedVehicle)) {
      throw new Error('Invalid vehicle data');
    }

    await saveItem('vehicles', id, updatedVehicle);
  } catch (error) {
    console.error('Error updating vehicle:', error);
    throw error;
  }
}
