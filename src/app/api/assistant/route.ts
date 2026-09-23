import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import {
  buildDatabaseContext,
  extractSuggestedActions,
  generateLocalFallbackResponse,
} from '@/lib/assistant/knowledgeEngine';

let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Failed to initialize Gemini SDK in Route Handler:', err);
  }
}

const sanitizePromptField = (value: unknown, maxLen: number): string => {
  if (value === null || value === undefined) return '';
  return String(value).replace(/[\u0000-\u001f\u007f]/g, ' ').slice(0, maxLen);
};

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
    let promptContent = prompt;
    const fileContext = body.fileContext;

    if (fileContext && typeof fileContext === 'object') {
      const name = sanitizePromptField(fileContext.name, 200);
      const size = sanitizePromptField(fileContext.size, 20);
      const mimeType = sanitizePromptField(fileContext.mimeType, 120);
      const magicBytes = sanitizePromptField(fileContext.magicBytes, 200);
      promptContent = `[ATTACHED FILE FOR ANALYSIS]:\nFileName: ${name}\nFileSize: ${size} bytes\nMIME Type: ${mimeType}\nMagic Bytes Hex: ${magicBytes || 'N/A'}\n\nUSER QUESTION:\n${prompt}`;
    }

    if (!process.env.GEMINI_API_KEY || !ai) {
      const fallback = generateLocalFallbackResponse(prompt);
      return NextResponse.json({
        text: fallback.text,
        suggestedActions: fallback.suggestedActions,
        isFallback: true,
      });
    }

    try {
      const systemInstruction = buildDatabaseContext();
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptContent,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const responseText =
        response.text ||
        'I apologize, but I was unable to generate a response for that file format query.';
      const suggestedActions = extractSuggestedActions(prompt, responseText);

      return NextResponse.json({
        text: responseText,
        suggestedActions,
        isFallback: false,
      });
    } catch (apiError: any) {
      const isRateLimit =
        apiError?.status === 429 ||
        apiError?.code === 429 ||
        String(apiError?.message || '').toLowerCase().includes('resource_exhausted') ||
        String(apiError?.message || '').toLowerCase().includes('rate') ||
        String(apiError?.message || '').toLowerCase().includes('quota');

      console.warn('Route Handler Gemini Error:', apiError?.message || apiError);
      const fallback = generateLocalFallbackResponse(prompt);
      const notice = isRateLimit
        ? '*(Note: AI rate limit reached. Answered instantly via AnyFileX offline format intelligence engine.)*'
        : '*(Note: Generated via AnyFileX Local Knowledge Engine due to network fallback)*';

      return NextResponse.json({
        text: `${fallback.text}\n\n${notice}`,
        suggestedActions: fallback.suggestedActions,
        isFallback: true,
        rateLimitExceeded: isRateLimit,
        error: isRateLimit ? 'Rate limit reached' : apiError.message || 'Gemini API call error',
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
