'use client';

import { ConverterUploadBox } from '@/components/converter/ConverterUploadBox';
import { resolveConverterPair } from '@/lib/converter/registry';

export function SpanishConverterTool({ converterId }: { converterId: string }) {
  const pair = resolveConverterPair(converterId);
  return <div className="mx-auto max-w-4xl">
    <ConverterUploadBox pair={pair} />
  </div>;
}
