import React, { useState } from 'react';
import { Input } from "@/components/ui/input";

interface TimeInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function TimeInput({ value, onChange }: TimeInputProps) {
  // Estado local para controlar a validação
  const [error, setError] = useState<string>('');

  // Extrai hora e minuto do valor
  const [hour = '', minute = ''] = value ? value.split(':') : [];

  const validateAndUpdateTime = (newHour: string, newMinute: string) => {
    // Converte para números
    const hourNum = parseInt(newHour);
    const minuteNum = parseInt(newMinute);

    // Valida hora
    if (isNaN(hourNum) || hourNum < 0 || hourNum > 23) {
      setError('Hora inválida (0-23)');
      return;
    }

    // Valida minuto
    if (isNaN(minuteNum) || minuteNum < 0 || minuteNum > 59) {
      setError('Minuto inválido (0-59)');
      return;
    }

    // Formata o tempo com dois dígitos
    const formattedTime = `${hourNum.toString().padStart(2, '0')}:${minuteNum.toString().padStart(2, '0')}`;
    setError('');
    console.log('Horário formatado:', formattedTime); // Debug
    onChange(formattedTime);
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-1">
        <Input
          type="text"
          maxLength={2}
          value={hour}
          onChange={(e) => {
            const newHour = e.target.value.replace(/\D/g, '').slice(0, 2);
            validateAndUpdateTime(newHour, minute || '00');
          }}
          className="w-[50px] text-center"
          placeholder="00"
        />
        <span>:</span>
        <Input
          type="text"
          maxLength={2}
          value={minute}
          onChange={(e) => {
            const newMinute = e.target.value.replace(/\D/g, '').slice(0, 2);
            validateAndUpdateTime(hour || '00', newMinute);
          }}
          className="w-[50px] text-center"
          placeholder="00"
        />
      </div>
      {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
    </div>
  );
}
