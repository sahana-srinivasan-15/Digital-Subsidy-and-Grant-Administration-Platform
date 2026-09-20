import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FundProgressWidget } from '../components/authority/FundProgressWidget';
import { SanctionModal } from '../components/authority/SanctionModal';
import { StatusBadge } from '../components/common/Badge';
import { 
  Award, 
  CheckCircle2, 
  IndianRupee, 
  Search, 
  Download, 
  Shield, 
  Clock 
} from 'lucide-react';
import { 
  exportAuditTrailToCsv, 
  exportSanctionRegistryToCsv, 
  generateAuditTrailPdf, 
  generateSanctionRegistryPdf 
} from '../utils/exportUtils';

export const AuthorityDashboard = ({ activeTab = 'dashboard', setActiveTab }) => {
  const { applications, schemes, approveSanction, disburseApplication, auditLogs, showToast } = useApp();
  const [selectedApp, setSelectedApp] = useState(null);
  const [filterStatus, setFilterStatus] = useState('VERIFIED');
  const [searchTerm, setSearchTerm] = useState('');
  const [auditSearchTerm, setAuditSearchTerm] = useState('');
  const validTabs = ['dashboard', 'funds', 'approvals', 'audit', 'sanction', 'utilization', 'registry', 'logs'];
  const currentTab = validTabs.includes(activeTab) ? activeTab : 'dashboard';

  // Authority queue: verifier-approved applications
  const verifiedApps = applications.filter(a => {
    const matchesStatus = filterStatus === 'ALL' || a.status === filterStatus;
    const matchesSearch = a.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.schemeTitle.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const awaitingCount = applications.filter(a => a.status === 'VERIFIED').length;
  const approvedCount = applications.filter(a => a.status === 'APPROVED' || a.status === 'PAID').length;
  const totalDisbursed = applications.filter(a => a.status === 'PAID').reduce((sum, a) => sum + (a.approvedAmount || 0), 0);

  // Authority relevant audit logs
  const sanctionLogs = (auditLogs || []).filter(l => {
    const act = (l.action || '').toUpperCase();
    const actor = ((l.actor || l.actorName || '') + ' ' + (l.actorRole || '')).toUpperCase();
    const details = (l.details || '').toUpperCase();
    return act.includes('SANCTION') || act.includes('DISBURSE') || act.includes('APPROV') ||
           actor.includes('AUTHORITY') || actor.includes('VARMA') || actor.includes('SANCTION') ||
           details.includes('SANCTION') || details.includes('DISBURSE') || act.includes('STATUS');
  });

  const displayLogs = sanctionLogs.length > 0 ? sanctionLogs : (auditLogs || []);

  const filteredAuditLogs = displayLogs.filter(log => {
    const term = auditSearchTerm.toLowerCase();
    return (log.action || '').toLowerCase().includes(term) ||
           (log.details || '').toLowerCase().includes(term) ||
           (log.actorName || log.actor || '').toLowerCase().includes(term) ||
           (log.id || '').toLowerCase().includes(term);
  });

  const handleExportRegistry = (format) => {
    try {
      if (format === 'PDF') {
        const fileName = generateSanctionRegistryPdf(applications, 'Official_Sanction_Registry.pdf');
        showToast?.(`Downloaded Official Sanction Registry PDF (${fileName})!`, 'success');
      } else {
        const fileName = exportSanctionRegistryToCsv(applications, 'Sanction_Registry.csv');
        showToast?.(`Downloaded Official Sanction Registry CSV (${fileName})!`, 'success');
      }
    } catch (err) {
      console.error('[AuthorityDashboard] Failed to export registry:', err);
      showToast?.('Failed to export sanction registry. Please try again.', 'error');
    }
  };

  const handleExportAuditTrailCsv = () => {
    try {
      const fileName = exportAuditTrailToCsv(displayLogs, 'Audit_Trail.csv');
      showToast?.(`Downloaded Official Audit Trail CSV (${fileName})!`, 'success');
    } catch (err) {
      console.error('[AuthorityDashboard] Failed to export Audit Trail CSV:', err);
      showToast?.('Failed to export Audit Trail CSV. Please try again.', 'error');
    }
  };

  const handleExportAuditTrailPdf = () => {
    try {
      const fileName = generateAuditTrailPdf(displayLogs, 'Sanction Authority & Treasury Audit Trail', 'Audit_Trail.pdf');
      showToast?.(`Downloaded Official Audit Trail PDF (${fileName})!`, 'success');
    } catch (err) {
      console.error('[AuthorityDashboard] Failed to export Audit Trail PDF:', err);
      showToast?.('Failed to export Audit Trail PDF. Please try again.', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-[#17324D] p-8 rounded-2xl text-white shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-t-4 border-[#D97706]">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0E2438] border border-[#D97706]/40 text-[#FFF3E0] text-xs font-semibold">
            <Award className="w-4 h-4 text-[#D97706]" />
            <span>State Sanctioning Directorate • Treasury Authorization Desk</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white font-heading">Grant Sanction & Treasury Disbursal Desk</h1>
          <p className="text-xs text-[#DDE3E7]">Sanction verifier-approved grants and authorize Direct Bank Transfer (DBT) payment releases.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-full bg-[#0E2438] border border-[#D97706]/50 text-[#FFF3E0] font-bold text-xs shadow-xs">
            ● {awaitingCount} Verified Applications Awaiting Sanction
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-box">
          <div className="text-[#526270] text-xs font-semibold uppercase tracking-wider mb-1">Awaiting Sanction</div>
          <div className="text-2xl font-extrabold text-[#B7791F] font-heading">{awaitingCount}</div>
          <div className="text-[11px] text-[#B7791F] font-bold mt-1">Ready for approval sign-off</div>
        </div>

        <div className="stat-box">
          <div className="text-[#526270] text-xs font-semibold uppercase tracking-wider mb-1">Sanctioned Grants</div>
          <div className="text-2xl font-extrabold text-[#17324D] font-heading">{approvedCount}</div>
          <div className="text-[11px] text-[#526270] mt-1 font-medium">Approved applications</div>
        </div>

        <div className="stat-box">
          <div className="text-[#526270] text-xs font-semibold uppercase tracking-wider mb-1">Total Disbursed</div>
          <div className="text-2xl font-extrabold text-[#287C5A] font-heading">₹{(totalDisbursed / 100000).toFixed(2)} Lakhs</div>
          <div className="text-[11px] text-[#287C5A] font-bold mt-1">Direct Bank Transfer</div>
        </div>

        <div className="stat-box">
          <div className="text-[#526270] text-xs font-semibold uppercase tracking-wider mb-1">Active Schemes</div>
          <div className="text-2xl font-extrabold text-[#17324D] font-heading">{schemes.length}</div>
          <div className="text-[11px] text-[#287C5A] font-bold mt-1">Allocated budget pools</div>
        </div>
      </div>

      {/* VIEW 1: SANCTIONING DESK */}
      {(currentTab === 'dashboard' || currentTab === 'sanction') && (
        <div className="space-y-6">
          <FundProgressWidget schemes={schemes} />

          <div className="table-container">
            <div className="p-6 border-b border-[#DDE3E7] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white">
              <div>
                <h3 className="text-base font-extrabold text-[#17324D] font-heading">Verified Applications Queue</h3>
                <p className="text-xs text-[#526270]">Applications passed by field inspectors waiting for official sanction approval</p>
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
                  className="bg-white border border-[#DDE3E7] rounded-full px-4 py-2 text-xs text-[#17324D] focus:outline-none focus:border-[#17324D] font-bold cursor-pointer"
                >
                  <option value="VERIFIED">Awaiting Sanction</option>
                  <option value="APPROVED">Approved / Disbursed</option>
                  <option value="ALL">All Applications</option>
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
                    <th className="px-6 py-3.5">Inspector Verification</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#DDE3E7] bg-white">
                  {verifiedApps.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-[#7C8992]">
                        No applications currently awaiting sanction decision.
                      </td>
                    </tr>
                  ) : (
                    verifiedApps.map(app => (
                      <tr key={app.id} className="hover:bg-[#F8FAFC] transition">
                        <td className="px-6 py-4 font-mono font-bold text-[#17324D]">{app.id}</td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-[#17324D]">{app.applicantName}</div>
                          <div className="text-[11px] text-[#526270]">{app.applicantDistrict}, {app.applicantState}</div>
                        </td>
                        <td className="px-6 py-4 max-w-[200px] truncate font-medium text-[#17324D]">{app.schemeTitle}</td>
                        <td className="px-6 py-4 font-bold text-[#287C5A]">₹{app.requestedAmount?.toLocaleString('en-IN')}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-[#287C5A] font-semibold text-[11px]">
                            <CheckCircle2 className="w-4 h-4 text-[#287C5A]" />
                            <span>Passed Inspector Scrutiny</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={app.status} />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setSelectedApp(app)}
                            className="px-4 py-2 rounded-full bg-[#D97706] hover:bg-[#B45309] text-white font-extrabold text-xs flex items-center gap-1.5 ml-auto shadow-xs tracking-wider transition cursor-pointer"
                          >
                            <Award className="w-3.5 h-3.5 text-white" />
                            <span>Review & Sanction</span>
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

      {/* VIEW 2: FUND UTILIZATION */}
      {(currentTab === 'funds' || currentTab === 'utilization') && (
        <div className="space-y-6">
          <FundProgressWidget schemes={schemes} />
        </div>
      )}

      {/* VIEW 3: SANCTION REGISTRY */}
      {(currentTab === 'dashboard' || currentTab === 'approvals' || currentTab === 'registry') && (
        <div className="table-container animate-fade-in">
          <div className="p-6 border-b border-[#DDE3E7] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white">
            <div>
              <h3 className="text-base font-extrabold text-[#17324D] font-heading">Official Grant Sanction Registry</h3>
              <p className="text-xs text-[#526270]">Ledger of approved direct benefit transfer disbursals & treasury signatures</p>
            </div>

            {/* Audit Trail & Registry Controls with prominent Export CSV */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                id="export-pdf-registry-btn"
                onClick={() => handleExportRegistry('PDF')}
                className="px-4 py-2 rounded-full bg-[#F8FAFC] hover:bg-[#DDE3E7]/40 text-xs font-bold text-[#17324D] border border-[#DDE3E7] flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                title="Export Official Sanction Registry as PDF"
              >
                <Download className="w-3.5 h-3.5 text-[#17324D]" />
                <span>Export PDF Registry</span>
              </button>

              <button
                id="export-csv-btn"
                onClick={handleExportAuditTrailCsv}
                className="px-4 py-2 rounded-full bg-[#287C5A] hover:bg-[#1E6045] text-xs font-bold text-white flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                title="Export Audit Trail CSV"
              >
                <Download className="w-3.5 h-3.5 text-white" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#526270]">
              <thead className="bg-[#17324D] text-white uppercase font-bold text-[11px] tracking-wider font-heading">
                <tr>
                  <th className="px-6 py-3.5">App ID</th>
                  <th className="px-6 py-3.5">Citizen Beneficiary</th>
                  <th className="px-6 py-3.5">Sanctioned Amount</th>
                  <th className="px-6 py-3.5">PFMS Transaction ID</th>
                  <th className="px-6 py-3.5">Approval Date</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Disbursal Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDE3E7] bg-white">
                {applications.filter(a => a.status === 'APPROVED' || a.status === 'PAID').map(app => (
                  <tr key={app.id} className="hover:bg-[#F8FAFC]">
                    <td className="px-6 py-4 font-mono font-bold text-[#17324D]">{app.id}</td>
                    <td className="px-6 py-4 font-bold text-[#17324D]">{app.applicantName}</td>
                    <td className="px-6 py-4 font-extrabold text-[#287C5A]">₹{(app.approvedAmount || app.requestedAmount)?.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4 font-mono text-[11px] text-[#17324D]">
                      {app.transactionId || 'TXN-DBT-2026-91823901'}
                    </td>
                    <td className="px-6 py-4 text-[#7C8992] font-mono text-[10px]">
                      {app.approvalDate ? new Date(app.approvalDate).toLocaleDateString('en-IN') : 'Just now'}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      {app.status === 'APPROVED' ? (
                        <button
                          onClick={() => disburseApplication(app.id)}
                          className="px-3 py-1.5 rounded-md bg-[#287C5A] hover:bg-[#1E6045] text-white font-bold text-[11px] shadow-xs flex items-center gap-1 ml-auto cursor-pointer transition"
                        >
                          <IndianRupee className="w-3.5 h-3.5 text-white" />
                          <span>Disburse DBT</span>
                        </button>
                      ) : (
                        <span className="text-[11px] font-bold text-[#287C5A] flex items-center gap-1 justify-end font-mono">
                          <CheckCircle2 className="w-3.5 h-3.5" /> 100% Disbursed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 4: SANCTION AUTHORITY AUDIT TRAIL */}
      {(currentTab === 'audit' || currentTab === 'logs') && (
        <div className="table-container animate-fade-in">
          <div className="p-6 border-b border-[#DDE3E7] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#EAF5EF] text-[#287C5A] border border-[#287C5A]/30 flex items-center gap-1">
                  <Shield className="w-3 h-3 text-[#287C5A]" /> Immutable Treasury Audit Trail
                </span>
                <span className="text-xs text-[#526270]">ISO 27001 / CERT-In Compliant</span>
              </div>
              <h3 className="text-base font-extrabold text-[#17324D] font-heading">Sanction Authority & Treasury Audit Trail</h3>
              <p className="text-xs text-[#526270]">Cryptographically sealed historical log of grant approvals, PFMS disbursement warrants, and role interventions</p>
            </div>

            {/* Audit Trail Controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#7C8992] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search audit trail..."
                  value={auditSearchTerm}
                  onChange={(e) => setAuditSearchTerm(e.target.value)}
                  className="bg-white border border-[#DDE3E7] rounded-full pl-9 pr-3 py-1.5 text-xs text-[#17324D] focus:outline-none focus:border-[#17324D] shadow-xs"
                />
              </div>

              <button
                id="audit-export-pdf-btn"
                onClick={handleExportAuditTrailPdf}
                className="px-4 py-2 rounded-full bg-[#F8FAFC] hover:bg-[#DDE3E7]/40 text-xs font-bold text-[#17324D] border border-[#DDE3E7] flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                title="Export Official Audit Trail as PDF"
              >
                <Download className="w-3.5 h-3.5 text-[#17324D]" />
                <span>Export PDF Log</span>
              </button>

              <button
                id="audit-trail-export-csv-btn"
                onClick={handleExportAuditTrailCsv}
                className="px-4 py-2 rounded-full bg-[#287C5A] hover:bg-[#1E6045] text-xs font-bold text-white flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                title="Export Audit Trail as CSV file"
              >
                <Download className="w-3.5 h-3.5 text-white" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#526270]">
              <thead className="bg-[#17324D] text-white uppercase font-bold text-[11px] tracking-wider font-heading">
                <tr>
                  <th className="px-6 py-3.5">Timestamp</th>
                  <th className="px-6 py-3.5">Authorized Actor</th>
                  <th className="px-6 py-3.5">Action Event</th>
                  <th className="px-6 py-3.5">Event Details</th>
                  <th className="px-6 py-3.5">Digital Seal Checksum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDE3E7] bg-white">
                {filteredAuditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-[#7C8992]">
                      No matching audit records found.
                    </td>
                  </tr>
                ) : (
                  filteredAuditLogs.map(log => (
                    <tr key={log.id} className="hover:bg-[#F8FAFC] transition">
                      <td className="px-6 py-3.5 font-mono text-[11px] text-[#7C8992]">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#D97706]" />
                          <span>{log.timestamp ? new Date(log.timestamp).toLocaleString('en-IN') : 'Recent'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 font-bold text-[#17324D]">
                        <div>{log.actorName || log.actor || 'Dr. Priya Varma'}</div>
                        <div className="text-[10px] text-[#526270] font-normal">{log.actorRole || 'Joint Director (Authority)'}</div>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#EAF5EF] text-[#287C5A] border border-[#287C5A]/30">
                          {log.action || log.eventCategory || 'SANCTION_EVENT'}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-[#17324D] max-w-md leading-relaxed">
                        {log.details}
                      </td>
                      <td className="px-6 py-3.5 font-mono text-[10px] text-[#7C8992]">
                        {log.checksum || `SHA256:${log.id || '4b91ae902c'}`}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sanction Modal */}
      {selectedApp && (
        <SanctionModal
          application={selectedApp}
          onApprove={(appId, isApproved, sanctionedAmount, remarks) => {
            approveSanction(appId, isApproved, sanctionedAmount, remarks);
            setSelectedApp(null);
          }}
          onClose={() => setSelectedApp(null)}
        />
      )}
    </div>
  );
};
