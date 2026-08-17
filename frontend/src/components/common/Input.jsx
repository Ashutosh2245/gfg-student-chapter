import React from 'react';

export const Input = ({ label, error, icon: Icon, className = '', ...props }) => {
  return (
    <div className="space-y-1">
      {label && <label className="block text-xs font-mono text-gray-400">{label}</label>}
      <div className="relative">
        {Icon && <Icon className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />}
        <input
          className={`w-full bg-dark-bg border border-dark-border rounded-xl ${Icon ? 'pl-10' : 'px-3.5'} pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gfg-accent transition-colors ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-[11px] text-red-400 font-mono">{error}</p>}
    </div>
  );
};

export const Select = ({ label, options = [], className = '', ...props }) => {
  return (
    <div className="space-y-1">
      {label && <label className="block text-xs font-mono text-gray-400">{label}</label>}
      <select
        className={`w-full bg-dark-bg border border-dark-border rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-gfg-accent transition-colors ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
