import { useCallback } from 'react';
import { toast } from 'sonner';

export interface ErrorHandlerOptions {
  showToast?: boolean;
  logError?: boolean;
  onError?: (error: Error) => void;
}

export function useErrorHandler(options: ErrorHandlerOptions = {}) {
  const { showToast = true, logError = true, onError } = options;

  const handleError = useCallback((error: Error | string, context?: string) => {
    const errorObj = typeof error === 'string' ? new Error(error) : error;
    
    if (logError) {
      console.error(`Error${context ? ` in ${context}` : ''}:`, errorObj);
    }

    if (showToast) {
      toast.error(`${context ? `${context}: ` : ''}${errorObj.message}`);
    }

    if (onError) {
      onError(errorObj);
    }
  }, [showToast, logError, onError]);

  const handleAsyncError = useCallback(async <T>(
    asyncFn: () => Promise<T>, 
    context?: string
  ): Promise<T | null> => {
    try {
      return await asyncFn();
    } catch (error) {
      handleError(error as Error, context);
      return null;
    }
  }, [handleError]);

  return {
    handleError,
    handleAsyncError,
  };
}