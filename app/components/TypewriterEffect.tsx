'use client';

import React, { useState, useEffect } from 'react';

interface TypewriterEffectProps {
  text: string;
  className?: string;
  delay?: number;
}

export const TypewriterEffect: React.FC<TypewriterEffectProps> = ({
  text,
  className = '',
  delay = 100,
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prevText => prevText + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, delay);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, text]);

  return (
    <span className={className}>
      {displayText}
      {currentIndex < text.length && <span className="animate-pulse">|</span>}
    </span>
  );
}; 