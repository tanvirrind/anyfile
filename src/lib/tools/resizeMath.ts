/**
 * Pure resize-dimension math for the Image Resizer tool.
 * Framework-free so the dimension logic can be unit-tested
 * (the workspace renders through canvas at these exact dims).
 */

export type ResizeMode = 'pixels' | 'percent' | 'preset';
export type ResizeOutFormat = 'original' | 'png' | 'jpg' | 'webp';

export interface ResizePreset {
  label: string;
  width: number;
  /** height 0 = derive from source aspect ratio */
  height: number;
}

export const RESIZE_PRESETS: ResizePreset[] = [
  { label: 'HD 1080p', width: 1920, height: 1080 },
  { label: 'HD 720p', width: 1280, height: 720 },
  { label: 'Large', width: 1600, height: 0 },
  { label: 'Medium', width: 1024, height: 0 },
  { label: 'Small', width: 640, height: 0 },
];

export const MAX_DIMENSION = 8192;

/**
 * Compute target dimensions from a resize spec.
 */
export function computeTargetDims(
  naturalW: number,
  naturalH: number,
  spec:
    | { mode: 'percent'; percent: number }
    | { mode: 'pixels'; w: number; h: number }
    | { mode: 'preset'; preset: ResizePreset }
): { w: number; h: number } {
  if (naturalW <= 0 || naturalH <= 0) return { w: 0, h: 0 };
  if (spec.mode === 'percent') {
    const p = Math.min(100, Math.max(1, spec.percent));
    return {
      w: Math.max(1, Math.round((naturalW * p) / 100)),
      h: Math.max(1, Math.round((naturalH * p) / 100)),
    };
  }
  if (spec.mode === 'preset') {
    if (spec.preset.height > 0) return { w: spec.preset.width, h: spec.preset.height };
    const w = spec.preset.width;
    return { w, h: Math.max(1, Math.round((naturalH * w) / naturalW)) };
  }
  return { w: Math.max(1, Math.round(spec.w)), h: Math.max(1, Math.round(spec.h)) };
}

/**
 * When the aspect lock is on, typing a width derives the height (and vice
 * versa) from the source image's aspect ratio.
 */
export function lockedCounterpart(
  naturalW: number,
  naturalH: number,
  edited: 'w' | 'h',
  value: number
): number {
  if (naturalW <= 0 || naturalH <= 0 || value <= 0) return 0;
  return edited === 'w'
    ? Math.max(1, Math.round((naturalH * value) / naturalW))
    : Math.max(1, Math.round((naturalW * value) / naturalH));
}

/** MIME type for the chosen output format. */
export function mimeForFormat(format: ResizeOutFormat, sourceType: string): string {
  if (format === 'png') return 'image/png';
  if (format === 'jpg') return 'image/jpeg';
  if (format === 'webp') return 'image/webp';
  return sourceType || 'image/png';
}

/** File extension for the chosen output format. */
export function extForFormat(format: ResizeOutFormat, mime: string): string {
  if (format === 'png' || mime === 'image/png') return 'png';
  if (format === 'jpg' || mime === 'image/jpeg') return 'jpg';
  if (format === 'webp' || mime === 'image/webp') return 'webp';
  return 'png';
}
