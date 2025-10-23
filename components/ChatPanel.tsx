
import React, { useState, useEffect, useRef } from 'react';
import type { ChatMessage } from '../types';
import { PaperAirplaneIcon } from './icons/PaperAirplaneIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { ClipboardIcon } from './icons/ClipboardIcon';

interface ChatPanelProps {
  chatHistory: ChatMessage[];
  onSendMessage: (message: string) => void;
  onVisualize: () => void;
  isDisabled: boolean;
  error: string | null;
}

const SourceLink: React.FC<{ uri: string; title: string; index: number }> = ({ uri, title, index }) => (
    <a
        href={uri}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs bg-gray-200 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700 rounded-full px-2 py-0.5 transition-colors duration-200 block truncate"
        title={title}
    >
        {index + 1}. {title || new URL(uri).hostname}
    </a>
);

export const ChatPanel: React.FC<ChatPanelProps> = ({
  chatHistory,
  onSendMessage,
  onVisualize,
  isDisabled,
  error,
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && !isDisabled) {
      onSendMessage(inputMessage.trim());
      setInputMessage('');
    }
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg flex flex-col h-[85vh] lg:h-auto">
      <h2 className="text-lg font-bold text-gray-800 border-b pb-3 mb-4">Design Assistant</h2>
      <div className="flex-grow overflow-y-auto pr-2 space-y-4">
        {chatHistory.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
             {msg.sender === 'ai' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white"><SparklesIcon className="w-5 h-5"/></div>}
            <div className={`max-w-md p-3 rounded-lg ${msg.sender === 'user' ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-800'}`}>
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-gray-200">
                        <p className="text-xs font-semibold mb-1.5 text-gray-500">Sources:</p>
                        <div className="flex flex-wrap gap-2">
                           {msg.sources.map((chunk, i) => chunk.web && (
                              <SourceLink key={i} uri={chunk.web.uri} title={chunk.web.title} index={i}/>
                           ))}
                        </div>
                    </div>
                )}
                 {msg.sender === 'ai' && msg.text.startsWith('**Room Analysis:**') && (
                    <button 
                        onClick={() => handleCopyToClipboard(msg.text)} 
                        className="mt-2 text-xs text-gray-500 hover:text-indigo-600 flex items-center gap-1 transition-colors"
                    >
                        <ClipboardIcon className="w-3 h-3"/> Copy Analysis
                    </button>
                 )}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {error && <div className="mt-2 text-sm text-red-500 bg-red-50 p-3 rounded-lg">{error}</div>}

      <div className="mt-4 pt-4 border-t">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={isDisabled && chatHistory.length === 0 ? "Upload an image to start" : "Describe your changes..."}
            className="flex-grow p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            disabled={isDisabled}
          />
          <button
            type="submit"
            className="p-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
            disabled={isDisabled || !inputMessage.trim()}
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </form>
        <button
          onClick={onVisualize}
          className="w-full mt-2 p-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          disabled={isDisabled || chatHistory.length <= 1}
        >
          <SparklesIcon className="w-5 h-5"/>
          Visualize Design
        </button>
      </div>
    </div>
  );
};
