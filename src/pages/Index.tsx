import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Car, Users, Calendar, TrendingUp } from "lucide-react";

export default function Index() {
  // Dados mockados para demonstração
  const stats = [
    {
      title: "Total de Veículos",
      value: "24",
      icon: Car,
      trend: "+2.5%",
    },
    {
      title: "Clientes Ativos",
      value: "156",
      icon: Users,
      trend: "+12.3%",
    },
    {
      title: "Locações Ativas",
      value: "18",
      icon: Calendar,
      trend: "+5.4%",
    },
    {
      title: "Receita Mensal",
      value: "R$ 45.850",
      icon: TrendingUp,
      trend: "+8.1%",
    },
  ];

  return (
    <Layout>
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title} className="dashboard-card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-semibold mt-2">{stat.value}</p>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                {stat.trend} esse mês
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="dashboard-card">
            <h2 className="text-lg font-semibold mb-4">Locações Recentes</h2>
            <div className="space-y-4">
              {/* Lista de locações recentes aqui */}
              <p className="text-gray-600">Nenhuma locação recente</p>
            </div>
          </Card>

          <Card className="dashboard-card">
            <h2 className="text-lg font-semibold mb-4">Veículos Populares</h2>
            <div className="space-y-4">
              {/* Lista de veículos populares aqui */}
              <p className="text-gray-600">Nenhum veículo cadastrado</p>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}