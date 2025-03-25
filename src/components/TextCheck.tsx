import React, { useState, useCallback } from 'react';
import { AlertCircle, Check } from 'lucide-react';
import { SpellCheckResult } from '../types';
import { checkText } from '../api';

interface TextCheckProps {
  className?: string;
}

export function TextCheck({ className }: TextCheckProps) {
  const [text, setText] = useState('');
  const [results, setResults] = useState<SpellCheckResult[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  },[]);

  const handleKeyUp = useCallback(async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === ' ' || e.key === '.' || e.key === ',' || e.key === '?' || e.key === '!') {
      setIsChecking(true);
      setError(null);
  
      try {
        const data = await checkText(text);
        setResults(data.results);
      } catch (err) {
        setError('Failed to check text. Please try again.');
        setResults([]);
      } finally {
        setIsChecking(false);
      }
    }
  }, [text]);

  const replaceWord = useCallback((oldWord: string, newWord: string) => {
    const updatedText = text.replace(new RegExp(`\\b${oldWord}\\b`, 'g'), newWord);
    setText(updatedText);
    handleTextChange({ target: { value: updatedText } } as React.ChangeEvent<HTMLTextAreaElement>);
  }, [text, handleTextChange]);

  return (
    <div className={className}>
      <div className="relative">
        <textarea
          value={text}
          onChange={handleTextChange}
          onKeyUp={handleKeyUp}
          placeholder="Type or paste your text here..."
          className="w-full min-h-[200px] p-4 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-y"
          disabled={isChecking}
        />
        {isChecking && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
            <div className="animate-pulse text-blue-500">Checking...</div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Analysis Results</h3>
          <div className="p-4 bg-gray-50 rounded-lg">
            {results.map((word, index) => (
              <span
                key={`${word.word}-${index}`}
                className="inline-block mr-1"
              >
                {word.is_correct ? (
                  <span className="text-gray-700">{word.word}</span>
                ) : (
                  <span className="relative group">
                    <span className="text-red-500 border-b-2 border-red-300 cursor-help">
                      {word.word}
                    </span>
                    {word.suggestions.length > 0 && (
                      <div className="absolute bottom-full left-0 mb-2 invisible group-hover:visible z-10">
                        <div className="bg-white rounded-lg shadow-lg p-2 border border-gray-200">
                          <div className="text-sm font-medium text-gray-700 mb-1">Suggestions:</div>
                          <div className="flex flex-col gap-1">
                            {word.suggestions.map((suggestion, i) => (
                              <button
                                key={i}
                                onClick={() => replaceWord(word.word, suggestion)}
                                className="text-left px-2 py-1 hover:bg-blue-50 rounded text-sm flex items-center gap-2 text-gray-600 hover:text-blue-600"
                              >
                                <Check className="w-4 h-4" />
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </span>
                )}
                {' '}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}