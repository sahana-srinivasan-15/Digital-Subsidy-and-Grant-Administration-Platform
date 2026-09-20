import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Scale, 
  Trash2, 
  ArrowRight, 
  Plus, 
  Clock, 
  Info
} from 'lucide-react';

export const SchemeComparisonPage = ({ onStartApply, onBackToDashboard }) => {
  const { 
    schemes, 
    comparedSchemeIds, 
    toggleCompareScheme, 
    removeCompareScheme, 
    clearComparedSchemes 
  } = useApp();

  const comparedSchemes = comparedSchemeIds
    .map(id => schemes.find(s => String(s.id) === String(id) || String(s.backendId) === String(id) || s.code === id))
    .filter(Boolean);

  const availableToAdd = schemes.filter(s => !comparedSchemeIds.some(id => String(id) === String(s.id) || String(id) === String(s.backendId) || id === s.code));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Official Government Hero Header */}
      <div className="bg-[#17324D] p-6 sm:p-8 rounded-2xl text-white shadow-card border-t-4 border-[#D97706] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1.5 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0E2438] border border-[#D97706]/40 text-[#FFF3E0] text-xs font-semibold">
            <Scale className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Factual Scheme Evaluation Matrix</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-heading">
            Scheme Comparison Tool
          </h1>
          <p className="text-xs sm:text-sm text-[#DDE3E7] max-w-2xl">
            Compare subsidy programs side-by-side using official government scheme parameters. Review eligibility criteria, maximum grant allocations, required documentation, and deadlines to make an informed choice.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10 flex-shrink-0">
          {comparedSchemes.length > 0 && (
            <button
              onClick={clearComparedSchemes}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition border border-white/20 cursor-pointer"
            >
              Clear Comparison
            </button>
          )}
          <button
            onClick={() => onBackToDashboard?.()}
            className="px-4 py-2.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs shadow-md transition font-heading uppercase tracking-wider cursor-pointer"
          >
            ← Back to Schemes
          </button>
        </div>
      </div>

      {/* When fewer than 2 schemes are selected */}
      {comparedSchemes.length < 2 && (
        <div className="gov-card p-6 sm:p-8 rounded-2xl bg-[#FFF8EE] border-2 border-[#D97706]/40 shadow-xs space-y-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-[#D97706] mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-base font-bold text-[#17324D] font-heading">
                {comparedSchemes.length === 0 ? 'No Schemes Selected for Comparison' : 'Select At Least One More Scheme'}
              </h3>
              <p className="text-xs text-[#526270] mt-0.5">
                You currently have <strong>{comparedSchemes.length}</strong> scheme selected. Choose from the schemes below to enable a side-by-side comparative table (up to 4 schemes).
              </p>
            </div>
          </div>

          {/* Currently Selected Scheme Pill (if 1 selected) */}
          {comparedSchemes.length === 1 && (
            <div className="p-3.5 rounded-xl bg-white border border-[#D97706]/40 flex items-center justify-between gap-3 shadow-2xs">
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold text-[#287C5A] px-2 py-0.5 rounded bg-[#EAF5EF]">
                  {comparedSchemes[0].category}
                </span>
                <div className="text-xs sm:text-sm font-bold text-[#17324D] truncate mt-1">
                  1. {comparedSchemes[0].title}
                </div>
                <div className="text-[11px] font-semibold text-[#287C5A]">
                  Up to ₹{Number(comparedSchemes[0].maxAmount || 0).toLocaleString('en-IN')} • {comparedSchemes[0].department}
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeCompareScheme(comparedSchemes[0].id)}
                className="text-xs font-semibold text-[#B84040] hover:bg-rose-50 px-2.5 py-1.5 rounded-lg border border-rose-200 transition flex-shrink-0 cursor-pointer"
              >
                ✕ Remove
              </button>
            </div>
          )}

          {/* Quick Add Pills */}
          <div className="pt-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#17324D] mb-2 font-heading">
              Click Any Scheme Below to Add to Comparison:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {availableToAdd.slice(0, 6).map(sch => (
                <button
                  key={sch.id}
                  onClick={() => toggleCompareScheme(sch.id)}
                  className="p-3 rounded-xl bg-white border border-[#DDE3E7] hover:border-[#17324D] hover:shadow-sm text-left transition flex items-center justify-between gap-2 group cursor-pointer"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] uppercase font-bold text-[#287C5A]">{sch.category}</div>
                    <div className="text-xs font-bold text-[#17324D] truncate group-hover:text-[#D97706]">{sch.title}</div>
                    <div className="text-[11px] font-semibold text-[#287C5A]">Up to ₹{Number(sch.maxAmount || 0).toLocaleString('en-IN')}</div>
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-[#F8FAFC] border border-[#DDE3E7] flex items-center justify-center text-[#17324D] group-hover:bg-[#17324D] group-hover:text-white transition flex-shrink-0">
                    <Plus className="w-4 h-4" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Scheme Drawer if between 2 and 3 schemes are compared */}
      {comparedSchemes.length >= 2 && comparedSchemes.length < 4 && availableToAdd.length > 0 && (
        <div className={`p-3.5 rounded-xl bg-[#FFF8EE] border border-[#D97706]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-2xs ${comparedSchemes.length === 2 ? 'max-w-5xl mx-auto' : 'w-full'}`}>
          <div className="flex items-center gap-2 text-[#17324D]">
            <Plus className="w-4 h-4 text-[#D97706] flex-shrink-0" />
            <span>Comparing <strong>{comparedSchemes.length}/4</strong> schemes. You can add up to {4 - comparedSchemes.length} more schemes side-by-side:</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            {availableToAdd.slice(0, 3).map(sch => (
              <button
                key={sch.id}
                onClick={() => toggleCompareScheme(sch.id)}
                className="px-2.5 py-1.5 rounded-lg bg-white border border-[#DDE3E7] hover:border-[#17324D] text-[#17324D] text-[11px] font-semibold flex items-center gap-1 whitespace-nowrap shadow-2xs hover:bg-[#F8FAFC] cursor-pointer"
              >
                <span>+ {sch.title.length > 22 ? sch.title.slice(0, 22) + '...' : sch.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Head-to-Head 2-Scheme Overview Hero when exactly 2 schemes are selected */}
      {comparedSchemes.length === 2 && (
        <div className="max-w-5xl mx-auto p-4 sm:p-5 rounded-2xl bg-[#F8FAFC] border border-[#DDE3E7] shadow-xs animate-fade-in">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#7C8992] text-center mb-3 font-mono">
            Direct Head-to-Head Evaluation
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-[1fr,auto,1fr] items-center gap-4">
            {/* Scheme A Pill */}
            <div className="p-4 rounded-xl bg-white border-2 border-[#17324D]/20 shadow-2xs space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] uppercase font-bold text-[#287C5A] px-2 py-0.5 rounded bg-[#EAF5EF] border border-[#287C5A]/30">
                  {comparedSchemes[0].category || 'General'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#17324D] text-white font-mono">
                  Option A
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-[#17324D] truncate mt-1">
                {comparedSchemes[0].title}
              </h4>
              <div className="text-base font-extrabold text-[#287C5A]">
                Up to ₹{Number(comparedSchemes[0].maxAmount || 0).toLocaleString('en-IN')}
              </div>
            </div>

            {/* VS Badge */}
            <div className="flex items-center justify-center my-1 sm:my-0">
              <div className="w-10 h-10 rounded-full bg-[#17324D] text-[#FFF3E0] flex items-center justify-center font-extrabold text-xs shadow-md font-mono border-2 border-[#D97706] ring-4 ring-[#FFF8EE]">
                VS
              </div>
            </div>

            {/* Scheme B Pill */}
            <div className="p-4 rounded-xl bg-white border-2 border-[#17324D]/20 shadow-2xs space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] uppercase font-bold text-[#287C5A] px-2 py-0.5 rounded bg-[#EAF5EF] border border-[#287C5A]/30">
                  {comparedSchemes[1].category || 'General'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#17324D] text-white font-mono">
                  Option B
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-[#17324D] truncate mt-1">
                {comparedSchemes[1].title}
              </h4>
              <div className="text-base font-extrabold text-[#287C5A]">
                Up to ₹{Number(comparedSchemes[1].maxAmount || 0).toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Side-by-Side Comparison Table Matrix */}
      {comparedSchemes.length >= 2 && (
        <div className={`gov-card rounded-2xl border border-[#DDE3E7] bg-white shadow-card overflow-hidden ${comparedSchemes.length === 2 ? 'max-w-5xl mx-auto' : 'w-full'}`}>
          
          <div className="p-4 bg-[#F8FAFC] border-b border-[#DDE3E7] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#17324D] font-heading uppercase tracking-wider">
                {comparedSchemes.length === 2 ? 'Head-to-Head Comparative Matrix' : 'Side-by-Side Comparative Matrix'}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#EAF5EF] text-[#287C5A] border border-[#287C5A]/30 text-[10px] font-bold">
                {comparedSchemes.length} Schemes Selected
              </span>
            </div>
            <div className="text-[11px] text-[#7C8992]">
              Factual, objective comparison based on official scheme guidelines
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-fixed min-w-[680px]">
              <colgroup>
                <col className={comparedSchemes.length === 2 ? 'w-52 sm:w-60 md:w-64' : 'w-44 sm:w-56'} />
                {comparedSchemes.map(sch => (
                  <col key={sch.id} style={{ width: `${(100 - (comparedSchemes.length === 2 ? 26 : 22)) / comparedSchemes.length}%` }} />
                ))}
              </colgroup>
              
              {/* Header Row: Scheme Titles & Main CTAs */}
              <thead>
                <tr className="border-b border-[#DDE3E7] bg-[#F8FAFB]">
                  <th className="p-4 sm:p-5 text-xs font-bold text-[#526270] uppercase tracking-wider border-r border-[#DDE3E7]">
                    Scheme Parameter
                  </th>
                  {comparedSchemes.map((sch, idx) => {
                    const isTwo = comparedSchemes.length === 2;
                    const otherSch = isTwo ? comparedSchemes[1 - idx] : null;
                    const isHigherAid = isTwo && Number(sch.maxAmount || 0) > Number(otherSch?.maxAmount || 0);

                    return (
                      <th key={sch.id} className="p-4 sm:p-5 text-left align-top border-r border-[#DDE3E7] last:border-r-0">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between gap-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#EAF5EF] text-[#287C5A] border border-[#287C5A]/30 truncate">
                              {sch.category || 'General'}
                            </span>
                            {isTwo && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#17324D] text-white font-mono shrink-0">
                                Option {idx === 0 ? 'A' : 'B'}
                              </span>
                            )}
                          </div>

                          <div>
                            <h3 className="text-sm font-bold text-[#17324D] font-heading mt-0.5 leading-snug line-clamp-2 min-h-[2.5rem]">
                              {sch.title}
                            </h3>
                            {isHigherAid && (
                              <span className="inline-block text-[9px] font-bold text-[#287C5A] bg-[#EAF5EF] border border-[#287C5A]/30 px-1.5 py-0.5 rounded mt-1 font-mono">
                                ★ Higher Grant Allocation
                              </span>
                            )}
                          </div>

                          <div className="p-2.5 rounded-xl bg-white border border-[#DDE3E7] shadow-2xs">
                            <div className="text-[10px] text-[#526270] uppercase font-semibold">Maximum Financial Aid</div>
                            <div className="text-base font-extrabold text-[#287C5A] font-heading">
                              Up to ₹{Number(sch.maxAmount || 0).toLocaleString('en-IN')}
                            </div>
                          </div>

                          {/* Top CTAs */}
                          <div className="flex items-center gap-2 pt-1">
                            <button
                              onClick={() => onStartApply?.(sch)}
                              className="flex-1 py-2 rounded-lg bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition uppercase tracking-wider font-heading cursor-pointer"
                            >
                              <span>Apply Now</span>
                              <ArrowRight className="w-3.5 h-3.5 text-white" />
                            </button>
                            <button
                              onClick={() => removeCompareScheme(sch.id)}
                              className="p-2 rounded-lg text-[#B84040] hover:bg-[#FDF2F2] border border-[#DDE3E7] transition cursor-pointer"
                              title="Remove from comparison"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody className="divide-y divide-[#DDE3E7] text-xs">
                
                {/* Row 1: Department / Ministry */}
                <tr className="hover:bg-[#F8FAFC]/50">
                  <td className="p-4 font-bold text-[#17324D] border-r border-[#DDE3E7] bg-[#FAFAFA]">
                    Department / Ministry
                  </td>
                  {comparedSchemes.map(sch => (
                    <td key={sch.id} className="p-4 text-[#526270] border-r border-[#DDE3E7] last:border-r-0">
                      {sch.department || 'Not specified'}
                    </td>
                  ))}
                </tr>

                {/* Row 2: Objective & Description */}
                <tr className="hover:bg-[#F8FAFC]/50">
                  <td className="p-4 font-bold text-[#17324D] border-r border-[#DDE3E7] bg-[#FAFAFA]">
                    Scheme Objective
                  </td>
                  {comparedSchemes.map(sch => (
                    <td key={sch.id} className="p-4 text-[#526270] leading-relaxed border-r border-[#DDE3E7] last:border-r-0">
                      {sch.description || sch.shortDesc || 'Not specified'}
                    </td>
                  ))}
                </tr>

                {/* Row 3: Age Requirement */}
                <tr className="hover:bg-[#F8FAFC]/50">
                  <td className="p-4 font-bold text-[#17324D] border-r border-[#DDE3E7] bg-[#FAFAFA]">
                    Age Requirement
                  </td>
                  {comparedSchemes.map(sch => (
                    <td key={sch.id} className="p-4 font-mono font-semibold text-[#17324D] border-r border-[#DDE3E7] last:border-r-0">
                      {sch.minAge !== undefined && sch.maxAge !== undefined
                        ? `${sch.minAge} – ${sch.maxAge} Years`
                        : 'Not specified'}
                    </td>
                  ))}
                </tr>

                {/* Row 4: Annual Income Ceiling */}
                <tr className="hover:bg-[#F8FAFC]/50">
                  <td className="p-4 font-bold text-[#17324D] border-r border-[#DDE3E7] bg-[#FAFAFA]">
                    Annual Income Ceiling
                  </td>
                  {comparedSchemes.map(sch => (
                    <td key={sch.id} className="p-4 font-semibold text-[#17324D] border-r border-[#DDE3E7] last:border-r-0">
                      {sch.maxIncome !== undefined
                        ? `Below ₹${Number(sch.maxIncome).toLocaleString('en-IN')}`
                        : 'Not specified'}
                    </td>
                  ))}
                </tr>

                {/* Row 5: Eligible States / Region */}
                <tr className="hover:bg-[#F8FAFC]/50">
                  <td className="p-4 font-bold text-[#17324D] border-r border-[#DDE3E7] bg-[#FAFAFA]">
                    Eligible States / Jurisdiction
                  </td>
                  {comparedSchemes.map(sch => (
                    <td key={sch.id} className="p-4 text-[#526270] border-r border-[#DDE3E7] last:border-r-0">
                      {Array.isArray(sch.allowedStates) && sch.allowedStates.length > 0
                        ? sch.allowedStates.join(', ')
                        : 'All India'}
                    </td>
                  ))}
                </tr>

                {/* Row 6: Required Documents */}
                <tr className="hover:bg-[#F8FAFC]/50">
                  <td className="p-4 font-bold text-[#17324D] border-r border-[#DDE3E7] bg-[#FAFAFA]">
                    Required Documents Checklist
                  </td>
                  {comparedSchemes.map(sch => (
                    <td key={sch.id} className="p-4 text-[#526270] border-r border-[#DDE3E7] last:border-r-0">
                      {Array.isArray(sch.requiredDocs) && sch.requiredDocs.length > 0 ? (
                        <ul className="space-y-1">
                          {sch.requiredDocs.map((d, i) => (
                            <li key={i} className="flex items-center gap-1.5 text-[11px]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#287C5A]"></span>
                              <span>{d.name || d}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        'Not specified'
                      )}
                    </td>
                  ))}
                </tr>

                {/* Row 7: Estimated Processing Time */}
                <tr className="hover:bg-[#F8FAFC]/50">
                  <td className="p-4 font-bold text-[#17324D] border-r border-[#DDE3E7] bg-[#FAFAFA]">
                    Estimated Processing Time
                  </td>
                  {comparedSchemes.map(sch => (
                    <td key={sch.id} className="p-4 border-r border-[#DDE3E7] last:border-r-0">
                      <div className="flex items-center gap-1.5 text-[#D97706] font-bold">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{sch.processingDays || '5–8 Working Days (Estimate)'}</span>
                      </div>
                      <span className="text-[10px] text-[#7C8992] block mt-0.5">Direct Bank Transfer cycle</span>
                    </td>
                  ))}
                </tr>

                {/* Row 8: Application Status / Availability */}
                <tr className="hover:bg-[#F8FAFC]/50">
                  <td className="p-4 font-bold text-[#17324D] border-r border-[#DDE3E7] bg-[#FAFAFA]">
                    Application Availability
                  </td>
                  {comparedSchemes.map(sch => (
                    <td key={sch.id} className="p-4 border-r border-[#DDE3E7] last:border-r-0">
                      <span className={`inline-block px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                        sch.status === 'ACTIVE'
                          ? 'bg-[#EAF5EF] text-[#287C5A] border border-[#287C5A]/30'
                          : 'bg-[#FDF2F2] text-[#B84040] border border-[#B84040]/30'
                      }`}>
                        {sch.status === 'ACTIVE' ? 'Applications Open' : 'Applications Closed'}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Row 9: Application Deadline */}
                <tr className="hover:bg-[#F8FAFC]/50">
                  <td className="p-4 font-bold text-[#17324D] border-r border-[#DDE3E7] bg-[#FAFAFA]">
                    Application Deadline
                  </td>
                  {comparedSchemes.map(sch => (
                    <td key={sch.id} className="p-4 font-mono text-[#17324D] font-semibold border-r border-[#DDE3E7] last:border-r-0">
                      {sch.deadline || 'Ongoing / Not specified'}
                    </td>
                  ))}
                </tr>

                {/* Row 10: Total Outlay / Beneficiaries */}
                <tr className="hover:bg-[#F8FAFC]/50">
                  <td className="p-4 font-bold text-[#17324D] border-r border-[#DDE3E7] bg-[#FAFAFA]">
                    Budget Allocation
                  </td>
                  {comparedSchemes.map(sch => (
                    <td key={sch.id} className="p-4 text-[#526270] border-r border-[#DDE3E7] last:border-r-0">
                      {sch.totalFund ? `₹${(sch.totalFund / 10000000).toFixed(1)} Cr total pool` : 'Not specified'}
                    </td>
                  ))}
                </tr>

                {/* Bottom Action Row */}
                <tr className="bg-[#F8FAFB]">
                  <td className="p-4 font-bold text-[#17324D] border-r border-[#DDE3E7]">
                    Actions
                  </td>
                  {comparedSchemes.map(sch => (
                    <td key={sch.id} className="p-4 border-r border-[#DDE3E7] last:border-r-0">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onStartApply?.(sch)}
                          className="flex-1 py-2 rounded-lg bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition font-heading uppercase tracking-wider"
                        >
                          <span>Apply Now</span>
                          <ArrowRight className="w-3.5 h-3.5 text-white" />
                        </button>
                        <button
                          onClick={() => removeCompareScheme(sch.id)}
                          className="px-3 py-2 rounded-lg text-xs font-semibold text-[#B84040] hover:bg-[#FDF2F2] border border-[#DDE3E7] transition"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  ))}
                </tr>

              </tbody>
            </table>
          </div>

          <div className="p-4 bg-[#F8FAFC] border-t border-[#DDE3E7] text-[11px] text-[#7C8992] flex items-center gap-2">
            <Info className="w-4 h-4 text-[#7C8992] flex-shrink-0" />
            <span>Information presented above is factual and retrieved directly from government notifications. The platform does not score or rank schemes.</span>
          </div>

        </div>
      )}

    </div>
  );
};
