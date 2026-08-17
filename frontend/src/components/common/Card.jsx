import React from 'react';

export const Card = ({ children, className = '', hover = true, padding = 'p-6' }) => {
  return (
    <div className={`bg-dark-card border border-dark-border rounded-3xl ${padding} ${hover ? 'hover:border-gfg-500/40 transition-all duration-200' : ''} ${className}`}>
      {children}
    </div>
  );
};
