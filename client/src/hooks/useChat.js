import { useState, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { streamChat } from '../api/llama';

export function useChat() {
  const [streamedResponse, setStreamedResponse] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef(null);

  const mutation = useMutation({
    mutationFn: async ({ query, apiKey }) => {
      // Reset previous response
      setStreamedResponse('');
      setIsStreaming(true);
      
      // Create a new AbortController for this request
      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;

      return new Promise((resolve, reject) => {
        streamChat(
          { query, apiKey, signal },
          // onChunk callback - called for each piece of content
          (chunk) => {
            setStreamedResponse(prev => prev + chunk);
          },
          // onComplete callback - called when streaming is finished
          () => {
            setIsStreaming(false);
            resolve();
          },
          // onError callback - called if there's an error
          (error) => {
            setIsStreaming(false);
            reject(error);
          }
        );
      });
    },
    onSettled: () => {
      // Clean up the abort controller
      abortControllerRef.current = null;
    }
  });

  // Function to abort the current request
  const abort = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
    }
  };

  // Reset the state
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