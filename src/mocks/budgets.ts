import { Budget } from "@/types";

export const mockBudgets: Budget[] = [
  {
    id: "1",
    customerId: "1",
    vehicles: [
      {
        id: "bv1",
        vehicleId: "1",
        startDate: "2024-04-01",
        endDate: "2024-04-05",
        dailyRate: 200,
        totalDays: 5,
        totalAmount: 1000,
        notes: "Sedan executivo para viagem de negócios"
      },
      {
        id: "bv2",
        vehicleId: "2",
        startDate: "2024-04-01",
        endDate: "2024-04-05",
        dailyRate: 300,
        totalDays: 5,
        totalAmount: 1500,
        notes: "SUV para passeios com a família"
      }
    ],
    totalAmount: 2500,
    status: "pending",
    notes: "Cliente solicitou dois veículos para o mesmo período",
    history: [
      {
        id: "h1",
        date: "2024-03-20T10:00:00.000Z",
        action: "created",
        description: "Orçamento criado",
        userId: "u1"
      }
    ],
    createdAt: "2024-03-20T10:00:00.000Z",
    updatedAt: "2024-03-20T10:00:00.000Z"
  },
  {
    id: "2",
    customerId: "2",
    vehicles: [
      {
        id: "bv3",
        vehicleId: "3",
        startDate: "2024-04-10",
        endDate: "2024-04-15",
        dailyRate: 150,
        totalDays: 6,
        totalAmount: 900,
        notes: "Hatch econômico para cidade"
      }
    ],
    totalAmount: 900,
    status: "approved",
    notes: "Cliente aprovou o orçamento por telefone",
    history: [
      {
        id: "h2",
        date: "2024-03-19T14:30:00.000Z",
        action: "created",
        description: "Orçamento criado",
        userId: "u1"
      },
      {
        id: "h3",
        date: "2024-03-19T15:00:00.000Z",
        action: "approved",
        description: "Orçamento aprovado pelo cliente",
        userId: "u2"
      }
    ],
    createdAt: "2024-03-19T14:30:00.000Z",
    updatedAt: "2024-03-19T15:00:00.000Z"
  },
  {
    id: "3",
    customerId: "3",
    vehicles: [
      {
        id: "bv4",
        vehicleId: "4",
        startDate: "2024-04-20",
        endDate: "2024-04-22",
        dailyRate: 500,
        totalDays: 3,
        totalAmount: 1500,
        notes: "Veículo de luxo para evento"
      }
    ],
    totalAmount: 1500,
    status: "rejected",
    notes: "Cliente achou o valor muito alto",
    history: [
      {
        id: "h4",
        date: "2024-03-18T09:15:00.000Z",
        action: "created",
        description: "Orçamento criado",
        userId: "u1"
      },
      {
        id: "h5",
        date: "2024-03-18T10:00:00.000Z",
        action: "rejected",
        description: "Cliente rejeitou devido ao valor",
        userId: "u1"
      }
    ],
    createdAt: "2024-03-18T09:15:00.000Z",
    updatedAt: "2024-03-18T10:00:00.000Z"
  },
  {
    id: "4",
    customerId: "4",
    vehicles: [
      {
        id: "bv5",
        vehicleId: "5",
        startDate: "2024-05-01",
        endDate: "2024-05-10",
        dailyRate: 250,
        totalDays: 10,
        totalAmount: 2500,
        notes: "Veículo para viagem longa"
      }
    ],
    totalAmount: 2500,
    status: "draft",
    notes: "Aguardando confirmação das datas pelo cliente",
    history: [
      {
        id: "h6",
        date: "2024-03-21T16:00:00.000Z",
        action: "created",
        description: "Orçamento criado como rascunho",
        userId: "u3"
      }
    ],
    createdAt: "2024-03-21T16:00:00.000Z",
    updatedAt: "2024-03-21T16:00:00.000Z"
  }
];
