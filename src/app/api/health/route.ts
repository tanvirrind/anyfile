import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    ssrEngine: 'Next.js App Router',
    timestamp: new Date().toISOString(),
  });
}
