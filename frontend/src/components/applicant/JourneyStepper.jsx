import React from 'react';
import { CheckCircle2, Clock, Award, IndianRupee, FileCheck, Building2 } from 'lucide-react';

export const JourneyStepper = ({ status, timeline = [], districtEndorsed = false }) => {
  const steps = [
    { key: 'SUBMITTED', label: '1. SUBMITTED', icon: Clock, desc: 'Application received' },
    { key: 'UNDER_VERIFICATION', label: '2. FIELD SCRUTINY', icon: FileCheck, desc: 'Field inspector scrutiny' },
    { key: 'DISTRICT_VERIFICATION', label: '3. DISTRICT VERIFICATION', icon: Building2, desc: 'District Officer verification & quota' },
    { key: 'APPROVED', label: '4. SANCTION', icon: Award, desc: 'Sanction officer sign-off' },
    { key: 'PAID', label: '5. DISBURSED', icon: IndianRupee, desc: 'Direct Bank Transfer' }
  ];

  const normStatus = (status === 'DISBURSED' ? 'PAID' : status) || 'SUBMITTED';

  const isEndorsed = Boolean(
    districtEndorsed || 
    (timeline && timeline.some(t => t.status === 'DISTRICT_ENDORSED')) ||
    normStatus === 'APPROVED' || 
    normStatus === 'PAID'
  );

  const getStepStatus = (stepKey) => {
    const order = ['SUBMITTED', 'UNDER_VERIFICATION', 'DISTRICT_VERIFICATION', 'APPROVED', 'PAID'];
    const stepIndex = order.indexOf(stepKey);

    if (normStatus === 'REJECTED') {
      if (stepIndex === 0) return 'completed';
      if (stepIndex === 1) return 'rejected';
      return 'upcoming';
    }
    if (normStatus === 'PAID') return 'completed';
    if (normStatus === 'APPROVED') {
      if (stepIndex <= 3) return 'completed';
      if (stepIndex === 4) return 'current';
      return 'upcoming';
    }
    if (normStatus === 'DISTRICT_VERIFICATION' || normStatus === 'DISTRICT_REVIEW') {
      if (stepIndex <= 1) return 'completed';
      if (stepIndex === 2) return 'current';
      return 'upcoming';
    }
    if (normStatus === 'VERIFIED') {
      if (isEndorsed) {
        if (stepIndex <= 2) return 'completed';
        if (stepIndex === 3) return 'current';
        return 'upcoming';
      } else {
        if (stepIndex <= 1) return 'completed';
        if (stepIndex === 2) return 'current';
        return 'upcoming';
      }
    }
    // SUBMITTED or UNDER_VERIFICATION:
    if (stepIndex === 0) return 'completed';
    if (stepIndex === 1) return 'current';
    return 'upcoming';
  };

  const getProgressPercentage = () => {
    if (normStatus === 'PAID') return 100;
    if (normStatus === 'REJECTED') return 20;
    if (normStatus === 'APPROVED') return 80;
    if (normStatus === 'VERIFIED') return isEndorsed ? 65 : 45;
    if (normStatus === 'DISTRICT_VERIFICATION' || normStatus === 'DISTRICT_REVIEW') return 45;
    return 25;
  };

  const progressPct = getProgressPercentage();
  const isFullyDisbursed = progressPct === 100;

  return (
    <div className="w-full py-4 animate-fade-in">
      {/* Step Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {steps.map((step) => {
          const state = getStepStatus(step.key);

          const cardStyles = {
            completed: 'bg-[#EAF5EF] border-[#287C5A] text-[#17324D] hover:border-[#287C5A] shadow-2xs',
            current: 'bg-[#FFF3E0] border-[#D97706] text-[#17324D] shadow-xs ring-2 ring-[#D97706]/40 scale-[1.02]',
            rejected: 'bg-[#FDF2F2] border-[#B84040] text-[#17324D]',
            upcoming: 'bg-[#FFFFFF] border-[#DDE3E7] text-[#7C8992]'
          };

          const badgeStyles = {
            completed: 'bg-[#287C5A] text-white',
            current: 'bg-[#D97706] text-white pulse-saffron',
            rejected: 'bg-[#B84040] text-white',
            upcoming: 'bg-[#DDE3E7] text-[#526270]'
          };

          return (
            <div
              key={step.key}
              className={`p-3.5 rounded-xl border transition-all duration-300 transform hover:-translate-y-0.5 ${cardStyles[state]}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-extrabold text-xs transition-transform ${badgeStyles[state]}`}>
                  {state === 'completed' ? '✓' : state === 'current' ? '●' : state === 'rejected' ? '✕' : '○'}
                </div>
                <span className="text-[10px] font-bold tracking-wider uppercase font-mono">
                  {state === 'completed' ? 'Done' : state === 'current' ? 'In Progress' : state === 'rejected' ? 'Rejected' : 'Upcoming'}
                </span>
              </div>
              <div className="text-xs font-bold text-[#17324D] leading-tight font-heading">{step.label}</div>
              <div className="text-[10px] text-[#526270] mt-1 leading-snug">{step.desc}</div>
            </div>
          );
        })}
      </div>

      {/* Structural Progress Bar (100% Solid Green when Disbursed) */}
      <div className="mt-5 pt-3 border-t border-[#DDE3E7]">
        <div className="flex justify-between items-center text-xs font-bold mb-2">
          <span className="text-[#17324D] font-heading uppercase tracking-wider flex items-center gap-2">
            <span>Application Journey Progress</span>
            {isFullyDisbursed ? (
              <span className="w-2.5 h-2.5 rounded-full bg-[#287C5A] inline-block shadow-xs"></span>
            ) : (
              <span className="w-2 h-2 rounded-full bg-[#D97706] inline-block animate-ping"></span>
            )}
          </span>
          <span className={`font-mono text-sm font-extrabold ${isFullyDisbursed ? 'text-[#287C5A]' : 'text-[#D97706]'}`}>
            {progressPct}% {isFullyDisbursed ? 'Completed' : ''}
          </span>
        </div>
        <div className="w-full h-3 bg-[#DDE3E7] rounded-full overflow-hidden flex p-0.5 shadow-inner">
          {isFullyDisbursed ? (
            <div
              className="h-full bg-[#287C5A] rounded-full transition-all duration-700 ease-out shadow-xs"
              style={{ width: '100%' }}
            />
          ) : (
            <>
              <div
                className="h-full bg-[#287C5A] rounded-l-full transition-all duration-700 ease-out"
                style={{ width: `${Math.max(0, progressPct - 20)}%` }}
              />
              <div
                className="h-full bg-[#D97706] rounded-r-full transition-all duration-700 ease-out pulse-saffron"
                style={{ width: `${Math.min(20, progressPct)}%` }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
