export type DriverStatus = "active" | "inactive" | "suspended";

export type DriverDocumentType = "cnh" | "cpf" | "rg" | "comprovante_residencia" | "outro";

export type DriverPhoto = {
  id: string;
  url: string;
  description?: string;
  isPrimary: boolean;
  uploadedAt: string;
};

export type DriverDocument = {
  id: string;
  type: DriverDocumentType;
  name: string;
  url: string;
  uploadedAt: string;
  expirationDate?: string;
};

export type DriverActivity = {
  lastActivity?: string;
  totalTrips: number;
  rating?: number;
};

export type Driver = {
  id: string;
  // Campos obrigatórios
  name: string;
  cpf: string;
  phone: string;
  cnh: string;
  // Campos opcionais
  email?: string;
  cnhCategory?: string;
  cnhExpiration?: string;
  birthDate?: string;
  status?: DriverStatus;
  notes?: string;
  driverPhoto?: File | null;
  cnhPhoto?: File | null;
  photos?: DriverPhoto[];
  documents?: DriverDocument[];
  updatedAt?: string;
  activity?: DriverActivity;
};

export type NewDriver = Omit<Driver, "id">;

export const driverStatusConfig = {
  active: { color: "bg-green-100 text-green-800", label: "Ativo" },
  inactive: { color: "bg-gray-100 text-gray-800", label: "Inativo" },
  suspended: { color: "bg-red-100 text-red-800", label: "Suspenso" },
} as const;
