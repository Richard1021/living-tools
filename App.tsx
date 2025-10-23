
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImagePanel } from './components/ImagePanel';
import { ChatPanel } from './components/ChatPanel';
import type { ChatMessage, GroundingChunk } from './types';
import { analyzeImage, generateDesignIdea, generateImage, generateImagenPrompt } from './services/geminiService';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageUpload = useCallback(async (file: File) => {
    setOriginalImage(file);
    setOriginalImageUrl(URL.createObjectURL(file));
    setGeneratedImageUrl(null);
    setError(null);
    
    const initialMessage: ChatMessage = {
        sender: 'ai',
        text: "Hello! I've analyzed your room. How would you like to redesign it? For example, you could say 'make it more modern', 'add a plant in the corner', or 'change the sofa to a blue one'.",
        sources: []
    };
    setChatHistory([initialMessage]);

    setIsLoading(true);
    setLoadingMessage('Analyzing your room...');

    try {
      const base64Image = await fileToBase64(file);
      const analysis = await analyzeImage(base64Image);
      const analysisMessage: ChatMessage = {
        sender: 'ai',
        text: `**Room Analysis:**\n${analysis}`,
        sources: []
      };
      setChatHistory(prev => [analysisMessage, ...prev]);
    } catch (e) {
      console.error(e);
      setError('Failed to analyze the image. Please try again.');
      setChatHistory([]);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, []);

  const handleSendMessage = useCallback(async (message: string) => {
    if (!originalImage) return;

    const userMessage: ChatMessage = { sender: 'user', text: message, sources: [] };
    setChatHistory(prev => [...prev, userMessage]);
    setIsLoading(true);
    setLoadingMessage('Thinking of design ideas...');
    setError(null);

    try {
      const base64Image = await fileToBase64(originalImage);
      const fullHistory = [...chatHistory, userMessage];
      const { text, groundingChunks } = await generateDesignIdea(fullHistory, base64Image);
      
      const aiMessage: ChatMessage = { sender: 'ai', text, sources: groundingChunks };
      setChatHistory(prev => [...prev, aiMessage]);
    } catch (e) {
      console.error(e);
      const errorMessage: ChatMessage = { sender: 'ai', text: 'Sorry, I encountered an error. Could you try rephrasing your request?', sources: [] };
      setChatHistory(prev => [...prev, errorMessage]);
      setError('Failed to get a response from the design assistant.');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [originalImage, chatHistory]);

  const handleVisualize = useCallback(async () => {
    if (!originalImage) return;

    setIsLoading(true);
    setLoadingMessage('Generating your new room... This might take a minute.');
    setError(null);

    try {
      const base64Image = await fileToBase64(originalImage);
      const imagenPrompt = await generateImagenPrompt(chatHistory, base64Image);
      
      setLoadingMessage('Prompt generated. Creating image with Imagen...');
      
      const generatedImageBase64 = await generateImage(imagenPrompt);
      setGeneratedImageUrl(`data:image/jpeg;base64,${generatedImageBase64}`);

    } catch (e) {
      console.error(e);
      setError('Failed to generate the image. Please try again or adjust your design request.');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [originalImage, chatHistory]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <ImagePanel
          originalImageUrl={originalImageUrl}
          generatedImageUrl={generatedImageUrl}
          onImageUpload={handleImageUpload}
          isLoading={isLoading}
          loadingMessage={loadingMessage}
        />
        <ChatPanel
          chatHistory={chatHistory}
          onSendMessage={handleSendMessage}
          onVisualize={handleVisualize}
          isDisabled={!originalImage || isLoading}
          error={error}
        />
      </main>
    </div>
  );
};

export default App;
