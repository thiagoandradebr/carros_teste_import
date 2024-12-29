import { DriverStatus } from "@/types/driver";
import { VehicleStatus } from "@/types/vehicle";
import { CustomerStatus } from "@/types/customer";

export type StatusConfig = {
  [key: string]: {
    variant: "default" | "secondary" | "destructive" | "outline";
    label: string;
  };
};

export const driverStatusConfig: StatusConfig = {
  active: { variant: "default", label: "Ativo" },
  inactive: { variant: "outline", label: "Inativo" },
  suspended: { variant: "destructive", label: "Suspenso" },
};

export const vehicleStatusConfig: StatusConfig = {
  active: { variant: "default", label: "Disponível" },
  maintenance: { variant: "secondary", label: "Em Manutenção" },
  inactive: { variant: "destructive", label: "Indisponível" },
};

export const customerStatusConfig: StatusConfig = {
  active: { variant: "default", label: "Ativo" },
  inactive: { variant: "outline", label: "Inativo" },
  blocked: { variant: "destructive", label: "Bloqueado" },
};

export const budgetStatusConfig: StatusConfig = {
  draft: { variant: "outline", label: "Rascunho" },
  pending: { variant: "secondary", label: "Pendente" },
  approved: { variant: "default", label: "Aprovado" },
  rejected: { variant: "destructive", label: "Rejeitado" },
  cancelled: { variant: "outline", label: "Cancelado" },
};

export function getStatusLabel(status: string, config: StatusConfig): string {
  return config[status]?.label || status;
}

export function getStatusVariant(status: string, config: StatusConfig): "default" | "secondary" | "destructive" | "outline" {
  return config[status]?.variant || "outline";
}
