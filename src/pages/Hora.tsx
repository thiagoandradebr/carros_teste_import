import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function HoraPage() {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  // Método 1: Diferença simples usando Date
  const calcMethod1 = () => {
    if (!startTime || !endTime) return 0;
    const start = new Date(`2023-01-01T${startTime}`);
    const end = new Date(`2023-01-01T${endTime}`);
    return Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60);
  };

  // Método 2: Usando parse manual de horas
  const calcMethod2 = () => {
    if (!startTime || !endTime) return 0;
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    return Math.abs(endHour - startHour + (endMin - startMin) / 60);
  };

  // Método 3: Usando reduce para cálculo
  const calcMethod3 = () => {
    if (!startTime || !endTime) return 0;
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    return [startHour, startMin, endHour, endMin]
      .reduce((acc, curr, idx) => idx % 2 === 0 ? acc - curr : acc + curr / 60, 0);
  };

  // Método 4: Usando moment.js (simulado sem importação real)
  const calcMethod4 = () => {
    if (!startTime || !endTime) return 0;
    const start = new Date(`2023-01-01T${startTime}`);
    const end = new Date(`2023-01-01T${endTime}`);
    const diff = end.getTime() - start.getTime();
    return diff / (1000 * 60 * 60);
  };

  // Método 5: Cálculo com aritmética simples
  const calcMethod5 = () => {
    if (!startTime || !endTime) return 0;
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    return (endHour + endMin / 60) - (startHour + startMin / 60);
  };

  // Método 6: Usando Date.parse()
  const calcMethod6 = () => {
    if (!startTime || !endTime) return 0;
    const start = Date.parse(`1970-01-01T${startTime}:00`);
    const end = Date.parse(`1970-01-01T${endTime}:00`);
    return Math.abs(end - start) / (1000 * 60 * 60);
  };

  // Método 7: Usando subtração de minutos
  const calcMethod7 = () => {
    if (!startTime || !endTime) return 0;
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    const totalMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin);
    return totalMinutes / 60;
  };

  // Método 8: Usando spread e Math.abs
  const calcMethod8 = () => {
    if (!startTime || !endTime) return 0;
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    return Math.abs([startHour, startMin, endHour, endMin]
      .reduce((acc, val, idx) => idx % 2 === 0 ? acc - val : acc + val / 60, 0));
  };

  // Método 9: Usando função de transformação
  const calcMethod9 = () => {
    const timeToDecimal = (time: string) => {
      if (!time) return 0;
      const [hours, minutes] = time.split(':').map(Number);
      return hours + minutes / 60;
    };
    return Math.abs(timeToDecimal(endTime) - timeToDecimal(startTime));
  };

  // Método 10: Usando operações bitwise (apenas para demonstração)
  const calcMethod10 = () => {
    if (!startTime || !endTime) return 0;
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    return Math.abs((endHour << 8 | endMin) - (startHour << 8 | startMin)) / (1 << 8);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Calculadora de Horas Trabalhadas</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Hora Inicial</Label>
          <Input 
            type="time" 
            value={startTime} 
            onChange={(e) => setStartTime(e.target.value)} 
          />
        </div>
        <div>
          <Label>Hora Final</Label>
          <Input 
            type="time" 
            value={endTime} 
            onChange={(e) => setEndTime(e.target.value)} 
          />
        </div>
      </div>

      <div className="mt-6 space-y-2">
        <Card>
          <CardHeader>
            <CardTitle>Resultados dos Métodos de Cálculo</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Método</th>
                  <th className="border p-2">Resultado (Horas)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  calcMethod1(),
                  calcMethod2(),
                  calcMethod3(),
                  calcMethod4(),
                  calcMethod5(),
                  calcMethod6(),
                  calcMethod7(),
                  calcMethod8(),
                  calcMethod9(),
                  calcMethod10()
                ].map((result, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border p-2">Método {index + 1}</td>
                    <td className="border p-2">{result.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
