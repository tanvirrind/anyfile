/**
 * Pure crop-rectangle math for the Image Cropper tool.
 * All values in SOURCE pixels; framework-free so it can be unit-tested
 * (the workspace renders these rects through a display scale factor).
 */

export interface CropRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface CropBounds {
  w: number; // source image width
  h: number; // source image height
}

export type CropHandle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';

export const MIN_CROP = 8;

const round = (v: number) => Math.round(v * 100) / 100;

/**
 * Move a crop rect by (dx, dy) source pixels, clamped inside bounds.
 */
export function moveCrop(start: CropRect, dx: number, dy: number, bounds: CropBounds): CropRect {
  const x = Math.min(Math.max(0, start.x + dx), Math.max(0, bounds.w - start.w));
  const y = Math.min(Math.max(0, start.y + dy), Math.max(0, bounds.h - start.h));
  return { x: round(x), y: round(y), w: start.w, h: start.h };
}

/**
 * Resize a crop rect from the given handle by (dx, dy) source pixels.
 * When `aspect` is set (width / height), the rect keeps that ratio.
 * The corner/edge opposite the handle stays anchored where bounds allow.
 */
export function resizeCrop(
  start: CropRect,
  dx: number,
  dy: number,
  handle: CropHandle,
  aspect: number | null,
  bounds: CropBounds
): CropRect {
  // Normalize to an x/y/w/h form where the dragged edges are free.
  let { x, y, w, h } = start;
  const right = x + w;
  const bottom = y + h;

  const dragsLeft = handle === 'nw' || handle === 'w' || handle === 'sw';
  const dragsTop = handle === 'nw' || handle === 'n' || handle === 'ne';
  const dragsRight = handle === 'ne' || handle === 'e' || handle === 'se';
  const dragsBottom = handle === 'sw' || handle === 's' || handle === 'se';

  let newLeft = dragsLeft ? x + dx : x;
  let newTop = dragsTop ? y + dy : y;
  let newRight = dragsRight ? right + dx : right;
  let newBottom = dragsBottom ? bottom + dy : bottom;

  if (aspect !== null && aspect > 0) {
    // Drive one axis off the dragged handle, derive the other from aspect.
    if (handle === 'e' || handle === 'w') {
      const nw = newRight - newLeft;
      newBottom = newTop + nw / aspect;
    } else if (handle === 's' || handle === 'n') {
      const nh = newBottom - newTop;
      newRight = newLeft + nh * aspect;
    } else {
      // Corner handles: drive off width, derive height.
      const nw = newRight - newLeft;
      const nh = nw / aspect;
      if (dragsTop) newTop = newBottom - nh;
      else newBottom = newTop + nh;
    }
    if (dragsLeft) newLeft = newRight - (newBottom - newTop) * aspect;
  }

  w = newRight - newLeft;
  h = newBottom - newTop;
  x = newLeft;
  y = newTop;

  // Enforce minimum size (grow back toward the anchor side).
  if (w < MIN_CROP) {
    if (dragsLeft) x -= MIN_CROP - w; else x = x;
    w = MIN_CROP;
  }
  if (h < MIN_CROP) {
    if (dragsTop) y -= MIN_CROP - h;
    h = MIN_CROP;
  }

  // Clamp inside bounds, preserving aspect where set.
  if (x < 0) {
    if (aspect !== null) {
      const adj = -x;
      x = 0;
      w -= adj;
      if (dragsBottom || !dragsTop) h = w / aspect; else { h = w / aspect; y = bottom - h; }
    } else {
      w += x;
      x = 0;
    }
  }
  if (y < 0) {
    if (aspect !== null) {
      const adj = -y;
      y = 0;
      h -= adj;
      w = h * aspect;
      if (dragsRight && !dragsLeft) x = right - w; else if (dragsLeft) x = Math.max(0, x);
    } else {
      h += y;
      y = 0;
    }
  }
  if (x + w > bounds.w) {
    w = bounds.w - x;
    if (aspect !== null) h = w / aspect;
  }
  if (y + h > bounds.h) {
    h = bounds.h - y;
    if (aspect !== null) w = h * aspect;
  }
  if (w < MIN_CROP) w = MIN_CROP;
  if (h < MIN_CROP) h = MIN_CROP;

  return { x: round(x), y: round(y), w: round(w), h: round(h) };
}

/**
 * Fit the current rect to a new aspect ratio, shrinking inside the
 * existing rect and keeping it centered.
 */
export function fitAspect(rect: CropRect, aspect: number | null, bounds: CropBounds): CropRect {
  if (aspect === null) return rect;
  const rectAspect = rect.w / rect.h;
  let w = rect.w;
  let h = rect.h;
  if (rectAspect > aspect) {
    w = h * aspect;
  } else {
    h = w / aspect;
  }
  w = Math.max(MIN_CROP, Math.min(w, bounds.w));
  h = Math.max(MIN_CROP, Math.min(h, bounds.h));
  const x = Math.min(Math.max(0, rect.x + (rect.w - w) / 2), bounds.w - w);
  const y = Math.min(Math.max(0, rect.y + (rect.h - h) / 2), bounds.h - h);
  return { x: round(x), y: round(y), w: round(w), h: round(h) };
}

/**
 * Default crop: centered rect covering 80% of the shorter side,
 * expanded to a square (aspect 1) region.
 */
export function defaultCrop(bounds: CropBounds): CropRect {
  const side = Math.floor(Math.min(bounds.w, bounds.h) * 0.8);
  return {
    x: Math.floor((bounds.w - side) / 2),
    y: Math.floor((bounds.h - side) / 2),
    w: side,
    h: side,
  };
}
