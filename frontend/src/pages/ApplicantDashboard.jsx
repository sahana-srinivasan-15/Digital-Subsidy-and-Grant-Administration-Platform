import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { JourneyStepper } from '../components/applicant/JourneyStepper';
import { EligibilityCalculator } from '../components/applicant/EligibilityCalculator';
import { ApplicationWizard } from '../components/applicant/ApplicationWizard';
import { ApplicationStatusTracker } from '../components/applicant/ApplicationStatusTracker';
import { StatusBadge } from '../components/common/Badge';
import { ArrowRight, FileText, CheckCircle2, IndianRupee, Search, Plus, Eye, Shield, Tag, Clock, RotateCw } from 'lucide-react';
import { downloadVoucherPdf } from '../utils/voucherPdf';
import { ProcessingTimeEstimator } from '../components/applicant/ProcessingTimeEstimator';

export const ApplicantDashboard = ({ activeTab: _activeTab, setActiveTab }) => {
  const { 
    currentUser, 
    schemes, 
    applications, 
    disburseApplication, 
    showToast,
    toggleSaveScheme,
    isSchemeSaved
  } = useApp();
  const [selectedScheme, setSelectedScheme] = useState(() => {
    try {
      const pendingId = sessionStorage.getItem('dsga_pending_apply_scheme');
      if (pendingId) {
        return schemes.find(s => s.id === pendingId) || null;
      }
    } catch {
      // ignore
    }
    return null;
  });
  const [isApplying, setIsApplying] = useState(() => {
    try {
      return Boolean(sessionStorage.getItem('dsga_pending_apply_scheme'));
    } catch {
      return false;
    }
  });
  const [renewalApp, setRenewalApp] = useState(null);
  const [selectedAppModal, setSelectedAppModal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Clear any pending scheme pointer on mount silently without top toast notifications (Requirement 10)
  useEffect(() => {
    try {
      sessionStorage.removeItem('dsga_pending_apply_scheme');
    } catch (e) {
      console.warn('Pending scheme storage notice:', e);
    }
  }, []);

  // Citizen applications (filtered strictly for the currently logged-in citizen)
  const myApps = applications.filter(a => {
    if (!currentUser) return false;
    const currentId = currentUser.id ? String(currentUser.id) : '';
    const currentBackendId = currentUser.backendId ? Number(currentUser.backendId) : null;
    const currentEmail = currentUser.email ? currentUser.email.toLowerCase().trim() : '';

    const appApplicantId = a.applicantId ? String(a.applicantId) : '';
    const appBackendId = a.applicantBackendId ? Number(a.applicantBackendId) : null;
    const appEmail = a.applicantEmail ? a.applicantEmail.toLowerCase().trim() : '';

    if (currentBackendId && appBackendId && currentBackendId === appBackendId) return true;
    if (currentId && appApplicantId && currentId === appApplicantId) return true;
    if (currentEmail && appEmail && currentEmail === appEmail) return true;
    return false;
  });
  const activeApp = myApps.find(a => a.status !== 'PAID' && a.status !== 'DISBURSED' && a.status !== 'REJECTED') || myApps[0];

  const handleStartApply = (scheme) => {
    setSelectedScheme(scheme);
    setRenewalApp(null);
    setIsApplying(true);
  };

  const handleReapply = (app) => {
    const targetScheme = schemes.find(s => s.id === app.schemeId) || {
      id: app.schemeId,
      title: app.schemeTitle,
      maxAmount: app.requestedAmount,
      department: 'Department of Welfare & Benefit Administration'
    };
    setSelectedScheme(targetScheme);
    setRenewalApp(app);
    setIsApplying(true);
  };

  const filteredSchemes = schemes.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase()) || s.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || s.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleDownloadReceipt = (app) => {
    try {
      const fileName = downloadVoucherPdf(app, currentUser);
      showToast?.(`Downloaded Official Payment Receipt (${fileName})!`, 'success');
    } catch (err) {
      console.error('[ApplicantDashboard] Failed to download receipt:', err);
      showToast?.('Could not download receipt. Please try again.', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome Official Government Hero Banner */}
      <div className="bg-[#17324D] p-8 rounded-xl text-white shadow-card relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-t-4 border-[#D97706]">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0E2438] border border-[#D97706]/40 text-[#FFF3E0] text-xs font-semibold">
            <Shield className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Beneficiary Citizen Portal • State Direct Transfer</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-heading">
            Good Day, {currentUser?.name || 'Citizen'}
          </h1>
          <p className="text-sm text-[#DDE3E7] max-w-xl">
            You have <span className="text-[#FFF3E0] font-bold">{myApps.length} active applications</span> registered in the state direct benefit pipeline.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10">
          <button
            onClick={() => { setSelectedScheme(schemes[0]); setIsApplying(true); }}
            className="px-5 py-2.5 rounded-md bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs shadow-md transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>APPLY FOR NEW GRANT →</span>
          </button>
        </div>
      </div>

      {/* If currently viewing full timeline page */}
      {selectedAppModal ? (
        <ApplicationStatusTracker
          application={selectedAppModal}
          onClose={() => setSelectedAppModal(null)}
          onReapply={(app) => {
            setSelectedAppModal(null);
            handleReapply(app);
          }}
          onFileGrievance={(_app) => {
            setSelectedAppModal(null);
            setActiveTab('grievances');
          }}
        />
      ) : isApplying ? (
        <ApplicationWizard
          scheme={selectedScheme}
          isRenewal={Boolean(renewalApp)}
          previousApplication={renewalApp}
          onComplete={(_newAppId) => { 
            setIsApplying(false); 
            setRenewalApp(null);
          }}
          onCancel={() => {
            setIsApplying(false);
            setRenewalApp(null);
          }}
        />
      ) : (
        <>
          {/* Active Application Stepper Card */}
          {activeApp ? (
            <div className="gov-card p-6 relative">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-[#DDE3E7]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#17324D] bg-[#F8FAFC] px-2.5 py-1 rounded border border-[#DDE3E7]">
                      {activeApp.id}
                    </span>
                    <h3 className="text-base font-bold text-[#17324D] font-heading">{activeApp.schemeTitle}</h3>
                  </div>
                  <p className="text-xs text-[#526270] mt-1">
                    Submitted on {new Date(activeApp.submittedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} • Requested: <span className="text-[#287C5A] font-extrabold">₹{activeApp.requestedAmount.toLocaleString('en-IN')}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <StatusBadge status={activeApp.status} />

                  {(activeApp.status === 'PAID' || activeApp.status === 'DISBURSED' || activeApp.status === 'REJECTED') && (
                    <button
                      onClick={() => handleReapply(activeApp)}
                      className="px-3 py-1.5 rounded-md bg-[#D97706] hover:bg-[#B45309] text-xs font-bold text-white flex items-center gap-1.5 shadow-xs transition"
                      title="Renew or re-apply based on this application"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>{activeApp.status === 'REJECTED' ? 'Re-Apply' : 'Renew Application'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedAppModal(activeApp)}
                    className="px-3.5 py-2 rounded-xl bg-[#17324D] hover:bg-[#0E2438] text-xs font-bold text-white flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-[#D97706]" />
                    <span>View Timeline</span>
                  </button>
                </div>
              </div>

              {/* Processing Time Estimator Summary Preview */}
              <div className="mb-4">
                <ProcessingTimeEstimator application={activeApp} compact={true} />
              </div>

              {/* Sanction Approved -> Ready for Disbursal Action Callout */}
              {activeApp.status === 'APPROVED' && (
                <div className="mb-5 p-5 rounded-xl bg-[#FFF8EE] border-2 border-[#D97706] shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#D97706] text-white uppercase tracking-wider">
                        Sanction Approved • 80% Complete
                      </span>
                      <span className="text-xs font-mono font-bold text-[#17324D]">{activeApp.id}</span>
                    </div>
                    <h4 className="text-base font-extrabold text-[#17324D] font-heading">
                      Grant of ₹{(activeApp.approvedAmount || activeApp.requestedAmount)?.toLocaleString('en-IN')} Authorized by Sanction Authority
                    </h4>
                    <p className="text-xs text-[#526270]">
                      The Sanction Officer has approved this grant. Click the button below to execute Direct Bank Transfer (DBT) to your registered bank account (<strong className="text-[#17324D]">{activeApp.bankDetails?.bankName || 'Aadhaar Seeded Account'}</strong>) and advance to 100% Disbursed.
                    </p>
                  </div>

                  <button
                    onClick={() => disburseApplication(activeApp.id)}
                    className="px-5 py-2.5 rounded-lg bg-[#287C5A] hover:bg-[#1E6045] text-white font-extrabold text-xs shadow-md transition flex items-center gap-2 flex-shrink-0 tracking-wider uppercase"
                  >
                    <IndianRupee className="w-4 h-4 text-white" />
                    <span>⚡ Claim Disbursal (Reach 100%)</span>
                  </button>
                </div>
              )}

              {/* 100% Disbursed Confirmation Banner */}
              {(activeApp.status === 'PAID' || activeApp.status === 'DISBURSED') && (
                <div className="mb-5 p-4 rounded-xl bg-[#EAF5EF] border border-[#287C5A]/40 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#287C5A] text-white uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> 100% Fully Disbursed
                      </span>
                      <span className="text-xs font-mono font-bold text-[#287C5A]">PFMS Ref: {activeApp.transactionId || 'TXN-DBT-2026-91823901'}</span>
                    </div>
                    <p className="text-xs text-[#17324D] font-medium mt-1">
                      Direct Benefit Transfer of <strong className="text-[#287C5A] font-extrabold">₹{(activeApp.approvedAmount || activeApp.requestedAmount)?.toLocaleString('en-IN')}</strong> was successfully credited to your {activeApp.bankDetails?.bankName || 'Bank Account'} (••••{activeApp.bankDetails?.accountNumber?.slice(-4) || '1024'}).
                    </p>
                  </div>
                  <button
                    id="dashboard-download-receipt-btn"
                    onClick={() => handleDownloadReceipt(activeApp)}
                    className="px-4 py-2 rounded-lg bg-white hover:bg-[#F8FAFC] text-[#17324D] font-bold text-xs border border-[#DDE3E7] shadow-xs flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
                    title="Download Official DBT Payment Voucher PDF"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#287C5A]" />
                    <span>Download Receipt</span>
                  </button>
                </div>
              )}

              {/* 5-Stage Stepper */}
              <JourneyStepper status={activeApp.status} timeline={activeApp.timeline} />
            </div>
          ) : (
            <div className="gov-card p-6 rounded-xl bg-gradient-to-r from-[#17324D]/5 to-[#D97706]/5 border border-[#DDE3E7] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EAF5EF] border border-[#287C5A]/30 text-[#287C5A] text-[11px] font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#287C5A]" />
                  <span>Verified Citizen Account</span>
                </div>
                <h3 className="text-base font-extrabold text-[#17324D] font-heading">
                  Welcome to DBT Beneficiary Portal, {currentUser?.name || 'Citizen'}!
                </h3>
                <p className="text-xs text-[#526270]">
                  You have not submitted any subsidy or grant applications yet. Choose an eligible welfare scheme below to begin your digital application with instant paperless verification.
                </p>
              </div>
            </div>
          )}

          {/* Quick Metrics Stat Boxes */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="stat-box">
              <div className="text-[#526270] text-xs font-semibold uppercase tracking-wider mb-1">Available Schemes</div>
              <div className="text-2xl font-extrabold text-[#17324D] font-heading">{schemes.length}</div>
              <div className="text-[11px] text-[#287C5A] font-bold mt-1">Open for application</div>
            </div>

            <div className="stat-box">
              <div className="text-[#526270] text-xs font-semibold uppercase tracking-wider mb-1">My Submissions</div>
              <div className="text-2xl font-extrabold text-[#17324D] font-heading">{myApps.length}</div>
              <div className="text-[11px] text-[#526270] font-medium mt-1">Total applications</div>
            </div>

            <div className="stat-box">
              <div className="text-[#526270] text-xs font-semibold uppercase tracking-wider mb-1">Under Verification</div>
              <div className="text-2xl font-extrabold text-[#B7791F] font-heading">{myApps.filter(a => a.status === 'UNDER_VERIFICATION' || a.status === 'VERIFIED').length}</div>
              <div className="text-[11px] text-[#B7791F] font-bold mt-1">In inspector queue</div>
            </div>

            <div className="stat-box">
              <div className="text-[#526270] text-xs font-semibold uppercase tracking-wider mb-1">Disbursed Grant</div>
              <div className="text-2xl font-extrabold text-[#287C5A] font-heading">
                ₹{myApps.filter(a => a.status === 'PAID' || a.status === 'DISBURSED').reduce((sum, a) => sum + (a.approvedAmount || 0), 0).toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-[#287C5A] font-bold mt-1">Direct Bank Transfer</div>
            </div>
          </div>

          {/* Scheme Discovery Grid */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-[#17324D] font-heading">Explore Government Assistance Schemes</h2>
                <p className="text-xs text-[#526270]">Browse active subsidies, check eligibility criteria, and apply directly online</p>
              </div>

              {/* Search & Category Filter */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-72">
                  <Search className="w-4 h-4 text-[#7C8992] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search schemes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white border border-[#DDE3E7] rounded-md !pl-11 pr-3 py-2 text-xs text-[#17324D] placeholder-[#7C8992] focus:outline-none focus:border-[#17324D] search-input shadow-xs"
                    style={{ paddingLeft: '2.75rem' }}
                  />
                </div>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-white border border-[#DDE3E7] rounded-md px-3 py-2 text-xs text-[#17324D] focus:outline-none focus:border-[#17324D] font-medium"
                >
                  <option value="ALL">All Categories</option>
                  <option value="AGRICULTURE">Agriculture</option>
                  <option value="HOUSING">Housing</option>
                  <option value="EDUCATION">Education</option>
                  <option value="WOMEN & BUSINESS">MSME & Women</option>
                </select>
              </div>
            </div>

            {/* Scheme Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredSchemes.map(sch => {
                const isSaved = isSchemeSaved(sch.id);

                return (
                  <div key={sch.id} className="gov-card p-6 bg-white flex flex-col justify-between space-y-4 rounded-2xl border border-[#DDE3E7] shadow-card hover:border-[#17324D]/40 transition">
                    <div>
                      {/* Top Header: Category & Applications Open Status */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-[#EAF5EF] text-[#287C5A] border border-[#287C5A]/30">
                          {sch.category}
                        </span>

                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#EAF5EF] text-[#287C5A] border border-[#287C5A]/30 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#287C5A]"></span>
                          <span>Applications Open</span>
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-[#17324D] mb-1 font-heading">{sch.title}</h3>
                      <p className="text-[11px] text-[#7C8992] font-semibold mb-2">{sch.department || 'Department of Welfare'}</p>
                      <p className="text-xs text-[#526270] leading-relaxed mb-4">{sch.shortDesc}</p>

                      <div className="grid grid-cols-2 gap-3 p-3.5 rounded-md bg-[#F8FAFC] border border-[#DDE3E7] text-xs mb-2">
                        <div>
                          <span className="text-[#526270] text-[10px] uppercase font-semibold block">Max Financial Aid</span>
                          <span className="text-[#287C5A] font-extrabold text-sm font-heading">Up to ₹{Number(sch.maxAmount || 0).toLocaleString('en-IN')}</span>
                        </div>
                        <div>
                          <span className="text-[#526270] text-[10px] uppercase font-semibold block">Beneficiaries</span>
                          <span className="text-[#17324D] font-bold">{sch.approvedCount} / {sch.applicantsCount} approved</span>
                        </div>
                      </div>

                      {/* Processing Time Pill */}
                      <div className="flex items-center justify-between text-[11px] text-[#7C8992] bg-[#F3F6F8] p-2 rounded-lg border border-[#DDE3E7] mb-1">
                        <div className="flex items-center gap-1 text-[#D97706] font-bold">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Est. Processing: {sch.processingDays || '7–10 Working Days'}</span>
                        </div>
                        <span className="font-mono text-[10px]">Deadline: {sch.deadline || 'Ongoing'}</span>
                      </div>
                    </div>

                    {/* Scheme Card Actions:
                        🏷️ Save Scheme (or 🏷️ Saved)
                        [View Details]    [Apply Now]
                    */}
                    <div className="pt-3 border-t border-[#DDE3E7] flex flex-col gap-2.5">
                      <button
                        type="button"
                        onClick={() => toggleSaveScheme(sch.id)}
                        className={`inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl text-xs font-bold border transition ${
                          isSaved
                            ? 'bg-[#FEF3C7] border-[#F59E0B] text-[#92400E]'
                            : 'bg-[#F8FAFC] border-[#DDE3E7] text-[#526270] hover:text-[#17324D] hover:bg-[#F3F6F8]'
                        }`}
                        title={isSaved ? 'Scheme is saved in your list' : 'Save scheme'}
                      >
                        <Tag className={`w-3.5 h-3.5 ${isSaved ? 'fill-[#D97706] text-[#D97706]' : 'text-[#7C8992]'}`} />
                        <span>{isSaved ? 'Saved' : 'Save Scheme'}</span>
                      </button>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedScheme(sch)}
                          className="py-2.5 px-3 rounded-xl bg-[#F8FAFC] hover:bg-[#DDE3E7]/40 text-[#17324D] font-bold text-xs border border-[#DDE3E7] text-center transition"
                        >
                          View Details
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStartApply(sch)}
                          className="py-2.5 px-3 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition uppercase tracking-wider font-heading text-center"
                        >
                          <span>Apply Now</span>
                          <ArrowRight className="w-3.5 h-3.5 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Screener Modal / Section if a scheme is selected for criteria */}
          {selectedScheme && !isApplying && (
            <div className="mt-6">
              <EligibilityCalculator
                scheme={selectedScheme}
                onProceedToApply={(s) => handleStartApply(s)}
              />
            </div>
          )}

        </>
      )}
    </div>
  );
};
