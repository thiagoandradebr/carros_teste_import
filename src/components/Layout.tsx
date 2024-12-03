import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Home, Car, Users, Calendar, Settings as SettingsIcon, FileText } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-heading font-bold text-primary">CarRental</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Button
                  variant="ghost"
                  className="inline-flex items-center px-1 pt-1"
                  onClick={() => navigate('/')}
                >
                  <Home className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  className="inline-flex items-center px-1 pt-1"
                  onClick={() => navigate('/vehicles')}
                >
                  <Car className="mr-2 h-4 w-4" />
                  Veículos
                </Button>
                <Button
                  variant="ghost"
                  className="inline-flex items-center px-1 pt-1"
                  onClick={() => navigate('/customers')}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Clientes
                </Button>
                <Button
                  variant="ghost"
                  className="inline-flex items-center px-1 pt-1"
                  onClick={() => navigate('/drivers')}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Motoristas
                </Button>
                <Button
                  variant="ghost"
                  className="inline-flex items-center px-1 pt-1"
                  onClick={() => navigate('/budgets')}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Orçamentos
                </Button>
                <Button
                  variant="ghost"
                  className="inline-flex items-center px-1 pt-1"
                  onClick={() => navigate('/services')}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Serviços
                </Button>
                <Button
                  variant="ghost"
                  className="inline-flex items-center px-1 pt-1"
                  onClick={() => navigate('/settings')}
                >
                  <SettingsIcon className="mr-2 h-4 w-4" />
                  Configurações
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}