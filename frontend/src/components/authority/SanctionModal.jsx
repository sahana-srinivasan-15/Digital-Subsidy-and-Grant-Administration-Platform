import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Award, Shield } from 'lucide-react';

export const SanctionModal = ({ application, onApprove, onClose }) => {
  const [approvedAmount, setApprovedAmount] = useState(application.requestedAmount || 150000);
  const [remarks, setRemarks] = useState('Sanctioned grant released under state welfare quota.');

  const handleApprove = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });

    onApprove(application.id, true, approvedAmount, remarks);
  };

  const handleReject = () => {
    onApprove(application.id, false, 0, remarks || 'Sanction request declined by approving authority.');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-xl animate-fade-in text-slate-800 relative">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-blue-700">{application.id}</span>
              <h3 className="text-base font-bold text-[#0f172a]">Sanctioning Officer Decision Desk</h3>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded bg-slate-100">✕</button>
        </div>

        {/* Application Overview */}
        <div className="p-4 rounded-md bg-slate-50 border border-slate-200 space-y-2 text-xs">
          <div className="flex justify-between"><span className="text-slate-500">Beneficiary Applicant:</span> <span className="text-[#0f172a] font-bold">{application.applicantName}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Scheme:</span> <span className="text-blue-700 font-semibold">{application.schemeTitle}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Requested Amount:</span> <span className="text-emerald-700 font-bold">₹{application.requestedAmount?.toLocaleString('en-IN')}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Field Verifier Remarks:</span> <span className="text-slate-600 italic">"{application.verifierRemarks || 'Verified'}"</span></div>
        </div>

        {/* Sanction Amount Adjuster */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-[#0f172a] flex items-center justify-between">
            <span>Approved Grant Amount (₹)</span>
            <span className="text-emerald-700 font-bold text-sm">₹{Number(approvedAmount).toLocaleString('en-IN')}</span>
          </label>
          
          <input
            type="range"
            min={10000}
            max={application.requestedAmount || 200000}
            step={5000}
            value={approvedAmount}
            onChange={(e) => setApprovedAmount(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded appearance-none cursor-pointer accent-[#1d4ed8]"
          />

          <div className="flex items-center justify-between text-[10px] text-slate-500">
            <span>Min: ₹10,000</span>
            <span>Requested Max: ₹{application.requestedAmount?.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Authority Remarks */}
        <div>
          <label className="text-xs font-bold text-[#0f172a] block mb-1">Official Sanction Note / Remarks</label>
          <textarea
            rows={2}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-md p-3 text-slate-900 focus:border-blue-600 focus:outline-none text-xs shadow-sm"
          />
        </div>

        {/* Official Digital Seal */}
        <div className="p-3.5 rounded-md bg-blue-50 border border-blue-200 flex items-center gap-3 text-xs text-blue-900">
          <Shield className="w-5 h-5 text-blue-700 flex-shrink-0" />
          <div className="flex-1">
            <span className="font-bold block text-blue-900">Digital Sanction Seal Ready</span>
            <span className="text-[10px] text-slate-600">Signing Authority: Dr. Priya Varma (Joint Director, State Treasury)</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            onClick={handleReject}
            className="px-4 py-2.5 rounded-md bg-rose-50 border border-rose-200 text-rose-800 font-bold text-xs hover:bg-rose-100"
          >
            Decline Sanction
          </button>

          <button
            onClick={handleApprove}
            className="px-6 py-2.5 rounded-md bg-[#1d4ed8] hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
          >
            <Award className="w-4 h-4 text-white" />
            <span>Approve & Release Direct Bank Transfer</span>
          </button>
        </div>

      </div>
    </div>
  );
};
