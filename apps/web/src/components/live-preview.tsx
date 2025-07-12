'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Play, 
  Square, 
  RotateCcw, 
  ExternalLink, 
  Monitor, 
  Smartphone, 
  Tablet,
  Code,
  Eye,
  Loader2
} from 'lucide-react';
import { webContainerService } from '@/lib/webcontainer';
import { aiOrchestrator } from '@/lib/ai-orchestrator';
import { toast } from 'sonner';

interface PreviewProps {
  sessionId?: string;
}

export default function LivePreview({ sessionId }: PreviewProps) {
  const [isPreviewRunning, setIsPreviewRunning] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [files, setFiles] = useState<Array<{ path: string; content: string; type: string }>>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  useEffect(() => {
    if (sessionId) {
      const session = aiOrchestrator.getSession(sessionId);
      if (session?.results.files) {
        setFiles(session.results.files);
        if (session.results.files.length > 0) {
          setSelectedFile(session.results.files[0].path);
        }
      }
    }
  }, [sessionId]);

  const startPreview = async () => {
    if (!sessionId) {
      toast.error('No session selected');
      return;
    }

    setIsLoading(true);
    
    try {
      const session = aiOrchestrator.getSession(sessionId);
      if (!session?.results.files) {
        toast.error('No files to preview');
        return;
      }

      // Initialize WebContainer
      await webContainerService.initialize();
      
      // Install dependencies
      toast.info('Installing dependencies...');
      await webContainerService.installDependencies();
      
      // Start development server
      toast.info('Starting development server...');
      const url = await webContainerService.startDevServer();
      
      setPreviewUrl(url);
      setIsPreviewRunning(true);
      toast.success('Preview is ready!');
      
    } catch (error) {
      console.error('Failed to start preview:', error);
      toast.error('Failed to start preview');
    } finally {
      setIsLoading(false);
    }
  };

  const stopPreview = async () => {
    setIsPreviewRunning(false);
    setPreviewUrl(null);
    toast.info('Preview stopped');
  };

  const restartPreview = async () => {
    await stopPreview();
    await startPreview();
  };

  const openInNewTab = () => {
    if (previewUrl) {
      window.open(previewUrl, '_blank');
    }
  };

  const getViewportDimensions = () => {
    switch (viewport) {
      case 'mobile':
        return { width: '375px', height: '667px' };
      case 'tablet':
        return { width: '768px', height: '1024px' };
      default:
        return { width: '100%', height: '100%' };
    }
  };

  const getFileLanguage = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'tsx':
      case 'ts':
        return 'typescript';
      case 'jsx':
      case 'js':
        return 'javascript';
      case 'css':
        return 'css';
      case 'html':
        return 'html';
      case 'json':
        return 'json';
      default:
        return 'text';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Live Preview</h2>
          <Badge variant={isPreviewRunning ? 'default' : 'secondary'}>
            {isPreviewRunning ? 'Running' : 'Stopped'}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          {isPreviewRunning && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewport('desktop')}
                className={viewport === 'desktop' ? 'bg-accent' : ''}
              >
                <Monitor className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewport('tablet')}
                className={viewport === 'tablet' ? 'bg-accent' : ''}
              >
                <Tablet className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewport('mobile')}
                className={viewport === 'mobile' ? 'bg-accent' : ''}
              >
                <Smartphone className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={openInNewTab}>
                <ExternalLink className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={restartPreview}>
                <RotateCcw className="w-4 h-4" />
              </Button>
            </>
          )}
          
          <Button
            onClick={isPreviewRunning ? stopPreview : startPreview}
            disabled={isLoading}
            size="sm"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isPreviewRunning ? (
              <Square className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {isLoading ? 'Starting...' : isPreviewRunning ? 'Stop' : 'Start'}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        <Tabs defaultValue="preview" className="flex-1 flex flex-col">
          <TabsList className="mx-4 mt-4 w-fit">
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="files" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              Files
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="preview" className="flex-1 p-4 pt-2">
            <Card className="h-full">
              <CardContent className="p-0 h-full">
                {isPreviewRunning && previewUrl ? (
                  <div className="h-full flex items-center justify-center bg-gray-50">
                    <div 
                      className="border rounded-lg overflow-hidden bg-white shadow-lg transition-all duration-300"
                      style={getViewportDimensions()}
                    >
                      <iframe
                        src={previewUrl}
                        className="w-full h-full border-0"
                        title="Live Preview"
                        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-center">
                    <div className="space-y-4">
                      <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
                        <Eye className="w-8 h-8 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">No Preview Available</h3>
                        <p className="text-muted-foreground">
                          {files.length === 0 
                            ? 'Generate some code first to see the preview'
                            : 'Click "Start" to run the preview'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="files" className="flex-1 p-4 pt-2">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full">
              {/* File Explorer */}
              <Card className="lg:col-span-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Files</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-64 lg:h-full">
                    {files.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">
                        No files available
                      </div>
                    ) : (
                      <div className="space-y-1 p-2">
                        {files.map((file) => (
                          <Button
                            key={file.path}
                            variant={selectedFile === file.path ? 'secondary' : 'ghost'}
                            className="w-full justify-start text-left h-auto py-2 px-3"
                            onClick={() => setSelectedFile(file.path)}
                          >
                            <div className="flex items-center gap-2">
                              <Code className="w-4 h-4" />
                              <span className="text-sm">{file.path}</span>
                            </div>
                          </Button>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Code Editor */}
              <Card className="lg:col-span-3">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">
                    {selectedFile || 'Select a file'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-64 lg:h-full">
                    {selectedFile ? (
                      <pre className="p-4 text-sm font-mono overflow-x-auto">
                        <code>
                          {files.find(f => f.path === selectedFile)?.content || 'File not found'}
                        </code>
                      </pre>
                    ) : (
                      <div className="p-4 text-center text-muted-foreground">
                        Select a file to view its content
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}