import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Info, 
  FileCheck, 
  ShieldCheck, 
  Award, 
  IndianRupee 
} from 'lucide-react';

/**
 * Processing Time Estimator Component
 * Requirement 8:
 * - Dynamically generated from relevant scheme/application data
 * - Application submitted date, scheme processing duration, estimated completion date
 * - Clearly labeled as estimates
 */
export const ProcessingTimeEstimator = ({ application, compact = false }) => {
  const { schemes } = useApp();
  if (!application) return null;

  const scheme = schemes?.find(s => s.id === application.schemeId || s.code === application.schemeCode);
  const durationLabel = scheme?.processingDays || '7–10 Working Days (Estimate)';

  // Parse max days from duration label
  const maxDaysMatch = durationLabel.match(/[–-]\s*(\d+)/) || durationLabel.match(/(\d+)\s*Working/i);
  const maxProcessingDays = maxDaysMatch ? parseInt(maxDaysMatch[1], 10) : 10;

  // Calculate dynamic estimated completion date
  const submittedDateObj = application.submittedDate ? new Date(application.submittedDate) : new Date();
  const estimatedCompletionDateObj = new Date(submittedDateObj.getTime() + maxProcessingDays * 24 * 60 * 60 * 1000);
  const formattedSubmissionDate = submittedDateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const formattedEstimatedCompletionDate = estimatedCompletionDateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const stages = [
    {
      id: 'SUBMITTED',
      name: 'Application Submitted',
      estimatedDuration: 'Immediate (Day 1)',
      icon: Clock,
      description: 'Digital application received and logged into national DBT scheme registry.'
    },
    {
      id: 'DOC_VERIFY',
      name: 'Document Verification',
      estimatedDuration: '1–2 Working Days',
      icon: FileCheck,
      description: 'Aadhaar e-KYC, income certificates, and submitted files undergoing OCR & desk check.'
    },
    {
      id: 'FIELD_VERIFY',
      name: 'Field Verification',
      estimatedDuration: '2–3 Working Days',
      icon: ShieldCheck,
      description: 'Designated field inspector verifies physical eligibility, location, and records.'
    },
    {
      id: 'SANCTION_REVIEW',
      name: 'Sanction Review',
      estimatedDuration: '1–2 Working Days',
      icon: Award,
      description: 'Directorate committee reviews inspector scrutiny score and budget allocation.'
    },
    {
      id: 'APPROVAL',
      name: 'Sanction Approval',
      estimatedDuration: '1–2 Working Days',
      icon: CheckCircle2,
      description: 'Competent Sanctioning Authority grants formal sanction order for eligible grant.'
    },
    {
      id: 'DISBURSEMENT',
      name: 'DBT Fund Disbursement',
      estimatedDuration: '1–2 Working Days',
      icon: IndianRupee,
      description: 'Direct Bank Transfer dispatched via Public Financial Management System (PFMS).'
    }
  ];

  // Determine active stage index (0 to 5) based on existing status
  const getActiveStageIndex = (status) => {
    switch (status) {
      case 'SUBMITTED':
        return 1;
      case 'UNDER_VERIFICATION':
        return 2;
      case 'VERIFIED':
        return 3;
      case 'APPROVED':
        return 5;
      case 'PAID':
      case 'DISBURSED':
        return 6;
      case 'REJECTED':
        return 2;
      default:
        return 1;
    }
  };

  const isRejected = application.status === 'REJECTED';
  const isPaid = application.status === 'PAID' || application.status === 'DISBURSED';
  const activeIdx = getActiveStageIndex(application.status);

  // Calculate elapsed days since submission
  const calculateDaysElapsed = () => {
    if (!application.submittedDate) return 0;
    const submitted = new Date(application.submittedDate);
    const now = new Date();
    const diffMs = now - submitted;
    return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  };

  const daysElapsed = calculateDaysElapsed();
  const isDelayed = daysElapsed > maxProcessingDays && !isPaid && !isRejected;

  if (compact) {
    return (
      <div className="p-3 rounded-xl bg-[#FFF8EE] border border-[#D97706]/40 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#D97706] flex-shrink-0" />
          <div>
            <div className="font-bold text-[#17324D]">
              Est. Processing Time: <span className="text-[#D97706]">{durationLabel}</span>
            </div>
            <p className="text-[11px] text-[#526270]">
              Est. Completion: <strong className="text-[#17324D]">{formattedEstimatedCompletionDate} (Estimate)</strong> • Stage: {stages[Math.min(activeIdx, 5)].name}
            </p>
          </div>
        </div>
        {isDelayed && (
          <span className="px-2.5 py-1 rounded bg-[#B84040]/10 border border-[#B84040]/30 text-[#B84040] text-[10px] font-bold">
            Longer than estimated
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Banner with Estimated Processing Time */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-[#FFF8EE] to-[#FFF3E0] border border-[#D97706]/40 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#D97706]/10 text-[#D97706] text-[10px] font-bold uppercase tracking-wider font-heading mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Processing Time Estimator</span>
            </div>
            <div className="text-base sm:text-lg font-extrabold text-[#17324D] font-heading flex flex-wrap items-center gap-2">
              <span>Estimated Processing:</span>
              <span className="text-[#D97706]">{durationLabel}</span>
            </div>
            <div className="text-xs text-[#526270] mt-1 space-y-0.5">
              <p>Submitted On: <strong className="text-[#17324D] font-mono">{formattedSubmissionDate}</strong></p>
              <p>Estimated Completion: <strong className="text-[#287C5A] font-mono">{formattedEstimatedCompletionDate} (Estimate)</strong></p>
            </div>
          </div>

          <div className="text-right sm:border-l sm:border-[#DDE3E7] sm:pl-4">
            <div className="text-[10px] font-semibold text-[#526270] uppercase">Elapsed Time</div>
            <div className="text-sm font-extrabold font-mono text-[#17324D]">
              {daysElapsed} {daysElapsed === 1 ? 'Day' : 'Days'} Elapsed
            </div>
            <div className="text-[10px] text-[#7C8992]">Since submission</div>
          </div>
        </div>

        {/* Delay Notice Banner */}
        {isDelayed && (
          <div className="mt-3.5 p-3 rounded-lg bg-[#FDF2F2] border border-[#B84040]/30 text-[#B84040] text-xs flex items-start gap-2.5 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-[#B84040] flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Processing is taking longer than the estimated timeframe.</span>
              <p className="text-[11px] text-[#526270] mt-0.5">
                Your file is queued with the verification officer for additional field scrutiny. You may file a query via Grievance Redressal if required.
              </p>
            </div>
          </div>
        )}

        {/* Mandatory Estimation Disclaimer */}
        <div className="mt-2.5 pt-2 border-t border-[#D97706]/20 flex items-center gap-1.5 text-[10px] text-[#7C8992]">
          <Info className="w-3 h-3 text-[#D97706] flex-shrink-0" />
          <span>Note: Timeframes are estimates based on typical departmental workflows. Actual processing times may vary depending on documentation and inspection schedules.</span>
        </div>
      </div>

      {/* Visual 6-Stage Timeline */}
      <div className="p-4 sm:p-5 rounded-xl bg-white border border-[#DDE3E7] shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#DDE3E7]">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#17324D] font-heading flex items-center gap-2">
            <span>Stage-Based Pipeline Duration</span>
          </h4>
          <span className="text-[11px] font-mono font-semibold text-[#526270]">
            {isPaid ? '6 of 6 Stages Complete' : `Stage ${Math.min(activeIdx + 1, 6)} of 6`}
          </span>
        </div>

        <div className="space-y-0 relative">
          {stages.map((stage, idx) => {
            const isCompleted = isPaid || idx < activeIdx;
            const isCurrent = !isPaid && !isRejected && idx === activeIdx;
            const isFailed = isRejected && idx === activeIdx;
            const isLast = idx === stages.length - 1;

            return (
              <div key={stage.id} className="flex items-start group">
                {/* Visual Indicator & Connected Line */}
                <div className="flex flex-col items-center flex-shrink-0 w-8 self-stretch relative">
                  {/* Status Circle */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 z-10 transition-all ${
                      isCompleted
                        ? 'bg-[#287C5A] text-white shadow-xs ring-4 ring-[#EAF5EF]'
                        : isFailed
                        ? 'bg-[#B84040] text-white shadow-xs ring-4 ring-[#FDF2F2]'
                        : isCurrent
                        ? 'bg-[#D97706] text-white ring-4 ring-[#FFF3E0] shadow-xs animate-pulse'
                        : 'bg-white border-2 border-[#DDE3E7] text-[#7C8992]'
                    }`}
                  >
                    {isCompleted ? (
                      '✓'
                    ) : isFailed ? (
                      '✕'
                    ) : isCurrent ? (
                      '●'
                    ) : (
                      '○'
                    )}
                  </div>

                  {/* Connecting Track Line */}
                  {!isLast && (
                    <div className="w-0.5 flex-1 min-h-[36px] bg-[#DDE3E7] relative my-1">
                      {isCompleted && (
                        <div className="absolute inset-0 bg-[#287C5A]" />
                      )}
                    </div>
                  )}
                </div>

                {/* Stage Info */}
                <div className={`flex-1 min-w-0 pl-3.5 ${!isLast ? 'pb-4 sm:pb-5' : 'pb-1'}`}>
                  <div className="flex flex-wrap items-center justify-between gap-1 mb-0.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs sm:text-sm font-bold font-heading ${
                        isCompleted
                          ? 'text-[#287C5A]'
                          : isFailed
                          ? 'text-[#B84040]'
                          : isCurrent
                          ? 'text-[#17324D]'
                          : 'text-[#526270]'
                      }`}>
                        {stage.name}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      isCompleted
                        ? 'bg-[#EAF5EF] text-[#287C5A] border border-[#287C5A]/30'
                        : isFailed
                        ? 'bg-[#FDF2F2] text-[#B84040] border border-[#B84040]/30'
                        : isCurrent
                        ? 'bg-[#FFF3E0] text-[#D97706] border border-[#D97706]/40 ring-1 ring-[#D97706]/30'
                        : 'bg-[#F8FAFC] text-[#7C8992] border border-[#DDE3E7]'
                    }`}>
                      {isCompleted
                        ? 'Completed'
                        : isFailed
                        ? 'Needs Clarification'
                        : isCurrent
                        ? 'Currently in progress'
                        : 'Upcoming'}
                    </span>
                  </div>

                  {/* Stage Duration & Description */}
                  <div className="flex items-center gap-2 text-[11px] text-[#526270] mb-0.5">
                    <span className="font-semibold text-[#17324D] font-mono">
                      Estimated: {stage.estimatedDuration}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#7C8992] leading-relaxed">
                    {stage.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
