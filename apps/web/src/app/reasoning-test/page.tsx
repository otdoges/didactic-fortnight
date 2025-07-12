'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

interface ReasoningResponse {
  response: string;
  model: string;
  config: {
    temperature: number;
    maxTokens: number;
    reasoningFormat: string;
  };
}

export default function ReasoningTestPage() {
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState('qwen/qwen3-32b');
  const [response, setResponse] = useState<ReasoningResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const reasoningModels = [
    { id: 'qwen/qwen3-32b', name: 'Qwen3 32B', description: 'Code generation and implementation' },
    { id: 'qwen-qwq-32b', name: 'Qwen QwQ 32B', description: 'Code review and optimization' },
    { id: 'deepseek-r1-distill-llama-70b', name: 'DeepSeek R1 Distill', description: 'System architecture and planning' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError('');
    setResponse(null);

    try {
      const res = await fetch('/api/reasoning', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          model: selectedModel,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Reasoning Models Test</h1>
        <p className="text-muted-foreground">
          Test the Groq reasoning models with enhanced system prompts
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Test Reasoning Models</CardTitle>
          <CardDescription>
            Select a reasoning model and enter a prompt to test its capabilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="model" className="block text-sm font-medium mb-2">
                Select Model
              </label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a reasoning model" />
                </SelectTrigger>
                <SelectContent>
                  {reasoningModels.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{model.name}</span>
                        <span className="text-sm text-muted-foreground">{model.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="prompt" className="block text-sm font-medium mb-2">
                Prompt
              </label>
              <Textarea
                id="prompt"
                placeholder="Enter your prompt here... (e.g., 'Explain how to implement a React component with TypeScript')"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                className="w-full"
              />
            </div>

            <Button type="submit" disabled={isLoading || !prompt.trim()} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Test Reasoning Model'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700">{error}</p>
          </CardContent>
        </Card>
      )}

      {response && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Response
              <Badge variant="outline">{response.model}</Badge>
            </CardTitle>
            <CardDescription>
              Temperature: {response.config.temperature} | Max Tokens: {response.config.maxTokens}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap text-sm font-mono bg-gray-50 p-4 rounded-md overflow-auto">
              {response.response}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}