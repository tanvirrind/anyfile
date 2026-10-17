import { ImageResponse } from 'next/og';
import { iconMarkup } from '../icon-shared';

// iOS rounds the icon itself: full-bleed, no transparency.
// Generated at build time; paths are content-stable, so cache aggressively.
export const revalidate = 31536000;

export function GET() {
  return new ImageResponse(iconMarkup(180, 'apple'), { width: 180, height: 180 });
}
