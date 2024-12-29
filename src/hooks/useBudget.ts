import { useContext } from 'react';
import { ServicesContext } from '@/contexts/ServicesContext';
import { BudgetDetails, BudgetItem } from '@/types/service';

export function useBudget() {
  const context = useContext(ServicesContext);
  if (!context) {
    throw new Error('useBudget must be used within a ServicesProvider');
  }

  const { services, updateService } = context;

  const createBudget = (serviceId: string, budget: Omit<BudgetDetails, 'id' | 'serviceId'>) => {
    const service = services.find(s => s.id === serviceId);
    if (!service) return;

    const newBudget: BudgetDetails = {
      id: `budget_${Date.now()}`,
      serviceId,
      ...budget,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    updateService({
      ...service,
      budget: newBudget,
    });

    return newBudget;
  };

  const updateBudget = (serviceId: string, budget: Partial<BudgetDetails>) => {
    const service = services.find(s => s.id === serviceId);
    if (!service || !service.budget) return;

    const updatedBudget: BudgetDetails = {
      ...service.budget,
      ...budget,
      updatedAt: new Date().toISOString(),
    };

    updateService({
      ...service,
      budget: updatedBudget,
    });

    return updatedBudget;
  };

  const addBudgetItem = (serviceId: string, item: Omit<BudgetItem, 'id'>) => {
    const service = services.find(s => s.id === serviceId);
    if (!service || !service.budget) return;

    const newItem: BudgetItem = {
      id: `item_${Date.now()}`,
      ...item,
    };

    const updatedBudget: BudgetDetails = {
      ...service.budget,
      items: [...service.budget.items, newItem],
      total: service.budget.total + newItem.total,
      updatedAt: new Date().toISOString(),
    };

    updateService({
      ...service,
      budget: updatedBudget,
    });

    return newItem;
  };

  const removeBudgetItem = (serviceId: string, itemId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (!service || !service.budget) return;

    const item = service.budget.items.find(i => i.id === itemId);
    if (!item) return;

    const updatedBudget: BudgetDetails = {
      ...service.budget,
      items: service.budget.items.filter(i => i.id !== itemId),
      total: service.budget.total - item.total,
      updatedAt: new Date().toISOString(),
    };

    updateService({
      ...service,
      budget: updatedBudget,
    });
  };

  return {
    createBudget,
    updateBudget,
    addBudgetItem,
    removeBudgetItem,
  };
}
