
import React, { useRef } from 'react';
import { PhotoIcon } from './icons/PhotoIcon';

interface ImagePanelProps {
  originalImageUrl: string | null;
  generatedImageUrl: string | null;
  onImageUpload: (file: File) => void;
  isLoading: boolean;
  loadingMessage: string;
}

const ImageDisplay: React.FC<{ src: string | null; alt: string; label: string }> = ({ src, alt, label }) => (
  <div className="relative w-full h-full bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center">
    {src ? (
      <>
        <img src={src} alt={alt} className="object-contain w-full h-full" />
        <div className="absolute top-2 left-2 bg-black/50 text-white text-xs font-semibold px-2 py-1 rounded-full">
          {label}
        </div>
      </>
    ) : (
      <div className="text-center text-gray-500">
        <PhotoIcon className="w-16 h-16 mx-auto text-gray-300" />
        <p className="mt-2 text-sm">{label} will appear here</p>
      </div>
    )}
  </div>
);

const UploadPlaceholder: React.FC<{ onImageUpload: (file: File) => void }> = ({ onImageUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
        onImageUpload(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
  };

  return (
    <div 
        className="w-full h-full flex items-center justify-center bg-white rounded-xl shadow-md border-2 border-dashed border-gray-300 hover:border-indigo-400 transition-colors duration-300 p-6"
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
      <div className="text-center cursor-pointer">
        <PhotoIcon className="mx-auto h-16 w-16 text-gray-400" />
        <h3 className="mt-2 text-lg font-semibold text-gray-700">Upload a photo of your room</h3>
        <p className="mt-1 text-sm text-gray-500">Click to browse or drag and drop an image</p>
      </div>
    </div>
  );
};

export const ImagePanel: React.FC<ImagePanelProps> = ({
  originalImageUrl,
  generatedImageUrl,
  onImageUpload,
  isLoading,
  loadingMessage,
}) => {
  return (
    <div className="relative bg-white p-4 sm:p-6 rounded-xl shadow-lg h-[85vh] lg:h-auto flex flex-col">
      {originalImageUrl ? (
        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
          <ImageDisplay src={originalImageUrl} alt="Original room" label="Before" />
          <ImageDisplay src={generatedImageUrl} alt="Generated design" label="After" />
        </div>
      ) : (
        <UploadPlaceholder onImageUpload={onImageUpload} />
      )}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl z-10">
          <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-lg font-semibold text-gray-700">{loadingMessage}</p>
        </div>
      )}
    </div>
  );
};
