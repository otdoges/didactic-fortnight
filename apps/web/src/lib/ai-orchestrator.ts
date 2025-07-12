import { aiService } from './ai';
import { webContainerService } from './webcontainer';
import { toast } from 'sonner';

export interface GenerationTask {
  id: string;
  title: string;
  description: string;
  assignedModel: 'ARCHITECT' | 'ENGINEER' | 'REVIEWER' | 'DESIGNER' | 'COORDINATOR';
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  result?: any;
  error?: string;
  dependencies: string[];
}

export interface GenerationSession {
  id: string;
  userRequest: string;
  tasks: GenerationTask[];
  status: 'planning' | 'executing' | 'completed' | 'failed';
  results: {
    architecture?: string;
    code?: any;
    review?: string;
    design?: string;
    files?: Array<{ path: string; content: string; type: string }>;
  };
  createdAt: Date;
  updatedAt: Date;
}

export class AIOrchestrator {
  private static instance: AIOrchestrator;
  private sessions: Map<string, GenerationSession> = new Map();
  private activeSession: string | null = null;

  private constructor() {}

  static getInstance(): AIOrchestrator {
    if (!AIOrchestrator.instance) {
      AIOrchestrator.instance = new AIOrchestrator();
    }
    return AIOrchestrator.instance;
  }

  async startGeneration(userRequest: string): Promise<string> {
    const sessionId = this.generateSessionId();
    
    // Initialize session
    const session: GenerationSession = {
      id: sessionId,
      userRequest,
      tasks: [],
      status: 'planning',
      results: {},
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.sessions.set(sessionId, session);
    this.activeSession = sessionId;

    try {
      // Phase 1: Planning - Coordinator creates task plan
      toast.info('🎯 AI Team is planning your request...');
      const taskPlan = await aiService.createTaskPlan(userRequest);
      
      session.tasks = taskPlan.tasks.map(task => ({
        ...task,
        status: 'pending' as const
      }));
      
      session.status = 'executing';
      this.updateSession(session);

      // Phase 2: Execution - Run tasks in dependency order
      await this.executeTasks(session);

      return sessionId;
    } catch (error) {
      session.status = 'failed';
      this.updateSession(session);
      throw error;
    }
  }

  private async executeTasks(session: GenerationSession): Promise<void> {
    const taskQueue = [...session.tasks];
    const completed = new Set<string>();

    while (taskQueue.length > 0) {
      // Find tasks with satisfied dependencies
      const readyTasks = taskQueue.filter(task => 
        task.dependencies.every(dep => completed.has(dep))
      );

      if (readyTasks.length === 0) {
        throw new Error('Circular dependency detected in task plan');
      }

      // Execute ready tasks in parallel (group by priority)
      const highPriorityTasks = readyTasks.filter(t => t.priority === 'high');
      const mediumPriorityTasks = readyTasks.filter(t => t.priority === 'medium');
      const lowPriorityTasks = readyTasks.filter(t => t.priority === 'low');

      // Execute high priority first, then medium, then low
      for (const taskGroup of [highPriorityTasks, mediumPriorityTasks, lowPriorityTasks]) {
        if (taskGroup.length === 0) continue;

        const promises = taskGroup.map(task => this.executeTask(session, task));
        await Promise.all(promises);

        // Mark completed tasks
        taskGroup.forEach(task => {
          completed.add(task.id);
          taskQueue.splice(taskQueue.indexOf(task), 1);
        });
      }
    }

    // Phase 3: Integration - Combine results
    await this.integrateResults(session);
  }

  private async executeTask(session: GenerationSession, task: GenerationTask): Promise<void> {
    task.status = 'in-progress';
    this.updateSession(session);

    toast.info(`🤖 ${task.assignedModel} is working on: ${task.title}`);

    try {
      switch (task.assignedModel) {
        case 'ARCHITECT':
          task.result = await aiService.generateArchitecture(
            session.userRequest,
            JSON.stringify(session.results)
          );
          session.results.architecture = task.result;
          break;

        case 'ENGINEER':
          task.result = await aiService.generateCode(
            task.description,
            session.results.architecture || ''
          );
          session.results.code = task.result;
          session.results.files = task.result.files;
          break;

        case 'REVIEWER':
          task.result = await aiService.reviewCode(
            JSON.stringify(session.results.code),
            session.userRequest
          );
          session.results.review = task.result;
          break;

        case 'DESIGNER':
          task.result = await aiService.generateDesign(
            task.description,
            session.userRequest
          );
          session.results.design = task.result;
          break;

        case 'COORDINATOR':
          // Coordination tasks are handled by the orchestrator
          task.result = 'Task coordination completed';
          break;
      }

      task.status = 'completed';
      toast.success(`✅ ${task.assignedModel} completed: ${task.title}`);
    } catch (error) {
      task.status = 'failed';
      task.error = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`❌ ${task.assignedModel} failed: ${task.title}`);
      throw error;
    }

    this.updateSession(session);
  }

  private async integrateResults(session: GenerationSession): Promise<void> {
    toast.info('🔄 Integrating results and preparing preview...');

    try {
      // Apply reviewer feedback to code
      if (session.results.review && session.results.code) {
        // Re-generate code with review feedback
        const improvedCode = await aiService.generateCode(
          `${session.userRequest}\n\nReview feedback to incorporate:\n${session.results.review}`,
          session.results.architecture || ''
        );
        session.results.code = improvedCode;
        session.results.files = improvedCode.files;
      }

      // Prepare files for WebContainer
      if (session.results.files) {
        await this.prepareWebContainerFiles(session.results.files);
      }

      session.status = 'completed';
      toast.success('🎉 Generation completed! Your app is ready.');
    } catch (error) {
      session.status = 'failed';
      toast.error('❌ Failed to integrate results');
      throw error;
    }

    this.updateSession(session);
  }

  private async prepareWebContainerFiles(files: Array<{ path: string; content: string; type: string }>) {
    // Initialize WebContainer if not already done
    await webContainerService.initialize();

    // Create project structure
    const projectFiles = await webContainerService.createReactProject('ai-generated-app');

    // Add generated files to project
    for (const file of files) {
      if (file.path.startsWith('src/')) {
        projectFiles.src!.directory![file.path.replace('src/', '')] = {
          file: { contents: file.content }
        };
      } else {
        projectFiles[file.path] = {
          file: { contents: file.content }
        };
      }
    }

    // Mount files to WebContainer
    await webContainerService.createProject(projectFiles);
  }

  private generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private updateSession(session: GenerationSession): void {
    session.updatedAt = new Date();
    this.sessions.set(session.id, session);
  }

  getSession(sessionId: string): GenerationSession | undefined {
    return this.sessions.get(sessionId);
  }

  getActiveSession(): GenerationSession | undefined {
    return this.activeSession ? this.sessions.get(this.activeSession) : undefined;
  }

  getAllSessions(): GenerationSession[] {
    return Array.from(this.sessions.values()).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async regenerateWithFeedback(sessionId: string, feedback: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    // Create new request with feedback
    const enhancedRequest = `${session.userRequest}\n\nUser feedback: ${feedback}`;
    
    // Reset session for re-generation
    session.userRequest = enhancedRequest;
    session.status = 'planning';
    session.results = {};
    session.updatedAt = new Date();

    // Re-run generation
    await this.startGeneration(enhancedRequest);
  }
}

export const aiOrchestrator = AIOrchestrator.getInstance();