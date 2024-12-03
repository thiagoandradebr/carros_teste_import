import { Driver } from "@/types";

export let mockDrivers: Driver[] = [
  {
    id: "1",
    name: "Carlos Silva",
    cpf: "123.456.789-00",
    cnh: "12345678900",
    cnhValidity: "2025-12-31",
    cnhPoints: 0,
    phone: "(11) 98765-4321",
    photo: "https://i.pravatar.cc/150?u=carlos",
    cnhDocument: "/docs/cnh-carlos.pdf",
    notes: "Motorista experiente, especializado em carros de luxo",
    status: "active",
    address: {
      cep: "01234-567",
      street: "Rua dos Motoristas",
      number: "100",
      complement: "Apto 10",
      neighborhood: "Centro",
      city: "São Paulo",
      state: "SP"
    },
    trips: [
      {
        id: "t1",
        date: "2024-01-15",
        destination: "Rio de Janeiro",
        distance: 450,
        rating: 5,
        notes: "Viagem perfeita, cliente muito satisfeito"
      },
      {
        id: "t2",
        date: "2024-01-20",
        destination: "Campinas",
        distance: 100,
        rating: 5,
        notes: "Entrega pontual"
      }
    ],
    updatedAt: "2024-01-20T10:00:00Z"
  },
  {
    id: "2",
    name: "Ana Santos",
    cpf: "987.654.321-00",
    cnh: "98765432100",
    cnhValidity: "2024-10-15",
    cnhPoints: 5,
    phone: "(11) 91234-5678",
    photo: "https://i.pravatar.cc/150?u=ana",
    status: "training",
    address: {
      cep: "04567-890",
      street: "Avenida Principal",
      number: "200",
      neighborhood: "Jardins",
      city: "São Paulo",
      state: "SP"
    },
    trips: [
      {
        id: "t3",
        date: "2024-01-18",
        destination: "Santos",
        distance: 80,
        rating: 4,
        notes: "Primeira viagem, bom desempenho"
      }
    ],
    updatedAt: "2024-01-18T14:30:00Z"
  },
  {
    id: "3",
    name: "Roberto Oliveira",
    cpf: "456.789.123-00",
    cnh: "45678912300",
    cnhValidity: "2024-08-20",
    cnhPoints: 13,
    phone: "(11) 97777-8888",
    photo: "https://i.pravatar.cc/150?u=roberto",
    cnhDocument: "/docs/cnh-roberto.pdf",
    notes: "Precisa de reciclagem devido aos pontos na CNH",
    status: "suspended",
    address: {
      cep: "05678-901",
      street: "Rua das Palmeiras",
      number: "300",
      neighborhood: "Moema",
      city: "São Paulo",
      state: "SP"
    },
    updatedAt: "2024-01-10T16:45:00Z"
  },
  {
    id: "4",
    name: "Mariana Costa",
    cpf: "789.123.456-00",
    cnh: "78912345600",
    cnhValidity: "2025-06-30",
    cnhPoints: 2,
    phone: "(11) 96666-7777",
    photo: "https://i.pravatar.cc/150?u=mariana",
    status: "active",
    address: {
      cep: "06789-012",
      street: "Alameda dos Ipês",
      number: "400",
      complement: "Casa 2",
      neighborhood: "Alto de Pinheiros",
      city: "São Paulo",
      state: "SP"
    },
    trips: [
      {
        id: "t4",
        date: "2024-01-19",
        destination: "Guarulhos",
        distance: 30,
        rating: 5,
        notes: "Excelente condução"
      },
      {
        id: "t5",
        date: "2024-01-21",
        destination: "Osasco",
        distance: 25,
        rating: 5,
        notes: "Muito profissional"
      }
    ],
    updatedAt: "2024-01-21T09:15:00Z"
  }
];
