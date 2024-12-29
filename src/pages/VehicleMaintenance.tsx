import { useVehicles } from "@/contexts/VehiclesContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Vehicle } from "@/types/vehicle";
import { Badge } from "@/components/ui/badge";

export default function VehicleMaintenance() {
  const { vehicles } = useVehicles();
  const ownedVehicles = vehicles.filter(vehicle => vehicle.isOwned);

  const columns: ColumnDef<Vehicle>[] = [
    {
      accessorKey: "vehicleName",
      header: "Nome",
    },
    {
      accessorKey: "brand",
      header: "Marca",
    },
    {
      accessorKey: "model",
      header: "Modelo",
    },
    {
      accessorKey: "plate",
      header: "Placa",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge variant={status === "maintenance" ? "destructive" : status === "unavailable" ? "secondary" : "default"}>
            {status === "maintenance" ? "Em Manutenção" : status === "unavailable" ? "Indisponível" : "Disponível"}
          </Badge>
        );
      },
    },
  ];

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Manutenção de Veículos</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={ownedVehicles} />
        </CardContent>
      </Card>
    </div>
  );
}
