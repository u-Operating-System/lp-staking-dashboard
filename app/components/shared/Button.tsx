'use client';

import React, { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  isLoading,
  disabled,
  className = '',
  ...props
}, ref) => {
  const baseStyles = 'rounded-lg font-medium transition-colors duration-200';
  const sizeStyles = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };
  const variantStyles = {
    primary: 'bg-primary text-black hover:bg-primary/90 disabled:bg-primary/50',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 disabled:bg-gray-100/50',
  };

  const buttonClassName = twMerge(baseStyles, sizeStyles[size], variantStyles[variant], className);

  return (
    <button
      ref={ref}
      className={buttonClassName}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
        </div>
      ) : (
        children
      )}
    </button>
  );
}); 