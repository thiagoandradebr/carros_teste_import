import { Driver } from "@/types/driver";

export const mockDrivers: Driver[] = [
  {
    id: "d1",
    name: "João Silva",
    cpf: "12345678900",
    birthDate: "1990-05-15",
    cnh: "12345678900",
    cnhValidity: "2025-12-31",
    cnhPoints: 0,
    phone: "(11) 98765-4321",
    status: "active",
    address: {
      cep: "01234-567",
      street: "Rua A",
      number: "123",
      neighborhood: "Centro",
      city: "São Paulo",
      state: "SP"
    },
    updatedAt: new Date().toISOString(),
  },
  {
    id: "d2",
    name: "Maria Santos",
    cpf: "98765432100",
    birthDate: "1988-03-20",
    cnh: "98765432100",
    cnhValidity: "2024-12-31",
    cnhPoints: 5,
    phone: "(11) 91234-5678",
    status: "active",
    address: {
      cep: "04567-890",
      street: "Rua B",
      number: "456",
      neighborhood: "Vila Nova",
      city: "São Paulo",
      state: "SP"
    },
    updatedAt: new Date().toISOString(),
  },
  {
    id: "d3",
    name: "Pedro Oliveira",
    cpf: "45678912300",
    birthDate: "1995-11-10",
    cnh: "45678912300",
    cnhValidity: "2024-06-30",
    cnhPoints: 19,
    phone: "(11) 94567-8901",
    status: "inactive",
    address: {
      cep: "08901-234",
      street: "Rua C",
      number: "789",
      neighborhood: "Jardim",
      city: "São Paulo",
      state: "SP"
    },
    updatedAt: new Date().toISOString(),
  },
  {
    id: "d4",
    name: "Ana Costa",
    cpf: "78912345600",
    birthDate: "1992-07-25",
    cnh: "78912345600",
    cnhValidity: "2024-12-31",
    cnhPoints: 21,
    phone: "(11) 97890-1234",
    status: "suspended",
    address: {
      cep: "03456-789",
      street: "Rua D",
      number: "321",
      neighborhood: "Moema",
      city: "São Paulo",
      state: "SP"
    },
    updatedAt: new Date().toISOString(),
  },
];
