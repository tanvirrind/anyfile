import { NextRequest, NextResponse } from 'next/server';
import { generateLocalFallbackResponse } from '@/lib/assistant/knowledgeEngine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawMessage: unknown = body.message;
    const message =
      typeof rawMessage === 'string'
        ? rawMessage.trim()
        : rawMessage === null || rawMessage === undefined
          ? ''
          : String(rawMessage);

    if (message.length > 4000) {
      return NextResponse.json(
        { error: 'Message too long (max 4000 characters).' },
        { status: 400 }
      );
    }

    const prompt = message || 'Hello';
    const fallback = generateLocalFallbackResponse(prompt);
    return NextResponse.json({
      text: fallback.text,
      suggestedActions: fallback.suggestedActions,
      isFallback: true,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
