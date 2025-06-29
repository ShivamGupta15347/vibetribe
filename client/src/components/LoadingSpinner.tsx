import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-light">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-primary-purple"></div>
        <p className="mt-4 text-lg text-neutral-gray font-medium">Loading VibeTribe... ✨</p>
      </div>
    </div>
  );
};

export default LoadingSpinner; 