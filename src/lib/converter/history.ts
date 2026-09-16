import { ConversionHistoryItem } from './types';

const HISTORY_STORAGE_KEY = 'openanyfile_conversion_history';
const MAX_HISTORY_ITEMS = 15;

export function getConversionHistory(): ConversionHistoryItem[] {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ConversionHistoryItem[];
  } catch {
    return [];
  }
}

export function addConversionHistory(item: Omit<ConversionHistoryItem, 'id' | 'timestamp'>): ConversionHistoryItem {
  const history = getConversionHistory();
  const newItem: ConversionHistoryItem = {
    ...item,
    id: `conv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: Date.now(),
  };

  const updated = [newItem, ...history].slice(0, MAX_HISTORY_ITEMS);
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore quota errors
  }

  return newItem;
}

export function clearConversionHistory(): void {
  try {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch {
    // ignore
  }
}
