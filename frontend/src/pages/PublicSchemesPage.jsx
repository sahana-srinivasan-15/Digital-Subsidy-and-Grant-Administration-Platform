import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EligibilityCalculator } from '../components/applicant/EligibilityCalculator';
import { 
  Landmark, 
  Search, 
  ArrowRight, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  LogIn,
  Tag,
  FileText,
  CheckCircle2,
  Lock,
  X
} from 'lucide-react';

export const PublicSchemesPage = ({ onNavigateLogin, onStartApply }) => {
  const { 
    schemes, 
    currentUser, 
    isSchemeSaved,
    showToast
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedAvailability, setSelectedAvailability] = useState('ALL');
  const [selectedSchemeForModal, setSelectedSchemeForModal] = useState(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Format date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Ongoing';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  // Calculate dynamic Estimated Processing Date from processing days
  const getEstimatedProcessingDate = (processingDaysStr, baseDateStr) => {
    const match = (processingDaysStr || '').match(/[–-]\s*(\d+)/) || (processingDaysStr || '').match(/(\d+)\s*Working/i);
    const days = match ? parseInt(match[1], 10) : 7;
    const base = baseDateStr ? new Date(baseDateStr) : new Date('2026-09-19');
    const estDate = new Date(base.getTime() + days * 24 * 60 * 60 * 1000);
    return estDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // Filter schemes
  const filteredSchemes = schemes.filter(sch => {
    const term = searchTerm.trim().toLowerCase();
    const matchesSearch = !term ||
      sch.title.toLowerCase().includes(term) ||
      sch.description.toLowerCase().includes(term) ||
      (sch.department && sch.department.toLowerCase().includes(term)) ||
      (sch.category && sch.category.toLowerCase().includes(term));

    const matchesCat = selectedCategory === 'ALL' || sch.category === selectedCategory;
    const matchesStatus = selectedStatus === 'ALL' || 
      (selectedStatus === 'ACTIVE' && sch.status === 'ACTIVE') ||
      (selectedStatus === 'SUSPENDED' && sch.status !== 'ACTIVE');

    const matchesAvail = selectedAvailability === 'ALL' ||
      (selectedAvailability === 'OPEN' && sch.status === 'ACTIVE') ||
      (selectedAvailability === 'CLOSED' && sch.status !== 'ACTIVE');

    return matchesSearch && matchesCat && matchesStatus && matchesAvail;
  });

  const handleApplyClick = (sch) => {
    if (!currentUser) {
      try {
        sessionStorage.setItem('dsga_pending_apply_scheme', sch.id);
      } catch (e) {
        console.warn('Session storage error:', e);
      }
      if (onNavigateLogin) {
        onNavigateLogin(sch);
      }
    } else {
      if (onStartApply) {
        onStartApply(sch);
      }
    }
  };

  // Applicable for public portal only: clicking save scheme MUST show login popup
  const handleSaveClick = (_schemeId) => {
    setShowLoginPrompt(true);
    if (showToast) {
      showToast('Please login to save this scheme.', 'info');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-[#17324D] flex flex-col font-sans selection:bg-[#17324D] selection:text-white">
      
      {/* Tricolor Header Bar */}
      <div className="tricolor-accent-bar"></div>

      {/* Public Top Navbar */}
      <header className="bg-white border-b border-[#DDE3E7] sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          
          {/* Brand Emblem */}
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-[#17324D] flex items-center justify-center text-white shadow-xs">
              <Landmark className="w-5 h-5 text-[#FFF3E0]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-[#17324D] font-heading uppercase">
                  GovGrant
                </span>
                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#EAF5EF] text-[#287C5A] border border-[#287C5A]/30">
                  PUBLIC TRANSPARENCY
                </span>
              </div>
              <p className="text-[10px] font-semibold text-[#7C8992] tracking-wide">
                Direct Benefit Transfer (DBT) Scheme Directory
              </p>
            </div>
          </div>

          {/* Right Action */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onNavigateLogin?.()}
              className="px-4 py-2.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold shadow-md transition flex items-center gap-2 font-heading uppercase tracking-wider cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-white" />
              <span>Sign In / Citizen Portal</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 w-full">
        
        {/* Public Hero Section */}
        <div className="bg-[#17324D] p-8 sm:p-10 rounded-2xl text-white shadow-card border-t-4 border-[#D97706] relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0E2438] border border-[#D97706]/40 text-[#FFF3E0] text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-[#D97706]" />
              <span>Open Public Registry • Government of India</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-heading">
              Official Scheme Transparency Portal
            </h1>
            <p className="text-xs sm:text-sm text-[#DDE3E7] leading-relaxed">
              Explore national and state direct benefit subsidies, verify eligibility qualifications, review required documentation dossiers, and apply directly with paperless e-KYC.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-3 z-10 w-full sm:w-auto">
            <div className="p-3.5 rounded-xl bg-[#0E2438] border border-[#17324D] text-center">
              <div className="text-2xl font-extrabold text-[#D97706] font-heading">{schemes.length}</div>
              <div className="text-[10px] text-[#A0B0C0] font-semibold uppercase">Published Schemes</div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#0E2438] border border-[#17324D] text-center">
              <div className="text-2xl font-extrabold text-[#287C5A] font-heading">100%</div>
              <div className="text-[10px] text-[#A0B0C0] font-semibold uppercase">Paperless DBT</div>
            </div>
          </div>
        </div>

        {/* Search Schemes Toolbar */}
        <div className="gov-card p-5 sm:p-6 rounded-2xl bg-white border border-[#DDE3E7] shadow-card space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#7C8992] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search scheme name, department, or keyword (e.g. Agriculture, Housing, Scholarship)..."
                className="w-full bg-[#F8FAFC] border border-[#DDE3E7] rounded-xl !pl-11 pr-4 py-2.5 text-xs text-[#17324D] placeholder-[#7C8992] focus:outline-none focus:border-[#17324D] shadow-xs font-medium"
                style={{ paddingLeft: '2.75rem' }}
              />
            </div>

            {(searchTerm || selectedCategory !== 'ALL' || selectedStatus !== 'ALL' || selectedAvailability !== 'ALL') && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('ALL');
                  setSelectedStatus('ALL');
                  setSelectedAvailability('ALL');
                }}
                className="text-xs font-bold text-[#B84040] hover:underline px-3 py-2 cursor-pointer whitespace-nowrap"
              >
                Reset All Filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 border-t border-[#DDE3E7]">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#526270] block mb-1 font-heading">
                Scheme Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-[#DDE3E7] rounded-lg px-2.5 py-2 text-xs text-[#17324D] font-medium focus:outline-none focus:border-[#17324D]"
              >
                <option value="ALL">All Categories</option>
                <option value="AGRICULTURE">Agriculture</option>
                <option value="HOUSING">Housing</option>
                <option value="EDUCATION">Education</option>
                <option value="HEALTHCARE">Healthcare</option>
                <option value="WOMEN & BUSINESS">MSME & Women</option>
                <option value="SKILL & EMPLOYMENT">Skill & Jobs</option>
                <option value="ENTREPRENEURSHIP">Entrepreneurship</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#526270] block mb-1 font-heading">
                Application Availability
              </label>
              <select
                value={selectedAvailability}
                onChange={(e) => setSelectedAvailability(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-[#DDE3E7] rounded-lg px-2.5 py-2 text-xs text-[#17324D] font-medium focus:outline-none focus:border-[#17324D]"
              >
                <option value="ALL">All Availabilities</option>
                <option value="OPEN">Applications Open</option>
                <option value="CLOSED">Applications Closed</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#526270] block mb-1 font-heading">
                Scheme Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-[#DDE3E7] rounded-lg px-2.5 py-2 text-xs text-[#17324D] font-medium focus:outline-none focus:border-[#17324D]"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active Schemes</option>
                <option value="SUSPENDED">Suspended Schemes</option>
              </select>
            </div>
          </div>
        </div>

        {/* Scheme Cards Grid */}
        <div id="public-schemes-list" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#17324D] font-heading">
                Available Government Schemes ({filteredSchemes.length})
              </h2>
              <p className="text-xs text-[#526270]">
                Verified official subsidy details directly synchronized from government mission registries
              </p>
            </div>
          </div>

          {filteredSchemes.length === 0 ? (
            <div className="gov-card p-12 text-center rounded-2xl bg-white border border-[#DDE3E7]">
              <p className="text-sm font-bold text-[#17324D]">No schemes found matching your search and filter criteria.</p>
              <p className="text-xs text-[#526270] mt-1">Try broadening your search term or clearing the active filters above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredSchemes.map((sch, idx) => {
                const isOpen = sch.status === 'ACTIVE';
                const isSaved = isSchemeSaved(sch.id);

                const processingTimeOptions = [
                  '4–7 Working Days',
                  '12–18 Working Days',
                  '3–5 Working Days',
                  '5–8 Working Days',
                  '8–14 Working Days',
                  '6–10 Working Days',
                  '7–12 Working Days',
                  '5–7 Working Days',
                  '10–15 Working Days'
                ];
                const lastUpdatedOptions = [
                  '2026-09-12',
                  '2026-09-08',
                  '2026-09-14',
                  '2026-09-16',
                  '2026-09-10',
                  '2026-09-15',
                  '2026-09-11',
                  '2026-09-07',
                  '2026-09-13'
                ];

                const processingTimeLabel = sch.processingDays || processingTimeOptions[idx % processingTimeOptions.length];
                const lastUpdatedDate = sch.lastUpdated 
                  ? formatDate(sch.lastUpdated)
                  : sch.updatedAt 
                  ? formatDate(sch.updatedAt) 
                  : formatDate(lastUpdatedOptions[idx % lastUpdatedOptions.length]);

                const estimatedProcessingDate = getEstimatedProcessingDate(processingTimeLabel, sch.lastUpdated || lastUpdatedOptions[idx % lastUpdatedOptions.length]);
                const formattedDeadline = formatDate(sch.deadline);

                return (
                  /* Clean, compact scheme card without compare and without full eligibility/docs */
                  <div
                    key={sch.id}
                    className="gov-card p-6 bg-white rounded-2xl border border-[#DDE3E7] shadow-card flex flex-col justify-between space-y-4 hover:border-[#17324D]/40 transition"
                  >
                    <div>
                      {/* Top Header: Category & Application Status only (NO Compare checkbox) */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#EAF5EF] text-[#287C5A] border border-[#287C5A]/30">
                          {sch.category}
                        </span>
                        
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          isOpen
                            ? 'bg-[#EAF5EF] text-[#287C5A] border border-[#287C5A]/30 flex items-center gap-1'
                            : 'bg-[#FDF2F2] text-[#B84040] border border-[#B84040]/30'
                        }`}>
                          {isOpen ? <span className="w-1.5 h-1.5 rounded-full bg-[#287C5A]"></span> : null}
                          <span>{isOpen ? 'Applications Open' : 'Applications Closed'}</span>
                        </span>
                      </div>

                      {/* Scheme Name & Ministry */}
                      <h3 className="text-base font-bold text-[#17324D] mb-1 font-heading">
                        {sch.title}
                      </h3>
                      <p className="text-[11px] text-[#7C8992] font-semibold mb-2">
                        {sch.department || 'State Welfare Directorate'}
                      </p>

                      {/* Short Scheme Description */}
                      <p className="text-xs text-[#526270] leading-relaxed mb-4">
                        {sch.shortDesc || sch.description}
                      </p>

                      {/* Benefit / Grant Amount & Application Deadline */}
                      <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#DDE3E7] text-xs mb-3">
                        <div>
                          <span className="text-[#526270] text-[10px] uppercase font-semibold block">Max Financial Aid</span>
                          <span className="text-[#287C5A] font-extrabold text-sm font-heading">
                            Up to ₹{Number(sch.maxAmount || 0).toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#526270] text-[10px] uppercase font-semibold block">Application Deadline</span>
                          <span className="text-[#17324D] font-bold font-mono text-xs">
                            {formattedDeadline}
                          </span>
                        </div>
                      </div>

                      {/* Dynamic Timelines & Distinct Estimated Processing Date */}
                      <div className="flex flex-wrap items-center justify-between text-[11px] text-[#7C8992] bg-[#F3F6F8] p-2.5 rounded-lg border border-[#DDE3E7] gap-2">
                        <div className="flex items-center gap-1 text-[#D97706] font-bold">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Est. Processing Date: {estimatedProcessingDate} ({processingTimeLabel})</span>
                        </div>
                        <div className="flex items-center gap-1 font-mono">
                          <Calendar className="w-3 h-3 text-[#7C8992]" />
                          <span>Last Updated: {lastUpdatedDate}</span>
                        </div>
                      </div>
                    </div>

                    {/* Requirement 3: Compact secondary Save Scheme button (Not full-width) */}
                    <div className="pt-3 border-t border-[#DDE3E7] flex flex-col gap-2.5">
                      <div>
                        <button
                          type="button"
                          onClick={() => handleSaveClick(sch.id)}
                          className={`inline-flex items-center gap-1.5 py-1 px-2.5 rounded-lg text-[11px] font-semibold border transition cursor-pointer ${
                            isSaved
                              ? 'bg-[#FEF3C7] border-[#F59E0B] text-[#92400E]'
                              : 'bg-[#F8FAFC] border-[#DDE3E7] text-[#526270] hover:text-[#17324D] hover:bg-[#F3F6F8]'
                          }`}
                          title={isSaved ? 'Scheme is saved in your wishlist' : 'Save scheme'}
                        >
                          <Tag className={`w-3 h-3 ${isSaved ? 'fill-[#D97706] text-[#D97706]' : 'text-[#7C8992]'}`} />
                          <span>{isSaved ? 'Saved' : 'Save Scheme'}</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedSchemeForModal(sch)}
                          className="py-2.5 px-3 rounded-xl bg-[#F8FAFC] hover:bg-[#DDE3E7]/40 text-[#17324D] font-bold text-xs border border-[#DDE3E7] text-center transition cursor-pointer"
                        >
                          View Details
                        </button>

                        <button
                          type="button"
                          onClick={() => handleApplyClick(sch)}
                          className="py-2.5 px-3 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition uppercase tracking-wider font-heading text-center cursor-pointer"
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
          )}
        </div>

      </main>

      {/* Global Transparency Footer */}
      <footer className="bg-[#0E2438] text-white border-t border-[#DDE3E7]/20 py-8 text-center text-xs mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#D97706] font-heading">GovGrant</span>
            <span className="text-[#DDE3E7]">• Public Welfare & Scheme Transparency Mission</span>
          </div>
          <div className="text-[#DDE3E7] text-[11px]">
            <span>Government of India • Ministry of Electronics & IT • Paperless DBT Infrastructure</span>
          </div>
        </div>
      </footer>

      {/* Requirement 4: VIEW DETAILS MODAL – Complete Scheme Details, Eligibility & Documents */}
      {selectedSchemeForModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-slide-up text-[#17324D] my-8 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#DDE3E7] pb-4 mb-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-[#EAF5EF] text-[#287C5A] border border-[#287C5A]/30">
                  {selectedSchemeForModal.category}
                </span>
                <h3 className="text-xl font-bold text-[#17324D] mt-2 font-heading">
                  {selectedSchemeForModal.title}
                </h3>
                <p className="text-xs text-[#7C8992] mt-0.5">
                  {selectedSchemeForModal.department || 'State Welfare Directorate'}
                </p>
              </div>
              <button
                onClick={() => setSelectedSchemeForModal(null)}
                className="text-[#7C8992] hover:text-[#17324D] p-2 rounded-full hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 text-xs text-[#526270]">
              {/* 1. Scheme Description */}
              <div>
                <h4 className="text-xs font-bold text-[#17324D] uppercase tracking-wider mb-1 font-heading">Scheme Overview</h4>
                <p className="leading-relaxed text-xs">
                  {selectedSchemeForModal.description || selectedSchemeForModal.shortDesc}
                </p>
              </div>

              {/* 2. Key Benefits & Financial Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-[#F8FAFC] border border-[#DDE3E7]">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-[#7C8992] block">Maximum Financial Aid</span>
                  <span className="text-[#287C5A] font-extrabold text-base font-heading">
                    Up to ₹{Number(selectedSchemeForModal.maxAmount || 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-[#7C8992] block">Application Deadline</span>
                  <span className="text-[#17324D] font-bold font-mono">
                    {formatDate(selectedSchemeForModal.deadline)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-[#7C8992] block">Estimated Processing Date</span>
                  <span className="text-[#D97706] font-bold">
                    {getEstimatedProcessingDate(selectedSchemeForModal.processingDays, selectedSchemeForModal.lastUpdated)} ({selectedSchemeForModal.processingDays || '5–8 Working Days'})
                  </span>
                </div>
              </div>

              {/* 3. Complete Eligibility Criteria (Moved inside View Details per Requirement 4) */}
              <div className="p-4 rounded-xl bg-[#F3F6F8] border border-[#DDE3E7] space-y-2">
                <h4 className="text-xs font-bold text-[#17324D] uppercase tracking-wider font-heading flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#287C5A]" />
                  <span>Mandatory Eligibility Criteria</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <strong className="text-[#17324D]">Age Requirement:</strong> {selectedSchemeForModal.minAge || 18} to {selectedSchemeForModal.maxAge || 65} Years
                  </div>
                  <div>
                    <strong className="text-[#17324D]">Annual Income Ceiling:</strong> Up to ₹{Number(selectedSchemeForModal.maxIncome || 500000).toLocaleString('en-IN')}
                  </div>
                  <div>
                    <strong className="text-[#17324D]">Eligible States:</strong> {Array.isArray(selectedSchemeForModal.allowedStates) ? selectedSchemeForModal.allowedStates.join(', ') : 'All India'}
                  </div>
                  <div>
                    <strong className="text-[#17324D]">Application Mode:</strong> Paperless Online with e-KYC Verification
                  </div>
                </div>
              </div>

              {/* 4. Complete Required Documents Dossier (Moved inside View Details per Requirement 4) */}
              <div>
                <h4 className="text-xs font-bold text-[#17324D] uppercase tracking-wider mb-2 font-heading flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#D97706]" />
                  <span>Required Verification Documents</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {Array.isArray(selectedSchemeForModal.requiredDocs) && selectedSchemeForModal.requiredDocs.length > 0 ? (
                    selectedSchemeForModal.requiredDocs.map((doc, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2.5 rounded-lg border border-[#DDE3E7] bg-white text-xs">
                        <CheckCircle2 className="w-4 h-4 text-[#287C5A] flex-shrink-0" />
                        <span className="font-semibold text-[#17324D]">{doc.name || doc}</span>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex items-center gap-2 p-2.5 rounded-lg border border-[#DDE3E7] bg-white text-xs">
                        <CheckCircle2 className="w-4 h-4 text-[#287C5A] flex-shrink-0" />
                        <span className="font-semibold text-[#17324D]">Aadhaar Card (Identity & e-KYC)</span>
                      </div>
                      <div className="flex items-center gap-2 p-2.5 rounded-lg border border-[#DDE3E7] bg-white text-xs">
                        <CheckCircle2 className="w-4 h-4 text-[#287C5A] flex-shrink-0" />
                        <span className="font-semibold text-[#17324D]">Annual Income Certificate (Revenue Department)</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* 5. Interactive Smart Eligibility Screener (starts with empty inputs) */}
              <div className="pt-2">
                <EligibilityCalculator scheme={selectedSchemeForModal} />
              </div>
            </div>

            {/* Modal Bottom Actions: Requirement 3 - Only ONE single Apply Now button */}
            <div className="mt-6 pt-4 border-t border-[#DDE3E7] flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedSchemeForModal(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#17324D] text-xs font-bold transition"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  const s = selectedSchemeForModal;
                  setSelectedSchemeForModal(null);
                  handleApplyClick(s);
                }}
                className="px-6 py-2.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold shadow-sm uppercase tracking-wider font-heading flex items-center gap-2 transition"
              >
                <span>Apply for this Scheme</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Requirement 1: Unauthenticated Citizen Login Prompt Modal for Save Scheme */}
      {showLoginPrompt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-[#17324D] space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#FFF8EE] border border-[#D97706]/30 text-[#D97706] flex items-center justify-center shadow-xs">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#17324D] font-heading">
                Login Required
              </h3>
              <p className="text-xs text-[#526270] mt-1.5 leading-relaxed font-medium">
                Please login to save this scheme.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLoginPrompt(false)}
                className="flex-1 py-2.5 rounded-xl border border-[#DDE3E7] text-[#526270] hover:text-[#17324D] text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLoginPrompt(false);
                  if (onNavigateLogin) onNavigateLogin();
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-bold shadow-sm transition flex items-center justify-center gap-1.5 font-heading uppercase tracking-wider cursor-pointer"
              >
                <span>Login</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
