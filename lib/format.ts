// Утилиты для форматирования чисел и дат
// Обеспечивают одинаковый результат на сервере и клиенте

/**
 * Форматирует число с разделителями тысяч
 * Использует фиксированный формат для избежания проблем с гидратацией
 */
export function formatNumber(num: number): string {
  // Используем простой алгоритм вместо toLocaleString для консистентности
  const parts = num.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return parts.join('.');
}

/**
 * Форматирует число как валюту
 */
export function formatCurrency(amount: number, currency: string = '₸'): string {
  return `${formatNumber(amount)}${currency}`;
}

/**
 * Форматирует процент
 */
export function formatPercent(value: number): string {
  return `${value}%`;
}

