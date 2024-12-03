import { Service } from "@/types";

export const mockServices: Service[] = [
  {
    id: "s1",
    budgetId: "b1",
    customerId: "1",
    vehicles: [
      {
        id: "v1",
        vehicleId: "1",
        startDate: "2024-02-01T10:00:00Z",
        endDate: "2024-02-05T10:00:00Z",
        dailyRate: 150,
        totalDays: 4,
        totalAmount: 600,
        notes: "Entrega no local"
      }
    ],
    status: "in_progress",
    extraCosts: [
      {
        id: "ec1",
        type: "extra_hours",
        description: "Horas extras de utilização",
        quantity: 3,
        unitValue: 50,
        totalValue: 150
      },
      {
        id: "ec2",
        type: "other",
        description: "Pedágio",
        unitValue: 25,
        totalValue: 25
      }
    ],
    subtotalAmount: 600,
    extraCostsAmount: 175,
    totalAmount: 775,
    history: [
      {
        id: "h1",
        date: "2024-02-01T10:00:00Z",
        action: "created",
        description: "Serviço criado a partir do orçamento #b1",
        userId: "u1"
      }
    ],
    createdAt: "2024-02-01T10:00:00Z",
    updatedAt: "2024-02-01T10:00:00Z"
  }
];
