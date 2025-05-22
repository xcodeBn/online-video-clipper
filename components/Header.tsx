
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <h1 className="text-3xl font-bold text-center text-blue-400 tracking-tight">
          Online Video Clipper
        </h1>
      </div>
    </header>
  );
};
