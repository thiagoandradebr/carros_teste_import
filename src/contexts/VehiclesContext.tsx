import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Vehicle } from "@/types";
import * as vehicleStorage from "@/services/vehicleStorage";

type NewVehicle = Parameters<typeof vehicleStorage.addVehicle>[0];

interface VehiclesContextData {
  vehicles: Vehicle[];
  addVehicle: (vehicle: NewVehicle) => string;
  updateVehicle: (id: string, vehicle: Partial<Vehicle>) => boolean;
  deleteVehicle: (id: string) => boolean;
  getVehicleById: (id: string) => Vehicle | undefined;
  clearVehicles: () => void;
}

const VehiclesContext = createContext<VehiclesContextData>({} as VehiclesContextData);

export function VehiclesProvider({ children }: { children: ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    // Carrega os veículos do localStorage quando o componente é montado
    setVehicles(vehicleStorage.getVehicles());
  }, []);

  const addVehicle = (vehicle: NewVehicle) => {
    const id = vehicleStorage.addVehicle(vehicle);
    setVehicles(vehicleStorage.getVehicles());
    return id;
  };

  const updateVehicle = (id: string, vehicle: Partial<Vehicle>) => {
    const success = vehicleStorage.updateVehicle(id, vehicle);
    if (success) {
      setVehicles(vehicleStorage.getVehicles());
    }
    return success;
  };

  const deleteVehicle = (id: string) => {
    const success = vehicleStorage.deleteVehicle(id);
    if (success) {
      setVehicles(vehicleStorage.getVehicles());
    }
    return success;
  };

  const getVehicleById = (id: string) => {
    return vehicleStorage.getVehicleById(id);
  };

  const clearVehicles = () => {
    vehicleStorage.clearVehicles();
    setVehicles([]);
  };

  return (
    <VehiclesContext.Provider
      value={{
        vehicles,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        getVehicleById,
        clearVehicles,
      }}
    >
      {children}
    </VehiclesContext.Provider>
  );
}

export function useVehicles() {
  const context = useContext(VehiclesContext);
  if (!context) {
    throw new Error("useVehicles must be used within a VehiclesProvider");
  }
  return context;
}
