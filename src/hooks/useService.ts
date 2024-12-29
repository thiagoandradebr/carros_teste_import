import { useContext } from 'react';
import { ServicesContext } from '@/contexts/ServicesContext';
import { Service, ServiceBase, BudgetDetails, ExecutionDetails, ServiceDocument } from '@/types/service';

export function useService() {
  const context = useContext(ServicesContext);
  if (!context) {
    throw new Error('useService must be used within a ServicesProvider');
  }

  const {
    services,
    addService,
    updateService,
    deleteService,
    getServiceWithDetails,
    updateServiceStatus,
  } = context;

  // Funções auxiliares
  const getServiceById = (id: string): Service | null => {
    return services.find(service => service.id === id) || null;
  };

  const getBudgetByServiceId = (serviceId: string): BudgetDetails | null => {
    const service = getServiceById(serviceId);
    return service?.budget || null;
  };

  const getExecutionByServiceId = (serviceId: string): ExecutionDetails | null => {
    const service = getServiceById(serviceId);
    return service?.execution || null;
  };

  const getDocumentsByServiceId = (serviceId: string): ServiceDocument[] => {
    const service = getServiceById(serviceId);
    return service?.documents || [];
  };

  return {
    // Funções do contexto
    services,
    addService,
    updateService,
    deleteService,
    getServiceWithDetails,
    updateServiceStatus,

    // Funções auxiliares
    getServiceById,
    getBudgetByServiceId,
    getExecutionByServiceId,
    getDocumentsByServiceId,
  };
}
