import { useState, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { streamChat } from '../api/llama';

export function useChat() {
  const [streamedResponse, setStreamedResponse] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef(null);

  const mutation = useMutation({
    mutationFn: async ({ query, apiKey }) => {
      setStreamedResponse('');
      setIsStreaming(true);
      
      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;

      return new Promise((resolve, reject) => {
        streamChat(
          { query, apiKey, signal },
          (chunk) => {
            setStreamedResponse(prev => prev + chunk);
          },
          () => {
            setIsStreaming(false);
            resolve();
          },
          (error) => {
            setIsStreaming(false);
            reject(error);
          }
        );
      });
    },
    onSettled: () => {
      abortControllerRef.current = null;
    }
  });

  const abort = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
    }
  };

  const reset = () => {
    setStreamedResponse('');
    mutation.reset();
  };

  return {
    ...mutation,
    streamedResponse,
    isStreaming,
    abort,
    reset
  };
}