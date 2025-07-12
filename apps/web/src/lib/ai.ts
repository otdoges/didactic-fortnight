import { groq } from '@ai-sdk/groq';
import { generateText, generateObject, streamText } from 'ai';
import { z } from 'zod';
import { SYSTEM_PROMPTS, PromptEnhancer } from './system-prompts';

// Reasoning model configuration
export const REASONING_CONFIG = {
  temperature: 0.6,
  maxTokens: 2048,
  reasoningFormat: 'parsed' as const, // 'parsed' | 'raw' | 'hidden'
  enableStepByStep: true,
} as const;

// AI Models Configuration - Enhanced with reasoning models
export const AI_MODELS = {
  // Reasoning models for complex problem-solving
  ARCHITECT: 'deepseek-r1-distill-llama-70b',    // System architecture & planning
  ENGINEER: 'qwen/qwen3-32b',                     // Code generation & implementation
  REVIEWER: 'qwen-qwq-32b',                       // Code review & optimization
  // Specialized models
  DESIGNER: 'llama-3.2-90b-text-preview',        // UI/UX design decisions
  COORDINATOR: 'llama-3.2-11b-text-preview',     // Task coordination & management
  // Traditional models (fallback)
  LEGACY_ENGINEER: 'llama-3.1-70b-versatile',    // Fallback for code generation
  LEGACY_ARCHITECT: 'llama-3.3-70b-versatile',   // Fallback for architecture
} as const;

// Schema for structured AI responses
export const CodeGenerationSchema = z.object({
  files: z.array(z.object({
    path: z.string(),
    content: z.string(),
    type: z.enum(['component', 'page', 'utility', 'style', 'config'])
  })),
  dependencies: z.array(z.string()),
  instructions: z.string(),
  reasoning: z.string(),
  stepByStepAnalysis: z.object({
    problemAnalysis: z.string(),
    solutionDesign: z.string(),
    implementationPlan: z.string(),
    considerations: z.array(z.string())
  }).optional()
});

export const TaskPlanSchema = z.object({
  tasks: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    assignedModel: z.enum(['ARCHITECT', 'ENGINEER', 'REVIEWER', 'DESIGNER', 'COORDINATOR']),
    priority: z.enum(['high', 'medium', 'low']),
    dependencies: z.array(z.string())
  })),
  overview: z.string(),
  estimatedComplexity: z.enum(['simple', 'medium', 'complex'])
});

// AI Model Service
export class AIService {
  private static instance: AIService;
  
  private constructor() {}
  
  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  // Coordinator: Creates task plan and delegates work
  async createTaskPlan(userRequest: string): Promise<z.infer<typeof TaskPlanSchema>> {
    const enhancedPrompt = PromptEnhancer.withReasoning(`
      Break down this user request into specific tasks for our AI team:
      - ARCHITECT: System design and architecture decisions (uses ${AI_MODELS.ARCHITECT})
      - ENGINEER: Code implementation and technical details (uses ${AI_MODELS.ENGINEER})
      - REVIEWER: Code quality, optimization, and best practices (uses ${AI_MODELS.REVIEWER})
      - DESIGNER: UI/UX design, styling, and user experience
      - COORDINATOR: Task management and integration

      User Request: ${userRequest}

      Create a detailed task plan with clear responsibilities for each model.
    `, SYSTEM_PROMPTS.COORDINATOR);

    const { object } = await generateObject({
      model: groq(AI_MODELS.COORDINATOR),
      schema: TaskPlanSchema,
      prompt: enhancedPrompt
    });
    
    return object as z.infer<typeof TaskPlanSchema>;
  }

