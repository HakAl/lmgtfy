import { useState, useRef, useEffect } from 'react';
import { sanitizeSearchInput } from '../utils/sanitize';
import { useChat } from '../hooks/useChat';

function Terminal() {
  const [isActive, setIsActive] = useState(false);
  const [promptWidth, setPromptWidth] = useState(0);
  const [textWidth, setTextWidth] = useState(0);
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState([]);

  const inputRef = useRef(null);
  const promptRef = useRef(null);
  const measureRef = useRef(null);
  const containerRef = useRef(null);

  const {
    mutate,
    streamedResponse,
    isStreaming,
    isError,
    error,
    abort
  } = useChat();

  const handleSubmit = (e) => {
    e.preventDefault();
    const raw = query.trim();
    if (!raw) return;
    const clean = sanitizeSearchInput(raw);
    if (!clean) return;
    
    setHistory(prev => [...prev, { 
      id: Date.now(), 
      query: clean, 
      response: '', 
      isError: false,
      isComplete: false,
      isCancelled: false
    }]);
    
    setQuery('');
    mutate({ query: clean, apiKey: import.meta.env.VITE_LLAMA_KEY });
  };

  // Handle Ctrl+C key combination
  const handleKeyDown = (e) => {
    // Check for Ctrl+C or Cmd+C (for Mac)
    if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
      e.preventDefault();
      
      if (isStreaming) {
        abort();
        
        setHistory(prev => {
          if (prev.length === 0) return prev;
          const lastItem = prev[prev.length - 1];
          return [
            ...prev.slice(0, -1),
            {
              ...lastItem,
              isCancelled: true,
              isComplete: true
            }
          ];
        });
      } else {
        setHistory(prev => [...prev, { 
          id: Date.now(), 
          query: '', 
          response: '', 
          isError: false,
          isComplete: true,
          isCancelled: true
        }]);
        setQuery('');
      }
      
      // Refocus the input
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);
    }
  };

  // Update history when streaming response changes
  useEffect(() => {
    if (history.length > 0) {
      const lastItem = history[history.length - 1];
      if (!lastItem.isComplete && !lastItem.isCancelled) {
        setHistory(prev => {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1] = {
            ...lastItem,
            response: streamedResponse,
            isError: isError,
            isComplete: !isStreaming
          };
          return newHistory;
        });
      }
    }
  }, [streamedResponse, isStreaming, isError]);

  // Scroll to bottom when history updates
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  // Update widths when query changes (including when cleared)
  useEffect(() => {
    updateWidths();
  }, [query]);

  const handleFocus = () => setIsActive(true);
  const handleBlur = () => setIsActive(false);

  const updateWidths = () => {
    if (promptRef.current) {
      setPromptWidth(promptRef.current.offsetWidth);
    }
    if (inputRef.current && measureRef.current) {
      measureRef.current.textContent = inputRef.current.value;
      setTextWidth(measureRef.current.offsetWidth);
    }
  };

  const handleOnChange = (e) => {
    setQuery(e.target.value);
  };

  useEffect(() => {
    const focusTimer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        setIsActive(true);
        updateWidths();
      }
    }, 100);
    return () => clearTimeout(focusTimer);
  }, []);

  return (
    <div className="terminal-container" ref={containerRef}>
      <div className="terminal-prompt">Welcome to the LMGTFY 0.1 terminal.</div>
      <div className="terminal-prompt">Type your query below:</div>
      
      {/* Command history */}
      <div className="terminal-history">
        {history.map((item) => (
          <div key={item.id} className="terminal-history-item">
            {item.query && (
              <div className="terminal-prompt">$ {item.query}</div>
            )}
            {item.isCancelled ? (
              <div className="terminal-cancellation">^C</div>
            ) : item.isError ? (
              <div className="terminal-error">Error: {error?.message || 'Unknown error'}</div>
            ) : (
              <div className="terminal-response">
                {item.response}
                {!item.isComplete && !item.isCancelled && isStreaming && <span className="terminal-cursor"></span>}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Current input */}
      <form onSubmit={handleSubmit}>
        <div
          className={`terminal-input-wrapper ${isActive ? 'active' : ''}`}
          style={{
            '--prompt-width': `${promptWidth}px`,
            '--text-width': `${textWidth}px`
          }}
        >
          <span ref={promptRef} className="terminal-prompt-sign">$ </span>
          <input
            type="text"
            className="terminal-input"
            ref={inputRef}
            value={query}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleOnChange}
            onKeyDown={handleKeyDown} 
          />
          <span
            ref={measureRef}
            style={{
              position: 'absolute',
              visibility: 'hidden',
              whiteSpace: 'pre',
              fontFamily: 'Courier New, Courier, monospace',
              fontSize: '1em',
            }}
          />
        </div>
      </form>
    </div>
  );
}

export default Terminal;