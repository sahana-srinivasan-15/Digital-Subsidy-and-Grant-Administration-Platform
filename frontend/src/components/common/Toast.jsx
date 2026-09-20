import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, Info, XCircle } from 'lucide-react';

export const Toast = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400" />,
    danger: <XCircle className="w-5 h-5 text-rose-400" />,
    info: <Info className="w-5 h-5 text-cyan-400" />
  };

  const borderColors = {
    success: 'border-emerald-500/40 bg-emerald-950/90 text-emerald-100',
    warning: 'border-amber-500/40 bg-amber-950/90 text-amber-100',
    danger: 'border-rose-500/40 bg-rose-950/90 text-rose-100',
    info: 'border-cyan-500/40 bg-cyan-950/90 text-cyan-100'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border glass-panel shadow-2xl backdrop-blur-lg ${borderColors[toast.type] || borderColors.info}`}>
        {icons[toast.type] || icons.info}
        <span className="text-sm font-medium">{toast.message}</span>
      </div>
    </div>
  );
};
