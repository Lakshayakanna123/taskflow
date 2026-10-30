import {
  startOfDay,
  endOfDay,
  isToday,
  isBefore,
  isAfter,
  format,
  parseISO,
} from 'date-fns';

export function toDateInputValue(date: Date | null): string {
  if (!date) return '';
  return format(date, 'yyyy-MM-dd');
}

export function isOverdue(dueDate: Date | null): boolean {
  if (!dueDate) return false;
  return isBefore(endOfDay(dueDate), new Date());
}

export function isDueToday(dueDate: Date | null): boolean {
  if (!dueDate) return false;
  return isToday(dueDate);
}

export function isUpcoming(dueDate: Date | null): boolean {
  if (!dueDate) return false;
  const tomorrow = startOfDay(new Date());
  tomorrow.setDate(tomorrow.getDate() + 1);
  return isAfter(dueDate, endOfDay(new Date())) && !isOverdue(dueDate);
}

export function formatDueDate(dueDate: Date | null): string {
  if (!dueDate) return '';
  if (isToday(dueDate)) return 'Today';
  return format(dueDate, 'MMM d, yyyy');
}

export function parseDateInput(value: string): Date | null {
  if (!value) return null;
  try {
    return parseISO(value);
  } catch {
    return null;
  }
}
