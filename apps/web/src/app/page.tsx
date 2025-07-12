import ChatInterface from '@/components/chat-interface';
import LivePreview from '@/components/live-preview';
import ErrorBoundary from '@/components/error-boundary';

export default function Home() {
  return (
    <ErrorBoundary>
      <div className="h-full flex">
        {/* Chat Interface */}
        <div className="w-1/2 border-r">
          <ChatInterface />
        </div>
        
        {/* Live Preview */}
        <div className="w-1/2">
          <LivePreview />
        </div>
      </div>
    </ErrorBoundary>
  );
}
