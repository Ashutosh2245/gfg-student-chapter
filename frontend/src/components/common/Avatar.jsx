import React from 'react';
import { formatAvatarUrl } from '../../utils/formatAvatar';

export const Avatar = ({ src, alt = 'Avatar', size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const finalSrc = formatAvatarUrl(src);

  return (
    <img
      src={finalSrc}
      alt={alt}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400';
      }}
      className={`${sizes[size] || sizes.md} rounded-full object-cover border border-dark-border ${className}`}
    />
  );
};

export const LoadingSpinner = ({ label = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3">
      <div className="w-10 h-10 border-4 border-gfg-500 border-t-transparent rounded-full animate-spin"></div>
      <span className="text-xs font-mono text-gray-400">{label}</span>
    </div>
  );
};

export const EmptyState = ({ title = 'No Data Available', message = 'Nothing to show right now.', action }) => {
  return (
    <div className="bg-dark-card border border-dark-border rounded-3xl p-12 text-center space-y-4">
      <h4 className="text-base font-bold text-white">{title}</h4>
      <p className="text-xs text-gray-400 max-w-sm mx-auto">{message}</p>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
};

export const ErrorState = ({ title = 'Something went wrong', message = 'Failed to load content.', onRetry }) => {
  return (
    <div className="bg-red-500/10 border border-red-500/30 rounded-3xl p-8 text-center space-y-3 text-red-400">
      <h4 className="text-base font-bold">{title}</h4>
      <p className="text-xs text-gray-300 max-w-sm mx-auto">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="bg-red-600 hover:bg-red-700 text-white text-xs px-4 py-2 rounded-xl font-bold transition-colors">
          Retry
        </button>
      )}
    </div>
  );
};
