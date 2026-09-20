import React, { useState, useEffect } from 'react';
import { 
  Landmark, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  IndianRupee, 
  Users, 
  FileText, 
  ShieldCheck, 
  AlertCircle
} from 'lucide-react';

export const SchemeFormModal = ({ onSubmit, onClose }) => {
  const [step, setStep] = useState(1);
  const [validationError, setValidationError] = useState('');
  
  const [form, setForm] = useState({
    title: '',
    code: '',
    category: 'AGRICULTURE',
    department: 'Department of Agriculture & State Welfare',
    description: '',
    maxAmount: 150000,
    totalFund: 50000000,
    deadline: '2026-12-31',
    minAge: 18,
    maxAge: 65,
    maxIncome: 500000
  });

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const validateStep1 = () => {
    if (!form.title.trim()) {
      setValidationError('Please enter an official scheme title.');
      return false;
    }
    if (!form.department.trim()) {
      setValidationError('Please specify the sponsoring ministry or department.');
      return false;
    }
    if (!form.description.trim() || form.description.length < 20) {
      setValidationError('Please provide a descriptive scheme policy overview (at least 20 characters).');
      return false;
    }
    setValidationError('');
    return true;
  };

  const validateStep2 = () => {
    if (!form.maxAmount || form.maxAmount <= 0) {
      setValidationError('Maximum grant per beneficiary must be greater than zero.');
      return false;
    }
    if (!form.totalFund || form.totalFund <= form.maxAmount) {
      setValidationError('Total scheme budget pool must exceed the individual single cap.');
      return false;
    }
    setValidationError('');
    return true;
  };

  const handleNext = () => {
    if (step === 1) {
      if (validateStep1()) setStep(2);
    } else if (step === 2) {
      if (validateStep2()) setStep(3);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalCode = form.code.trim()
      ? form.code.toUpperCase().trim()
      : `SCH-${form.category.slice(0, 4)}-${Math.floor(100 + Math.random() * 900)}`;

    onSubmit({
      ...form,
      code: finalCode,
      shortDesc: form.description ? form.description.slice(0, 140) + '...' : form.title
    });
    onClose();
  };

  const stepTitles = [
    { num: 1, label: 'Identity & Scope', desc: 'Title, Department & Category' },
    { num: 2, label: 'Financial Pool', desc: 'Treasury Budget & DBT Caps' },
    { num: 3, label: 'Eligibility & Policy', desc: 'Ceilings, Age & Verification' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0E2438]/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-[#DDE3E7] shadow-2xl overflow-hidden animate-scale-up text-[#17324D] relative my-6">
        
        {/* Header with Tricolor Accent */}
        <div className="bg-[#17324D] p-6 sm:p-7 text-white relative border-b-4 border-[#D97706]">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-[#0E2438] border border-[#D97706]/40 text-[#D97706] shadow-inner">
              <Landmark className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#D97706] font-bold">
                  NATIONAL SCHEME POLICY ENGINE
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#287C5A] text-white">
                  e-Gov 2026
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold font-heading text-white mt-0.5">
                Configure New Welfare Scheme
              </h3>
            </div>
          </div>

          <p className="text-xs text-[#DDE3E7] mt-2 max-w-xl">
            Publish official Direct Benefit Transfer schemes with automated eligibility rules, treasury budget locks, and paperless verification criteria.
          </p>

          {/* Clean Stepper Progress Indicator */}
          <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-white/10">
            {stepTitles.map(s => {
              const isPassed = step > s.num;
              const isCurrent = step === s.num;
              return (
                <div 
                  key={s.num}
                  className={`p-2.5 rounded-xl transition-all ${
                    isCurrent 
                      ? 'bg-white/15 border border-[#D97706]/60 text-white shadow-xs' 
                      : isPassed 
                        ? 'bg-white/5 text-[#FFF3E0] border border-white/10' 
                        : 'text-white/40 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold ${
                      isCurrent ? 'bg-[#D97706] text-white' : isPassed ? 'bg-[#287C5A] text-white' : 'bg-white/10 text-white/50'
                    }`}>
                      {isPassed ? '✓' : s.num}
                    </div>
                    <span className="text-xs font-bold truncate">{s.label}</span>
                  </div>
                  <p className="text-[10px] opacity-75 truncate mt-1 hidden sm:block">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Validation Alert Box */}
        {validationError && (
          <div className="mx-6 sm:mx-8 mt-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5 animate-shake">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span className="font-semibold">{validationError}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 text-xs">
          
          {/* STEP 1: SCHEME IDENTITY & SCOPE */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#DDE3E7] space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#DDE3E7]">
                  <FileText className="w-4 h-4 text-[#D97706]" />
                  <span className="text-xs font-extrabold text-[#17324D] uppercase tracking-wider font-heading">
                    1. Basic Scheme Information
                  </span>
                </div>

                <div>
                  <label className="text-[#526270] font-bold uppercase text-[11px] block mb-1">
                    Scheme Official Title <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => {
                      setForm({ ...form, title: e.target.value });
                      if (validationError) setValidationError('');
                    }}
                    placeholder="e.g. Modern Agricultural Mechanization & Equipment Grant"
                    className="w-full bg-white border border-[#DDE3E7] rounded-xl px-4 py-2.5 text-xs text-[#17324D] font-bold focus:outline-none focus:border-[#17324D] shadow-xs"
                  />
                  <span className="text-[10px] text-[#7C8992] mt-1 block">
                    Official title displayed to citizens on the public welfare portal.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[#526270] font-bold uppercase text-[11px] block mb-1">
                      Scheme Code (Optional / Auto-Generated)
                    </label>
                    <input
                      type="text"
                      value={form.code}
                      onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                      placeholder="e.g. AGRI-MOD-2026"
                      className="w-full bg-white border border-[#DDE3E7] rounded-xl px-4 py-2.5 text-xs font-mono text-[#17324D] font-bold focus:outline-none focus:border-[#17324D] shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[#526270] font-bold uppercase text-[11px] block mb-1">
                      Target Sector Category <span className="text-rose-600">*</span>
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full bg-white border border-[#DDE3E7] rounded-xl px-4 py-2.5 text-xs text-[#17324D] font-bold focus:outline-none focus:border-[#17324D] shadow-xs cursor-pointer"
                    >
                      <option value="AGRICULTURE">AGRICULTURE & ALLIED</option>
                      <option value="HOUSING">HOUSING & SHELTER</option>
                      <option value="EDUCATION">EDUCATION & SKILLING</option>
                      <option value="WOMEN & BUSINESS">WOMEN & MSME BUSINESS</option>
                      <option value="ENERGY">ENERGY & SOLAR RENEWABLE</option>
                      <option value="HEALTHCARE">HEALTHCARE & FAMILY WELFARE</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[#526270] font-bold uppercase text-[11px] block mb-1">
                    Sponsoring Ministry / State Department <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                    placeholder="e.g. Department of Agriculture & Farmers Empowerment"
                    className="w-full bg-white border border-[#DDE3E7] rounded-xl px-4 py-2.5 text-xs text-[#17324D] font-semibold focus:outline-none focus:border-[#17324D] shadow-xs"
                  />
                </div>

                <div>
                  <label className="text-[#526270] font-bold uppercase text-[11px] block mb-1">
                    Scheme Policy Objectives & Description <span className="text-rose-600">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Describe eligibility conditions, intended beneficiaries, approved expenditure, and DBT milestones..."
                    className="w-full bg-white border border-[#DDE3E7] rounded-xl p-3 text-xs text-[#17324D] focus:outline-none focus:border-[#17324D] shadow-xs"
                  />
                  <div className="flex items-center justify-between text-[10px] text-[#7C8992] mt-1">
                    <span>Summary will appear on scheme cards & acknowledgement slips.</span>
                    <span>{form.description.length} chars</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: FINANCIAL ALLOCATION & BUDGETING */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#DDE3E7] space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#DDE3E7]">
                  <IndianRupee className="w-4 h-4 text-[#287C5A]" />
                  <span className="text-xs font-extrabold text-[#17324D] uppercase tracking-wider font-heading">
                    2. Treasury Budget & DBT Disbursement Thresholds
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[#526270] font-bold uppercase text-[11px] block mb-1">
                      Max Grant per Beneficiary (₹) <span className="text-rose-600">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#526270]">₹</span>
                      <input
                        type="number"
                        min="1000"
                        step="1000"
                        required
                        value={form.maxAmount}
                        onChange={(e) => setForm({ ...form, maxAmount: Number(e.target.value) })}
                        className="w-full bg-white border border-[#DDE3E7] rounded-xl pl-8 pr-4 py-2.5 text-xs text-[#17324D] font-mono font-bold focus:outline-none focus:border-[#17324D] shadow-xs"
                      />
                    </div>
                    <span className="text-[10px] text-[#287C5A] font-semibold mt-1 block">
                      Single transfer cap per authorized Aadhaar identity.
                    </span>
                  </div>

                  <div>
                    <label className="text-[#526270] font-bold uppercase text-[11px] block mb-1">
                      Total Scheme Treasury Pool (₹) <span className="text-rose-600">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#526270]">₹</span>
                      <input
                        type="number"
                        min="100000"
                        step="100000"
                        required
                        value={form.totalFund}
                        onChange={(e) => setForm({ ...form, totalFund: Number(e.target.value) })}
                        className="w-full bg-white border border-[#DDE3E7] rounded-xl pl-8 pr-4 py-2.5 text-xs text-[#17324D] font-mono font-bold focus:outline-none focus:border-[#17324D] shadow-xs"
                      />
                    </div>
                    <span className="text-[10px] text-[#17324D] font-bold mt-1 block">
                      = ₹{(form.totalFund / 10000000).toFixed(2)} Crores (Treasury Authorized)
                    </span>
                  </div>
                </div>

                {/* Live Capacity Telemetry Box */}
                <div className="p-4 rounded-xl bg-white border border-[#DDE3E7] grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
                  <div className="p-2 rounded-lg bg-[#F8FAFC]">
                    <span className="text-[10px] text-[#526270] uppercase font-bold block">Estimated Beneficiaries</span>
                    <span className="text-base font-extrabold text-[#17324D] font-mono">
                      {form.maxAmount > 0 ? Math.floor(form.totalFund / form.maxAmount).toLocaleString('en-IN') : 0}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#F8FAFC]">
                    <span className="text-[10px] text-[#526270] uppercase font-bold block">Disbursal Mechanism</span>
                    <span className="text-xs font-bold text-[#287C5A] mt-1 block">PFMS e-Kuber DBT</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#F8FAFC] col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-[#526270] uppercase font-bold block">Treasury State</span>
                    <span className="text-xs font-bold text-[#D97706] mt-1 block">Pre-Allocated Pool</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: CITIZEN ELIGIBILITY & VERIFICATION RULES */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#DDE3E7] space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#DDE3E7]">
                  <Users className="w-4 h-4 text-[#D97706]" />
                  <span className="text-xs font-extrabold text-[#17324D] uppercase tracking-wider font-heading">
                    3. Citizen Eligibility Criteria & Governance Rules
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[#526270] font-bold uppercase text-[11px] block mb-1">
                      Max Annual Income (₹) <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="number"
                      step="25000"
                      value={form.maxIncome}
                      onChange={(e) => setForm({ ...form, maxIncome: Number(e.target.value) })}
                      className="w-full bg-white border border-[#DDE3E7] rounded-xl px-4 py-2.5 text-xs text-[#17324D] font-mono font-bold focus:outline-none focus:border-[#17324D] shadow-xs"
                    />
                    <span className="text-[10px] text-[#526270] mt-0.5 block">
                      = ₹{(form.maxIncome / 100000).toFixed(1)} Lakhs / year
                    </span>
                  </div>

                  <div>
                    <label className="text-[#526270] font-bold uppercase text-[11px] block mb-1">
                      Eligible Age Range (Years)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={form.minAge}
                        onChange={(e) => setForm({ ...form, minAge: Number(e.target.value) })}
                        placeholder="Min"
                        className="w-full bg-white border border-[#DDE3E7] rounded-xl px-3 py-2.5 text-xs text-[#17324D] font-mono font-bold focus:outline-none focus:border-[#17324D] shadow-xs"
                      />
                      <span className="text-[#7C8992] font-bold">to</span>
                      <input
                        type="number"
                        min="1"
                        max="120"
                        value={form.maxAge}
                        onChange={(e) => setForm({ ...form, maxAge: Number(e.target.value) })}
                        placeholder="Max"
                        className="w-full bg-white border border-[#DDE3E7] rounded-xl px-3 py-2.5 text-xs text-[#17324D] font-mono font-bold focus:outline-none focus:border-[#17324D] shadow-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[#526270] font-bold uppercase text-[11px] block mb-1">
                      Filing Deadline <span className="text-rose-600">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        required
                        value={form.deadline}
                        onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                        className="w-full bg-white border border-[#DDE3E7] rounded-xl px-4 py-2.5 text-xs text-[#17324D] font-bold focus:outline-none focus:border-[#17324D] shadow-xs cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Automated Security & Verification Advisory */}
                <div className="p-4 bg-[#EAF5EF] rounded-2xl border border-[#287C5A]/30 flex items-start gap-3.5">
                  <ShieldCheck className="w-5 h-5 text-[#287C5A] flex-shrink-0 mt-0.5" />
                  <div className="space-y-1 text-xs">
                    <strong className="font-extrabold text-[#287C5A] block">
                      Automated Policy Engine Enforcement:
                    </strong>
                    <p className="text-[#17324D] leading-relaxed text-[11px]">
                      Upon publishing, applicants will undergo automated <strong>Aadhaar e-KYC biometric matching</strong> and <strong>Revenue Land Record verification</strong>. Field Inspectors will be auto-assigned via the round-robin scrutiny queue.
                    </p>
                  </div>
                </div>

                {/* Quick Summary of New Scheme */}
                <div className="p-4 rounded-2xl bg-white border border-[#DDE3E7] space-y-2">
                  <span className="text-[11px] font-bold text-[#526270] uppercase tracking-wider block">
                    Scheme Configuration Summary
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div><span className="text-[#7C8992]">Title:</span> <p className="font-bold text-[#17324D] truncate">{form.title}</p></div>
                    <div><span className="text-[#7C8992]">Category:</span> <p className="font-bold text-[#D97706]">{form.category}</p></div>
                    <div><span className="text-[#7C8992]">Max Single Grant:</span> <p className="font-bold text-[#287C5A]">₹{form.maxAmount?.toLocaleString('en-IN')}</p></div>
                    <div><span className="text-[#7C8992]">Total Fund:</span> <p className="font-bold text-[#17324D]">₹{(form.totalFund / 10000000).toFixed(2)} Cr</p></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stepper Navigation Footer Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-[#DDE3E7]">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-5 py-2.5 rounded-xl bg-[#F8FAFC] hover:bg-[#EBF2F7] border border-[#DDE3E7] text-[#526270] hover:text-[#17324D] font-bold text-xs flex items-center gap-2 transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-[#F8FAFC] hover:bg-[#EBF2F7] border border-[#DDE3E7] text-[#526270] hover:text-[#17324D] font-bold text-xs transition cursor-pointer"
              >
                Cancel
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-[#17324D] hover:bg-[#0E2438] text-white font-bold text-xs flex items-center gap-2 shadow-xs transition cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4 text-[#D97706]" />
              </button>
            ) : (
              <button
                type="submit"
                className="px-7 py-2.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-extrabold text-xs flex items-center gap-2 shadow-md transition cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Publish Scheme to Public Portal</span>
              </button>
            )}
          </div>
        </form>

      </div>
    </div>
  );
};
