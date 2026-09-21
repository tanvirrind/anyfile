import { describe, it, expect } from 'vitest';
import { createZipFromQueueItems } from '../../src/lib/converter/zipExporter';

function item(over: Record<string, unknown>) {
  return {
    id: 'x',
    name: 'photo.png',
    fromExt: 'png',
    toExt: 'jpg',
    status: 'completed',
    progress: 100,
    originalSize: 16,
    resultFileName: 'photo.jpg',
    resultBlobUrl: `data:image/png;base64,${Buffer.from('fake-bytes').toString('base64')}`,
    ...over,
  } as any;
}

describe('Fix #17 — ZIP export must not silently drop files', () => {
  it('reports unreadable files via `skipped` instead of omitting them silently', async () => {
    const good = item({ id: 'good' });
    const bad = item({ id: 'bad', resultFileName: 'missing.jpg', resultBlobUrl: 'http://127.0.0.1:9/unreachable' });

    const result = await createZipFromQueueItems([good, bad], 'batch.zip');

    expect(result.skipped).toEqual(['missing.jpg']);
    expect(result.filename).toBe('batch.zip');
    expect(result.size).toBeGreaterThan(0);
  });

  it('throws when no converted files are available at all', async () => {
    await expect(createZipFromQueueItems([item({ status: 'error', resultBlobUrl: undefined })])).rejects.toThrow(
      /no completed converted files/i
    );
  });

  it('throws rather than returning an empty archive when every file is unreadable', async () => {
    const bad = item({ resultBlobUrl: 'http://127.0.0.1:9/unreachable' });
    await expect(createZipFromQueueItems([bad])).rejects.toThrow(/none of the converted files could be read/i);
  });
});
