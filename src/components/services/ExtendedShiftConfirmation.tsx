import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ExtendedShiftConfirmationProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
}

export function ExtendedShiftConfirmation({
  isOpen,
  onConfirm,
  onCancel,
  date,
  startTime,
  endTime,
  duration
}: ExtendedShiftConfirmationProps) {
  // Garante que a data está no formato correto antes de formatar
  const formattedDate = React.useMemo(() => {
    try {
      if (!date) return '';
      
      // Se a data já estiver no formato ISO
      if (date.includes('-')) {
        return format(new Date(date), "dd/MM", { locale: ptBR });
      }
      
      // Se a data estiver no formato dd/MM/yyyy
      const parsedDate = parse(date, 'dd/MM/yyyy', new Date());
      return format(parsedDate, "dd/MM", { locale: ptBR });
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return date;
    }
  }, [date]);

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>⚠️ Atenção</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>A jornada informada é superior a 24 horas:</p>
            <div className="bg-muted p-4 rounded-md space-y-1">
              <p>
                <span className="font-medium">Início:</span>{' '}
                {formattedDate} {startTime}
              </p>
              <p>
                <span className="font-medium">Fim:</span>{' '}
                {formattedDate} {endTime}
              </p>
              <p>
                <span className="font-medium">Total:</span>{' '}
                {duration.toFixed(1)} horas
              </p>
            </div>
            <p className="font-medium pt-2">Esta jornada está correta?</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>
            Não, Corrigir
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Sim, Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
