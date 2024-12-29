import { useContext } from 'react';
import { ServicesContext } from '@/contexts/ServicesContext';
import { ExecutionDetails, ExecutionItem, UsedMaterial } from '@/types/service';

export function useExecution() {
  const context = useContext(ServicesContext);
  if (!context) {
    throw new Error('useExecution must be used within a ServicesProvider');
  }

  const { services, updateService } = context;

  const createExecution = (serviceId: string, execution: Omit<ExecutionDetails, 'id' | 'serviceId'>) => {
    const service = services.find(s => s.id === serviceId);
    if (!service) return;

    const newExecution: ExecutionDetails = {
      id: `execution_${Date.now()}`,
      serviceId,
      ...execution,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    updateService({
      ...service,
      execution: newExecution,
    });

    return newExecution;
  };

  const updateExecution = (serviceId: string, execution: Partial<ExecutionDetails>) => {
    const service = services.find(s => s.id === serviceId);
    if (!service || !service.execution) return;

    const updatedExecution: ExecutionDetails = {
      ...service.execution,
      ...execution,
      updatedAt: new Date().toISOString(),
    };

    updateService({
      ...service,
      execution: updatedExecution,
    });

    return updatedExecution;
  };

  const addExecutionItem = (serviceId: string, item: Omit<ExecutionItem, 'id'>) => {
    const service = services.find(s => s.id === serviceId);
    if (!service || !service.execution) return;

    const newItem: ExecutionItem = {
      id: `item_${Date.now()}`,
      ...item,
    };

    const updatedExecution: ExecutionDetails = {
      ...service.execution,
      items: [...service.execution.items, newItem],
      total: service.execution.total + newItem.total,
      updatedAt: new Date().toISOString(),
    };

    updateService({
      ...service,
      execution: updatedExecution,
    });

    return newItem;
  };

  const addMaterial = (serviceId: string, material: Omit<UsedMaterial, 'id'>) => {
    const service = services.find(s => s.id === serviceId);
    if (!service || !service.execution) return;

    const newMaterial: UsedMaterial = {
      id: `material_${Date.now()}`,
      ...material,
    };

    const updatedExecution: ExecutionDetails = {
      ...service.execution,
      materials: [...service.execution.materials, newMaterial],
      updatedAt: new Date().toISOString(),
    };

    updateService({
      ...service,
      execution: updatedExecution,
    });

    return newMaterial;
  };

  return {
    createExecution,
    updateExecution,
    addExecutionItem,
    addMaterial,
  };
}
