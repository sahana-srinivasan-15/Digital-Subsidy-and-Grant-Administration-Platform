import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/Badge';
import { ApplicationStatusTracker } from '../../components/applicant/ApplicationStatusTracker';
import { ApplicationWizard } from '../../components/applicant/ApplicationWizard';
import { FileText, Search, Eye, IndianRupee, RotateCw } from 'lucide-react';

export const ApplicationsHistoryPage = ({ onFileGrievance }) => {
  const { currentUser, applications, schemes, disburseApplication } = useApp();
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAppModal, setSelectedAppModal] = useState(null);
  const [renewingApp, setRenewingApp] = useState(null);

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

  const filteredApps = myApps.filter(app => {
    const matchesStatus = filterStatus === 'ALL' || app.status === filterStatus;
    const matchesSearch = app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.schemeTitle.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      {selectedAppModal ? (
        <ApplicationStatusTracker 
          application={selectedAppModal} 
          onClose={() => setSelectedAppModal(null)}
          onReapply={(app) => {
            setSelectedAppModal(null);
            setRenewingApp(app);
          }}
          onFileGrievance={(app) => {
            setSelectedAppModal(null);
            if (onFileGrievance) onFileGrievance(app);
          }}
        />
      ) : renewingApp ? (
        <ApplicationWizard
          scheme={schemes.find(s => s.id === renewingApp.schemeId) || { id: renewingApp.schemeId, title: renewingApp.schemeTitle, maxAmount: renewingApp.requestedAmount }}
          isRenewal={true}
          previousApplication={renewingApp}
          onComplete={() => setRenewingApp(null)}
          onCancel={() => setRenewingApp(null)}
        />
      ) : (
        <>
          {/* Header */}
          <div className="bg-[#17324D] p-6 sm:p-8 rounded-xl border-t-4 border-[#D97706] text-white shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#0E2438] border border-[#D97706]/40 text-[#FFF3E0] text-xs font-semibold mb-2">
            <FileText className="w-4 h-4 text-[#D97706]" />
            <span>Citizen Portal Directory • Government Scheme Portal</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white font-heading">Application Tracking & History</h1>
          <p className="text-xs text-[#DDE3E7]">Track all your submitted subsidy applications, document scrutiny status, and approval history.</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="gov-card p-4 rounded-xl border border-[#DDE3E7] bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {[
            { id: 'ALL', label: 'All Applications' },
            { id: 'UNDER_VERIFICATION', label: 'Under Verification' },
            { id: 'VERIFIED', label: 'Verified' },
            { id: 'APPROVED', label: 'Sanctioned' },
            { id: 'PAID', label: 'Disbursed' },
            { id: 'REJECTED', label: 'Declined' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setFilterStatus(t.id)}
              className={`px-3 py-1.5 rounded text-xs font-bold whitespace-nowrap transition ${
                filterStatus === t.id
                  ? 'bg-[#17324D] text-white shadow-xs'
                  : 'bg-[#F8FAFC] text-[#526270] hover:bg-[#DDE3E7]/40 hover:text-[#17324D]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#7C8992] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search App ID or Scheme..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-[#DDE3E7] rounded-lg !pl-11 pr-3 py-2.5 text-xs text-[#17324D] placeholder-[#7C8992] focus:outline-none focus:border-[#17324D] search-input shadow-xs"
            style={{ paddingLeft: '2.75rem' }}
          />
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {filteredApps.length === 0 ? (
          <div className="gov-card p-12 text-center text-[#7C8992] rounded-xl bg-white border border-[#DDE3E7]">
            <FileText className="w-12 h-12 text-[#7C8992] mx-auto mb-3 opacity-50" />
            <h3 className="text-sm font-bold text-[#17324D] font-heading">No Applications Found</h3>
            <p className="text-xs text-[#526270] mt-1">No applications match the active filter criteria.</p>
          </div>
        ) : (
          filteredApps.map(app => (
            <div key={app.id} className="gov-card p-6 rounded-xl border border-[#DDE3E7] bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#17324D] bg-[#F8FAFC] px-2.5 py-0.5 rounded border border-[#DDE3E7]">
                    {app.id}
                  </span>
                  <StatusBadge status={app.status} />
                </div>

                <h3 className="text-base font-bold text-[#17324D] font-heading">{app.schemeTitle}</h3>
                <p className="text-xs text-[#526270]">
                  Submitted: {new Date(app.submittedDate).toLocaleDateString('en-IN')} • Requested: <strong className="text-[#287C5A] font-extrabold">₹{app.requestedAmount?.toLocaleString('en-IN')}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                {app.status === 'APPROVED' && (
                  <button
                    onClick={() => disburseApplication(app.id)}
                    className="px-3.5 py-2 rounded bg-[#287C5A] hover:bg-[#1E6045] text-xs font-bold text-white flex items-center gap-1.5 shadow-sm"
                  >
                    <IndianRupee className="w-3.5 h-3.5 text-white" />
                    <span>⚡ Claim Disbursal</span>
                  </button>
                )}

                {(app.status === 'PAID' || app.status === 'DISBURSED' || app.status === 'REJECTED') && (
                  <button
                    id={`history-reapply-btn-${app.id}`}
                    onClick={() => setRenewingApp(app)}
                    className="px-3.5 py-2 rounded bg-[#D97706] hover:bg-[#B45309] text-xs font-bold text-white flex items-center gap-1.5 shadow-xs transition"
                    title="Renew or Re-apply based on this application"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>{app.status === 'REJECTED' ? 'Re-Apply' : 'Renew Application'}</span>
                  </button>
                )}

                <button
                  onClick={() => setSelectedAppModal(app)}
                  className="px-4 py-2 rounded-xl bg-[#17324D] hover:bg-[#0E2438] text-xs font-bold text-white flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-[#D97706]" />
                  <span>View Timeline</span>
                </button>
              </div>

            </div>
          ))
        )}
      </div>

        </>
      )}
    </div>
  );
};
