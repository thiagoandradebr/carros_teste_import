import { StatsCard } from "@/components/dashboard/stats-card";
import { mockCustomers } from "@/mocks/customers";
import { mockDrivers } from "@/mocks/drivers";
import { mockRentals } from "@/mocks/rentals";
import { mockVehicles } from "@/mocks/vehicles";
import { mockBudgets } from "@/mocks/budgets";
import { 
  Users, 
  Car, 
  Truck, 
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  DollarSign,
  AlertTriangle,
  Wrench
} from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function Dashboard() {
  // Cálculo de estatísticas
  const totalCustomers = mockCustomers.length;
  const activeCustomers = mockCustomers.filter(c => c.status === "active").length;
  const customerGrowth = ((totalCustomers / 100) * 15).toFixed(1);

  const totalVehicles = mockVehicles.length;
  const availableVehicles = mockVehicles.filter(v => v.status === "available").length;
  const maintenanceVehicles = mockVehicles.filter(v => v.status === "maintenance").length;
  const rentedVehicles = mockVehicles.filter(v => v.status === "rented").length;
  const reservedVehicles = mockVehicles.filter(v => v.status === "reserved").length;

  const totalDrivers = mockDrivers.length;
  const activeDrivers = mockDrivers.filter(d => d.status === "active").length;
  const trainingDrivers = mockDrivers.filter(d => d.status === "training").length;
  const driverGrowth = ((totalDrivers / 100) * 8).toFixed(1);

  const totalRentals = mockRentals.length;
  const activeRentals = mockRentals.filter(r => r.status === "active").length;
  const completedRentals = mockRentals.filter(r => r.status === "completed").length;
  const pendingRentals = mockRentals.filter(r => r.status === "pending").length;

  // Alertas de manutenção
  const vehiclesNeedingMaintenance = mockVehicles.filter(v => 
    v.mileage && v.mileage > 10000 && v.status !== "maintenance"
  ).length;

  // Cálculo de receita
  const totalRevenue = mockRentals.reduce((acc, rental) => acc + rental.totalAmount, 0);
  const revenueGrowth = 12.5;

  // Orçamentos
  const totalBudgets = mockBudgets.length;
  const pendingBudgets = mockBudgets.filter(b => b.status === "pending").length;
  const approvedBudgets = mockBudgets.filter(b => b.status === "approved").length;
  const conversionRate = ((approvedBudgets / totalBudgets) * 100).toFixed(1);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Visão geral do sistema de locação de veículos
        </p>
      </div>

      {/* Principais Indicadores */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total de Clientes"
          value={totalCustomers}
          icon={Users}
          trend={{ value: Number(customerGrowth), isPositive: true }}
          description={`${activeCustomers} clientes ativos`}
        />

        <StatsCard
          title="Receita Total"
          value={formatCurrency(totalRevenue)}
          icon={TrendingUp}
          trend={{ value: revenueGrowth, isPositive: true }}
          description="Receita acumulada no período"
        />

        <StatsCard
          title="Frota de Veículos"
          value={totalVehicles}
          icon={Car}
          description={`${availableVehicles} disponíveis • ${maintenanceVehicles} em manutenção`}
        />

        <StatsCard
          title="Motoristas"
          value={totalDrivers}
          icon={Truck}
          trend={{ value: Number(driverGrowth), isPositive: true }}
          description={`${activeDrivers} motoristas ativos • ${trainingDrivers} em treinamento`}
        />
      </div>

      {/* Status das Locações */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Status das Locações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 grid-cols-2">
                <StatsCard
                  title="Locações Ativas"
                  value={activeRentals}
                  icon={Calendar}
                  className="bg-green-50"
                  description="Em andamento"
                />

                <StatsCard
                  title="Locações Pendentes"
                  value={pendingRentals}
                  icon={Clock}
                  className="bg-yellow-50"
                  description="Aguardando aprovação"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Taxa de Ocupação da Frota</span>
                  <span className="font-medium">{((rentedVehicles / totalVehicles) * 100).toFixed(1)}%</span>
                </div>
                <Progress value={(rentedVehicles / totalVehicles) * 100} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Desempenho Comercial</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 grid-cols-2">
                <StatsCard
                  title="Orçamentos Aprovados"
                  value={`${conversionRate}%`}
                  icon={FileText}
                  className="bg-blue-50"
                  description={`${approvedBudgets} de ${totalBudgets} orçamentos`}
                />

                <StatsCard
                  title="Ticket Médio"
                  value={formatCurrency(totalRevenue / completedRentals)}
                  icon={DollarSign}
                  className="bg-purple-50"
                  description="Por locação concluída"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas e Manutenção */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Alertas do Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <StatsCard
                title="Veículos para Manutenção"
                value={vehiclesNeedingMaintenance}
                icon={Wrench}
                className="bg-orange-50"
                description="Necessitam revisão"
              />

              <StatsCard
                title="CNHs Próximas do Vencimento"
                value={mockDrivers.filter(d => {
                  const validity = new Date(d.cnhValidity);
                  const threeMothsFromNow = new Date();
                  threeMothsFromNow.setMonth(threeMothsFromNow.getMonth() + 3);
                  return validity <= threeMothsFromNow;
                }).length}
                icon={AlertTriangle}
                className="bg-yellow-50"
                description="Nos próximos 3 meses"
              />

              <StatsCard
                title="Contratos a Vencer"
                value={mockRentals.filter(r => {
                  const endDate = new Date(r.endDate);
                  const oneWeekFromNow = new Date();
                  oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
                  return endDate <= oneWeekFromNow && r.status === "active";
                }).length}
                icon={AlertCircle}
                className="bg-red-50"
                description="Nos próximos 7 dias"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
