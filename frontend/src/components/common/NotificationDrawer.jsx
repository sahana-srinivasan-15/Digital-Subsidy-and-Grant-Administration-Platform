import React from 'react';
import { useApp, isNotificationForUser, isNotificationReadForUser } from '../../context/AppContext';
import { Bell, X, CheckCheck, Info, AlertTriangle, CheckCircle2, Check } from 'lucide-react';

export const NotificationDrawer = ({ isOpen, onClose }) => {
  const { notifications, currentRole, currentUser, markNotificationsRead, markNotificationRead } = useApp();

  if (!isOpen) return null;

  // Strict account isolation: filter notifications belonging strictly to the currently authenticated account
  const filteredNotifs = notifications.filter(n => isNotificationForUser(n, currentUser));
  const unreadCount = filteredNotifs.filter(n => !isNotificationReadForUser(n, currentUser)).length;

  const icons = {
    SUCCESS: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
    WARNING: <AlertTriangle className="w-4 h-4 text-amber-400" />,
    DANGER: <X className="w-4 h-4 text-rose-400" />,
    INFO: <Info className="w-4 h-4 text-cyan-400" />
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-slide-left">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-800/40 text-cyan-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    {unreadCount} unread
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 truncate max-w-[230px]" title={currentUser?.email || currentRole}>
                {currentUser?.name ? `${currentUser.name} (${currentUser.email || currentRole})` : `Alerts for ${currentRole}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markNotificationsRead}
                className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 text-xs flex items-center gap-1 transition-colors"
                title="Mark all as read for this account"
              >
                <CheckCheck className="w-4 h-4" />
                <span className="hidden sm:inline">Read all</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close notification panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredNotifs.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <Bell className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-medium text-slate-400">No notifications for this account</p>
              <p className="text-xs text-slate-600 mt-1">Notifications specific to your login identity will appear here.</p>
            </div>
          ) : (
            filteredNotifs.map(n => {
              const isRead = isNotificationReadForUser(n, currentUser);
              return (
                <div
                  key={n.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isRead ? 'bg-slate-800/40 border-slate-800 text-slate-400' : 'bg-slate-800/80 border-cyan-900/50 text-slate-200 shadow-md'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{icons[n.type] || icons.INFO}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-xs font-semibold text-white">{n.title}</h4>
                          {n.isGlobal && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 uppercase">
                              Global
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 whitespace-nowrap">{n.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
                      {!isRead && markNotificationRead && (
                        <div className="mt-2 flex justify-end">
                          <button
                            onClick={() => markNotificationRead(n.id)}
                            className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 hover:underline"
                          >
                            <Check className="w-3 h-3" /> Mark read
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

