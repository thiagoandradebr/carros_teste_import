import { Driver } from "@/types/driver";
import { generateUUID } from "@/utils/uuid";

const mockDrivers: Driver[] = [
  {
    id: generateUUID(),
    name: "João Silva",
    cpf: "123.456.789-00",
    phone: "(11) 99999-9999",
    cnh: "12345678900",
    email: "joao.silva@email.com",
    cnhCategory: "D",
    cnhExpiration: "2025-12-31",
    birthDate: "1985-06-15",
    status: "active",
    activity: {
      lastActivity: "2023-12-20",
      totalTrips: 150,
      rating: 4.8
    }
  },
  {
    id: generateUUID(),
    name: "Maria Santos",
    cpf: "987.654.321-00",
    phone: "(11) 98888-8888",
    cnh: "98765432100",
    email: "maria.santos@email.com",
    cnhCategory: "D",
    cnhExpiration: "2024-10-15",
    birthDate: "1990-03-22",
    status: "active",
    activity: {
      lastActivity: "2023-12-21",
      totalTrips: 120,
      rating: 4.9
    }
  },
  {
    id: generateUUID(),
    name: "Pedro Oliveira",
    cpf: "456.789.123-00",
    phone: "(11) 97777-7777",
    cnh: "45678912300",
    email: "pedro.oliveira@email.com",
    cnhCategory: "D",
    cnhExpiration: "2024-08-20",
    birthDate: "1988-09-10",
    status: "active",
    activity: {
      lastActivity: "2023-12-19",
      totalTrips: 90,
      rating: 4.7
    }
  },
  {
    id: generateUUID(),
    name: "Ana Costa",
    cpf: "789.123.456-00",
    phone: "(11) 96666-6666",
    cnh: "78912345600",
    email: "ana.costa@email.com",
    cnhCategory: "D",
    cnhExpiration: "2025-03-25",
    birthDate: "1992-12-05",
    status: "active",
    activity: {
      lastActivity: "2023-12-18",
      totalTrips: 80,
      rating: 4.6
    }
  },
  {
    id: generateUUID(),
    name: "Carlos Ferreira",
    cpf: "321.654.987-00",
    phone: "(11) 95555-5555",
    cnh: "32165498700",
    email: "carlos.ferreira@email.com",
    cnhCategory: "D",
    cnhExpiration: "2024-11-30",
    birthDate: "1987-04-18",
    status: "inactive",
    activity: {
      lastActivity: "2023-11-30",
      totalTrips: 45,
      rating: 4.5
    }
  }
];

export function addMockDriversToStorage() {
  const existingDrivers = localStorage.getItem("drivers");
  if (!existingDrivers) {
    localStorage.setItem("drivers", JSON.stringify(mockDrivers));
  }
}
