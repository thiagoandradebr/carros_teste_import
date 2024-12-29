export type CustomerType = 'pf' | 'pj';
export type CustomerNationality = 'national' | 'international';

export interface CustomerAddress {
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
}

export type CustomerStatus = "active" | "inactive" | "blocked";

const customerStatusConfig = {
  active: { color: "bg-green-100 text-green-800", label: "Ativo" },
  inactive: { color: "bg-gray-100 text-gray-800", label: "Inativo" },
  blocked: { color: "bg-red-100 text-red-800", label: "Bloqueado" },
} as const;

export interface Customer {
  id: string;
  type: CustomerType;
  nationality: CustomerNationality;
  name: string;
  document: string;
  email: string;
  phone: string;
  representative?: string;
  address?: CustomerAddress;
  notes?: string;
  status: CustomerStatus;
  updatedAt: string;
}

export type NewCustomer = Omit<Customer, "id">;
