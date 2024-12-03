import { createContext, useContext, useState, useEffect } from "react";
import { Service, ServiceWithDetails, Budget, BudgetStatus, ServiceStatus } from "@/types";
import { mockCustomers } from "@/mocks/customers";
import { mockBudgets } from "@/mocks/budgets";
import { mockVehicles } from "@/mocks/vehicles";

// Funções utilitárias
const calculateTotalAmount = (service: Partial<Service>) => {
  const subtotal = service.vehicles?.reduce((sum, v) => sum + v.totalAmount, 0) || 0;
  const extraCosts = service.extraCosts?.reduce((sum, c) => sum + c.totalValue, 0) || 0;
  return subtotal + extraCosts;
};

const addHistoryEntry = (history: Service['history'], action: string, description: string) => {
  return [
    ...history,
    {
      id: `h${Date.now()}`,
      date: new Date().toISOString(),
      action,
      description,
      userId: "u1", // Em produção, usar ID do usuário logado
    },
  ];
};

interface ServicesContextType {
  services: Service[];
  addService: (service: Service) => void;
  updateService: (service: Service) => void;
  deleteService: (serviceId: string) => void;
  getServiceWithDetails: (serviceId: string) => ServiceWithDetails | null;
  convertBudgetToService: (budget: Budget) => void;
  updateServiceStatus: (serviceId: string, status: ServiceStatus) => void;
}

const ServicesContext = createContext<ServicesContextType | undefined>(undefined);

export function ServicesProvider({ children }: { children: React.ReactNode }) {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const storedServices = localStorage.getItem("services");
    if (storedServices) {
      setServices(JSON.parse(storedServices));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("services", JSON.stringify(services));
  }, [services]);

  const addService = (service: Service) => {
    const newService = {
      ...service,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "pending" as ServiceStatus,
      history: addHistoryEntry([], "created", "Serviço criado"),
    };
    setServices((prev) => [...prev, newService]);
  };

  const updateService = (service: Service) => {
    const updatedService = {
      ...service,
      updatedAt: new Date().toISOString(),
      history: addHistoryEntry(service.history, "updated", "Serviço atualizado"),
    };
    setServices((prev) =>
      prev.map((s) => (s.id === service.id ? updatedService : s))
    );
  };

  const updateServiceStatus = (serviceId: string, status: ServiceStatus) => {
    setServices((prev) =>
      prev.map((s) => {
        if (s.id === serviceId) {
          return {
            ...s,
            status,
            updatedAt: new Date().toISOString(),
            history: addHistoryEntry(
              s.history,
              "status_updated",
              `Status atualizado para ${status}`
            ),
          };
        }
        return s;
      })
    );
  };

  const deleteService = (serviceId: string) => {
    setServices((prev) => prev.filter((s) => s.id !== serviceId));
  };

  const getServiceWithDetails = (serviceId: string): ServiceWithDetails | null => {
    const service = services.find((s) => s.id === serviceId);
    if (!service) return null;

    const customer = mockCustomers.find((c) => c.id === service.customerId);
    if (!customer) return null;

    const budget = mockBudgets.find((b) => b.id === service.budgetId);

    const vehicles = service.vehicles.map((v) => ({
      ...v,
      vehicle: mockVehicles.find((mv) => mv.id === v.vehicleId) || null,
    }));

    const { vehicles: _, ...serviceWithoutVehicles } = service;

    return {
      ...serviceWithoutVehicles,
      customer,
      budget: budget || null,
      vehicles,
    };
  };

  const convertBudgetToService = (budget: Budget) => {
    // Validar status do orçamento
    if (budget.status !== "approved") {
      throw new Error("Apenas orçamentos aprovados podem ser convertidos em serviços");
    }

    const newService: Service = {
      id: `s${Date.now()}`,
      budgetId: budget.id,
      customerId: budget.customerId,
      vehicles: budget.vehicles,
      status: "pending",
      extraCosts: [],
      subtotalAmount: budget.totalAmount,
      extraCostsAmount: 0,
      totalAmount: budget.totalAmount,
      history: addHistoryEntry(
        [],
        "created",
        `Serviço criado a partir do orçamento #${budget.id}`
      ),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addService(newService);
  };

  return (
    <ServicesContext.Provider
      value={{
        services,
        addService,
        updateService,
        deleteService,
        getServiceWithDetails,
        convertBudgetToService,
        updateServiceStatus,
      }}
    >
      {children}
    </ServicesContext.Provider>
  );
}

export function useServices() {
  const context = useContext(ServicesContext);
  if (context === undefined) {
    throw new Error("useServices must be used within a ServicesProvider");
  }
  return context;
}
