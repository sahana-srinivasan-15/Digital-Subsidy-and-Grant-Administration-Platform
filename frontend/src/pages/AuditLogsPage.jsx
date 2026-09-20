import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  Download, 
  Lock
} from 'lucide-react';

import { exportAuditTrailToCsv, generateAuditTrailPdf } from '../utils/exportUtils';

export const AuditLogsPage = () => {
  const { auditLogs } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const filteredLogs = auditLogs.filter(log => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      (log.action || '').toLowerCase().includes(term) ||
      (log.details || '').toLowerCase().includes(term) ||
      (log.actorName || log.actor || '').toLowerCase().includes(term) ||
      (log.id || '').toLowerCase().includes(term);

    const matchesCategory = categoryFilter === 'ALL' || log.eventCategory === categoryFilter;
    const matchesRole = roleFilter === 'ALL' || (log.actorRole || '').includes(roleFilter);

    return matchesSearch && matchesCategory && matchesRole;
  });


  const exportCSV = () => {
    exportAuditTrailToCsv(filteredLogs, 'Audit_Trail.csv');
  };

  const exportPDF = () => {
    generateAuditTrailPdf(filteredLogs, 'System Security & Activity Audit Trail', 'Audit_Trail.pdf');
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'WARN':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">WARN</span>;
      case 'ERROR':
      case 'CRITICAL':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">CRITICAL</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">INFO</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-300 flex items-center gap-1">
              <Lock className="w-3 h-3 text-slate-600" /> Immutable Governance Ledger
            </span>
            <span className="text-xs text-slate-500">ISO 27001 / CERT-In Compliant</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0f172a]">System Security & Activity Audit Trail</h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Cryptographically timestamped record of administrative interventions, document verification decisions, DBT sanctions, and role state mutations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={exportPDF}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs flex items-center gap-2 shadow-xs transition cursor-pointer"
            title="Export Audit Trail as PDF"
          >
            <Download className="w-4 h-4 text-slate-700" />
            <span>Export PDF</span>
          </button>
          <button
            onClick={exportCSV}
            className="px-4 py-2.5 rounded-xl bg-[#287C5A] hover:bg-[#1E6045] text-white font-bold text-xs flex items-center gap-2 shadow-xs transition cursor-pointer"
            title="Export Audit Trail as CSV"
          >
            <Download className="w-4 h-4 text-white" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search audit actions, actors, or event IDs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg !pl-11 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 search-input shadow-xs"
            style={{ paddingLeft: '2.75rem' }}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="SANCTION_APPROVED">Sanctions</option>
            <option value="DOCS_VERIFIED">Verifications</option>
            <option value="SCHEME_CREATED">Scheme Creation</option>
            <option value="GRIEVANCE_FILED">Grievance Events</option>
            <option value="DBT_DISBURSED">DBT Payments</option>
          </select>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none"
          >
            <option value="ALL">All Roles</option>
            <option value="APPLICANT">Applicant</option>
            <option value="VERIFIER">Verifier</option>
            <option value="AUTHORITY">Authority</option>
            <option value="ADMINISTRATOR">Administrator</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-[11px] uppercase tracking-wider bg-slate-50">
                <th className="py-3 px-4">Event ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor & Role</th>
                <th className="py-3 px-4">Event Action</th>
                <th className="py-3 px-4">Details</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 font-sans">
                    <td className="py-3 px-4 font-mono font-bold text-slate-700">{log.id}</td>
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      {typeof log.timestamp === 'string' && log.timestamp.includes('T')
                        ? new Date(log.timestamp).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
                        : log.timestamp}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{log.actorName || log.actor}</div>
                      <div className="text-[10px] text-blue-700 font-medium">{log.actorRole || 'SYSTEM'}</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#0f172a]">{log.action}</td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate">{log.details}</td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{log.ipAddress || log.ip || '10.14.88.21'}</td>
                    <td className="py-3 px-4">{getSeverityBadge(log.severity || 'INFO')}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-sans">
                    No matching audit logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
