import React, { useState } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  FileText, 
  User, 
  ShieldCheck, 
  IndianRupee, 
  Send, 
  RotateCcw,
  MapPin,
  Calendar,
  Check
} from 'lucide-react';

export const DistrictEndorsementModal = ({ application, onEndorse, onClose }) => {
  const [remarks, setRemarks] = useState('');
  const [priorityCategory, setPriorityCategory] = useState('STANDARD');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!application) return null;

  const handleAction = (actionType) => {
    setIsSubmitting(true);
    try {
      const finalRemarks = remarks.trim() || (actionType === 'ENDORSE' 
        ? `Endorsed under ${priorityCategory === 'PRIORITY' ? 'Priority Welfare Quota' : 'Standard District Allocation'} by District Nodal Officer.`
        : 'Returned to block inspector for document re-verification.');
      onEndorse(application.id, finalRemarks, actionType);
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0E2438]/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-[#CBD5E1] shadow-2xl overflow-hidden animate-scale-up">
        
        {/* Modal Header */}
        <div className="bg-[#17324D] px-6 py-5 text-white flex items-center justify-between border-b border-[#0E2438]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0E2438] border border-[#D97706]/40 flex items-center justify-center text-[#D97706]">
              <Building2 className="w-5 h-5 text-[#D97706]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#0E2438] text-[#D97706] border border-[#D97706]/30">
                  District Collectorate Sign-Off
                </span>
                <span className="text-xs text-[#DDE3E7] font-mono">{application.id}</span>
              </div>
              <h3 className="text-base font-extrabold text-white font-heading mt-0.5">
                District Scrutiny & State Endorsement
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#A0B0C0] hover:text-white hover:bg-[#0E2438] transition cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Applicant & Scheme Summary Dossier */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#F8FAFC] border border-[#DDE3E7]">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#526270] block">
                Citizen Applicant
              </span>
              <div className="text-sm font-extrabold text-[#17324D] mt-0.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#526270]" />
                <span>{application.applicantName}</span>
              </div>
              <div className="text-xs text-[#526270] flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3 text-[#D97706]" />
                <span>{application.applicantTaluk ? `${application.applicantTaluk}, ` : ''}{application.applicantDistrict}, {application.applicantState}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#526270] block">
                Applied Scheme & Grant Value
              </span>
              <div className="text-xs font-bold text-[#17324D] mt-0.5 truncate" title={application.schemeTitle}>
                {application.schemeTitle}
              </div>
              <div className="text-sm font-extrabold text-[#287C5A] mt-1">
                ₹{(application.requestedAmount || 0).toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Inspector Verification Findings */}
          <div className="p-4 rounded-xl bg-[#EAF5EF] border border-[#287C5A]/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1E6045] flex items-center gap-1.5 font-heading">
                <ShieldCheck className="w-4 h-4 text-[#287C5A]" />
                Field Inspector Scrutiny Status: PASSED
              </span>
              <span className="text-[11px] font-mono text-[#526270]">
                {application.verificationDate ? new Date(application.verificationDate).toLocaleDateString('en-IN') : 'Recently Inspected'}
              </span>
            </div>
            <p className="text-xs text-[#17324D] leading-relaxed bg-white/80 p-2.5 rounded-lg border border-[#287C5A]/20">
              <span className="font-bold text-[#1E6045]">Inspector Remarks: </span>
              {application.verifierRemarks || 'All applicant eligibility records and land boundaries verified against digital revenue cadastre.'}
            </p>
          </div>

          {/* Verification Checkpoints */}
          <div>
            <label className="text-[11px] font-bold text-[#526270] uppercase tracking-wider block mb-2 font-heading">
              Audited Credentials & Evidence
            </label>
            <div className="space-y-2">
              {[
                { label: 'UIDAI Aadhaar e-KYC Identity Match', status: 'Confirmed (99% OCR match)', icon: CheckCircle2 },
                { label: 'Revenue Department Land & Cadastre Records', status: 'Approved by Block Tehsildar', icon: CheckCircle2 },
                { label: 'Bank Account & PFMS Direct Benefit Transfer Link', status: 'Active (Aadhaar Seeded)', icon: CheckCircle2 }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-[#F8FAFC] border border-[#DDE3E7] text-xs">
                  <span className="font-medium text-[#17324D] flex items-center gap-2">
                    <item.icon className="w-3.5 h-3.5 text-[#287C5A]" />
                    {item.label}
                  </span>
                  <span className="font-mono text-[11px] font-bold text-[#287C5A]">{item.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* District Quota & Category Endorsement */}
          <div className="space-y-3">
            <label className="text-[11px] font-bold text-[#526270] uppercase tracking-wider block font-heading">
              District Allocation Quota *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPriorityCategory('STANDARD')}
                className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                  priorityCategory === 'STANDARD'
                    ? 'border-[#17324D] bg-[#17324D] text-white shadow-xs'
                    : 'border-[#CBD5E1] bg-[#F8FAFC] text-[#17324D] hover:bg-white'
                }`}
              >
                <div className="text-xs font-bold">Standard District Quota</div>
                <div className={`text-[10px] mt-0.5 ${priorityCategory === 'STANDARD' ? 'text-[#DDE3E7]' : 'text-[#526270]'}`}>
                  Routine eligible grant endorsement
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPriorityCategory('PRIORITY')}
                className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                  priorityCategory === 'PRIORITY'
                    ? 'border-[#D97706] bg-[#D97706] text-white shadow-xs'
                    : 'border-[#CBD5E1] bg-[#F8FAFC] text-[#17324D] hover:bg-white'
                }`}
              >
                <div className="text-xs font-bold">Priority / Marginalized Quota</div>
                <div className={`text-[10px] mt-0.5 ${priorityCategory === 'PRIORITY' ? 'text-[#FFF3E0]' : 'text-[#526270]'}`}>
                  High-priority affirmative welfare allocation
                </div>
              </button>
            </div>
          </div>

          {/* District Nodal Officer Official Remarks */}
          <div>
            <label className="text-[11px] font-bold text-[#526270] uppercase tracking-wider block mb-1.5 font-heading">
              District Endorsement Remarks (Recorded in State Audit Ledger)
            </label>
            <textarea
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Scrutinized and verified under District Nodal Officer jurisdiction. Recommended for State Grant Sanction sign-off."
              className="w-full bg-white border border-[#CBD5E1] rounded-xl p-3 text-xs text-[#17324D] placeholder-[#7C8992] focus:outline-none focus:border-[#17324D] shadow-xs"
            />
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-5 bg-[#F8FAFC] border-t border-[#DDE3E7] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => handleAction('REJECT')}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-4 py-2.5 rounded-full border border-[#DC2626]/40 text-[#DC2626] hover:bg-[#FEF2F2] text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#DC2626]" />
            <span>Return to Inspector for Re-Scrutiny</span>
          </button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-full text-xs font-bold text-[#526270] hover:text-[#17324D] hover:bg-[#E2E8F0] border border-[#DDE3E7] transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => handleAction('ENDORSE')}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-full bg-[#287C5A] hover:bg-[#1E6045] text-white text-xs font-extrabold flex items-center gap-2 shadow-xs transition cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5 text-white" />
              <span>Sign & Endorse to State Authority</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
