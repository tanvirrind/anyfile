import { QueueItem, ConversionOptions } from './types';
import { convertFileInBrowser, validateFileInput } from './engine';
import { addConversionHistory } from './history';

export type QueueListener = (queue: QueueItem[], stats: QueueStats) => void;

export interface QueueStats {
  total: number;
  completed: number;
  converting: number;
  pending: number;
  error: number;
  cancelled: number;
  overallProgressPercent: number;
}

export class ConversionQueueManager {
  private queue: QueueItem[] = [];
  private concurrencyLimit: number = 2;
  private activeWorkers: number = 0;
  private listeners: Set<QueueListener> = new Set();
  private options: ConversionOptions = { quality: 92, bgFill: '#FFFFFF' };
  private autoDeleteMinutes: number = 30; // default 30 mins
  private autoDeleteTimers: Map<string, NodeJS.Timeout> = new Map();

  constructor(concurrencyLimit: number = 2) {
    this.concurrencyLimit = concurrencyLimit;
  }

  public setOptions(options: ConversionOptions) {
    this.options = { ...this.options, ...options };
  }

  public setAutoDeleteMinutes(mins: number) {
    this.autoDeleteMinutes = mins;
  }

  public subscribe(listener: QueueListener): () => void {
    this.listeners.add(listener);
    listener(this.getQueue(), this.getStats());
    return () => this.listeners.delete(listener);
  }

  private notify() {
    const queueCopy = this.getQueue();
    const stats = this.getStats();
    this.listeners.forEach((fn) => fn(queueCopy, stats));
  }

  public getQueue(): QueueItem[] {
    return [...this.queue];
  }

  public getStats(): QueueStats {
    const total = this.queue.length;
    let completed = 0;
    let converting = 0;
    let pending = 0;
    let error = 0;
    let cancelled = 0;

    let totalProgressSum = 0;

    this.queue.forEach((item) => {
      if (item.status === 'completed') {
        completed++;
        totalProgressSum += 100;
      } else if (item.status === 'converting') {
        converting++;
        totalProgressSum += item.progress;
      } else if (item.status === 'pending' || item.status === 'queued') {
        pending++;
      } else if (item.status === 'error') {
        error++;
      } else if (item.status === 'cancelled') {
        cancelled++;
      }
    });

    const overallProgressPercent = total > 0 ? Math.round(totalProgressSum / total) : 0;

    return {
      total,
      completed,
      converting,
      pending,
      error,
      cancelled,
      overallProgressPercent,
    };
  }

