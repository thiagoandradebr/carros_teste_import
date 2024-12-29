import { createContext, useContext, useState, useEffect } from "react";
import { Vehicle, NewVehicle, VehicleStatus } from "@/types/vehicle";
import { saveVehicle, loadVehicles, removeVehicle as removeVehicleFromStorage, updateVehicle as updateVehicleInStorage } from "@/services/vehicleStorage";
import { generateUUID } from "@/utils/uuid";

interface VehiclesContextData {
  vehicles: Vehicle[];
  loading: boolean;
  addVehicle: (vehicle: NewVehicle) => Promise<void>;
  updateVehicle: (id: string, vehicle: Partial<NewVehicle>) => Promise<void>;
  removeVehicle: (id: string) => Promise<void>;
  updateVehicleStatus: (id: string, status: VehicleStatus) => Promise<void>;
}

const VehiclesContext = createContext<VehiclesContextData>({} as VehiclesContextData);

export function VehiclesProvider({ children }: { children: React.ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const loadedVehicles = await loadVehicles();
        setVehicles(loadedVehicles);
      } catch (error) {
        console.error('Error loading vehicles:', error);
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();
  }, []);

  const addVehicle = async (vehicle: NewVehicle) => {
    try {
      const newVehicle: Vehicle = {
        ...vehicle,
        id: generateUUID(),
        updatedAt: new Date().toISOString(),
        photos: vehicle.photos || [],
        documents: vehicle.documents || [],
        rentalHistory: vehicle.rentalHistory || [],
        rentals: vehicle.rentals || [],
        maintenanceHistory: vehicle.maintenanceHistory || []
      };

      await saveVehicle(newVehicle);
      setVehicles(prev => [...prev, newVehicle]);
    } catch (error) {
      console.error('Error adding vehicle:', error);
      throw error;
    }
  };

  const updateVehicle = async (id: string, updates: Partial<NewVehicle>) => {
    try {
      const existingVehicle = vehicles.find(v => v.id === id);
      if (!existingVehicle) {
        throw new Error('Vehicle not found');
      }

      const updatedVehicle = {
        ...existingVehicle,
        ...updates,
        updatedAt: new Date().toISOString()
      };

      await updateVehicleInStorage(id, updatedVehicle);
      setVehicles(prev => prev.map(v => v.id === id ? updatedVehicle : v));
    } catch (error) {
      console.error('Error updating vehicle:', error);
      throw error;
    }
  };

  const removeVehicle = async (id: string) => {
    try {
      await removeVehicleFromStorage(id);
      setVehicles(prev => prev.filter(vehicle => vehicle.id !== id));
    } catch (error) {
      console.error('Error removing vehicle:', error);
      throw error;
    }
  };

  const updateVehicleStatus = async (id: string, status: VehicleStatus) => {
    try {
      await updateVehicleInStorage(id, { status });
      setVehicles(prev =>
        prev.map(v =>
          v.id === id
            ? {
                ...v,
                status,
                updatedAt: new Date().toISOString()
              }
            : v
        )
      );
    } catch (error) {
      console.error('Error updating vehicle status:', error);
      throw error;
    }
  };

  return (
    <VehiclesContext.Provider
      value={{ 
        vehicles, 
        loading,
        addVehicle, 
        updateVehicle, 
        removeVehicle, 
        updateVehicleStatus 
      }}
    >
      {children}
    </VehiclesContext.Provider>
  );
}

export const useVehicles = () => {
  const context = useContext(VehiclesContext);
  if (!context) {
    throw new Error('useVehicles must be used within a VehiclesProvider');
  }
  return context;
};
