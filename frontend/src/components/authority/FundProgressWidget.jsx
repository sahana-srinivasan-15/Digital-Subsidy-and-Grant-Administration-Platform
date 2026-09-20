import React from 'react';
import { Landmark } from 'lucide-react';

export const FundProgressWidget = ({ schemes = [] }) => {
  return (
    <div className="ds-card p-6 bg-white border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0f172a]">Scheme Budget Allocation & Utilization</h3>
            <p className="text-xs text-slate-500">Live monitoring of public fund disbursements</p>
          </div>
        </div>

        <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200">
          Treasury Gateway Active
        </span>
      </div>

      <div className="space-y-4">
        {schemes.map(sch => {
          const total = sch.totalFund || 10000000;
          const dist = sch.distributedFund || 0;
          const pct = Math.min(Math.round((dist / total) * 100), 100);
          const avail = total - dist;

          return (
            <div key={sch.id} className="p-4 rounded-md bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#0f172a]">{sch.title}</span>
                <span className="font-mono text-blue-700 font-bold">{pct}% Utilized</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 rounded bg-slate-200 overflow-hidden p-0.5 border border-slate-300">
                <div
                  className="h-full rounded bg-[#1d4ed8] transition-all duration-500"
                  style={{ width: `${pct}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1">
                <span>Allocated: <strong className="text-slate-900">₹{(total / 100000).toFixed(1)}L</strong></span>
                <span>Distributed: <strong className="text-emerald-700">₹{(dist / 100000).toFixed(1)}L</strong></span>
                <span>Available: <strong className="text-blue-700">₹{(avail / 100000).toFixed(1)}L</strong></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