  /**
   * Add files or folder items into queue
   */
  public addFiles(
    files: Array<{ file: File; folderPath?: string }>,
    fromExt: string,
    toExt: string
  ): { addedCount: number; errors: string[] } {
    const errors: string[] = [];
    let addedCount = 0;

    files.forEach(({ file, folderPath }) => {
      const val = validateFileInput(file, fromExt);
      if (!val.valid) {
        errors.push(`${file.name}: ${val.error || 'Invalid file'}`);
        return;
      }

      const item: QueueItem = {
        id: `job_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        file,
        name: file.name,
        originalSize: file.size,
        fromExt,
        toExt,
        status: 'queued',
        progress: 0,
        timestamp: Date.now(),
        folderPath,
        retryCount: 0,
      };

      this.queue.push(item);
      addedCount++;
    });

    this.notify();
    this.processQueue();

    return { addedCount, errors };
  }

  /**
   * Process next queued items up to concurrency limit
   */
  private async processQueue() {
    if (this.activeWorkers >= this.concurrencyLimit) {
      return;
    }

    const nextItem = this.queue.find((q) => q.status === 'queued');
    if (!nextItem) {
      return;
    }

    this.activeWorkers++;
    nextItem.status = 'converting';
    nextItem.progress = 10;
    nextItem.abortController = new AbortController();
    this.notify();

    try {
      const result = await convertFileInBrowser(
        nextItem.file,
        nextItem.fromExt,
        nextItem.toExt,
        this.options,
        (percent) => {
          if (nextItem.status === 'converting') {
            nextItem.progress = percent;
            this.notify();
          }
        },
        nextItem.abortController.signal
      );

      // Check if cancelled mid-flight
      if ((nextItem.status as string) === 'cancelled') {
        if (result.resultBlobUrl) URL.revokeObjectURL(result.resultBlobUrl);
      } else {
        nextItem.status = 'completed';
        nextItem.progress = 100;
        nextItem.resultBlobUrl = result.resultBlobUrl;
        nextItem.resultFileName = result.resultFileName;
        nextItem.resultSize = result.resultSize;

        // Add history record
        addConversionHistory({
          fileName: result.resultFileName,
          fromExt: nextItem.fromExt,
          toExt: nextItem.toExt,
          originalSize: nextItem.originalSize,
          convertedSize: result.resultSize,
          resultBlobUrl: result.resultBlobUrl,
        });

        // Setup auto-delete timer if enabled
        if (this.autoDeleteMinutes > 0) {
          this.scheduleAutoDelete(nextItem.id, result.resultBlobUrl, this.autoDeleteMinutes);
        }
      }
    } catch (err: any) {
      if ((nextItem.status as string) !== 'cancelled') {
        nextItem.status = 'error';
        nextItem.errorMessage = err.message || 'Conversion failed.';
      }
    } finally {
      this.activeWorkers--;
      this.notify();
      // Continue worker loop
      this.processQueue();
    }
  }

  /**
   * Cancel specific queue item
   */
  public cancelItem(id: string) {
    const item = this.queue.find((q) => q.id === id);
    if (!item) return;

    if (item.abortController) {
      item.abortController.abort();
    }

    if (item.resultBlobUrl) {
      URL.revokeObjectURL(item.resultBlobUrl);
      item.resultBlobUrl = undefined;
    }

    item.status = 'cancelled';
    item.errorMessage = 'Cancelled by user.';
    this.notify();
  }

  /**
   * Retry failed or cancelled item
   */
  public retryItem(id: string) {
    const item = this.queue.find((q) => q.id === id);
    if (!item) return;

    item.status = 'queued';
    item.progress = 0;
    item.errorMessage = undefined;
    item.retryCount = (item.retryCount || 0) + 1;
    this.notify();
    this.processQueue();
  }

  /**
   * Retry all failed or cancelled items
   */
  public retryAllFailed() {
    this.queue.forEach((item) => {
      if (item.status === 'error' || item.status === 'cancelled') {
        item.status = 'queued';
        item.progress = 0;
        item.errorMessage = undefined;
        item.retryCount = (item.retryCount || 0) + 1;
      }
    });
    this.notify();
    this.processQueue();
  }

  /**
   * Cancel all active and pending jobs
   */
  public cancelAll() {
    this.queue.forEach((item) => {
      if (item.status === 'converting' || item.status === 'queued') {
        if (item.abortController) item.abortController.abort();
        item.status = 'cancelled';
        item.errorMessage = 'Cancelled by user.';
      }
    });
    this.notify();
  }

  /**
   * Remove single item from queue
   */
  public removeItem(id: string) {
    const index = this.queue.findIndex((q) => q.id === id);
    if (index !== -1) {
      const item = this.queue[index];
      if (item.abortController) item.abortController.abort();
      if (item.resultBlobUrl) URL.revokeObjectURL(item.resultBlobUrl);
      this.clearAutoDeleteTimer(id);
      this.queue.splice(index, 1);
      this.notify();
    }
  }

  /**
   * Clear entire queue
   */
  public clearQueue() {
    this.queue.forEach((item) => {
      if (item.abortController) item.abortController.abort();
      if (item.resultBlobUrl) URL.revokeObjectURL(item.resultBlobUrl);
      this.clearAutoDeleteTimer(item.id);
    });
    this.queue = [];
    this.notify();
  }

  private scheduleAutoDelete(id: string, blobUrl: string, minutes: number) {
    this.clearAutoDeleteTimer(id);
    const ms = minutes * 60 * 1000;
    const timer = setTimeout(() => {
      const item = this.queue.find((q) => q.id === id);
      if (item && item.resultBlobUrl) {
        URL.revokeObjectURL(item.resultBlobUrl);
        item.resultBlobUrl = undefined;
        item.errorMessage = 'Result auto-deleted after timeout for privacy.';
        this.notify();
      }
    }, ms);
    this.autoDeleteTimers.set(id, timer);
  }

  private clearAutoDeleteTimer(id: string) {
    if (this.autoDeleteTimers.has(id)) {
      clearTimeout(this.autoDeleteTimers.get(id)!);
      this.autoDeleteTimers.delete(id);
    }
  }
}

/**
 * Extract files from DataTransferItems supporting folders & nested subdirectories
 */
export async function extractFilesFromDataTransfer(
  items: DataTransferItemList
): Promise<Array<{ file: File; folderPath?: string }>> {
  const result: Array<{ file: File; folderPath?: string }> = [];

  const traverseEntry = async (entry: any, path: string = '') => {
    if (entry.isFile) {
      return new Promise<void>((resolve) => {
        entry.file((file: File) => {
          result.push({ file, folderPath: path || undefined });
          resolve();
        });
      });
    } else if (entry.isDirectory) {
      const dirReader = entry.createReader();
      const readEntries = (): Promise<any[]> => {
        return new Promise((resolve, reject) => {
          dirReader.readEntries(resolve, reject);
        });
      };

      let entries: any[] = [];
      let readBatch = await readEntries();
      while (readBatch.length > 0) {
        entries = entries.concat(readBatch);
        readBatch = await readEntries();
      }

      for (const childEntry of entries) {
        await traverseEntry(childEntry, path ? `${path}/${entry.name}` : entry.name);
      }
    }
  };

  const entriesToProcess: any[] = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.kind === 'file') {
      const entry = item.webkitGetAsEntry ? item.webkitGetAsEntry() : null;
      if (entry) {
        entriesToProcess.push(entry);
      } else {
        const file = item.getAsFile();
        if (file) result.push({ file });
      }
    }
  }

  for (const entry of entriesToProcess) {
    await traverseEntry(entry);
  }

  return result;
}
