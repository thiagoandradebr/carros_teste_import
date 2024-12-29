import { createBrowserRouter, Outlet } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import Budgets from "@/pages/Budgets";
import Services from "@/pages/Services";
import Customers from "@/pages/Customers";
import Drivers from "@/pages/Drivers";
import Vehicles from "@/pages/Vehicles";
import Settings from "@/pages/Settings";
import Hora from "@/pages/Hora"; 
import VehicleMaintenance from "@/pages/VehicleMaintenance";
import CompanySettings from "@/pages/CompanySettings";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout><Outlet /></Layout>,
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "budgets",
        element: <Budgets />,
      },
      {
        path: "services",
        element: <Services />,
      },
      {
        path: "customers",
        element: <Customers />,
      },
      {
        path: "drivers",
        element: <Drivers />,
      },
      {
        path: "vehicles",
        element: <Vehicles />,
      },
      {
        path: "vehicles/maintenance",
        element: <VehicleMaintenance />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "company-settings",
        element: <CompanySettings />,
      },
    ],
  },
]);
