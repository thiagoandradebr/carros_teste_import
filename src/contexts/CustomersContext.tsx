import { createContext, useContext, ReactNode } from 'react';
import { Customer } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { mockCustomers } from '@/mocks/customers';

interface CustomersContextType {
  customers: Customer[];
  addCustomer: (customer: Customer) => void;
  updateCustomer: (customer: Customer) => void;
  deleteCustomer: (customerId: string) => void;
  getCustomerById: (customerId: string) => Customer | undefined;
}

const CustomersContext = createContext<CustomersContextType | undefined>(undefined);

export function CustomersProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useLocalStorage<Customer[]>('customers', mockCustomers);

  const addCustomer = (customer: Customer) => {
    setCustomers(prev => [...prev, {
      ...customer,
      updatedAt: new Date().toISOString()
    }]);
  };

  const updateCustomer = (updatedCustomer: Customer) => {
    setCustomers(prev =>
      prev.map(customer =>
        customer.id === updatedCustomer.id
          ? { ...updatedCustomer, updatedAt: new Date().toISOString() }
          : customer
      )
    );
  };

  const deleteCustomer = (customerId: string) => {
    setCustomers(prev => prev.filter(customer => customer.id !== customerId));
  };

  const getCustomerById = (customerId: string) => {
    return customers.find(customer => customer.id === customerId);
  };

  return (
    <CustomersContext.Provider
      value={{
        customers,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        getCustomerById,
      }}
    >
      {children}
    </CustomersContext.Provider>
  );
}

export function useCustomers() {
  const context = useContext(CustomersContext);
  if (context === undefined) {
    throw new Error('useCustomers must be used within a CustomersProvider');
  }
  return context;
}
