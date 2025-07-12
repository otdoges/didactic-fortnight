'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Send, Bot, User, Zap, Eye, Code, Palette, Settings } from 'lucide-react';
import { aiOrchestrator } from '@/lib/ai-orchestrator';
import type { GenerationSession, GenerationTask } from '@/lib/ai-orchestrator';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  session?: GenerationSession;
}

const MODEL_ICONS = {
  ARCHITECT: Settings,
  ENGINEER: Code,
  REVIEWER: Eye,
  DESIGNER: Palette,
  COORDINATOR: Zap
} as const;

const MODEL_COLORS = {
  ARCHITECT: 'bg-blue-500',
  ENGINEER: 'bg-green-500',
  REVIEWER: 'bg-yellow-500',
  DESIGNER: 'bg-purple-500',
  COORDINATOR: 'bg-orange-500'
} as const;

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeSession, setActiveSession] = useState<GenerationSession | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsGenerating(true);

    try {
      const sessionId = await aiOrchestrator.startGeneration(input);
      
      // Add system message
      const systemMessage: ChatMessage = {
        id: `${Date.now()}-system`,
        type: 'system',
        content: `🎯 AI Team is working on your request. Session ID: ${sessionId}`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, systemMessage]);

      // Start polling for updates
      const pollInterval = setInterval(async () => {
        const session = aiOrchestrator.getSession(sessionId);
        if (session) {
          setActiveSession(session);
          
          if (session.status === 'completed') {
            clearInterval(pollInterval);
            setIsGenerating(false);
            
            const completionMessage: ChatMessage = {
              id: `${Date.now()}-completion`,
              type: 'assistant',
              content: '🎉 Your app has been generated successfully! Check out the preview and files.',
              timestamp: new Date(),
              session
            };
            
            setMessages(prev => [...prev, completionMessage]);
          } else if (session.status === 'failed') {
            clearInterval(pollInterval);
            setIsGenerating(false);
            toast.error('Generation failed. Please try again.');
          }
        }
      }, 1000);

      // Clean up interval after 5 minutes
      setTimeout(() => {
        clearInterval(pollInterval);
        setIsGenerating(false);
      }, 300000);

    } catch (error) {
      setIsGenerating(false);
      toast.error('Failed to start generation');
      console.error('Generation error:', error);
    }
  };

  const TaskProgress = ({ task }: { task: GenerationTask }) => {
    const Icon = MODEL_ICONS[task.assignedModel];
    const colorClass = MODEL_COLORS[task.assignedModel];
    
    return (
      <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
        <div className={`p-2 rounded-full ${colorClass} text-white`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{task.title}</span>
            <Badge 
              variant={task.status === 'completed' ? 'default' : 
                      task.status === 'failed' ? 'destructive' : 'secondary'}
            >
              {task.status}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
        </div>
      </div>
    );
  };

  const SessionProgress = ({ session }: { session: GenerationSession }) => {
    const completedTasks = session.tasks.filter(t => t.status === 'completed').length;
    const totalTasks = session.tasks.length;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return (
      <Card className="mt-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Bot className="w-4 h-4" />
            AI Team Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span>Tasks completed</span>
            <span>{completedTasks}/{totalTasks}</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="space-y-2">
            {session.tasks.map((task) => (
              <TaskProgress key={task.id} task={task} />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-4">
      <div className="flex-1 flex flex-col">
        <ScrollArea ref={scrollRef} className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <Bot className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Welcome to AI Code Generator</h3>
                <p className="text-muted-foreground">
                  Describe what you want to build and our AI team will create it for you!
                </p>
              </div>
            )}

            {messages.map((message) => (
              <div key={message.id} className="space-y-2">
                <div className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.type !== 'user' && (
                    <div className="flex-shrink-0">
                      {message.type === 'assistant' ? (
                        <Bot className="w-8 h-8 p-2 rounded-full bg-primary text-primary-foreground" />
                      ) : (
                        <Zap className="w-8 h-8 p-2 rounded-full bg-orange-500 text-white" />
                      )}
                    </div>
                  )}
                  
                  <div className={`flex flex-col ${message.type === 'user' ? 'items-end' : 'items-start'} max-w-[80%]`}>
                    <div className={`rounded-lg px-4 py-2 ${
                      message.type === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : message.type === 'system'
                        ? 'bg-orange-100 text-orange-800 border border-orange-200'
                        : 'bg-muted'
                    }`}>
                      {message.content}
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>

                  {message.type === 'user' && (
                    <div className="flex-shrink-0">
                      <User className="w-8 h-8 p-2 rounded-full bg-secondary" />
                    </div>
                  )}
                </div>

                {message.session && (
                  <SessionProgress session={message.session} />
                )}
              </div>
            ))}

            {activeSession && activeSession.status !== 'completed' && (
              <SessionProgress session={activeSession} />
            )}
          </div>
        </ScrollArea>

        <Separator className="my-4" />

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe what you want to build..."
            className="flex-1"
            disabled={isGenerating}
          />
          <Button type="submit" disabled={isGenerating || !input.trim()}>
            {isGenerating ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}