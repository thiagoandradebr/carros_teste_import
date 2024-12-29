import { createContext, useContext, useState, ReactNode } from "react";

interface ModalsContextData {
  isNewBudgetOpen: boolean;
  isNewVehicleOpen: boolean;
  isNewDriverOpen: boolean;
  isNewCustomerOpen: boolean;
  openNewBudget: () => void;
  closeNewBudget: () => void;
  openNewVehicle: () => void;
  closeNewVehicle: () => void;
  openNewDriver: () => void;
  closeNewDriver: () => void;
  openNewCustomer: () => void;
  closeNewCustomer: () => void;
  openCustomerForm: (params?: { onSuccess?: (customer: any) => void }) => void;
}

const ModalsContext = createContext<ModalsContextData>({} as ModalsContextData);

export function ModalsProvider({ children }: { children: ReactNode }) {
  const [isNewBudgetOpen, setIsNewBudgetOpen] = useState(false);
  const [isNewVehicleOpen, setIsNewVehicleOpen] = useState(false);
  const [isNewDriverOpen, setIsNewDriverOpen] = useState(false);
  const [isNewCustomerOpen, setIsNewCustomerOpen] = useState(false);

  const openNewBudget = () => setIsNewBudgetOpen(true);
  const closeNewBudget = () => setIsNewBudgetOpen(false);
  const openNewVehicle = () => setIsNewVehicleOpen(true);
  const closeNewVehicle = () => setIsNewVehicleOpen(false);
  const openNewDriver = () => setIsNewDriverOpen(true);
  const closeNewDriver = () => setIsNewDriverOpen(false);
  const openNewCustomer = () => setIsNewCustomerOpen(true);
  const closeNewCustomer = () => setIsNewCustomerOpen(false);

  const openCustomerForm = (params?: { onSuccess?: (customer: any) => void }) => {
    // TO DO: implement openCustomerForm logic
  };

  return (
    <ModalsContext.Provider
      value={{
        isNewBudgetOpen,
        isNewVehicleOpen,
        isNewDriverOpen,
        isNewCustomerOpen,
        openNewBudget,
        closeNewBudget,
        openNewVehicle,
        closeNewVehicle,
        openNewDriver,
        closeNewDriver,
        openNewCustomer,
        closeNewCustomer,
        openCustomerForm,
      }}
    >
      {children}
    </ModalsContext.Provider>
  );
}

export function useModals() {
  const context = useContext(ModalsContext);
  if (!context) {
    throw new Error("useModals must be used within a ModalsProvider");
  }
  return context;
}