  // Architect: High-level system design and planning with reasoning
  async generateArchitecture(userRequest: string, context?: string) {
    const enhancedPrompt = PromptEnhancer.withStepByStep(`
      Design the high-level system architecture for this request.
      
      Focus on:
      - Component structure and hierarchy
      - Data flow and state management
      - Technology choices and patterns
      - Integration points and dependencies
      - Performance and scalability considerations
      
      ${context ? `Context: ${context}` : ''}
      User Request: ${userRequest}
    `, [
      'ANALYZE the user request and identify core requirements',
      'DECOMPOSE the problem into system components',
      'DESIGN the architecture with clear rationale',
      'VALIDATE the design against requirements'
    ]);

    const { text } = await generateText({
      model: groq(AI_MODELS.ARCHITECT),
      temperature: REASONING_CONFIG.temperature,
      maxTokens: REASONING_CONFIG.maxTokens,
      prompt: `${SYSTEM_PROMPTS.SYSTEM_ARCHITECT}\n\n${enhancedPrompt}`
    });
    
    return text;
  }

  // Engineer: Code generation and implementation with reasoning
  async generateCode(specification: string, architecture: string): Promise<z.infer<typeof CodeGenerationSchema>> {
    const enhancedPrompt = PromptEnhancer.withValidation(`
      Implement the code based on the specification and architecture.
      
      Architecture: ${architecture}
      Specification: ${specification}
      
      Generate clean, modern React/TypeScript code using:
      - Next.js 15 with App Router
      - TailwindCSS for styling
      - shadcn/ui components
      - TypeScript for type safety
      - Modern React patterns (hooks, context, etc.)
      
      Include stepByStepAnalysis with:
      - Problem analysis of the requirements
      - Solution design rationale
      - Implementation plan and approach
      - Key considerations and tradeoffs
    `, [
      'Code is production-ready and well-structured',
      'Follows React and TypeScript best practices',
      'Uses modern patterns and libraries appropriately',
      'Includes proper error handling and type safety',
      'Meets all specified requirements'
    ]);

    const { object } = await generateObject({
      model: groq(AI_MODELS.ENGINEER),
      schema: CodeGenerationSchema,
      temperature: REASONING_CONFIG.temperature,
      maxTokens: REASONING_CONFIG.maxTokens,
      prompt: `${SYSTEM_PROMPTS.CODE_ENGINEER}\n\n${enhancedPrompt}`
    });
    
    return object as z.infer<typeof CodeGenerationSchema>;
  }

  // Reviewer: Code review and optimization with reasoning
  async reviewCode(code: string, context: string) {
    const enhancedPrompt = PromptEnhancer.withStepByStep(`
      Review this code systematically.
      
      Review criteria:
      - Code quality and best practices
      - Performance optimizations
      - Security considerations
      - Accessibility improvements
      - Error handling
      - TypeScript type safety
      - Maintainability and readability
      
      Context: ${context}
      Code to review: ${code}
    `, [
      'ANALYZE the code structure and patterns',
      'EVALUATE against best practices and standards',
      'IDENTIFY potential issues and improvements',
      'PRIORITIZE feedback by impact and severity',
      'RECOMMEND specific actionable improvements'
    ]);

    const { text } = await generateText({
      model: groq(AI_MODELS.REVIEWER),
      temperature: REASONING_CONFIG.temperature,
      maxTokens: REASONING_CONFIG.maxTokens,
      prompt: `${SYSTEM_PROMPTS.CODE_REVIEWER}\n\n${enhancedPrompt}`
    });
    
    return text;
  }

  // Designer: UI/UX design and styling decisions
  async generateDesign(requirements: string, userRequest: string) {
    const { text } = await generateText({
      model: groq(AI_MODELS.DESIGNER),
      prompt: `
        You are the Designer AI. Create UI/UX design specifications for this request.
        
        Requirements: ${requirements}
        User Request: ${userRequest}
        
        Focus on:
        - Visual design and layout
        - User experience and interaction patterns
        - Responsive design considerations
        - Accessibility and usability
        - Animation and micro-interactions
        - Color scheme and typography
        
        Use TailwindCSS classes and modern design principles.
      `
    });
    
    return text;
  }

  // Stream text generation for chat interface
  async streamResponse(prompt: string, model: keyof typeof AI_MODELS = 'ENGINEER') {
    return streamText({
      model: groq(AI_MODELS[model]),
      prompt,
    });
  }
}

export const aiService = AIService.getInstance();