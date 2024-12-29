import { Card } from "@/components/ui/card";
import { Calculator, Car, Users, UserPlus } from "lucide-react";
import { useModals } from "@/contexts/ModalsContext";

export function QuickActions() {
  const { 
    openNewBudget,
    openNewVehicle,
    openNewDriver,
    openNewCustomer
  } = useModals();

  const actions = [
    {
      title: "Novo Orçamento",
      description: "Criar um novo orçamento",
      icon: Calculator,
      onClick: openNewBudget,
      color: "bg-blue-500",
    },
    {
      title: "Novo Veículo",
      description: "Adicionar um novo veículo à frota",
      icon: Car,
      onClick: openNewVehicle,
      color: "bg-green-500",
    },
    {
      title: "Novo Motorista",
      description: "Cadastrar um novo motorista",
      icon: Users,
      onClick: openNewDriver,
      color: "bg-purple-500",
    },
    {
      title: "Novo Cliente",
      description: "Cadastrar um novo cliente",
      icon: UserPlus,
      onClick: openNewCustomer,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action) => (
        <Card
          key={action.title}
          className="p-6 hover:shadow-lg transition-shadow cursor-pointer group"
          onClick={action.onClick}
        >
          <div className="flex flex-col items-center text-center space-y-4">
            <div className={`${action.color} p-4 rounded-full text-white group-hover:scale-110 transition-transform`}>
              <action.icon className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{action.title}</h3>
              <p className="text-sm text-muted-foreground">{action.description}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
