import React, { createContext, useContext, ReactNode } from 'react';
import { Budget } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { mockBudgets } from '@/mocks/budgets';

interface BudgetsContextType {
  budgets: Budget[];
  addBudget: (budget: Budget) => void;
  updateBudget: (budget: Budget) => void;
  deleteBudget: (budgetId: string) => void;
  updateBudgetStatus: (budgetId: string, status: Budget['status']) => void;
}

const BudgetsContext = createContext<BudgetsContextType | undefined>(undefined);

export function BudgetsProvider({ children }: { children: ReactNode }) {
  const [budgets, setBudgets] = useLocalStorage<Budget[]>('budgets', mockBudgets);

  const addBudget = (budget: Budget) => {
    setBudgets(prev => [...prev, budget]);
  };

  const updateBudget = (updatedBudget: Budget) => {
    setBudgets(prev =>
      prev.map(budget =>
        budget.id === updatedBudget.id ? updatedBudget : budget
      )
    );
  };

  const deleteBudget = (budgetId: string) => {
    setBudgets(prev => prev.filter(budget => budget.id !== budgetId));
  };

  const updateBudgetStatus = (budgetId: string, status: Budget['status']) => {
    setBudgets(prev =>
      prev.map(budget =>
        budget.id === budgetId
          ? {
              ...budget,
              status,
              updatedAt: new Date().toISOString(),
              history: [
                ...budget.history,
                {
                  id: `h${Date.now()}`,
                  date: new Date().toISOString(),
                  action: 'status_updated',
                  description: `Status atualizado para ${status}`,
                  userId: 'u1',
                },
              ],
            }
          : budget
      )
    );
  };

  return (
    <BudgetsContext.Provider
      value={{
        budgets,
        addBudget,
        updateBudget,
        deleteBudget,
        updateBudgetStatus,
      }}
    >
      {children}
    </BudgetsContext.Provider>
  );
}

export function useBudgets() {
  const context = useContext(BudgetsContext);
  if (context === undefined) {
    throw new Error('useBudgets must be used within a BudgetsProvider');
  }
  return context;
}
