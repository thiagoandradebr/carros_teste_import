import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { BudgetsProvider } from "@/contexts/BudgetsContext";
import { ServicesProvider } from "@/contexts/ServicesContext";
import { CustomersProvider } from "@/contexts/CustomersContext";
import { DriversProvider } from "@/contexts/DriversContext";
import { VehiclesProvider } from "@/contexts/VehiclesContext";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <CustomersProvider>
          <DriversProvider>
            <VehiclesProvider>
              <BudgetsProvider>
                <ServicesProvider>
                  <RouterProvider router={router} />
                  <Toaster />
                </ServicesProvider>
              </BudgetsProvider>
            </VehiclesProvider>
          </DriversProvider>
        </CustomersProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;