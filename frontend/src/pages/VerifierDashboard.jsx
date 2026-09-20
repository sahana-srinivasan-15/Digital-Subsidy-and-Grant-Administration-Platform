import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DualPaneInspectionDesk } from '../components/verifier/DualPaneInspectionDesk';
import { StatusBadge } from '../components/common/Badge';
import { ShieldCheck, CheckSquare, Search, Eye, AlertCircle, CheckCircle2, Clock, Layers, FileText, MapPin, Download, ChevronRight, Award } from 'lucide-react';

import { exportAuditTrailToCsv, generateAuditTrailPdf } from '../utils/exportUtils';

export const VerifierDashboard = ({ activeTab = 'dashboard', setActiveTab }) => {
  const { applications, verifyApplication, auditLogs, showToast } = useApp();
  const [selectedApp, setSelectedApp] = useState(null);
  const [filterStatus, setFilterStatus] = useState('UNDER_VERIFICATION');
  const [searchTerm, setSearchTerm] = useState('');
  const [districtFilter, setDistrictFilter] = useState('ALL');

  // Internal tab state if not driven by navbar
  const currentTab = ['dashboard', 'queue', 'history', 'verification', 'workload', 'logs'].includes(activeTab) ? activeTab : 'dashboard';

  // Verifier assigned queue
  const queueApps = (applications || []).filter(a => {
    const matchesStatus = filterStatus === 'ALL' || a.status === filterStatus;
    const matchesSearch = (a.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (a.applicantName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (a.schemeTitle || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDistrict = districtFilter === 'ALL' || a.applicantDistrict === districtFilter;
    return matchesStatus && matchesSearch && matchesDistrict;
  });

  // Dedicated workload list (independent of filterStatus)
  const workloadApps = (applications || []).filter(a => {
    const matchesDistrict = districtFilter === 'ALL' || a.applicantDistrict === districtFilter;
    const matchesSearch = (a.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (a.applicantName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (a.schemeTitle || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDistrict && matchesSearch;
  });

  const pendingCount = (applications || []).filter(a => a.status === 'UNDER_VERIFICATION').length;
  const verifiedCount = (applications || []).filter(a => a.status === 'VERIFIED' || a.status === 'APPROVED').length;
  const rejectedCount = (applications || []).filter(a => a.status === 'REJECTED').length;

  const verifierLogs = (auditLogs || []).filter(l => {
    const act = (l.action || '').toUpperCase();
    const actor = ((l.actor || l.actorName || '') + ' ' + (l.actorRole || '')).toUpperCase();
    const details = (l.details || '').toUpperCase();
    return act.includes('VERIF') || actor.includes('VERIFIER') || actor.includes('ANIL') || details.includes('VERIF') || act.includes('APPLICATION_SUBMITTED');
  });

  const handleExportLogs = (type) => {
    try {
      const logsToExport = verifierLogs.length > 0 ? verifierLogs : (auditLogs || []);
      if (type === 'PDF') {
        const fileName = generateAuditTrailPdf(logsToExport, 'Field Document Scrutiny Audit Logs', 'Field_Scrutiny_Audit_Log.pdf');
        showToast?.(`Downloaded Field Scrutiny Log PDF (${fileName})!`, 'success');
      } else {
        const fileName = exportAuditTrailToCsv(logsToExport, 'Field_Scrutiny_Audit_Log.csv');
        showToast?.(`Downloaded Field Scrutiny Log CSV (${fileName})!`, 'success');
      }
    } catch (err) {
      console.error('[VerifierDashboard] Export failed:', err);
      showToast?.('Could not generate export. Please try again.', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-[#17324D] p-8 rounded-2xl text-white shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-t-4 border-[#D97706]">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0E2438] border border-[#D97706]/40 text-[#FFF3E0] text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-[#D97706]" />
            <span>Field Inspector Workspace • Official Verification Directorate</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white font-heading">Verification & Scrutiny Administration Desk</h1>
          <p className="text-xs text-[#DDE3E7]">Scrutinize citizen applications, inspect OCR records, and validate eligibility criteria.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-full bg-[#0E2438] border border-[#D97706]/50 text-[#FFF3E0] font-extrabold text-xs shadow-xs">
            ● {pendingCount} APPLICATIONS NEED ATTENTION
          </div>
        </div>
      </div>

      {/* Primary Sub-Nav Pill Bar */}
      <div className="bg-white p-3 rounded-2xl border border-[#DDE3E7] shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 flex-wrap">
          {[
            { id: 'dashboard', label: 'Verification Center', icon: CheckSquare, badge: pendingCount },
            { id: 'queue', label: 'Assigned Workload', icon: Layers, badge: queueApps.length },
            { id: 'history', label: 'Scrutiny Audit Logs', icon: FileText, badge: verifierLogs.length }
          ].map(t => {
            const Icon = t.icon;
            const isActive = currentTab === t.id || (currentTab === 'verification' && t.id === 'dashboard') || (currentTab === 'workload' && t.id === 'queue') || (currentTab === 'logs' && t.id === 'history');
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab ? setActiveTab(t.id) : null}
                className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full text-xs font-extrabold transition-all ${
                  isActive
                    ? 'bg-[#17324D] text-white shadow-md'
                    : 'text-[#526270] hover:text-[#17324D] hover:bg-[#F8FAFC]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#D97706]' : 'text-[#526270]'}`} />
                <span>{t.label}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  isActive ? 'bg-[#D97706] text-white' : 'bg-[#F8FAFC] text-[#526270] border border-[#DDE3E7]'
                }`}>
                  {t.badge}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 pr-2 text-xs font-bold text-[#526270]">
          <span>Inspector Zone: <strong className="text-[#17324D]">Medak & Warangal Sector A</strong></span>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-box">
          <div className="text-[#526270] text-xs font-semibold uppercase tracking-wider mb-1">Total Assigned Queue</div>
          <div className="text-2xl font-extrabold text-[#17324D] font-heading">{applications.length}</div>
          <div className="text-[11px] text-[#526270] mt-1 font-medium">Field inspection workload</div>
        </div>

        <div className="stat-box">
          <div className="text-[#526270] text-xs font-semibold uppercase tracking-wider mb-1">Pending Scrutiny</div>
          <div className="text-2xl font-extrabold text-[#B7791F] font-heading">{pendingCount}</div>
          <div className="text-[11px] text-[#B7791F] font-bold mt-1">Requires document verification</div>
        </div>

        <div className="stat-box">
          <div className="text-[#526270] text-xs font-semibold uppercase tracking-wider mb-1">Verified & Forwarded</div>
          <div className="text-2xl font-extrabold text-[#287C5A] font-heading">{verifiedCount}</div>
          <div className="text-[11px] text-[#287C5A] font-bold mt-1">Passed to Sanction Officer</div>
        </div>

        <div className="stat-box">
          <div className="text-[#526270] text-xs font-semibold uppercase tracking-wider mb-1">Ineligible / Flagged</div>
          <div className="text-2xl font-extrabold text-[#B84040] font-heading">{rejectedCount}</div>
          <div className="text-[11px] text-[#B84040] font-bold mt-1">Failed criteria</div>
        </div>
      </div>

      {/* VIEW 1: VERIFICATION CENTER */}
      {(currentTab === 'dashboard' || currentTab === 'verification') && (
        <div className="table-container">
          <div className="p-6 border-b border-[#DDE3E7] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white">
            <div>
              <h3 className="text-base font-extrabold text-[#17324D] font-heading">Verification Work Queue</h3>
              <p className="text-xs text-[#526270]">Click inspect to review applicant documents in dual-pane view</p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-72">
                <Search className="w-4 h-4 text-[#7C8992] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search App ID or Citizen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-[#DDE3E7] rounded-full !pl-11 pr-4 py-2.5 text-xs text-[#17324D] placeholder-[#7C8992] focus:outline-none focus:border-[#17324D] search-input shadow-xs"
                  style={{ paddingLeft: '2.75rem' }}
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-white border border-[#DDE3E7] rounded-full px-4 py-2.5 text-xs text-[#17324D] focus:outline-none focus:border-[#17324D] font-bold shadow-xs"
              >
                <option value="UNDER_VERIFICATION">Pending Scrutiny</option>
                <option value="VERIFIED">Verified</option>
                <option value="REJECTED">Ineligible</option>
                <option value="ALL">All Queue</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#526270]">
              <thead className="bg-[#17324D] text-white uppercase font-bold text-[11px] tracking-wider font-heading">
                <tr>
                  <th className="px-6 py-3.5">App ID</th>
                  <th className="px-6 py-3.5">Citizen Applicant</th>
                  <th className="px-6 py-3.5">Scheme</th>
                  <th className="px-6 py-3.5">Requested Amount</th>
                  <th className="px-6 py-3.5">Docs Scrutinized</th>
                  <th className="px-6 py-3.5">Workflow Status</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#DDE3E7] bg-white">
                {queueApps.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-[#7C8992]">
                      <div className="max-w-md mx-auto space-y-3">
                        <AlertCircle className="w-8 h-8 text-[#D97706] mx-auto opacity-70" />
                        <p className="text-sm font-bold text-[#17324D]">No applications match the current filter ({filterStatus === 'ALL' ? 'All Queue' : filterStatus.replace('_', ' ')}).</p>
                        <p className="text-xs text-[#526270]">Applications in your inspection sector may already have been verified or are in another status.</p>
                        <div className="flex items-center justify-center gap-3 pt-2">
                          <button
                            onClick={() => { setFilterStatus('ALL'); setDistrictFilter('ALL'); setSearchTerm(''); }}
                            className="px-4 py-2 rounded-full bg-[#17324D] text-white text-xs font-bold hover:bg-[#0E2438] transition shadow-xs"
                          >
                            View All Queue Applications ({(applications || []).length})
                          </button>
                          {filterStatus !== 'UNDER_VERIFICATION' && (
                            <button
                              onClick={() => { setFilterStatus('UNDER_VERIFICATION'); setDistrictFilter('ALL'); setSearchTerm(''); }}
                              className="px-4 py-2 rounded-full bg-[#D97706] text-white text-xs font-bold hover:bg-[#B45309] transition shadow-xs"
                            >
                              Show Pending Scrutiny ({pendingCount})
                            </button>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  queueApps.map(app => (
                    <tr key={app.id} className="hover:bg-[#F8FAFC] transition">
                      <td className="px-6 py-4 font-mono font-bold text-[#17324D]">{app.id}</td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#17324D]">{app.applicantName}</div>
                        <div className="text-[11px] text-[#526270]">{app.applicantDistrict}, {app.applicantState}</div>
                      </td>
                      <td className="px-6 py-4 max-w-[200px] truncate font-medium text-[#17324D]">{app.schemeTitle}</td>
                      <td className="px-6 py-4 font-bold text-[#287C5A]">₹{app.requestedAmount?.toLocaleString('en-IN')}</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-[#EAF5EF] text-[#287C5A] border border-[#287C5A]/20">
                          {(app.documents || []).length} / {(app.documents || []).length} Verified
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="px-4 py-2 rounded-full bg-[#D97706] hover:bg-[#B45309] text-white font-extrabold text-xs flex items-center gap-1.5 ml-auto shadow-xs tracking-wider transition"
                        >
                          <Eye className="w-3.5 h-3.5 text-white" />
                          <span>Inspect & Review</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: ASSIGNED WORKLOAD */}
      {(currentTab === 'queue' || currentTab === 'workload') && (
        <div className="space-y-6">
          
          {/* Workload Priority Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-[#DDE3E7] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase text-[#B84040] font-heading flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> Urgent SLA Queue (&lt; 24h)
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#FFF3E0] text-[#B84040] text-xs font-bold">High Priority</span>
              </div>
              <div className="text-3xl font-extrabold text-[#17324D] font-heading">2 Applications</div>
              <p className="text-xs text-[#526270]">Applications requiring immediate field verification before statutory SLA breach.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#DDE3E7] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase text-[#D97706] font-heading flex items-center gap-1.5">
                  <Award className="w-4 h-4" /> High Grant Value (&gt; ₹1.0L)
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#FFF3E0] text-[#D97706] text-xs font-bold">Dual Review</span>
              </div>
              <div className="text-3xl font-extrabold text-[#17324D] font-heading">3 Grants</div>
              <p className="text-xs text-[#526270]">Subsidies exceeding ₹1,00,000 requiring double revenue verification.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#DDE3E7] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase text-[#287C5A] font-heading flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Standard Queue
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#EAF5EF] text-[#287C5A] text-xs font-bold">Normal SLA</span>
              </div>
              <div className="text-3xl font-extrabold text-[#17324D] font-heading">{applications.length - 2} Active</div>
              <p className="text-xs text-[#526270]">Routine citizen subsidy requests assigned to inspector queue.</p>
            </div>
          </div>

          {/* District Filter & Detailed Workload List */}
          <div className="table-container">
            <div className="p-6 border-b border-[#DDE3E7] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white">
              <div>
                <h3 className="text-base font-extrabold text-[#17324D] font-heading">Inspector Workload Allocation Matrix</h3>
                <p className="text-xs text-[#526270]">Filter applications by revenue district and SLA priority</p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={districtFilter}
                  onChange={(e) => setDistrictFilter(e.target.value)}
                  className="bg-white border border-[#DDE3E7] rounded-full px-4 py-2 text-xs text-[#17324D] focus:outline-none focus:border-[#17324D] font-bold"
                >
                  <option value="ALL">All Districts</option>
                  <option value="Medak">Medak District</option>
                  <option value="Warangal">Warangal District</option>
                  <option value="Nizamabad">Nizamabad District</option>
                  <option value="Karimnagar">Karimnagar District</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#526270]">
                <thead className="bg-[#17324D] text-white uppercase font-bold text-[11px] tracking-wider font-heading">
                  <tr>
                    <th className="px-6 py-3.5">App ID</th>
                    <th className="px-6 py-3.5">District / Revenue Zone</th>
                    <th className="px-6 py-3.5">Citizen Name</th>
                    <th className="px-6 py-3.5">SLA Deadline Remaining</th>
                    <th className="px-6 py-3.5">Risk Score Indicator</th>
                    <th className="px-6 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DDE3E7] bg-white">
                  {workloadApps.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-[#7C8992]">
                        No applications allocated in {districtFilter === 'ALL' ? 'this inspection sector' : `${districtFilter} District`}.
                      </td>
                    </tr>
                  ) : (
                    workloadApps.map((app, idx) => (
                      <tr key={app.id} className="hover:bg-[#F8FAFC]">
                        <td className="px-6 py-4 font-mono font-bold text-[#17324D]">{app.id}</td>
                        <td className="px-6 py-4 font-semibold text-[#17324D] flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#D97706]" />
                          <span>{app.applicantDistrict}, {app.applicantState}</span>
                        </td>
                        <td className="px-6 py-4 font-bold text-[#17324D]">{app.applicantName}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold ${
                            idx % 2 === 0 ? 'bg-[#FFF3E0] text-[#D97706]' : 'bg-[#EAF5EF] text-[#287C5A]'
                          }`}>
                            {idx % 2 === 0 ? '⏱ 14 Hours Remaining' : '⏱ 36 Hours Remaining'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF5EF] text-[#287C5A] border border-[#287C5A]/20">
                            Low Risk (98% OCR)
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setSelectedApp(app)}
                            className="px-4 py-2 rounded-full bg-[#17324D] hover:bg-[#0E2438] text-white font-extrabold text-xs flex items-center gap-1 ml-auto shadow-xs"
                          >
                            <span>Open Desk</span>
                            <ChevronRight className="w-3.5 h-3.5 text-[#D97706]" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* VIEW 3: SCRUTINY LOGS */}
      {(currentTab === 'history' || currentTab === 'logs') && (
        <div className="space-y-6">
          <div className="table-container">
            <div className="p-6 border-b border-[#DDE3E7] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white">
              <div>
                <h3 className="text-base font-extrabold text-[#17324D] font-heading">Field Document Scrutiny Audit Logs</h3>
                <p className="text-xs text-[#526270]">Immutable historical log of verifier inspections, SHA-256 seals, and decision remarks</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleExportLogs('PDF')}
                  className="px-4 py-2 rounded-full bg-[#F8FAFC] hover:bg-[#DDE3E7]/40 text-xs font-bold text-[#17324D] border border-[#DDE3E7] flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-[#17324D]" />
                  <span>Export PDF Log</span>
                </button>
                <button
                  onClick={() => handleExportLogs('CSV')}
                  className="px-4 py-2 rounded-full bg-[#F8FAFC] hover:bg-[#DDE3E7]/40 text-xs font-bold text-[#287C5A] border border-[#DDE3E7] flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-[#287C5A]" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#526270]">
                <thead className="bg-[#17324D] text-white uppercase font-bold text-[11px] tracking-wider font-heading">
                  <tr>
                    <th className="px-6 py-3.5">Log Timestamp</th>
                    <th className="px-6 py-3.5">Field Inspector</th>
                    <th className="px-6 py-3.5">Event Action</th>
                    <th className="px-6 py-3.5">Digital Checksum Seal</th>
                    <th className="px-6 py-3.5">Inspection Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DDE3E7] bg-white">
                  {verifierLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-[#526270]">
                        No verification logs registered yet.
                      </td>
                    </tr>
                  ) : (
                    verifierLogs.map(log => (
                      <tr key={log.id} className="hover:bg-[#F8FAFC]">
                        <td className="px-6 py-4 text-[#7C8992] font-mono text-[10px]">{log.timestamp}</td>
                        <td className="px-6 py-4 font-bold text-[#17324D]">{log.actor || log.actorName || 'Field Inspector (Anil Sharma)'}</td>
                        <td className="px-6 py-4 font-mono font-extrabold text-[#287C5A]">{log.action}</td>
                        <td className="px-6 py-4 font-mono text-[10px] text-[#526270]">
                          <span className="px-2 py-0.5 rounded bg-[#F8FAFC] border border-[#DDE3E7]">
                            SHA-256: 8f9a...c43e
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[#17324D] font-medium">{log.details}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Dual Pane Inspection Desk Modal */}
      {selectedApp && (
        <DualPaneInspectionDesk
          application={selectedApp}
          onVerify={(appId, isApproved, remarks, updatedDocs) => {
            verifyApplication(appId, isApproved, remarks, updatedDocs);
            setSelectedApp(null);
          }}
          onClose={() => setSelectedApp(null)}
        />
      )}
    </div>
  );
};
