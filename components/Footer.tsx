
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 py-4 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400 text-sm">
        <p>&copy; {new Date().getFullYear()} Video Clipper. Developed for xcodebn.</p>
      </div>
    </footer>
  );
};
