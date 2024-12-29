import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Car, Users, Calendar, Settings as SettingsIcon, FileText, Clock, Wrench, Building2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { 
      icon: Users, 
      label: 'Clientes', 
      path: '/customers',
      activeClassName: location.pathname === '/customers' ? 'bg-primary/10 text-primary' : ''
    },
    { 
      icon: Users, 
      label: 'Motoristas', 
      path: '/drivers',
      activeClassName: location.pathname === '/drivers' ? 'bg-primary/10 text-primary' : ''
    },
    { 
      icon: FileText, 
      label: 'Orçamentos', 
      path: '/budgets',
      activeClassName: location.pathname === '/budgets' ? 'bg-primary/10 text-primary' : ''
    },
    { 
      icon: Calendar, 
      label: 'Serviços', 
      path: '/services',
      activeClassName: location.pathname === '/services' ? 'bg-primary/10 text-primary' : ''
    }
  ];

  const isVehiclesActive = location.pathname.startsWith('/vehicles');
  const isSettingsActive = location.pathname.startsWith('/settings') || location.pathname.startsWith('/company-settings');

  return (
    <header className="flex items-center h-18 px-5 border-b bg-white">
      <Link to="/" className="flex items-center mr-8">
        <img src="/logo.svg" alt="Car Rental Harmony Logo" className="w-14 h-14" />
      </Link>
      <nav className="flex space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={`flex items-center px-3.5 py-2 text-base font-medium hover:bg-primary/5 ${
                isVehiclesActive ? 'bg-primary/10 text-primary' : ''
              }`}
            >
              <Car className="mr-2 h-5 w-5" />
              Veículos
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem onClick={() => navigate('/vehicles')}>
              <Car className="mr-2 h-4 w-4" />
              <span>Lista de Veículos</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/vehicles/maintenance')}>
              <Wrench className="mr-2 h-4 w-4" />
              <span>Manutenção</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {menuItems.map((item) => (
          <Button
            key={item.path}
            variant="ghost"
            className={`flex items-center px-3.5 py-2 text-base font-medium hover:bg-primary/5 ${item.activeClassName}`}
            onClick={() => navigate(item.path)}
          >
            <item.icon className="mr-2 h-5 w-5" />
            {item.label}
          </Button>
        ))}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={`flex items-center px-3.5 py-2 text-base font-medium hover:bg-primary/5 ${
                isSettingsActive ? 'bg-primary/10 text-primary' : ''
              }`}
            >
              <SettingsIcon className="mr-2 h-5 w-5" />
              Configurações
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <SettingsIcon className="mr-2 h-4 w-4" />
              <span>Configurações Gerais</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/company-settings')}>
              <Building2 className="mr-2 h-4 w-4" />
              <span>Dados da Empresa</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </header>
  );
}
