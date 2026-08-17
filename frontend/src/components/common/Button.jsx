import React from 'react';

export const Button = ({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'
  size = 'md',        // 'sm' | 'md' | 'lg'
  className = '',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-gfg-500 hover:bg-gfg-hover text-white shadow-lg shadow-gfg-500/20 hover:scale-[1.02]',
    secondary: 'bg-dark-bg border border-dark-border text-gray-200 hover:text-white hover:border-gfg-500/50',
    outline: 'bg-transparent border border-gfg-500 text-gfg-accent hover:bg-gfg-500/10',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20',
    ghost: 'bg-transparent text-gray-400 hover:text-white hover:bg-dark-card'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-xs',
    lg: 'px-8 py-3.5 text-sm'
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="flex items-center space-x-2">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Processing...</span>
        </span>
      ) : children}
    </button>
  );
};
