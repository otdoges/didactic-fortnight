import { NextRequest, NextResponse } from 'next/server';
import { aiOrchestrator } from '@/lib/ai-orchestrator';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const sessionId = await aiOrchestrator.startGeneration(prompt);
    
    return NextResponse.json({ sessionId });
  } catch (error) {
    console.error('Generation API error:', error);
    
    return NextResponse.json(
      { error: 'Failed to start generation' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    const session = aiOrchestrator.getSession(sessionId);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error('Session API error:', error);
    
    return NextResponse.json(
      { error: 'Failed to get session' },
      { status: 500 }
    );
  }
}