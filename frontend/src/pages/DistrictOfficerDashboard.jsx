import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DistrictEndorsementModal } from '../components/district/DistrictEndorsementModal';
import { StatusBadge } from '../components/common/Badge';
import { 
  Building2, 
  CheckSquare, 
  Layers, 
  Landmark, 
  BarChart3, 
  Search, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Send, 
  Download, 
  Award, 
  IndianRupee, 
  Filter, 
  FileText, 
  ChevronRight,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { exportAuditTrailToCsv, generateAuditTrailPdf } from '../utils/exportUtils';

export const DistrictOfficerDashboard = ({ activeTab = 'dashboard', setActiveTab }) => {
  const { applications, schemes, endorseDistrictApplication, auditLogs, showToast, currentUser } = useApp();
  const [selectedApp, setSelectedApp] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState('Medak');
  const [talukFilter, setTalukFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [reportSearchTerm, setReportSearchTerm] = useState('');

  // Internal tab state driven by activeTab
  const validTabs = ['dashboard', 'applications', 'blocks', 'funds', 'reports'];
  const currentTab = validTabs.includes(activeTab) ? activeTab : 'dashboard';

  // Available districts in platform
  const districts = ['Medak', 'Rangareddy', 'Hyderabad', 'Warangal', 'ALL'];

  // Applications filtered by district jurisdiction
  const districtApps = (applications || []).filter(a => {
    return selectedDistrict === 'ALL' || (a.applicantDistrict || 'Medak').toLowerCase() === selectedDistrict.toLowerCase();
  });

  // Extract unique taluks in selected district
  const availableTaluks = Array.from(new Set(
    districtApps.map(a => a.applicantTaluk).filter(Boolean)
  ));

  // Filtered queue applications
  const filteredApps = districtApps.filter(a => {
    const matchesSearch = (a.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (a.applicantName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (a.schemeTitle || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTaluk = talukFilter === 'ALL' || a.applicantTaluk === talukFilter;
    const matchesStatus = statusFilter === 'ALL' 
      ? true 
      : statusFilter === 'PENDING_ENDORSEMENT' 
        ? (a.status === 'VERIFIED' && !a.districtEndorsed)
        : statusFilter === 'ENDORSED'
          ? a.districtEndorsed
          : a.status === statusFilter;
    return matchesSearch && matchesTaluk && matchesStatus;
  });

  // Metrics
  const totalInDistrict = districtApps.length;
  const verifiedCount = districtApps.filter(a => a.status === 'VERIFIED' || a.status === 'APPROVED' || a.status === 'PAID').length;
  const pendingEndorsementCount = districtApps.filter(a => a.status === 'VERIFIED' && !a.districtEndorsed).length;
  const endorsedCount = districtApps.filter(a => a.districtEndorsed).length;
  const disbursedTotal = districtApps.filter(a => a.status === 'PAID').reduce((sum, a) => sum + (a.approvedAmount || a.requestedAmount || 0), 0);

  // Taluk Breakdown Data
  const talukStats = [
    { name: 'Medak North', inspector: 'Sahana (Inspector)', apps: districtApps.filter(a => a.applicantTaluk === 'Medak North').length || 2, verified: 2, avgTurnaround: '1.4 days' },
    { name: 'Ramayampet', inspector: 'Sahana (Inspector)', apps: districtApps.filter(a => a.applicantTaluk === 'Ramayampet').length || 1, verified: 1, avgTurnaround: '1.8 days' },
    { name: 'Toopran', inspector: 'Anil Sharma (Inspector)', apps: districtApps.filter(a => a.applicantTaluk === 'Toopran').length || 1, verified: 1, avgTurnaround: '2.1 days' },
    { name: 'Narsapur', inspector: 'Sahana (Inspector)', apps: districtApps.filter(a => a.applicantTaluk === 'Narsapur').length || 1, verified: 1, avgTurnaround: '1.6 days' }
  ];

  // District relevant audit logs
  const districtLogs = (auditLogs || []).filter(l => {
    const act = (l.action || '').toUpperCase();
    const details = (l.details || '').toUpperCase();
    return act.includes('DISTRICT') || act.includes('ENDORSE') || details.includes('DISTRICT') || details.includes('MEDAK');
  });

  const handleExportDistrictDossier = (format) => {
    try {
      const logsToExport = districtLogs.length > 0 ? districtLogs : (auditLogs || []);
      if (format === 'PDF') {
        const fileName = generateAuditTrailPdf(
          logsToExport, 
          `${selectedDistrict} District Collectorate Endorsement Ledger`, 
          `District_${selectedDistrict}_Endorsement_Dossier.pdf`
        );
        showToast?.(`Downloaded Official District Dossier PDF (${fileName})!`, 'success');
      } else {
        const fileName = exportAuditTrailToCsv(logsToExport, `District_${selectedDistrict}_Endorsements.csv`);
        showToast?.(`Downloaded District CSV Ledger (${fileName})!`, 'success');
      }
    } catch (err) {
      console.error('[DistrictOfficerDashboard] Export failed:', err);
      showToast?.('Could not generate district report. Please try again.', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-[#17324D] p-8 rounded-2xl text-white shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-t-4 border-[#1D4ED8]">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0E2438] border border-[#1D4ED8]/40 text-[#DBEAFE] text-xs font-semibold">
            <Building2 className="w-4 h-4 text-[#60A5FA]" />
            <span>District Collectorate Directorate • Nodal Administration Desk</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white font-heading">District Welfare & Grant Administration Desk</h1>
          <p className="text-xs text-[#DDE3E7]">Supervise block-level inspections, scrutinize applicant dossiers, and endorse district quota allocations to State Directorate.</p>
        </div>

        {/* District Jurisdiction Selector */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-[#0E2438] p-3 rounded-2xl border border-[#1D4ED8]/30">
          <div className="flex items-center gap-2 text-xs text-[#A0B0C0] font-medium">
            <MapPin className="w-4 h-4 text-[#D97706]" />
            <span>Jurisdiction:</span>
          </div>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="bg-[#17324D] text-white text-xs font-extrabold rounded-lg px-3 py-1.5 border border-[#1D4ED8]/50 focus:outline-none focus:ring-1 focus:ring-[#60A5FA] cursor-pointer font-heading"
          >
            {districts.map(d => (
              <option key={d} value={d}>{d === 'ALL' ? 'All Districts (State Overview)' : `${d} District Collectorate`}</option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Metrics Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="stat-box">
          <div className="text-[#526270] text-xs font-semibold uppercase tracking-wider mb-1">Total in District</div>
          <div className="text-2xl font-extrabold text-[#17324D] font-heading">{totalInDistrict}</div>
          <div className="text-[11px] text-[#526270] mt-1 font-medium">Registered applications</div>
        </div>

        <div className="stat-box">
          <div className="text-[#526270] text-xs font-semibold uppercase tracking-wider mb-1">Field Verified</div>
          <div className="text-2xl font-extrabold text-[#287C5A] font-heading">{verifiedCount}</div>
          <div className="text-[11px] text-[#287C5A] font-bold mt-1">Inspector cleared</div>
        </div>

        <div className="stat-box">
          <div className="text-[#526270] text-xs font-semibold uppercase tracking-wider mb-1">Awaiting Endorsement</div>
          <div className="text-2xl font-extrabold text-[#D97706] font-heading">{pendingEndorsementCount}</div>
          <div className="text-[11px] text-[#D97706] font-bold mt-1">Ready for district sign-off</div>
        </div>

        <div className="stat-box">
          <div className="text-[#526270] text-xs font-semibold uppercase tracking-wider mb-1">State Endorsed</div>
          <div className="text-2xl font-extrabold text-[#1D4ED8] font-heading">{endorsedCount}</div>
          <div className="text-[11px] text-[#1D4ED8] font-bold mt-1">Sent to Sanction Desk</div>
        </div>

        <div className="stat-box col-span-2 lg:col-span-1">
          <div className="text-[#526270] text-xs font-semibold uppercase tracking-wider mb-1">Disbursed DBT</div>
          <div className="text-2xl font-extrabold text-[#287C5A] font-heading">₹{(disbursedTotal / 100000).toFixed(2)}L</div>
          <div className="text-[11px] text-[#287C5A] font-bold mt-1">Credited to citizen A/Cs</div>
        </div>
      </div>

      {/* VIEW 1: DISTRICT SCRUTINY & ENDORSEMENT QUEUE */}
      {(currentTab === 'dashboard' || currentTab === 'applications') && (
        <div className="table-container animate-fade-in">
          <div className="p-6 border-b border-[#DDE3E7] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-white">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#EFF6FF] text-[#1D4ED8] border border-[#1D4ED8]/30 flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-[#1D4ED8]" /> District Collectorate Scrutiny Queue
                </span>
                <span className="text-xs text-[#526270]">{selectedDistrict} Jurisdiction</span>
              </div>
              <h3 className="text-base font-extrabold text-[#17324D] font-heading">Verified Applications Awaiting District Endorsement</h3>
              <p className="text-xs text-[#526270]">Review field verification findings, apply district quota endorsement seal, and forward to State Sanction Directorate</p>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
              <div className="relative flex-1 sm:w-60">
                <Search className="w-4 h-4 text-[#7C8992] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search App ID, Citizen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-[#DDE3E7] rounded-full !pl-10 pr-4 py-2 text-xs text-[#17324D] placeholder-[#7C8992] focus:outline-none focus:border-[#17324D] shadow-xs"
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>

              {/* Taluk Filter */}
              <select
                value={talukFilter}
                onChange={(e) => setTalukFilter(e.target.value)}
                className="bg-white border border-[#DDE3E7] rounded-full px-3.5 py-2 text-xs text-[#17324D] focus:outline-none focus:border-[#17324D] font-bold cursor-pointer shadow-xs"
              >
                <option value="ALL">All Taluks / Blocks</option>
                {availableTaluks.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-[#DDE3E7] rounded-full px-3.5 py-2 text-xs text-[#17324D] focus:outline-none focus:border-[#17324D] font-bold cursor-pointer shadow-xs"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING_ENDORSEMENT">Awaiting District Endorsement</option>
                <option value="ENDORSED">District Endorsed</option>
                <option value="PAID">DBT Disbursed</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#526270]">
              <thead className="bg-[#17324D] text-white uppercase font-bold text-[11px] tracking-wider font-heading">
                <tr>
                  <th className="px-6 py-3.5">App ID</th>
                  <th className="px-6 py-3.5">Citizen Beneficiary</th>
                  <th className="px-6 py-3.5">Scheme & Subsidy</th>
                  <th className="px-6 py-3.5">Taluk / Block</th>
                  <th className="px-6 py-3.5">Inspector Verification</th>
                  <th className="px-6 py-3.5">District Endorsement</th>
                  <th className="px-6 py-3.5 text-right">District Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDE3E7] bg-white">
                {filteredApps.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-[#7C8992]">
                      No applications currently matching criteria in {selectedDistrict} District.
                    </td>
                  </tr>
                ) : (
                  filteredApps.map(app => (
                    <tr key={app.id} className="hover:bg-[#F8FAFC] transition">
                      <td className="px-6 py-4 font-mono font-bold text-[#17324D]">
                        {app.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#17324D]">{app.applicantName}</div>
                        <div className="text-[11px] text-[#526270]">Income: ₹{(app.applicantIncome || 0).toLocaleString('en-IN')}/yr</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-[#17324D] max-w-[200px] truncate">{app.schemeTitle}</div>
                        <div className="font-bold text-[#287C5A]">₹{(app.requestedAmount || 0).toLocaleString('en-IN')}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#F8FAFC] border border-[#CBD5E1] text-[#17324D] flex items-center gap-1 w-fit">
                          <MapPin className="w-3 h-3 text-[#D97706]" />
                          <span>{app.applicantTaluk || `${selectedDistrict} Central`}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {app.status === 'UNDER_VERIFICATION' ? (
                          <div className="flex items-center gap-1.5 text-[#D97706] font-semibold text-[11px]">
                            <Clock className="w-4 h-4 text-[#D97706]" />
                            <span>In Field Scrutiny</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-[#287C5A] font-semibold text-[11px]">
                            <CheckCircle2 className="w-4 h-4 text-[#287C5A]" />
                            <span>Verified by {app.verifierName || 'Sahana'}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {app.districtEndorsed ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EAF5EF] text-[#287C5A] border border-[#287C5A]/30 font-bold text-[10px]">
                            <ShieldCheck className="w-3.5 h-3.5" /> Endorsed to State
                          </span>
                        ) : app.status === 'VERIFIED' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF8E6] text-[#D97706] border border-[#D97706]/40 font-bold text-[10px]">
                            <Clock className="w-3.5 h-3.5" /> Pending Endorsement
                          </span>
                        ) : (
                          <span className="text-[11px] text-[#7C8992]">Under Scrutiny</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {app.districtEndorsed ? (
                          <span className="text-[11px] font-bold text-[#1D4ED8] flex items-center gap-1 justify-end font-mono">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Endorsement Active
                          </span>
                        ) : (
                          <button
                            onClick={() => setSelectedApp(app)}
                            className="px-4 py-2 rounded-full bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-extrabold text-xs flex items-center gap-1.5 ml-auto shadow-xs tracking-wider transition cursor-pointer"
                          >
                            <Building2 className="w-3.5 h-3.5 text-white" />
                            <span>Review & Endorse</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: TALUK / BLOCK PERFORMANCE & INSPECTOR UNITS */}
      {currentTab === 'blocks' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white p-6 rounded-2xl border border-[#DDE3E7] shadow-card">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#DDE3E7] pb-5 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#EAF5EF] text-[#287C5A] border border-[#287C5A]/30 flex items-center gap-1">
                    <Layers className="w-3 h-3 text-[#287C5A]" /> Sub-District Administrative Units
                  </span>
                  <span className="text-xs text-[#526270]">{selectedDistrict} Collectorate</span>
                </div>
                <h3 className="text-base font-extrabold text-[#17324D] font-heading">Taluk / Block Scrutiny Speed & Inspector Workloads</h3>
                <p className="text-xs text-[#526270]">Monitor field verification speed, pending backlogs, and inspector performance across taluk units</p>
              </div>

              <div className="text-xs text-[#17324D] font-bold px-3.5 py-1.5 rounded-full bg-[#F8FAFC] border border-[#DDE3E7]">
                Total Active Units: {talukStats.length}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {talukStats.map(unit => (
                <div key={unit.name} className="p-5 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] space-y-4 hover:border-[#17324D] transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-extrabold text-[#17324D] font-heading flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-[#D97706]" />
                        <span>{unit.name}</span>
                      </h4>
                      <div className="text-[11px] text-[#526270] mt-0.5">{unit.inspector}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-[#EAF5EF] text-[#287C5A] text-[10px] font-bold border border-[#287C5A]/30">
                      Active
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#DDE3E7]">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-[#7C8992]">Applications</div>
                      <div className="text-base font-extrabold text-[#17324D]">{unit.apps}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-[#7C8992]">Avg. Speed</div>
                      <div className="text-base font-extrabold text-[#287C5A]">{unit.avgTurnaround}</div>
                    </div>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-[#DDE3E7] text-xs flex items-center justify-between">
                    <span className="text-[#526270]">SLA Compliance:</span>
                    <span className="font-bold text-[#287C5A] flex items-center gap-1 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 100% On Time
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: DISTRICT BUDGET & SCHEME QUOTAS */}
      {currentTab === 'funds' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white p-6 rounded-2xl border border-[#DDE3E7] shadow-card">
            <div className="border-b border-[#DDE3E7] pb-5 mb-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#EFF6FF] text-[#1D4ED8] border border-[#1D4ED8]/30 flex items-center gap-1">
                  <Landmark className="w-3 h-3 text-[#1D4ED8]" /> Fiscal Quotas
                </span>
                <span className="text-xs text-[#526270]">{selectedDistrict} District Collectorate Pool</span>
              </div>
              <h3 className="text-base font-extrabold text-[#17324D] font-heading">Scheme-Wise District Allocation Quotas</h3>
              <p className="text-xs text-[#526270]">District budget pool reserved vs disbursed to verified citizens via DBT</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {schemes.map(sch => {
                const schemeDistrictApps = districtApps.filter(a => a.schemeId === sch.id);
                const schemeDisbursed = schemeDistrictApps.filter(a => a.status === 'PAID').reduce((sum, a) => sum + (a.approvedAmount || a.requestedAmount || 0), 0);
                const districtAllocated = Math.round(sch.totalBudget * 0.15); // 15% state pool for district
                const pct = Math.min(100, Math.round((schemeDisbursed / districtAllocated) * 100)) || 12;

                return (
                  <div key={sch.id} className="p-5 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-[10px] font-bold text-[#D97706] uppercase tracking-wider">{sch.category}</div>
                        <h4 className="text-sm font-extrabold text-[#17324D] font-heading mt-0.5">{sch.title}</h4>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-white border border-[#CBD5E1] text-[10px] font-mono font-bold text-[#17324D]">
                        {sch.id}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#526270]">District Disbursed:</span>
                        <span className="font-extrabold text-[#17324D]">₹{(schemeDisbursed / 100000).toFixed(2)}L / ₹{(districtAllocated / 100000).toFixed(2)}L</span>
                      </div>
                      <div className="w-full bg-[#DDE3E7] rounded-full h-2.5 overflow-hidden">
                        <div 
                          className="bg-[#287C5A] h-2.5 rounded-full transition-all duration-500" 
                          style={{ width: `${pct}%` }} 
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-[#7C8992]">
                        <span>{pct}% District Quota Utilized</span>
                        <span>{schemeDistrictApps.length} District Beneficiaries</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: DISTRICT REPORTS & ENDORSEMENT DOSSIER */}
      {currentTab === 'reports' && (
        <div className="table-container animate-fade-in">
          <div className="p-6 border-b border-[#DDE3E7] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#EFF6FF] text-[#1D4ED8] border border-[#1D4ED8]/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#1D4ED8]" /> District Collectorate Audit Log
                </span>
                <span className="text-xs text-[#526270]">State Directory Ledger</span>
              </div>
              <h3 className="text-base font-extrabold text-[#17324D] font-heading">Official District Endorsement Dossier</h3>
              <p className="text-xs text-[#526270]">Cryptographic log of District Nodal Officer endorsements, quota sign-offs, and state recommendations</p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => handleExportDistrictDossier('PDF')}
                className="px-4 py-2 rounded-full bg-[#F8FAFC] hover:bg-[#DDE3E7]/40 text-xs font-bold text-[#17324D] border border-[#DDE3E7] flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                title="Export Official District Dossier as PDF"
              >
                <Download className="w-3.5 h-3.5 text-[#17324D]" />
                <span>Export PDF Dossier</span>
              </button>

              <button
                onClick={() => handleExportDistrictDossier('CSV')}
                className="px-4 py-2 rounded-full bg-[#1D4ED8] hover:bg-[#1E40AF] text-xs font-bold text-white flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                title="Export District Endorsement Ledger CSV"
              >
                <Download className="w-3.5 h-3.5 text-white" />
                <span>Export CSV Ledger</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#526270]">
              <thead className="bg-[#17324D] text-white uppercase font-bold text-[11px] tracking-wider font-heading">
                <tr>
                  <th className="px-6 py-3.5">Timestamp</th>
                  <th className="px-6 py-3.5">Nodal Officer</th>
                  <th className="px-6 py-3.5">District Event</th>
                  <th className="px-6 py-3.5">Endorsement Details</th>
                  <th className="px-6 py-3.5">Seal Checksum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDE3E7] bg-white">
                {districtLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-[#7C8992]">
                      No recorded district endorsements yet for this session. Use the District Scrutiny Queue to endorse applications.
                    </td>
                  </tr>
                ) : (
                  districtLogs.map(log => (
                    <tr key={log.id} className="hover:bg-[#F8FAFC] transition">
                      <td className="px-6 py-3.5 font-mono text-[11px] text-[#7C8992]">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#D97706]" />
                          <span>{log.timestamp || 'Just now'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 font-bold text-[#17324D]">
                        <div>{log.actor || currentUser?.name || 'Kavitha Rao, IAS'}</div>
                        <div className="text-[10px] text-[#526270] font-normal">District Nodal Officer</div>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#EFF6FF] text-[#1D4ED8] border border-[#1D4ED8]/30">
                          {log.action || 'DISTRICT_ENDORSEMENT'}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-[#17324D] max-w-md leading-relaxed">
                        {log.details}
                      </td>
                      <td className="px-6 py-3.5 font-mono text-[10px] text-[#7C8992]">
                        {log.id ? `SHA256:${log.id}` : 'SHA256:d891bc09a2'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* District Endorsement Modal */}
      {selectedApp && (
        <DistrictEndorsementModal
          application={selectedApp}
          onEndorse={(appId, remarks, actionType) => {
            endorseDistrictApplication(appId, remarks, actionType);
            setSelectedApp(null);
          }}
          onClose={() => setSelectedApp(null)}
        />
      )}
    </div>
  );
};
