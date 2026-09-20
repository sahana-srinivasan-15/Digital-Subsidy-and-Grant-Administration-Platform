import React from 'react';
import { useApp } from '../../context/AppContext';
import { Scale, X, ArrowRight } from 'lucide-react';

export const FloatingCompareBar = ({ onOpenCompare }) => {
  const { schemes, comparedSchemeIds, removeCompareScheme, clearComparedSchemes } = useApp();

  if (!comparedSchemeIds || comparedSchemeIds.length === 0) return null;

  const selectedSchemes = comparedSchemeIds
    .map(id => schemes.find(s => s.id === id))
    .filter(Boolean);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-4xl animate-slide-up">
      <div className="bg-[#0E2438] border-2 border-[#D97706] text-white rounded-2xl shadow-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Left: Icon & Count info */}
        <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-[#17324D] border border-[#D97706]/40 flex items-center justify-center text-[#D97706] flex-shrink-0 shadow-xs">
            <Scale className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white font-heading uppercase tracking-wider">
                Scheme Comparison
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#D97706] text-white text-[10px] font-extrabold font-mono">
                {comparedSchemeIds.length}/4 Selected
              </span>
            </div>
            <p className="text-[11px] text-[#DDE3E7] truncate">
              {comparedSchemeIds.length === 1 
                ? 'Select at least 1 more scheme to compare side-by-side'
                : 'Ready for side-by-side criteria and benefit comparison'}
            </p>
          </div>
        </div>

        {/* Center: Selected Schemes Chips */}
        <div className="hidden md:flex items-center gap-1.5 flex-1 max-w-sm overflow-x-auto px-2">
          {selectedSchemes.map(sch => (
            <div
              key={sch.id}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#17324D] border border-[#DDE3E7]/20 text-[11px] text-white font-medium whitespace-nowrap"
            >
              <span className="truncate max-w-[120px]">{sch.title}</span>
              <button
                type="button"
                onClick={() => removeCompareScheme(sch.id)}
                className="text-[#DDE3E7] hover:text-white hover:bg-white/10 rounded p-0.5"
                title="Remove scheme from comparison"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={clearComparedSchemes}
            className="px-3 py-2 rounded-lg text-xs font-semibold text-[#DDE3E7] hover:text-white hover:bg-white/10 transition"
          >
            Clear
          </button>

          <button
            type="button"
            onClick={() => onOpenCompare?.()}
            className="flex-1 sm:flex-initial px-4 py-2 rounded-lg bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 uppercase tracking-wider font-heading"
          >
            <span>Compare ({comparedSchemeIds.length})</span>
            <ArrowRight className="w-3.5 h-3.5 text-white" />
          </button>
        </div>

      </div>
    </div>
  );
};
