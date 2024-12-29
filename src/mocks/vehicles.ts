import { Vehicle } from "@/types/vehicle";

export const mockVehicles: Vehicle[] = [
  {
    id: "1",
    vehicleName: "Chevrolet Onix 2023",
    model: "Onix",
    brand: "Chevrolet",
    year: 2023,
    plate: "ABC1234",
    color: "Prata",
    category: "HATCH",
    status: "available",
    supplier: "Chevrolet",
    isArmored: false,
    isOwned: true,
    dailyRate: 150,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    vehicleName: "Jeep Compass 2023",
    model: "Compass",
    brand: "Jeep",
    year: 2023,
    plate: "DEF5678",
    color: "Preto",
    category: "SUV",
    status: "available",
    supplier: "Jeep",
    isArmored: false,
    isOwned: true,
    dailyRate: 300,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    vehicleName: "Honda Civic 2023",
    model: "Civic",
    brand: "Honda",
    year: 2023,
    plate: "GHI9012",
    color: "Branco",
    category: "SEDAN",
    status: "maintenance",
    supplier: "Honda",
    isArmored: false,
    isOwned: true,
    dailyRate: 200,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    vehicleName: "BMW 320i 2023",
    model: "BMW 320i",
    brand: "BMW",
    year: 2023,
    plate: "JKL3456",
    color: "Azul",
    category: "LUXURY",
    status: "available",
    supplier: "BMW",
    isArmored: false,
    isOwned: true,
    dailyRate: 500,
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    vehicleName: "Hyundai HB20 2023",
    model: "HB20",
    brand: "Hyundai",
    year: 2023,
    plate: "MNO7890",
    color: "Vermelho",
    category: "HATCH",
    status: "available",
    supplier: "Hyundai",
    isArmored: false,
    isOwned: true,
    dailyRate: 150,
    updatedAt: new Date().toISOString(),
  }
];
