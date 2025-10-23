
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

export const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SparklesIcon className="w-8 h-8 text-indigo-500" />
          <div>
            <h1 className="text-xl font-bold text-gray-800">Gemini Interior Designer</h1>
            <p className="text-sm text-gray-500">Visualize your dream room with AI</p>
          </div>
        </div>
      </div>
    </header>
  );
};
