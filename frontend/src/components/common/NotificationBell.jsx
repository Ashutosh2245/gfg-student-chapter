import React, { useEffect, useState } from 'react';
import { Bell, Check } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const NotificationBell = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/notifications');
        if (res.data.success) {
          setNotifications(res.data.notifications);
          setUnreadCount(res.data.unreadCount);
        }
      } catch (err) {
        // silent fallback
      }
    };
    fetchNotifications();
  }, [user]);

  const markAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setUnreadCount(0);
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error('Error marking notifications read:', err);
    }
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-dark-card transition-colors relative"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-gfg-accent ring-4 ring-dark-bg animate-pulse"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-dark-card border border-dark-border rounded-2xl shadow-2xl p-4 z-50 space-y-3">
          <div className="flex items-center justify-between border-b border-dark-border pb-2">
            <h4 className="text-xs font-bold text-white font-mono uppercase">Notifications</h4>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-[10px] font-mono text-gfg-accent hover:underline flex items-center gap-1">
                <Check className="w-3 h-3" /> Mark all read
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-4">No notifications.</p>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className={`p-2.5 rounded-xl border text-xs space-y-1 ${n.is_read ? 'bg-dark-bg border-dark-border opacity-75' : 'bg-gfg-500/10 border-gfg-500/30'}`}>
                  <h5 className="font-bold text-white text-[11px]">{n.title}</h5>
                  <p className="text-[10px] text-gray-300">{n.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
