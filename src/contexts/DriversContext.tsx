import { createContext, useContext, ReactNode } from 'react';
import { Driver } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { mockDrivers } from '@/mocks/drivers';

interface DriversContextType {
  drivers: Driver[];
  addDriver: (driver: Driver) => void;
  updateDriver: (driver: Driver) => void;
  deleteDriver: (driverId: string) => void;
  getDriverById: (driverId: string) => Driver | undefined;
}

const DriversContext = createContext<DriversContextType | undefined>(undefined);

export function DriversProvider({ children }: { children: ReactNode }) {
  const [drivers, setDrivers] = useLocalStorage<Driver[]>('drivers', mockDrivers);

  const addDriver = (driver: Driver) => {
    setDrivers(prev => [...prev, {
      ...driver,
      updatedAt: new Date().toISOString()
    }]);
  };

  const updateDriver = (updatedDriver: Driver) => {
    setDrivers(prev =>
      prev.map(driver =>
        driver.id === updatedDriver.id
          ? { ...updatedDriver, updatedAt: new Date().toISOString() }
          : driver
      )
    );
  };

  const deleteDriver = (driverId: string) => {
    setDrivers(prev => prev.filter(driver => driver.id !== driverId));
  };

  const getDriverById = (driverId: string) => {
    return drivers.find(driver => driver.id === driverId);
  };

  return (
    <DriversContext.Provider
      value={{
        drivers,
        addDriver,
        updateDriver,
        deleteDriver,
        getDriverById,
      }}
    >
      {children}
    </DriversContext.Provider>
  );
}

export function useDrivers() {
  const context = useContext(DriversContext);
  if (context === undefined) {
    throw new Error('useDrivers must be used within a DriversProvider');
  }
  return context;
}
