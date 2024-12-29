import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { ExtraExpense } from '@/types/service';
import { v4 as uuidv4 } from 'uuid';

type ExpenseType = 'parking' | 'washing' | 'fuel' | 'toll';

interface ExpenseQuickAddProps {
  open: boolean;
  onClose: () => void;
  onAdd: (expense: ExtraExpense) => void;
  workDayId: string;
  vehicleId: string;
}

const expenseTypes: { type: ExpenseType; label: string; icon: string }[] = [
  { type: 'parking', label: 'Estacionamento', icon: '🅿️' },
  { type: 'washing', label: 'Lavagem', icon: '🚿' },
  { type: 'fuel', label: 'Combustível', icon: '⛽' },
  { type: 'toll', label: 'Pedágio', icon: '🛣️' },
];

export function ExpenseQuickAdd({ open, onClose, onAdd, workDayId, vehicleId }: ExpenseQuickAddProps) {
  const [selectedType, setSelectedType] = React.useState<ExpenseType | null>(null);
  const [amount, setAmount] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [title, setTitle] = React.useState('');

  const handleAdd = () => {
    if (!selectedType || !amount) return;

    const expenseTypeToTitle: Record<ExpenseType, string> = {
      'parking': 'Estacionamento',
      'washing': 'Lavagem',
      'fuel': 'Combustível',
      'toll': 'Pedágio'
    };

    const expense: ExtraExpense = {
      id: uuidv4(),
      workDayId,
      vehicleId,
      type: selectedType,
      amount: parseFloat(amount),
      title: expenseTypeToTitle[selectedType], // Título gerado automaticamente
      description: description || undefined,
    };

    onAdd(expense);
    handleClose();
  };

  const handleClose = () => {
    setSelectedType(null);
    setAmount('');
    setDescription('');
    setTitle('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Gasto Extra</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-2">
            {expenseTypes.map(({ type, label, icon }) => (
              <Button
                key={type}
                variant={selectedType === type ? "default" : "outline"}
                onClick={() => setSelectedType(type)}
                className="h-20"
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="text-2xl">{icon}</span>
                  <span>{label}</span>
                </div>
              </Button>
            ))}
          </div>
          <div className="grid gap-2">
            <Input
              placeholder="Título do Gasto (opcional)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Valor"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Input
              placeholder="Descrição (opcional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleAdd} disabled={!selectedType || !amount}>
            Adicionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
