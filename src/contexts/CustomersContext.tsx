import { createContext, useContext, useState, useEffect } from "react";
import { Customer, CustomerStatus } from "@/types/customer";
import { saveCustomer, loadCustomers, removeCustomer as removeCustomerFromStorage } from "@/services/customerStorage";

interface CustomersContextData {
  customers: Customer[];
  addCustomer: (customer: Customer) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  removeCustomer: (id: string) => void;
  updateCustomerStatus: (id: string, status: CustomerStatus) => void;
}

const CustomersContext = createContext<CustomersContextData>({} as CustomersContextData);

export function CustomersProvider({ children }: { children: React.ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const loadedCustomers = loadCustomers();
    setCustomers(loadedCustomers);
  }, []);

  const addCustomer = (customer: Customer) => {
    console.log("Adicionando cliente no contexto:", customer);
    setCustomers((prev) => {
      const updated = [...prev, customer];
      saveCustomer(updated);
      return updated;
    });
  };

  const updateCustomer = (id: string, customer: Partial<Customer>) => {
    setCustomers((prev) => {
      const updated = prev.map((c) =>
        c.id === id
          ? {
              ...c,
              ...customer,
              updatedAt: new Date().toISOString(),
            }
          : c
      );
      saveCustomer(updated);
      return updated;
    });
  };

  const updateCustomerStatus = (id: string, status: CustomerStatus) => {
    setCustomers((prev) => {
      const updated = prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status,
              updatedAt: new Date().toISOString(),
            }
          : c
      );
      saveCustomer(updated);
      return updated;
    });
  };

  const removeCustomer = (id: string) => {
    setCustomers((prev) => {
      const updated = prev.filter((customer) => customer.id !== id);
      removeCustomerFromStorage(id);
      return updated;
    });
  };

  return (
    <CustomersContext.Provider
      value={{
        customers,
        addCustomer,
        updateCustomer,
        removeCustomer,
        updateCustomerStatus,
      }}
    >
      {children}
    </CustomersContext.Provider>
  );
}

export const useCustomers = () => useContext(CustomersContext);
