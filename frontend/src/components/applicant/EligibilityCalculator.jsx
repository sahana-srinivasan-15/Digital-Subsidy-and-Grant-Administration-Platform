import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, Shield } from 'lucide-react';

export const EligibilityCalculator = ({ scheme }) => {
  // Requirements 5, 6, 7:
  // All fields must start EMPTY (no pre-filled defaults like 32 or 320000).
  const [age, setAge] = useState('');
  const [income, setIncome] = useState('');
  const [state, setState] = useState('');
  const [category, setCategory] = useState('');

  const minAge = scheme?.minAge || 18;
  const maxAge = scheme?.maxAge || 65;
  const maxInc = scheme ? Number(scheme.maxIncome || 500000) : 500000;

  const hasProvidedInput = age !== '' && income !== '';
  const numAge = Number(age);
  const numIncome = Number(income);

  const isAgeValid = !isNaN(numAge) && numAge >= 1 && numAge <= 120;
  const isIncomeValid = !isNaN(numIncome) && numIncome >= 0;

  const isEligible = hasProvidedInput && isAgeValid && isIncomeValid &&
    numAge >= minAge && numAge <= maxAge && numIncome <= maxInc;

  return (
    <div className="gov-card p-6 bg-white border border-[#DDE3E7] rounded-xl shadow-xs relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-[#17324D] font-bold text-xs uppercase tracking-wider font-heading">
          <Shield className="w-4 h-4 text-[#D97706]" />
          <span>Smart Eligibility Screener</span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-[#EAF5EF] text-[#287C5A] border border-[#287C5A]/30">
          Official Rule Engine
        </span>
      </div>

      <h3 className="text-base font-bold text-[#17324D] mb-1 font-heading">
        Check Your Eligibility for {scheme ? scheme.title : 'Government Assistance'}
      </h3>
      <p className="text-xs text-[#526270] mb-4">
        Enter your actual age and annual income below to verify preliminary eligibility criteria before submitting your application.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-5">
        <div>
          <label className="text-[#17324D] font-bold block mb-1">
            Age (Years) <span className="text-[#B84040]">*</span>
          </label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Enter your age"
            min="1"
            max="120"
            className="w-full bg-[#F8FAFC] border border-[#DDE3E7] rounded-lg px-3 py-2 text-[#17324D] placeholder-[#7C8992] focus:border-[#17324D] focus:outline-none shadow-xs text-xs font-medium"
          />
          {age !== '' && !isAgeValid && (
            <span className="text-[11px] text-[#B84040] mt-1 block">Please enter a valid age between 1 and 120.</span>
          )}
        </div>

        <div>
          <label className="text-[#17324D] font-bold block mb-1">
            Annual Income (₹) <span className="text-[#B84040]">*</span>
          </label>
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            placeholder="Enter your annual income"
            min="0"
            className="w-full bg-[#F8FAFC] border border-[#DDE3E7] rounded-lg px-3 py-2 text-[#17324D] placeholder-[#7C8992] focus:border-[#17324D] focus:outline-none shadow-xs text-xs font-medium"
          />
          {income !== '' && !isIncomeValid && (
            <span className="text-[11px] text-[#B84040] mt-1 block">Please enter a valid positive income amount.</span>
          )}
        </div>

        <div>
          <label className="text-[#17324D] font-bold block mb-1">State of Residence</label>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full bg-[#F8FAFC] border border-[#DDE3E7] rounded-lg px-3 py-2 text-[#17324D] focus:border-[#17324D] focus:outline-none shadow-xs text-xs font-medium"
          >
            <option value="">Select your state (Optional)</option>
            <option value="Telangana">Telangana</option>
            <option value="Andhra Pradesh">Andhra Pradesh</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Other">Other States</option>
          </select>
        </div>

        <div>
          <label className="text-[#17324D] font-bold block mb-1">Social Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-[#F8FAFC] border border-[#DDE3E7] rounded-lg px-3 py-2 text-[#17324D] focus:border-[#17324D] focus:outline-none shadow-xs text-xs font-medium"
          >
            <option value="">Select social category (Optional)</option>
            <option value="GENERAL">General / Unreserved</option>
            <option value="OBC">OBC</option>
            <option value="SC_ST">SC / ST</option>
            <option value="EWS">EWS</option>
          </select>
        </div>
      </div>

      {/* Result Box: Requirements 3 & 7 - Informative only, strictly NO duplicate Apply Now button */}
      {!hasProvidedInput ? (
        <div className="p-3.5 rounded-xl border border-[#DDE3E7] bg-[#F3F6F8] text-[#526270] text-xs flex items-center gap-2.5">
          <Shield className="w-4 h-4 text-[#7C8992] flex-shrink-0" />
          <span>Enter your age and annual income above to evaluate your preliminary eligibility.</span>
        </div>
      ) : isEligible ? (
        <div className="p-4 rounded-xl border border-[#287C5A]/30 bg-[#EAF5EF] text-[#17324D] shadow-2xs animate-fade-in">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#287C5A] mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-xs font-bold text-[#287C5A] font-heading">
                ✓ You are eligible
              </div>
              <p className="text-xs mt-1 text-[#526270] leading-relaxed">
                Based on the information you entered, you satisfy the available criteria.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl border border-[#B84040]/30 bg-[#FDF2F2] text-[#17324D] shadow-2xs animate-fade-in">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#B84040] mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-xs font-bold text-[#B84040] font-heading">
                Eligibility Criteria Not Met
              </div>
              <p className="text-xs mt-1 text-[#526270] leading-relaxed">
                Based on the information provided, you do not currently meet the available eligibility criteria.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
