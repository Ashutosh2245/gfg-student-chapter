import React from 'react';

export const RoleBadge = ({ role }) => {
  let styles = 'bg-gray-800 text-gray-300 border-gray-700';

  switch (role) {
    case 'PRESIDENT':
      styles = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      break;
    case 'VICE_PRESIDENT':
      styles = 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      break;
    case 'COORDINATOR':
      styles = 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      break;
    case 'LEAD':
      styles = 'bg-gfg-500/20 text-gfg-accent border-gfg-500/40';
      break;
    case 'CO_LEAD':
      styles = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      break;
    default:
      styles = 'bg-gray-800 text-gray-300 border-gray-700';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles}`}>
      {role ? role.replace('_', ' ') : 'MEMBER'}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  let styles = 'bg-gray-800 text-gray-300 border-gray-700';

  switch (status) {
    case 'PENDING':
      styles = 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      break;
    case 'IN_PROGRESS':
      styles = 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      break;
    case 'SUBMITTED':
    case 'UNDER_REVIEW':
      styles = 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      break;
    case 'APPROVED':
    case 'COMPLETED':
      styles = 'bg-gfg-500/20 text-gfg-accent border-gfg-500/40';
      break;
    case 'REJECTED':
      styles = 'bg-red-500/10 text-red-400 border-red-500/30';
      break;
    case 'REVISION_REQUIRED':
      styles = 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      break;
    default:
      styles = 'bg-gray-800 text-gray-300 border-gray-700';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border ${styles}`}>
      {status ? status.replace('_', ' ') : 'UNKNOWN'}
    </span>
  );
};

export const PriorityBadge = ({ priority }) => {
  let color = 'text-gray-400 bg-gray-800/40 border-gray-700';
  if (priority === 'HIGH') color = 'text-orange-400 bg-orange-500/10 border-orange-500/30';
  if (priority === 'CRITICAL') color = 'text-red-400 bg-red-500/10 border-red-500/30';

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono border ${color}`}>
      {priority}
    </span>
  );
};
