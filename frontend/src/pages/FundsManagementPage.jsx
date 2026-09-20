import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Send, 
  CreditCard 
} from 'lucide-react';

export const FundsManagementPage = () => {
  const { schemeBudgets, disburseTranche, currentRole } = useApp();
  const [selectedSchemeId, setSelectedSchemeId] = useState(schemeBudgets[0]?.schemeId || '');
  const [showTrancheModal, setShowTrancheModal] = useState(false);
  const [trancheAmount, setTrancheAmount] = useState('20000000');
  const [beneficiariesCount, setBeneficiariesCount] = useState('500');

  const selectedBudget = schemeBudgets.find(b => b.schemeId === selectedSchemeId) || schemeBudgets[0];

  const totalAllottedAll = schemeBudgets.reduce((acc, b) => acc + b.totalBudget, 0);
  const totalReleasedAll = schemeBudgets.reduce((acc, b) => acc + b.releasedBudget, 0);
  const overallUtilization = ((totalReleasedAll / totalAllottedAll) * 100).toFixed(1);

  const handleDisburse = (e) => {
    e.preventDefault();
    if (!selectedSchemeId || !trancheAmount) return;
    disburseTranche(selectedSchemeId, Number(trancheAmount), Number(beneficiariesCount));
    setShowTrancheModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
              PFMS & DBT Treasury
            </span>
            <span className="text-xs text-slate-500">Financial Year 2026-2027</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Public Fund Allocation & DBT Disbursement</h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Real-time monitoring of scheme budget envelopes, committed grants, electronic payment batches, and direct Aadhaar bank credit progress.
          </p>
        </div>

        {(currentRole === 'AUTHORITY' || currentRole === 'ADMINISTRATOR') && (
          <button
            onClick={() => setShowTrancheModal(true)}
            className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition"
          >
            <Send className="w-4 h-4" />
            <span>Disburse Scheme Tranche</span>
          </button>
        )}
      </div>

      {/* Aggregate Financial Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8 text-xs">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-slate-500 block">Total Sanctioned Envelope</span>
          <div className="text-2xl font-extrabold text-[#0f172a] mt-1">₹{(totalAllottedAll / 10000000).toFixed(1)} Cr</div>
          <span className="text-[10px] text-slate-400 mt-1 block">Parliamentary / Cabinet Budget</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-slate-500 block">Total Disbursed to Bank Accounts</span>
          <div className="text-2xl font-extrabold text-emerald-700 mt-1">₹{(totalReleasedAll / 10000000).toFixed(2)} Cr</div>
          <span className="text-[10px] text-emerald-600 mt-1 block">Credited via APBS / PFMS</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-slate-500 block">Overall Fund Utilization</span>
          <div className="text-2xl font-extrabold text-blue-700 mt-1">{overallUtilization}%</div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${overallUtilization}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-slate-500 block">Beneficiaries Reached</span>
          <div className="text-2xl font-extrabold text-[#0f172a] mt-1">
            {schemeBudgets.reduce((acc, b) => acc + b.beneficiariesCovered, 0).toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Verified Citizen Direct Transfers</span>
        </div>
      </div>

      {/* Scheme Selection Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6">
        {schemeBudgets.map(sb => (
          <button
            key={sb.schemeId}
            onClick={() => setSelectedSchemeId(sb.schemeId)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
              selectedBudget.schemeId === sb.schemeId
                ? 'bg-blue-700 text-white border-blue-700 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {sb.schemeName}
          </button>
        ))}
      </div>

      {/* Selected Scheme Budget Breakdown */}
      {selectedBudget && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Card: Budget Health */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
            <div className="border-b border-slate-200 pb-3">
              <div className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">{selectedBudget.schemeCode}</div>
              <h3 className="text-base font-bold text-[#0f172a] mt-0.5">{selectedBudget.schemeName}</h3>
              <p className="text-slate-500 mt-0.5">{selectedBudget.department}</p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Total Approved Allocation:</span>
                <span className="font-bold text-slate-900 text-sm">₹{Number(selectedBudget.totalBudget).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center text-emerald-700 font-semibold">
                <span>Released via Tranches:</span>
                <span>₹{Number(selectedBudget.releasedBudget).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center text-amber-700 font-semibold">
                <span>Committed to Verified Applications:</span>
                <span>₹{Number(selectedBudget.committedBudget).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center text-slate-500">
                <span>Available Treasury Balance:</span>
                <span className="font-bold text-slate-900">₹{Number(selectedBudget.availableBalance).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200">
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Utilization Rate</span>
                <span>{selectedBudget.utilizationRate}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-emerald-600 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, selectedBudget.utilizationRate)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Table: Tranche Disbursement Ledger */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#0f172a] flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-700" />
                <span>Tranche Payment Batches & UTR References</span>
              </h3>
              <span className="text-[11px] text-slate-500 font-medium">{selectedBudget.tranches?.length || 0} Batches Disbursed</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-[11px] uppercase tracking-wider bg-slate-50">
                    <th className="py-2.5 px-3">Batch ID</th>
                    <th className="py-2.5 px-3">Release Date</th>
                    <th className="py-2.5 px-3">Beneficiaries</th>
                    <th className="py-2.5 px-3">Amount Released</th>
                    <th className="py-2.5 px-3">PFMS UTR Number</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedBudget.tranches?.map((tr, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60">
                      <td className="py-3 px-3 font-mono font-bold text-slate-800">{tr.trancheNo}</td>
                      <td className="py-3 px-3 text-slate-600">{tr.date}</td>
                      <td className="py-3 px-3 font-semibold text-slate-800">{tr.beneficiaries?.toLocaleString('en-IN')} citizens</td>
                      <td className="py-3 px-3 font-bold text-emerald-700">₹{Number(tr.amount).toLocaleString('en-IN')}</td>
                      <td className="py-3 px-3 font-mono text-[11px] text-blue-700 font-semibold">{tr.utrBatch}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          Credited
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Disburse Tranche Modal */}
      {showTrancheModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-slide-up text-slate-800 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <div>
                <h3 className="font-bold text-base text-[#0f172a]">Disburse DBT Tranche</h3>
                <p className="text-slate-500 text-[11px]">Generate electronic PFMS batch payment</p>
              </div>
              <button onClick={() => setShowTrancheModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleDisburse} className="space-y-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Target Subsidy Scheme</label>
                <select
                  value={selectedSchemeId}
                  onChange={(e) => setSelectedSchemeId(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none"
                >
                  {schemeBudgets.map(sb => (
                    <option key={sb.schemeId} value={sb.schemeId}>{sb.schemeName} (Avail: ₹{(sb.availableBalance/100000).toFixed(1)}L)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tranche Disbursement Amount (₹)</label>
                <input
                  type="number"
                  required
                  value={trancheAmount}
                  onChange={(e) => setTrancheAmount(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Target Beneficiary Count</label>
                <input
                  type="number"
                  required
                  value={beneficiariesCount}
                  onChange={(e) => setBeneficiariesCount(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-900 text-[11px]">
                Upon confirmation, an official Bank Batch UTR reference will be minted, and funds will be debited from the treasury and credited directly to the approved applicants.
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowTrancheModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold inline-flex items-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" /> Authorize & Disburse
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
