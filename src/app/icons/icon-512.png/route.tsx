import { ImageResponse } from 'next/og';
import { iconMarkup } from '../icon-shared';

// Generated at build time; paths are content-stable, so cache aggressively.
export const revalidate = 31536000;

export function GET() {
  return new ImageResponse(iconMarkup(512, 'app'), { width: 512, height: 512 });
}
