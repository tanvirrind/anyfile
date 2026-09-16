import { WorkflowHistoryRecord } from './types';

const STORAGE_KEY = 'anyfilex_workflow_history_v1';
const MAX_HISTORY_ITEMS = 30;

export function getWorkflowHistory(): WorkflowHistoryRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('Failed to parse workflow history from localStorage:', err);
    return [];
  }
}

export function saveWorkflowRecord(record: Omit<WorkflowHistoryRecord, 'id' | 'executedAt'>): WorkflowHistoryRecord {
  try {
    const history = getWorkflowHistory();
    const newRecord: WorkflowHistoryRecord = {
      ...record,
      id: 'wf_rec_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now(),
      executedAt: new Date().toISOString()
    };

    const updated = [newRecord, ...history].slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newRecord;
  } catch (err) {
    console.warn('Failed to save workflow record:', err);
    return {
      ...record,
      id: 'wf_rec_temp',
      executedAt: new Date().toISOString()
    };
  }
}

export function clearWorkflowHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to clear workflow history:', err);
  }
}

export function deleteWorkflowRecord(id: string): void {
  try {
    const history = getWorkflowHistory();
    const filtered = history.filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.warn('Failed to delete workflow record:', err);
  }
}
