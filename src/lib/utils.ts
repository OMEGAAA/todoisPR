import { format, parseISO, isToday, isThisWeek, isThisMonth } from 'date-fns';
import { ja } from 'date-fns/locale';

export function formatDate(dateString: string, fmt: string = 'yyyy/MM/dd'): string {
  try {
    return format(parseISO(dateString), fmt, { locale: ja });
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string): string {
  try {
    return format(parseISO(dateString), 'yyyy/MM/dd HH:mm', { locale: ja });
  } catch {
    return dateString;
  }
}

export function isDateToday(dateString: string): boolean {
  try {
    return isToday(parseISO(dateString));
  } catch {
    return false;
  }
}

export function isDateThisWeek(dateString: string): boolean {
  try {
    return isThisWeek(parseISO(dateString), { locale: ja });
  } catch {
    return false;
  }
}

export function isDateThisMonth(dateString: string): boolean {
  try {
    return isThisMonth(parseISO(dateString));
  } catch {
    return false;
  }
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
}
