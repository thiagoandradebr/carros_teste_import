import { createContext, useContext, useEffect, useState } from "react";
import { Driver, DriverStatus } from "@/types/driver";
import { v4 as uuidv4 } from "uuid";

interface DriversContextData {
  drivers: Driver[];
  addDriver: (driver: Omit<Driver, "id">) => Promise<Driver>;
  updateDriver: (id: string, driver: Partial<Driver>) => Promise<Driver>;
  removeDriver: (id: string) => Promise<void>;
  updateDriverStatus: (id: string, status: DriverStatus) => Promise<Driver>;
}

const DriversContext = createContext<DriversContextData>({} as DriversContextData);

export function DriversProvider({ children }: { children: React.ReactNode }) {
  const [drivers, setDrivers] = useState<Driver[]>([]);

  useEffect(() => {
    const storedDrivers = localStorage.getItem("drivers");
    if (storedDrivers) {
      setDrivers(JSON.parse(storedDrivers));
    }
  }, []);

  const saveDrivers = (updatedDrivers: Driver[]) => {
    localStorage.setItem("drivers", JSON.stringify(updatedDrivers));
    setDrivers(updatedDrivers);
  };

  const addDriver = async (driverData: Omit<Driver, "id">): Promise<Driver> => {
    const newDriver = { ...driverData, id: uuidv4() };
    const updatedDrivers = [...drivers, newDriver];
    saveDrivers(updatedDrivers);
    return newDriver;
  };

  const updateDriver = async (id: string, driverData: Partial<Driver>): Promise<Driver> => {
    const driverIndex = drivers.findIndex(d => d.id === id);
    if (driverIndex === -1) {
      throw new Error("Motorista não encontrado");
    }

    const updatedDriver = { ...drivers[driverIndex], ...driverData };
    const updatedDrivers = [...drivers];
    updatedDrivers[driverIndex] = updatedDriver;
    saveDrivers(updatedDrivers);
    return updatedDriver;
  };

  const removeDriver = async (id: string): Promise<void> => {
    const updatedDrivers = drivers.filter(d => d.id !== id);
    saveDrivers(updatedDrivers);
  };

  const updateDriverStatus = async (id: string, status: DriverStatus): Promise<Driver> => {
    return updateDriver(id, { status });
  };

  return (
    <DriversContext.Provider
      value={{
        drivers,
        addDriver,
        updateDriver,
        removeDriver,
        updateDriverStatus,
      }}
    >
      {children}
    </DriversContext.Provider>
  );
}

export function useDrivers() {
  const context = useContext(DriversContext);
  if (!context) {
    throw new Error("useDrivers deve ser usado dentro de um DriversProvider");
  }
  return context;
}
