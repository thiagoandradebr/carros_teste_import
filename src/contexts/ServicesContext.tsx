import { createContext, useContext, useState, useEffect } from "react";
import { Service, ServiceStatus } from "@/types/service";
import { generateUUID } from "@/utils/uuid";

interface ServicesContextType {
  services: Service[];
  addService: (service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) => Service;
  updateService: (service: Service) => void;
  deleteService: (serviceId: string) => void;
  getServiceWithDetails: (serviceId: string) => Service | null;
  updateServiceStatus: (serviceId: string, status: ServiceStatus) => void;
}

const ServicesContext = createContext<ServicesContextType | undefined>(undefined);

const STORAGE_KEY = 'services';

export function ServicesProvider({ children }: { children: React.ReactNode }) {
  const [services, setServices] = useState<Service[]>([]);

  // Carregar serviços do localStorage
  useEffect(() => {
    const storedServices = localStorage.getItem(STORAGE_KEY);
    if (storedServices) {
      setServices(JSON.parse(storedServices));
    }
  }, []);

  // Salvar serviços no localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
  }, [services]);

  const addService = (serviceData: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newService: Service = {
      id: generateUUID(),
      ...serviceData,
      createdAt: now,
      updatedAt: now,
      documents: [],
    };

    setServices(prev => [...prev, newService]);
    return newService;
  };

  const updateService = (service: Service) => {
    const updatedService = {
      ...service,
      updatedAt: new Date().toISOString(),
    };

    setServices(prev =>
      prev.map(s => (s.id === service.id ? updatedService : s))
    );
  };

  const deleteService = (serviceId: string) => {
    setServices(prev => prev.filter(s => s.id !== serviceId));
  };

  const getServiceWithDetails = (serviceId: string): Service | null => {
    return services.find(s => s.id === serviceId) || null;
  };

  const updateServiceStatus = (serviceId: string, status: ServiceStatus) => {
    setServices(prev =>
      prev.map(s => {
        if (s.id === serviceId) {
          return {
            ...s,
            status,
            updatedAt: new Date().toISOString(),
          };
        }
        return s;
      })
    );
  };

  const value = {
    services,
    addService,
    updateService,
    deleteService,
    getServiceWithDetails,
    updateServiceStatus,
  };

  return (
    <ServicesContext.Provider value={value}>
      {children}
    </ServicesContext.Provider>
  );
}

export function useServices() {
  const context = useContext(ServicesContext);
  if (!context) {
    throw new Error('useServices must be used within a ServicesProvider');
  }
  return context;
}

export { ServicesContext };
