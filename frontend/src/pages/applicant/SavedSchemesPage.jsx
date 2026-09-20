import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EligibilityCalculator } from '../../components/applicant/EligibilityCalculator';
import { 
  Tag, 
  Trash2, 
  ArrowRight, 
  Calendar, 
  Search, 
  Compass 
} from 'lucide-react';


export const SavedSchemesPage = ({ onStartApply, onExploreSchemes, setActiveTab }) => {
  const { 
    getSavedSchemes, 
    unsaveScheme 
  } = useApp();

  const [selectedSchemeForCriteria, setSelectedSchemeForCriteria] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const savedList = getSavedSchemes();

  const filteredList = savedList.filter(sch => {
    const term = searchTerm.toLowerCase();
    return sch.title.toLowerCase().includes(term) ||
           sch.category.toLowerCase().includes(term) ||
           sch.description.toLowerCase().includes(term);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Official Government Hero Header */}
      <div className="bg-[#17324D] p-6 sm:p-8 rounded-2xl text-white shadow-card border-t-4 border-[#D97706] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1.5 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0E2438] border border-[#D97706]/40 text-[#FFF3E0] text-xs font-semibold">
            <Tag className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Citizen Saved Subsidies & Grants</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-heading">
            Your Saved Schemes
          </h1>
          <p className="text-xs sm:text-sm text-[#DDE3E7] max-w-xl">
            Track and manage welfare grants you have bookmarked. Review eligibility criteria and apply whenever you are ready.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10 flex-shrink-0">
          <button
            onClick={() => onExploreSchemes?.()}
            className="px-4 py-2.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs shadow-md transition flex items-center gap-2 font-heading uppercase tracking-wider"
          >
            <Compass className="w-4 h-4 text-white" />
            <span>Explore All Schemes</span>
          </button>
        </div>
      </div>

      {/* Toolbar & Search Bar */}
      {savedList.length > 0 && (
        <div className="gov-card p-4 rounded-xl border border-[#DDE3E7] bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-xs text-[#526270]">
            Showing <strong className="text-[#17324D]">{filteredList.length}</strong> of <strong className="text-[#17324D]">{savedList.length}</strong> saved {savedList.length === 1 ? 'scheme' : 'schemes'}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#7C8992] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search in saved schemes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-[#DDE3E7] rounded-lg !pl-11 pr-3 py-2 text-xs text-[#17324D] placeholder-[#7C8992] focus:outline-none focus:border-[#17324D] search-input shadow-xs"
              style={{ paddingLeft: '2.75rem' }}
            />
          </div>
        </div>
      )}

      {/* Saved Schemes List or Empty State */}
      {savedList.length === 0 ? (
        <div className="gov-card p-12 sm:p-16 text-center rounded-2xl bg-white border border-[#DDE3E7] shadow-xs max-w-2xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#FFF8EE] border border-[#D97706]/30 text-[#D97706] flex items-center justify-center mx-auto shadow-xs">
            <Tag className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#17324D] font-heading">
              No schemes saved yet.
            </h3>
            <p className="text-xs text-[#526270] mt-1 max-w-sm mx-auto">
              Save schemes to easily find them later. Look for the "🏷️ Save Scheme" tag on any scheme card while browsing government welfare programs.
            </p>
          </div>
          <button
            onClick={() => onExploreSchemes?.()}
            className="px-5 py-2.5 rounded-xl bg-[#17324D] hover:bg-[#0E2438] text-white font-bold text-xs shadow-sm transition inline-flex items-center gap-2 font-heading uppercase tracking-wider"
          >
            <Compass className="w-4 h-4 text-[#D97706]" />
            <span>Browse Available Schemes</span>
          </button>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="gov-card p-10 text-center rounded-xl bg-white border border-[#DDE3E7]">
          <p className="text-xs text-[#526270]">No saved schemes match your search filter "{searchTerm}".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredList.map((sch) => {
            const savedDateStr = sch.savedAt
              ? new Date(sch.savedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
              : 'Recently';

            return (
              <div 
                key={sch.id}
                className="gov-card p-6 bg-white rounded-2xl border border-[#DDE3E7] shadow-card flex flex-col justify-between space-y-4 hover:border-[#17324D]/40 transition"
              >
                <div>
                  {/* Top Metadata & Category */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#EAF5EF] text-[#287C5A] border border-[#287C5A]/30">
                      {sch.category}
                    </span>
                    <span className="text-[11px] font-medium flex items-center gap-1 text-[#7C8992]">
                      <Calendar className="w-3.5 h-3.5 text-[#7C8992]" />
                      Saved: {savedDateStr}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#17324D] mb-1.5 font-heading">
                    {sch.title}
                  </h3>
                  <p className="text-xs text-[#526270] leading-relaxed mb-4">
                    {sch.shortDesc || sch.description}
                  </p>

                  {/* Factual Highlights Box */}
                  <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#DDE3E7] text-xs mb-3">
                    <div>
                      <span className="text-[#526270] text-[10px] uppercase font-semibold block">Maximum Benefit</span>
                      <span className="text-[#287C5A] font-extrabold text-sm font-heading">
                        Up to ₹{Number(sch.maxAmount || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#526270] text-[10px] uppercase font-semibold block">Application Deadline</span>
                      <span className="text-[#17324D] font-bold font-mono text-xs">
                        {sch.deadline || 'Ongoing'}
                      </span>
                    </div>
                  </div>

                  {/* Eligibility Summary Pill */}
                  <div className="text-[11px] text-[#526270] bg-[#F3F6F8] p-2.5 rounded-lg border border-[#DDE3E7] space-y-1">
                    <div className="font-semibold text-[#17324D]">Eligibility Summary:</div>
                    <div className="flex flex-wrap gap-2 text-[10px]">
                      <span>• Age: {sch.minAge || 18}–{sch.maxAge || 65} Yrs</span>
                      <span>• Max Income: &lt; ₹{Number(sch.maxIncome || 500000).toLocaleString('en-IN')}</span>
                      <span>• States: {Array.isArray(sch.allowedStates) ? sch.allowedStates.join(', ') : 'All India'}</span>
                    </div>
                  </div>
                </div>

                {/* Scheme Card Actions:
                    🏷️ Saved
                    [View Details]    [Apply Now]
                */}
                <div className="pt-3 border-t border-[#DDE3E7] flex flex-col gap-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#FEF3C7] border border-[#F59E0B] text-[#92400E]">
                      <Tag className="w-3.5 h-3.5 fill-[#D97706] text-[#D97706]" />
                      <span>Saved</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => unsaveScheme(sch.id)}
                      className="text-xs font-semibold text-[#B84040] hover:text-[#991B1B] hover:bg-[#FDF2F2] px-2.5 py-1.5 rounded-lg transition flex items-center gap-1 border border-transparent hover:border-[#B84040]/20"
                      title="Remove scheme from saved list"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedSchemeForCriteria(sch)}
                      className="py-2.5 px-3 rounded-xl bg-[#F8FAFC] hover:bg-[#DDE3E7]/40 text-[#17324D] font-bold text-xs border border-[#DDE3E7] text-center transition"
                    >
                      View Details
                    </button>

                    <button
                      type="button"
                      onClick={() => onStartApply?.(sch)}
                      className="py-2.5 px-3 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition uppercase tracking-wider font-heading text-center"
                    >
                      <span>Apply Now</span>
                      <ArrowRight className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Criteria Details Modal */}
      {selectedSchemeForCriteria && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-slide-up text-slate-800 my-8">
            <div className="flex items-start justify-between border-b border-slate-200 pb-4 mb-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  {selectedSchemeForCriteria.category}
                </span>
                <h3 className="text-xl font-bold text-[#0f172a] mt-2 font-heading">
                  {selectedSchemeForCriteria.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedSchemeForCriteria.department}
                </p>
              </div>
              <button
                onClick={() => setSelectedSchemeForCriteria(null)}
                className="text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <EligibilityCalculator
              scheme={selectedSchemeForCriteria}
              onProceedToApply={(s) => {
                setSelectedSchemeForCriteria(null);
                onStartApply?.(s);
              }}
            />

            <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedSchemeForCriteria(null)}
                className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
