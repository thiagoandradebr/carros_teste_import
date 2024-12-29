import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { BudgetsProvider } from "@/contexts/BudgetsContext";
import { CustomersProvider } from "@/contexts/CustomersContext";
import { DriversProvider } from "@/contexts/DriversContext";
import { ServicesProvider } from "@/contexts/ServicesContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { VehiclesProvider } from "@/contexts/VehiclesContext";
import { ModalsProvider, useModals } from "@/contexts/ModalsContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { VehicleForm } from "@/components/vehicles/VehicleForm";
import { DriverForm } from "@/components/drivers/DriverForm";
import { CustomerFormModal } from "@/components/customers/CustomerFormModal";
import { BudgetFormModal } from "@/components/budgets/BudgetFormModal";
import { useCustomers } from "@/contexts/CustomersContext";
import { useToast } from "@/components/ui/use-toast";

const queryClient = new QueryClient();

function GlobalModals() {
  const {
    isNewBudgetOpen,
    closeNewBudget,
    isNewVehicleOpen,
    closeNewVehicle,
    isNewDriverOpen,
    closeNewDriver,
    isNewCustomerOpen,
    closeNewCustomer,
  } = useModals();

  const { addCustomer } = useCustomers();
  const { toast } = useToast();

  return (
    <>
      <BudgetFormModal
        open={isNewBudgetOpen}
        onOpenChange={closeNewBudget}
        onSubmit={() => {
          closeNewBudget();
        }}
        mode="create"
      />

      <Dialog open={isNewVehicleOpen} onOpenChange={closeNewVehicle}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Novo Veículo</DialogTitle>
          </DialogHeader>
          <VehicleForm
            onSuccess={() => {
              closeNewVehicle();
            }}
            onCancel={() => closeNewVehicle()}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isNewDriverOpen} onOpenChange={closeNewDriver}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Novo Motorista</DialogTitle>
          </DialogHeader>
          <DriverForm
            onSuccess={() => {
              closeNewDriver();
            }}
            onCancel={() => closeNewDriver()}
          />
        </DialogContent>
      </Dialog>

      <CustomerFormModal
        open={isNewCustomerOpen}
        onOpenChange={closeNewCustomer}
        onSubmit={async (data) => {
          try {
            addCustomer(data);
            toast({
              title: "Cliente adicionado",
              description: "O cliente foi adicionado com sucesso.",
            });
            closeNewCustomer();
          } catch (error) {
            console.error("Erro ao adicionar cliente:", error);
            toast({
              title: "Erro ao adicionar cliente",
              description: "Ocorreu um erro ao adicionar o cliente.",
              variant: "destructive"
            });
          }
        }}
        mode="create"
      />
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AuthProvider>
          <SettingsProvider>
            <CustomersProvider>
              <DriversProvider>
                <VehiclesProvider>
                  <ServicesProvider>
                    <BudgetsProvider>
                      <ModalsProvider>
                        <RouterProvider router={router} />
                        <GlobalModals />
                        <Toaster />
                      </ModalsProvider>
                    </BudgetsProvider>
                  </ServicesProvider>
                </VehiclesProvider>
              </DriversProvider>
            </CustomersProvider>
          </SettingsProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}