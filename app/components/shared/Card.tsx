'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div style={{ backgroundColor: 'rgb(247, 247, 247)' }} className={`rounded-lg shadow-sm ${className}`}>
      {children}
    </div>
  );
}; 