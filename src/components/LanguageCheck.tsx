import React, { useState, useCallback } from 'react';
import { Languages, AlertCircle, Check, Globe2 } from 'lucide-react';
import axios from 'axios';
import DetectLanguage from 'detectlanguage';

const API_KEY = process.env.API_KEY; // Replace with actual API key
const detecteLanguage = new DetectLanguage(API_KEY);

const languageNames: { [key: string]: string } = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  pt: 'Portuguese',
  nl: 'Dutch',
  ru: 'Russian',
  zh: 'Chinese',
  ja: 'Japanese',
  ko: 'Korean',
};

export function LanguageCheck() {
  const [text, setText] = useState('');
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Array<{ word: string; suggestions: string[] }>>([]);

  const detectLanguage = useCallback(async (inputText: string) => {
    if (!inputText.trim() || inputText.length < 3) {
      setDetectedLanguage(null);
      return;
    }

    setIsDetecting(true);
    setError(null);

    try {
      const response = await detecteLanguage.detect(inputText);
      if (response.length > 0) {
        setDetectedLanguage(response[0].language);
      }

      // Get spell check suggestions from FastAPI
      const spellCheckResponse = await axios.post('http://localhost:8000/check-text', { text: inputText });
      setSuggestions(spellCheckResponse.data.results);
    } catch (err) {
      console.error(err);
      setError('Failed to detect language. Please try again.');
      setDetectedLanguage(null);
    } finally {
      setIsDetecting(false);
    }
  }, []);

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    detectLanguage(newText);
  }, [detectLanguage]);

  const replaceWord = useCallback((oldWord: string, newWord: string) => {
    const updatedText = text.replace(new RegExp(`\\b${oldWord}\\b`, 'g'), newWord);
    setText(updatedText);
    detectLanguage(updatedText);
  }, [text, detectLanguage]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="text-input" className="block text-sm font-medium text-gray-700">
          Enter Text
        </label>
        <textarea
          id="text-input"
          value={text}
          onChange={handleTextChange}
          placeholder="Type or paste your text here..."
          className="w-full min-h-[150px] p-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-y"
          disabled={isDetecting}
        />
      </div>

      {isDetecting && (
        <div className="flex items-center justify-center gap-2 text-blue-500">
          <div className="animate-spin">
            <Languages className="w-5 h-5" />
          </div>
          <span>Detecting language...</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {detectedLanguage && (
        <div className="p-4 bg-blue-50 rounded-lg space-y-2">
          <div className="flex items-center gap-2 text-blue-700">
            <Globe2 className="w-5 h-5" />
            <h3 className="font-medium">Detected Language</h3>
          </div>
          <p className="text-blue-900 font-semibold">
            {languageNames[detectedLanguage] || detectedLanguage}
          </p>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900">Spelling Suggestions</h3>
          <div className="space-y-2">
            {suggestions.map((word, index) => (
              <div key={`${word.word}-${index}`} className="p-3 rounded-lg bg-yellow-50">
                <div className="flex items-center justify-between">
                  <span className="text-yellow-700">{word.word}</span>
                  {word.suggestions.length > 0 && (
                    <div className="flex gap-2">
                      {word.suggestions.map((suggestion, i) => (
                        <button
                          key={i}
                          onClick={() => replaceWord(word.word, suggestion)}
                          className="inline-flex items-center gap-1 px-2 py-1 text-sm bg-white rounded border border-yellow-200 hover:bg-yellow-50 transition-colors"
                        >
                          <Check className="w-3 h-3" />
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
