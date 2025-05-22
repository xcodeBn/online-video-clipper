
import React, { useRef, useState } from 'react';
import { UploadIcon } from './icons';

interface FileUploaderProps {
  onFileSelected: (file: File | null) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onFileSelected(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation(); 
    // You can add visual cues here if needed
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0] || null;
    if (fileInputRef.current) { // Ensure file input is updated for consistency if needed
        if (e.dataTransfer.files.length > 0) {
           fileInputRef.current.files = e.dataTransfer.files;
        }
    }
    onFileSelected(file);
  };

  return (
    <div 
      className={`w-full max-w-lg p-8 sm:p-10 lg:p-12 border-4 border-dashed rounded-xl text-center cursor-pointer transition-all duration-300 ease-in-out
        ${isDragging ? 'border-blue-500 bg-gray-700' : 'border-gray-600 hover:border-gray-500 bg-gray-800'}`}
      onClick={handleButtonClick}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="video/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <div className="flex flex-col items-center justify-center">
        <UploadIcon className="w-16 h-16 text-gray-500 mb-4" />
        <p className="text-xl font-semibold text-gray-300 mb-2">
          Drag & Drop your video here
        </p>
        <p className="text-gray-400 mb-4">or</p>
        <button
          type="button"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-colors duration-150 ease-in-out"
        >
          Browse Files
        </button>
        <p className="text-xs text-gray-500 mt-6">
          Supports common video formats (MP4, WebM, MOV, etc.)
        </p>
      </div>
    </div>
  );
};
