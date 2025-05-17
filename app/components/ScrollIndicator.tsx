import React from 'react';

export const ScrollIndicator = () => {
  return (
    <div className="absolute bottom-32 md:bottom-32 bottom-48 left-1/2 transform -translate-x-1/2 animate-bounce">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-6 w-6 text-gray-400"
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M19 14l-7 7m0 0l-7-7m7 7V3"
        />
      </svg>
    </div>
  );
}; 