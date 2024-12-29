import { QuickActions } from "@/components/dashboard/QuickActions";

export default function Home() {
  return (
    <div className="container mx-auto py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Bem-vindo ao Car Rental Harmony</h1>
        <p className="text-muted-foreground">
          Escolha uma das ações abaixo para começar
        </p>
      </div>

      <QuickActions />
    </div>
  );
}
