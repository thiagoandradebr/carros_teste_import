import { WorkDay } from "@/types/budget";
import { DailyType } from "@/types/budget";

const MINUTES_TO_START_OVERTIME = 15;

export function calculateExtraHours(
  duration: number, // duração total em minutos
  dailyType: DailyType,
  regularHours: number
): number {
  if (dailyType === 'transfer') return 0;

  // Converte horas regulares para minutos
  const regularMinutes = regularHours * 60;

  // Se não excedeu o tempo regular + tolerância, não tem hora extra
  if (duration <= regularMinutes) return 0;

  // Calcula o excesso em minutos
  const extraMinutes = duration - regularMinutes;

  // Se o excesso for menor que a tolerância, não conta hora extra
  if (extraMinutes < MINUTES_TO_START_OVERTIME) return 0;

  // Arredonda para cima em horas completas
  return Math.ceil(extraMinutes / 60);
}

export function validateWorkDay(workDay: WorkDay): boolean {
  return !!(
    workDay.date &&
    workDay.startTime &&
    workDay.endTime &&
    typeof workDay.duration === 'number' &&
    typeof workDay.regularHours === 'number' &&
    typeof workDay.extraHours === 'number' &&
    workDay.dailyType
  );
}

export function validateWorkDayTimes(startTime: string, endTime: string): boolean {
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;

  return startMinutes < endMinutes;
}

export function calculateWorkDayHours(
  startTime: string,
  endTime: string,
  dailyType: DailyType,
  regularHours: number
): { duration: number; regularHours: number; extraHours: number } {
  // Converte as strings de tempo para Date
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  // Calcula a duração total em minutos
  let durationMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
  
  // Se terminou no dia seguinte
  if (durationMinutes < 0) {
    durationMinutes += 24 * 60; // Adiciona 24 horas em minutos
  }

  // Calcula as horas extras com base no tipo de diária
  const extraHours = calculateExtraHours(durationMinutes, dailyType, regularHours);

  return {
    duration: durationMinutes / 60, // Converte para horas
    regularHours: regularHours,
    extraHours: extraHours
  };
}

export function getDaysInRange(startDate: string, endDate: string): string[] {
  const days: string[] = [];
  const currentDate = new Date(startDate);
  const end = new Date(endDate);

  while (currentDate <= end) {
    days.push(currentDate.toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return days;
}

export function formatDate(
  date: Date | string, 
  format: 'dd/MM/yyyy' | 'YYYY-MM-DD' = 'dd/MM/yyyy'
): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  // dd/MM/yyyy
  if (format === 'dd/MM/yyyy') {
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
  
  // YYYY-MM-DD
  return d.toISOString().split('T')[0];
}

export function calculateTotalHours(workDays: WorkDay[] = []): {
  totalRegularHours: number;
  totalExtraHours: number;
} {
  return workDays.reduce((acc, day) => ({
    totalRegularHours: acc.totalRegularHours + (day.regularHours || 0),
    totalExtraHours: acc.totalExtraHours + (day.extraHours || 0)
  }), { totalRegularHours: 0, totalExtraHours: 0 });
}
