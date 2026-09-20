import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Download, 
  MessageSquare,
  RotateCw,
  ArrowLeft,
  Shield,
  Landmark,
  User,
  IndianRupee,
  FileCheck2,
  Calendar,
  Building2,
  Phone
} from 'lucide-react';
import { downloadAcknowledgementPdf } from '../../utils/exportUtils';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/Badge';

export const ApplicationStatusTracker = ({ 
  application, 
  onClose, 
  onFileGrievance, 
  onReapply,
  isModal = false 
}) => {
  const { showToast } = useApp() || {};
  if (!application) return null;

  const stages = [
    { key: 'SUBMITTED', label: 'Application Submitted', desc: 'Application received and registered in national DBT registry.' },
    { key: 'UNDER_VERIFICATION', label: 'Under Review & Scrutiny', desc: 'Authorized field officer conducting document scrutiny & criteria verification.' },
    { key: 'VERIFIED', label: 'Documents Verified', desc: 'All certificates, land records & applicant credentials audited and approved.' },
    { key: 'APPROVED', label: 'Sanction Approved', desc: 'Competent Sanctioning Directorate authorized grant release.' },
    { key: 'PAID', label: 'DBT Disbursed', desc: 'Benefit amount credited directly to beneficiary bank account via PFMS gateway.' }
  ];

  const normStatus = (application.status === 'DISBURSED' ? 'PAID' : application.status) || 'SUBMITTED';
  const isRejected = normStatus === 'REJECTED';

  // Determine accurate stage state: 'completed' | 'current' | 'rejected' | 'pending'
  const getStageState = (stKey, idx) => {
    if (isRejected) {
      if (idx === 0) return 'completed';
      if (idx === 1) return 'rejected';
      return 'pending';
    }

    if (normStatus === 'PAID') {
      return 'completed';
    }

    if (normStatus === 'APPROVED') {
      if (idx <= 3) return 'completed';
      if (idx === 4) return 'current';
      return 'pending';
    }

    if (normStatus === 'VERIFIED') {
      if (idx <= 2) return 'completed';
      if (idx === 3) return 'current';
      return 'pending';
    }

    if (idx === 0) return 'completed';
    if (idx === 1) return 'current';
    return 'pending';
  };

  const getStageDetails = (stKey, idx, state) => {
    let timelineEntry = null;
    if (Array.isArray(application.timeline)) {
      timelineEntry = application.timeline.find(t => 
        t.status === stKey || 
        (stKey === 'PAID' && (t.status === 'DISBURSED' || t.status === 'PAID')) ||
        (stKey === 'UNDER_VERIFICATION' && (t.status === 'IN_REVIEW' || t.status === 'UNDER_VERIFICATION'))
      );
    }

    let dateStr = timelineEntry?.date || null;
    let actor = timelineEntry?.by || null;
    let remarks = timelineEntry?.title || timelineEntry?.remarks || null;

    if (!dateStr) {
      if (stKey === 'SUBMITTED' && application.submittedDate) {
        dateStr = new Date(application.submittedDate).toLocaleString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        actor = application.applicantName ? `${application.applicantName} (Citizen)` : 'Citizen Applicant';
        remarks = remarks || 'Digital application submitted with verified Aadhaar credentials.';
      } else if (stKey === 'UNDER_VERIFICATION') {
        if (state === 'completed') {
          dateStr = application.verificationDate 
            ? new Date(application.verificationDate).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
            : 'Scrutiny Completed';
        } else if (state === 'current') {
          dateStr = 'Active Review in Progress';
        }
        actor = application.verifierName || 'Field Scrutiny Officer';
        remarks = application.verifierRemarks || remarks || 'Conducting scrutiny of uploaded certificates & income criteria.';
      } else if (stKey === 'VERIFIED') {
        if (state === 'completed' && application.verificationDate) {
          dateStr = new Date(application.verificationDate).toLocaleString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
        }
        actor = application.verifierName || 'Field Scrutiny Officer';
        remarks = application.verifierRemarks || remarks || 'All submitted documents audited & passed eligibility criteria.';
      } else if (stKey === 'APPROVED') {
        if (state === 'completed' && application.approvalDate) {
          dateStr = new Date(application.approvalDate).toLocaleString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
        } else if (state === 'current') {
          dateStr = 'Under Sanction Review';
        }
        actor = 'Sanctioning Directorate / Department Head';
        remarks = application.authorityRemarks || remarks || (state === 'completed' ? 'Formal sanction warrant authorized for full grant amount.' : 'Awaiting sanction warrant authorization.');
      } else if (stKey === 'PAID') {
        if (state === 'completed' && application.paymentDate) {
          dateStr = new Date(application.paymentDate).toLocaleString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
        } else if (state === 'current') {
          dateStr = 'Queued for Bank Disbursal';
        }
        actor = 'PFMS / Reserve Bank DBT Gateway';
        remarks = application.transactionId 
          ? `PFMS Txn Reference: ${application.transactionId}` 
          : (remarks || 'Disbursement batch processed for direct account credit.');
      }
    }

    return { dateStr, actor, remarks };
  };

  const currentStageIndex = stages.findIndex((s, i) => getStageState(s.key, i) === 'current');
  const activeStageDisplay = normStatus === 'PAID' 
    ? 'All 5 Stages Completed' 
    : isRejected 
    ? 'Scrutiny Rejected' 
    : `Stage ${currentStageIndex + 1} of 5: ${stages[currentStageIndex]?.label || 'Under Evaluation'}`;

  const downloadAcknowledgement = () => {
    try {
      const fileName = downloadAcknowledgementPdf(application);
      showToast?.(`Downloaded Official Acknowledgement Slip (${fileName})!`, 'success');
    } catch (err) {
      console.error('[ApplicationStatusTracker] Failed to generate PDF acknowledgement:', err);
      const receiptContent = `
=========================================================
   DIRECT BENEFIT TRANSFER (DBT) ACKNOWLEDGEMENT SLIP
   Digital Subsidy & Grant Administration Platform (DSGA)
=========================================================
Application ID      : ${application.id}
Date of Submission  : ${new Date(application.submittedDate).toLocaleString()}
Applicant Name      : ${application.applicantName}
Aadhaar Linked Phone: ${application.applicantPhone || '9876543210'}
State / District    : ${application.applicantState || 'Telangana'} / ${application.applicantDistrict || 'Medak'}
Scheme Applied      : ${application.schemeTitle}
Grant Requested     : ₹${Number(application.requestedAmount || 0).toLocaleString('en-IN')}
Sanctioned Amount   : ${application.approvedAmount ? `₹${Number(application.approvedAmount).toLocaleString('en-IN')}` : 'Under Evaluation'}
Application Status  : ${application.status}
Verification Officer: ${application.verifierName || 'Anil Sharma (Field Inspector)'}
Officer Remarks     : ${application.verifierRemarks || 'Under routine scrutiny.'}
PFMS Txn Reference  : ${application.transactionId || 'Pending disbursement generation'}
Bank Account        : ${application.bankDetails?.bankName || 'State Bank of India'} (Acc: ${application.bankDetails?.accountNumber || '•••• 4589'})
IFSC Code           : ${application.bankDetails?.ifsc || 'SBIN0001234'}
=========================================================
Official Portal: https://dsga.gov.in | Toll-Free: 1800-11-2026
      `;

      const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Acknowledgement_${application.id}.txt`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const mainContent = (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Breadcrumb & Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#DDE3E7]">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#17324D] hover:text-[#D97706] bg-white border border-[#DDE3E7] hover:border-[#D97706]/40 px-3.5 py-2 rounded-xl shadow-xs transition w-fit cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#D97706]" />
          <span>← Back to Applications List</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-[#526270]">
          <span>Beneficiary Portal</span>
          <span>/</span>
          <span>Track Application</span>
          <span>/</span>
          <span className="font-mono font-bold text-[#17324D] bg-[#F3F6F8] px-2 py-0.5 rounded border border-[#DDE3E7]">
            {application.id}
          </span>
        </div>
      </div>

      {/* Official Government Hero Header */}
      <div className="bg-[#17324D] p-6 sm:p-8 rounded-2xl text-white shadow-card border-t-4 border-[#D97706] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0E2438] border border-[#D97706]/40 text-[#FFF3E0] text-xs font-semibold">
            <Shield className="w-3.5 h-3.5 text-[#D97706]" />
            <span>National DBT Welfare Gateway • Live Application Tracker</span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-heading">
            Application Status & Lifecycle Timeline
          </h1>
          
          <p className="text-xs sm:text-sm text-[#DDE3E7] max-w-2xl leading-relaxed">
            Official tracking record for <strong className="text-white">{application.schemeTitle}</strong>. 
            Review every stage of field scrutiny, sanction authorization, and PFMS direct benefit disbursal.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-[#DDE3E7]">
            <span className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#D97706]" />
              <span>{application.department || 'Department of Welfare & Benefit Administration'}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#D97706]" />
              <span>Submitted: {new Date(application.submittedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </span>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex flex-wrap items-center gap-3 z-10 flex-shrink-0">
          <button
            type="button"
            onClick={downloadAcknowledgement}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#F3F6F8] text-[#17324D] font-bold text-xs shadow-md transition inline-flex items-center gap-2 border border-white cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#D97706]" />
            <span>Download Slip (PDF)</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs shadow-md transition inline-flex items-center gap-2 uppercase tracking-wider font-heading cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Exit Timeline</span>
          </button>
        </div>
      </div>

      {/* 4-Card Quick Metrics Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-box">
          <span className="text-[#526270] text-[10px] uppercase font-semibold block mb-1">Tracking ID</span>
          <span className="text-base sm:text-lg font-extrabold text-[#17324D] font-mono block truncate">{application.id}</span>
          <span className="text-[11px] text-[#287C5A] font-bold mt-1 block">Registered in DBT Registry</span>
        </div>

        <div className="stat-box">
          <span className="text-[#526270] text-[10px] uppercase font-semibold block mb-1">Grant Benefit Amount</span>
          <span className="text-base sm:text-lg font-extrabold text-[#287C5A] font-heading block">
            ₹{Number(application.requestedAmount || 0).toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-[#526270] mt-1 block">
            {application.approvedAmount ? `Sanctioned: ₹${Number(application.approvedAmount).toLocaleString('en-IN')}` : 'Direct Transfer Pool'}
          </span>
        </div>

        <div className="stat-box">
          <span className="text-[#526270] text-[10px] uppercase font-semibold block mb-1">Current Lifecycle Status</span>
          <div className="mt-1">
            <StatusBadge status={application.status} />
          </div>
          <span className="text-[11px] text-[#7C8992] mt-1 block font-medium">
            {activeStageDisplay}
          </span>
        </div>

        <div className="stat-box">
          <span className="text-[#526270] text-[10px] uppercase font-semibold block mb-1">Disbursal Account</span>
          <span className="text-base sm:text-lg font-extrabold text-[#17324D] font-heading block truncate">
            {application.bankDetails?.bankName || 'State Bank of India'}
          </span>
          <span className="text-[11px] font-mono text-[#526270] mt-1 block">
            {application.bankDetails?.accountNumber 
              ? `A/C •••• ${application.bankDetails.accountNumber.slice(-4)}` 
              : 'Aadhaar Payment Bridge (APB)'}
          </span>
        </div>
      </div>

      {/* Live Status Callout Banner */}
      <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
        isRejected 
          ? 'bg-[#FDF2F2] border-[#F87171]/40 text-[#991B1B]'
          : application.status === 'PAID'
          ? 'bg-[#EAF5EF] border-[#287C5A]/30 text-[#1E6045]'
          : 'bg-[#F0F7FD] border-[#17324D]/20 text-[#17324D]'
      }`}>
        <div className="flex items-start gap-3.5">
          {isRejected ? (
            <AlertCircle className="w-6 h-6 text-[#DC2626] mt-0.5 shrink-0" />
          ) : application.status === 'PAID' ? (
            <CheckCircle2 className="w-6 h-6 text-[#287C5A] mt-0.5 shrink-0" />
          ) : (
            <Clock className="w-6 h-6 text-[#D97706] mt-0.5 shrink-0 animate-pulse" />
          )}

          <div>
            <div className="text-sm sm:text-base font-extrabold font-heading">
              {isRejected 
                ? 'Application Scrutiny Disapproved'
                : application.status === 'PAID'
                ? 'Grant Successfully Disbursed to Bank Account via PFMS!'
                : application.status === 'APPROVED'
                ? 'Sanction Order Authorized — Queued for Direct Bank Transfer (DBT)'
                : application.status === 'VERIFIED'
                ? 'Documents & Certificates Verified — Under Sanction Directorate Review'
                : 'Application Under Routine Field Verification & Scrutiny'}
            </div>
            
            <p className="text-xs mt-1.5 leading-relaxed opacity-95 max-w-3xl">
              {isRejected
                ? application.verifierRemarks || 'Applicant credentials did not fulfill the statutory scheme requirements. You can appeal via Grievance Redressal or submit a fresh revised application.'
                : application.status === 'PAID'
                ? `Direct Benefit Transfer of ₹${Number(application.approvedAmount || application.requestedAmount || 0).toLocaleString('en-IN')} has been completed to ${application.bankDetails?.bankName || 'Beneficiary Bank Account'}. Transaction reference: ${application.transactionId || 'PFMS-DBT-SUCCESS'}.`
                : application.verifierRemarks || 'Field verification officer is scrutinizing uploaded identity, caste, land, and income records against official state registry databases.'}
            </p>
          </div>
        </div>

        <div className="flex-shrink-0 flex items-center gap-2">
          {isRejected && onFileGrievance && (
            <button
              onClick={() => onFileGrievance(application)}
              className="px-3.5 py-2 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Raise Appeal</span>
            </button>
          )}

          {(application.status === 'PAID' || application.status === 'DISBURSED' || isRejected) && onReapply && (
            <button
              onClick={() => onReapply(application)}
              className="px-3.5 py-2 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCw className="w-4 h-4" />
              <span>{isRejected ? 'Re-Apply' : 'Renew Grant'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (8 cols): The 5-Stage Lifecycle Stepper */}
        <div className="lg:col-span-8 gov-card p-6 sm:p-8 bg-white rounded-2xl border border-[#DDE3E7] shadow-card space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#DDE3E7]">
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full bg-[#287C5A] animate-pulse"></div>
              <div>
                <h3 className="text-base font-extrabold text-[#17324D] font-heading">
                  Official 5-Stage Application Lifecycle
                </h3>
                <p className="text-xs text-[#526270]">
                  Sequential government scrutiny stages and real-time audit ledger
                </p>
              </div>
            </div>

            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#F8FAFC] border border-[#DDE3E7] text-[#17324D] font-mono">
              {activeStageDisplay}
            </span>
          </div>

          {/* Stepper Steps List */}
          <div className="space-y-0 relative pt-2">
            {stages.map((st, idx) => {
              const state = getStageState(st.key, idx);
              const isLast = idx === stages.length - 1;
              const isLineGreen = state === 'completed';
              const stageInfo = getStageDetails(st.key, idx, state);

              return (
                <div key={st.key} className="flex items-start group">
                  {/* Status / Icon Column with Continuous Centered Connecting Line */}
                  <div className="flex flex-col items-center flex-shrink-0 w-10 sm:w-12 self-stretch relative">
                    
                    {/* Stage Circle Node */}
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-extrabold text-xs shrink-0 z-10 transition-all ${
                        state === 'completed'
                          ? 'bg-[#287C5A] text-white shadow-sm ring-4 ring-[#EAF5EF]'
                          : state === 'rejected'
                          ? 'bg-[#DC2626] text-white shadow-sm ring-4 ring-[#FDF2F2]'
                          : state === 'current'
                          ? 'bg-[#D97706] text-white ring-4 ring-[#FFF3E0] shadow-md'
                          : 'bg-white border-2 border-[#DDE3E7] text-[#7C8992]'
                      }`}
                    >
                      {state === 'completed' ? (
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      ) : state === 'rejected' ? (
                        <AlertCircle className="w-5 h-5 text-white" />
                      ) : state === 'current' ? (
                        <Clock className="w-5 h-5 text-white animate-pulse" />
                      ) : (
                        <span className="text-xs font-bold font-mono">{idx + 1}</span>
                      )}
                    </div>

                    {/* Connecting Vertical Bar */}
                    {!isLast && (
                      <div className="w-0.5 flex-1 min-h-[48px] sm:min-h-[56px] bg-[#DDE3E7] relative my-1.5">
                        {isLineGreen && (
                          <div className="absolute inset-0 bg-[#287C5A] transition-all duration-500" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Stage Details Content */}
                  <div className={`flex-1 min-w-0 pl-4 sm:pl-6 ${!isLast ? 'pb-8 sm:pb-9' : 'pb-2'}`}>
                    
                    {/* Header: Stage Label & Status Pill */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <h4 className={`text-sm sm:text-base font-bold leading-snug font-heading ${
                        state === 'completed'
                          ? 'text-[#1E6045]'
                          : state === 'rejected'
                          ? 'text-[#991B1B]'
                          : state === 'current'
                          ? 'text-[#17324D] font-extrabold'
                          : 'text-[#526270]'
                      }`}>
                        {st.label}
                      </h4>

                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0 ${
                        state === 'completed'
                          ? 'bg-[#EAF5EF] text-[#287C5A] border border-[#287C5A]/30'
                          : state === 'rejected'
                          ? 'bg-[#FDF2F2] text-[#DC2626] border border-[#DC2626]/30'
                          : state === 'current'
                          ? 'bg-[#FFF3E0] text-[#D97706] border border-[#D97706]/40 font-extrabold'
                          : 'bg-[#F3F6F8] text-[#7C8992] border border-[#DDE3E7]'
                      }`}>
                        {state === 'completed' ? '✓ Completed' : state === 'rejected' ? '✕ Rejected' : state === 'current' ? '● In Progress' : '○ Pending'}
                      </span>
                    </div>

                    {/* Timestamp & Verification Authority */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#526270] mb-2">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#7C8992] shrink-0" />
                        <span className={`font-mono text-xs ${stageInfo.dateStr ? 'text-[#17324D] font-medium' : 'text-[#7C8992] italic'}`}>
                          {stageInfo.dateStr || 'Pending previous stage'}
                        </span>
                      </div>

                      {stageInfo.actor && (
                        <>
                          <span className="text-[#DDE3E7]">•</span>
                          <span className="text-[#526270] text-xs font-medium">
                            Authority: <strong className="text-[#17324D]">{stageInfo.actor}</strong>
                          </span>
                        </>
                      )}
                    </div>

                    {/* Remarks Card */}
                    <div className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                      state === 'completed'
                        ? 'bg-[#F8FAFC] border-[#DDE3E7] text-[#17324D]'
                        : state === 'current'
                        ? 'bg-[#FFFDF9] border-[#D97706]/30 text-[#17324D] shadow-xs'
                        : state === 'rejected'
                        ? 'bg-[#FFF5F5] border-[#F87171]/40 text-[#991B1B]'
                        : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#7C8992]'
                    }`}>
                      {stageInfo.remarks || st.desc}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right Column (4 cols): Beneficiary, Bank Account & Audit Dossier */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Beneficiary Profile Card */}
          <div className="gov-card p-6 bg-white rounded-2xl border border-[#DDE3E7] shadow-card space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#DDE3E7]">
              <User className="w-4 h-4 text-[#D97706]" />
              <h3 className="text-sm font-bold text-[#17324D] font-heading">
                Beneficiary Profile
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[#526270] text-[10px] uppercase font-semibold block">Applicant Name</span>
                <span className="text-[#17324D] font-bold text-sm">{application.applicantName || 'Citizen Beneficiary'}</span>
              </div>

              <div>
                <span className="text-[#526270] text-[10px] uppercase font-semibold block">Contact Number</span>
                <span className="text-[#17324D] font-mono">{application.applicantPhone || 'Aadhaar Verified'}</span>
              </div>

              <div>
                <span className="text-[#526270] text-[10px] uppercase font-semibold block">Domicile & District</span>
                <span className="text-[#17324D]">{application.applicantDistrict || 'Medak'}, {application.applicantState || 'Telangana'}</span>
              </div>

              <div>
                <span className="text-[#526270] text-[10px] uppercase font-semibold block">Identity Credentials</span>
                <span className="inline-flex items-center gap-1 text-[11px] text-[#287C5A] font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Aadhaar e-KYC Verified
                </span>
              </div>
            </div>
          </div>

          {/* Direct Bank Transfer (DBT) Dossier */}
          <div className="gov-card p-6 bg-white rounded-2xl border border-[#DDE3E7] shadow-card space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#DDE3E7]">
              <Landmark className="w-4 h-4 text-[#D97706]" />
              <h3 className="text-sm font-bold text-[#17324D] font-heading">
                DBT Bank Account Details
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[#526270] text-[10px] uppercase font-semibold block">Disbursement Bank</span>
                <span className="text-[#17324D] font-bold text-sm">
                  {application.bankDetails?.bankName || 'State Bank of India'}
                </span>
              </div>

              <div>
                <span className="text-[#526270] text-[10px] uppercase font-semibold block">Account Number</span>
                <span className="text-[#17324D] font-mono font-bold">
                  {application.bankDetails?.accountNumber ? `•••• •••• •••• ${application.bankDetails.accountNumber.slice(-4)}` : '•••• •••• 4589'}
                </span>
              </div>

              <div>
                <span className="text-[#526270] text-[10px] uppercase font-semibold block">IFSC Code</span>
                <span className="text-[#17324D] font-mono">
                  {application.bankDetails?.ifsc || 'SBIN0001234'}
                </span>
              </div>

              <div>
                <span className="text-[#526270] text-[10px] uppercase font-semibold block">PFMS Disbursal Reference</span>
                <span className="text-[#17324D] font-mono text-[11px] break-all">
                  {application.transactionId || 'PFMS-BATCH-TXN-QUEUED'}
                </span>
              </div>
            </div>
          </div>

          {/* Support & Grievance Contact */}
          <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#DDE3E7] space-y-3 text-xs">
            <div className="flex items-center gap-2 text-[#17324D] font-bold font-heading">
              <Phone className="w-4 h-4 text-[#D97706]" />
              <span>Need Assistance with this Application?</span>
            </div>
            
            <p className="text-[#526270] leading-relaxed text-[11px]">
              If you have queries regarding scrutiny delays, documents verification, or bank transfer errors, our citizen helpline is available 24/7.
            </p>

            <div className="pt-1 text-[11px] space-y-1">
              <div className="text-[#17324D]">Toll-Free Helpline: <strong>1800-11-2026</strong></div>
              <div className="text-[#17324D]">Support Email: <strong>helpdesk@dsga.gov.in</strong></div>
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Sticky Action Toolbar */}
      <div className="gov-card p-4 sm:p-5 rounded-2xl border border-[#DDE3E7] bg-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <button
          type="button"
          onClick={onClose}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#F8FAFC] hover:bg-[#DDE3E7]/40 text-[#17324D] font-bold text-xs border border-[#DDE3E7] transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#17324D]" />
          <span>Return to Applications</span>
        </button>

        <div className="flex flex-wrap items-center justify-end gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={downloadAcknowledgement}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white hover:bg-[#F3F6F8] text-[#17324D] font-bold text-xs border border-[#DDE3E7] transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#D97706]" />
            <span>Download Official Acknowledgement</span>
          </button>

          {(application.status === 'PAID' || application.status === 'DISBURSED' || isRejected) && onReapply && (
            <button
              type="button"
              onClick={() => onReapply(application)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <RotateCw className="w-4 h-4" />
              <span>{isRejected ? 'Re-Apply' : 'Renew Application'}</span>
            </button>
          )}

          {isRejected && onFileGrievance && (
            <button
              type="button"
              onClick={() => onFileGrievance(application)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Raise Grievance Appeal</span>
            </button>
          )}
        </div>
      </div>

    </div>
  );

  // If modal mode requested, wrap in dialog backdrop
  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white rounded-3xl max-w-5xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-slide-up text-slate-800 my-8">
          {mainContent}
        </div>
      </div>
    );
  }

  // Proper Full Page View (Default)
  return mainContent;
};
