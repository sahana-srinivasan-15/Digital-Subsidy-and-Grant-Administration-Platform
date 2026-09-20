import React, { useState } from 'react';
import { StatusBadge } from '../common/Badge';
import { ShieldCheck, CheckCircle2, XCircle, FileText, Eye, ArrowRight, X, Award, FileSearch } from 'lucide-react';

export const DualPaneInspectionDesk = ({ application, onVerify, onClose }) => {
  const [remarks, setRemarks] = useState(application?.verifierRemarks || '');
  const [docStatuses, setDocStatuses] = useState(() => {
    const initial = {};
    (application?.documents || []).forEach(d => {
      initial[d.id] = d.status || 'VERIFIED';
    });
    return initial;
  });

  const [selectedDoc, setSelectedDoc] = useState(() => {
    const docs = application?.documents || [];
    return docs.length > 0 ? docs[0] : null;
  });

  if (!application) return null;

  const toggleDocStatus = (docId, status) => {
    setDocStatuses(prev => ({ ...prev, [docId]: status }));
  };

  const handleApprove = () => {
    const updatedDocs = (application?.documents || []).map(d => ({
      ...d,
      status: docStatuses[d.id] || 'VERIFIED'
    }));
    onVerify(application.id, true, remarks || 'Verified physical & digital revenue records against revenue registry.', updatedDocs);
  };

  const handleReject = () => {
    onVerify(application.id, false, remarks || 'Applicant criteria or document failed verification scrutiny.');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#0E2438]/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-[#F8FAFC] border border-[#DDE3E7] rounded-2xl w-full max-w-6xl h-[92vh] flex flex-col shadow-2xl overflow-hidden text-[#17324D]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#17324D] text-white flex items-center justify-between border-b-4 border-[#D97706]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#0E2438] text-[#D97706] border border-[#D97706]/40 shadow-inner">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-extrabold text-[#D97706] tracking-wider">{application.id}</span>
                <StatusBadge status={application.status} />
              </div>
              <h3 className="text-base font-extrabold text-white font-heading mt-0.5">{application.schemeTitle}</h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-full bg-[#0E2438] hover:bg-[#0E2438]/80 text-xs font-bold text-white border border-[#DDE3E7]/20 flex items-center gap-1.5 transition"
            >
              <X className="w-4 h-4 text-[#D97706]" />
              <span>Close Inspection</span>
            </button>
          </div>
        </div>

        {/* Dual Pane Main Area */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          
          {/* Left Pane: Applicant Profile & Criteria Validation */}
          <div className="lg:col-span-5 border-r border-[#DDE3E7] p-5 overflow-y-auto space-y-6 bg-white text-xs">
            
            {/* Citizen Profile Card */}
            <div className="bg-[#F8FAFC] rounded-2xl p-4 border border-[#DDE3E7] shadow-xs space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#17324D] flex items-center gap-2 font-heading">
                <FileSearch className="w-4 h-4 text-[#D97706]" />
                <span>Applicant Profile Data</span>
              </h4>
              <div className="space-y-2 text-xs divide-y divide-[#DDE3E7]/60">
                <div className="flex justify-between py-1"><span className="text-[#526270]">Citizen Name:</span> <span className="text-[#17324D] font-bold">{application.applicantName}</span></div>
                <div className="flex justify-between py-1"><span className="text-[#526270]">Age / Category:</span> <span className="text-[#17324D] font-semibold">{application.applicantAge} Yrs • General/Farmer</span></div>
                <div className="flex justify-between py-1"><span className="text-[#526270]">Declared Income:</span> <span className="text-[#287C5A] font-extrabold">₹{application.applicantIncome?.toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between py-1"><span className="text-[#526270]">Location:</span> <span className="text-[#17324D] font-semibold">{application.applicantDistrict}, {application.applicantState}</span></div>
                <div className="flex justify-between py-1"><span className="text-[#526270]">Registered Contact:</span> <span className="text-[#17324D] font-mono">{application.applicantPhone}</span></div>
              </div>
            </div>

            {/* Automated Rule Scrutiny */}
            <div className="bg-[#F8FAFC] rounded-2xl p-4 border border-[#DDE3E7] shadow-xs space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#17324D] flex items-center gap-2 font-heading">
                <CheckCircle2 className="w-4 h-4 text-[#287C5A]" />
                <span>Automated Rule Scrutiny</span>
              </h4>
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-white border border-[#DDE3E7] flex items-center justify-between">
                  <span className="font-medium text-[#17324D]">Age Criteria (18–65 Yrs):</span>
                  <span className="text-[#287C5A] font-extrabold flex items-center gap-1 bg-[#EAF5EF] px-2.5 py-0.5 rounded-full border border-[#287C5A]/20">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#287C5A]" /> PASS
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[#DDE3E7] flex items-center justify-between">
                  <span className="font-medium text-[#17324D]">Income Ceiling (&lt; ₹5.0L):</span>
                  <span className="text-[#287C5A] font-extrabold flex items-center gap-1 bg-[#EAF5EF] px-2.5 py-0.5 rounded-full border border-[#287C5A]/20">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#287C5A]" /> PASS
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[#DDE3E7] flex items-center justify-between">
                  <span className="font-medium text-[#17324D]">District Revenue Match:</span>
                  <span className="text-[#287C5A] font-extrabold flex items-center gap-1 bg-[#EAF5EF] px-2.5 py-0.5 rounded-full border border-[#287C5A]/20">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#287C5A]" /> PASS
                  </span>
                </div>
              </div>
            </div>

            {/* Document Checklist */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#17324D] flex items-center gap-2 font-heading">
                <FileText className="w-4 h-4 text-[#D97706]" />
                <span>Submitted Documents Scrutiny</span>
              </h4>
              <div className="space-y-2">
                {(application.documents || []).map(doc => {
                  const isSel = selectedDoc && selectedDoc.id === doc.id;
                  const st = docStatuses[doc.id] || 'VERIFIED';
                  return (
                    <div
                      key={doc.id}
                      onClick={() => setSelectedDoc(doc)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSel
                          ? 'bg-[#FFF3E0] border-[#D97706] shadow-xs'
                          : 'bg-white border-[#DDE3E7] hover:border-[#526270]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <FileText className={`w-4 h-4 ${isSel ? 'text-[#D97706]' : 'text-[#17324D]'}`} />
                        <div>
                          <div className="font-bold text-[#17324D] truncate max-w-[150px]">{doc.name}</div>
                          <div className="text-[10px] text-[#526270]">{doc.type} • {doc.size || '1.1 MB'}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => toggleDocStatus(doc.id, 'VERIFIED')}
                          className={`px-3 py-1 rounded-full text-[10px] font-extrabold transition ${
                            st === 'VERIFIED' ? 'bg-[#287C5A] text-white shadow-xs' : 'bg-[#DDE3E7] text-[#526270] hover:bg-[#287C5A]/20'
                          }`}
                        >
                          Pass
                        </button>
                        <button
                          onClick={() => toggleDocStatus(doc.id, 'REJECTED')}
                          className={`px-3 py-1 rounded-full text-[10px] font-extrabold transition ${
                            st === 'REJECTED' ? 'bg-[#B84040] text-white shadow-xs' : 'bg-[#DDE3E7] text-[#526270] hover:bg-[#B84040]/20'
                          }`}
                        >
                          Fail
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Inspector Remarks */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-[#17324D] block font-heading">
                Field Officer Verification Remarks
              </label>
              <textarea
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter document verification notes and physical audit comments..."
                className="w-full bg-white border border-[#DDE3E7] rounded-xl p-3 text-[#17324D] focus:border-[#17324D] focus:outline-none text-xs shadow-xs"
              />
            </div>
          </div>

          {/* Right Pane: Document Previewer & OCR Verification */}
          <div className="lg:col-span-7 p-6 bg-[#F8FAFC] flex flex-col justify-between overflow-y-auto">
            {selectedDoc ? (
              <div className="space-y-4 flex-1 flex flex-col">
                <div className="flex items-center justify-between pb-3 border-b border-[#DDE3E7]">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-[#D97706]" />
                    <span className="font-extrabold text-[#17324D] text-xs font-heading">{selectedDoc.name}</span>
                  </div>
                  <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-[#EAF5EF] text-[#287C5A] border border-[#287C5A]/30">
                    DigiLocker OCR Confidence: {selectedDoc.ocrConfidence || '98.4%'}
                  </span>
                </div>

                {/* Simulated Document Preview Window */}
                <div className="flex-1 bg-white rounded-2xl border border-[#DDE3E7] p-6 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[340px] shadow-sm">
                  <div className="w-full max-w-lg p-6 bg-[#F8FAFC] rounded-2xl border border-[#DDE3E7] shadow-sm text-left space-y-4 font-mono text-xs">
                    <div className="flex items-center justify-between border-b border-[#DDE3E7] pb-3">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-[#D97706]" />
                        <span className="text-[#17324D] font-extrabold uppercase font-heading">GOVERNMENT REVENUE RECORD</span>
                      </div>
                      <span className="text-[10px] font-bold text-[#287C5A] bg-[#EAF5EF] px-2 py-0.5 rounded-full border border-[#287C5A]/20">
                        VERIFIED DIGILOCKER SEAL
                      </span>
                    </div>

                    <div className="space-y-2 text-[#17324D]">
                      <div className="flex justify-between"><span className="text-[#526270]">Document Type:</span> <span className="font-bold">{selectedDoc.type}</span></div>
                      <div className="flex justify-between"><span className="text-[#526270]">Extracted Applicant Name:</span> <span className="font-bold text-[#17324D]">{selectedDoc.extractedData?.name || application.applicantName}</span></div>
                      {selectedDoc.extractedData?.aadhaarNo && <div className="flex justify-between"><span className="text-[#526270]">Extracted Aadhaar UID:</span> <span className="font-bold">{selectedDoc.extractedData.aadhaarNo}</span></div>}
                      {selectedDoc.extractedData?.declaredIncome && <div className="flex justify-between"><span className="text-[#526270]">Extracted Annual Income:</span> <span className="font-bold text-[#287C5A]">{selectedDoc.extractedData.declaredIncome}</span></div>}
                      {selectedDoc.extractedData?.surveyNo && <div className="flex justify-between"><span className="text-[#526270]">Revenue Survey No:</span> <span className="font-bold">{selectedDoc.extractedData.surveyNo}</span></div>}
                      <div className="flex justify-between"><span className="text-[#526270]">Issuer Authority:</span> <span className="font-semibold text-[#17324D]">Revenue Department, Government of India</span></div>
                    </div>

                    <div className="pt-3 border-t border-[#DDE3E7] flex items-center justify-between text-[11px] text-[#287C5A]">
                      <span className="font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Digital Certificate Signature Valid
                      </span>
                      <span className="font-mono text-[10px] text-[#526270]">SHA-256: 8f9a...c43e</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-[#526270] text-xs">
                Select a document from the left checklist to scrutinize preview
              </div>
            )}

            {/* Bottom Action Controls */}
            <div className="pt-5 border-t border-[#DDE3E7] flex items-center justify-between gap-4 mt-4">
              <button
                onClick={handleReject}
                className="px-6 py-3 rounded-full bg-[#FFF3E0] hover:bg-[#B84040] text-[#B84040] hover:text-white border border-[#B84040]/30 font-extrabold text-xs flex items-center gap-2 transition shadow-xs"
              >
                <XCircle className="w-4 h-4" />
                <span>Mark Ineligible / Decline</span>
              </button>

              <button
                onClick={handleApprove}
                className="px-8 py-3 rounded-full bg-[#D97706] hover:bg-[#B45309] text-white font-extrabold text-xs flex items-center gap-2 shadow-md hover:shadow-lg transition tracking-wide"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verify & Forward to Sanction Officer</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

