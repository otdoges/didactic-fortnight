import { NextRequest, NextResponse } from 'next/server';
import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';
import { AI_MODELS, REASONING_CONFIG } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const { prompt, model, temperature, maxTokens, reasoningFormat } = await request.json();
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Validate model selection
    const selectedModel = model || AI_MODELS.ENGINEER;
    const validModels = [
      AI_MODELS.ARCHITECT,
      AI_MODELS.ENGINEER,
      AI_MODELS.REVIEWER,
      'qwen/qwen3-32b',
      'qwen-qwq-32b',
      'deepseek-r1-distill-llama-70b'
    ];

    if (!validModels.includes(selectedModel)) {
      return NextResponse.json(
        { error: 'Invalid model selection' },
        { status: 400 }
      );
    }

    // Enhanced reasoning prompt
    const reasoningPrompt = `
      You are an advanced reasoning AI model. Follow these guidelines:
      
      1. ANALYZE the problem or request step by step
      2. BREAK DOWN complex tasks into manageable components
      3. REASON through each step with clear logic
      4. VALIDATE your reasoning at each step
      5. PROVIDE the final answer with supporting rationale
      
      User Request: ${prompt}
      
      Please provide a detailed response with your reasoning process exposed.
    `;

    const { text } = await generateText({
      model: groq(selectedModel),
      temperature: temperature || REASONING_CONFIG.temperature,
      maxTokens: maxTokens || REASONING_CONFIG.maxTokens,
      prompt: reasoningPrompt,
    });

    return NextResponse.json({ 
      response: text,
      model: selectedModel,
      config: {
        temperature: temperature || REASONING_CONFIG.temperature,
        maxTokens: maxTokens || REASONING_CONFIG.maxTokens,
        reasoningFormat: reasoningFormat || REASONING_CONFIG.reasoningFormat
      }
    });
  } catch (error) {
    console.error('Reasoning API error:', error);
    
    return NextResponse.json(
      { error: 'Failed to process reasoning request' },
      { status: 500 }
    );
  }
}

// Get available reasoning models
export async function GET() {
  try {
    const availableModels = {
      reasoning: [
        { id: AI_MODELS.ARCHITECT, name: 'DeepSeek R1 Distill Llama 70B', description: 'Best for system architecture and planning' },
        { id: AI_MODELS.ENGINEER, name: 'Qwen3 32B', description: 'Optimized for code generation and implementation' },
        { id: AI_MODELS.REVIEWER, name: 'Qwen QwQ 32B', description: 'Specialized for code review and optimization' },
      ],
      traditional: [
        { id: AI_MODELS.DESIGNER, name: 'Llama 3.2 90B', description: 'UI/UX design decisions' },
        { id: AI_MODELS.COORDINATOR, name: 'Llama 3.2 11B', description: 'Task coordination and management' },
      ],
      config: REASONING_CONFIG
    };

    return NextResponse.json(availableModels);
  } catch (error) {
    console.error('Models API error:', error);
    
    return NextResponse.json(
      { error: 'Failed to get available models' },
      { status: 500 }
    );
  }
}