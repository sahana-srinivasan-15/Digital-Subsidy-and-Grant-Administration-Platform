import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  MessageSquare, 
  Send, 
  Plus, 
  Filter, 
  Search,
  ChevronDown,
  ChevronUp,
  ShieldCheck
} from 'lucide-react';

export const GrievanceRedressalPage = ({ initialScheme, onBackToDashboard: _onBackToDashboard }) => {
  const { currentUser, schemes, grievances, fileGrievance, currentRole } = useApp();
  const [showNewModal, setShowNewModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [expandedId, setExpandedId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    schemeId: initialScheme ? initialScheme.id : (schemes[0]?.id || ''),
    category: 'Application Status',
    priority: 'MEDIUM',
    subject: initialScheme ? `Query regarding ${initialScheme.title}` : '',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.description.trim()) return;

    const selectedScheme = schemes.find(s => s.id === formData.schemeId);
    fileGrievance({
      ...formData,
      schemeTitle: selectedScheme ? selectedScheme.title : 'General Platform Service'
    });

    setFormData({
      schemeId: schemes[0]?.id || '',
      category: 'Application Status',
      priority: 'MEDIUM',
      subject: '',
      description: ''
    });
    setShowNewModal(false);
  };

  // Filter grievances
  const userGrievances = currentRole === 'APPLICANT'
    ? grievances.filter(g => g.citizenId === currentUser.id || g.citizenEmail === currentUser.email)
    : grievances;

  const filteredGrievances = userGrievances.filter(g => {
    const matchesSearch = 
      g.ticketNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.schemeTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.citizenName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || g.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'RESOLVED':
      case 'CLOSED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">Resolved</span>;
      case 'IN_PROGRESS':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">In Progress</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">Open Ticket</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
              Citizen Redressal Desk
            </span>
            <span className="text-xs text-slate-500">Toll-free 1800-11-2026</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Public Grievance Redressal Portal</h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Register concerns regarding application delays, verification queries, or Direct Benefit Transfer disbursement. Every ticket is monitored with an official SLA.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNewModal(true)}
            className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Grievance</span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Total Grievances Logged</div>
          <div className="text-2xl font-extrabold text-[#0f172a] mt-1">{userGrievances.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Under official portal registry</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Pending / In Investigation</div>
          <div className="text-2xl font-extrabold text-amber-700 mt-1">
            {userGrievances.filter(g => g.status === 'OPEN' || g.status === 'IN_PROGRESS').length}
          </div>
          <div className="text-[11px] text-amber-600 mt-1">Average turnaround: 2 working days</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Successfully Resolved</div>
          <div className="text-2xl font-extrabold text-emerald-700 mt-1">
            {userGrievances.filter(g => g.status === 'RESOLVED' || g.status === 'CLOSED').length}
          </div>
          <div className="text-[11px] text-emerald-600 mt-1">Resolution letters generated</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search tickets by ID, subject, or scheme..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg !pl-11 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 search-input shadow-xs"
            style={{ paddingLeft: '2.75rem' }}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 flex items-center gap-1"><Filter className="w-3.5 h-3.5" /> Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      {/* Grievance Ticket Cards */}
      <div className="space-y-4">
        {filteredGrievances.length > 0 ? (
          filteredGrievances.map((grv) => {
            const isExpanded = expandedId === grv.id;
            return (
              <div key={grv.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition hover:border-slate-300">
                <div 
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50"
                  onClick={() => setExpandedId(isExpanded ? null : grv.id)}
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {grv.ticketNo || grv.id}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                        {grv.category}
                      </span>
                      {getStatusBadge(grv.status)}
                    </div>

                    <h3 className="font-bold text-sm text-[#0f172a] mt-1">{grv.subject}</h3>
                    <p className="text-xs text-slate-500">Scheme: <span className="font-medium text-slate-700">{grv.schemeTitle}</span></p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 text-xs text-slate-500">
                    <div className="text-right">
                      <div>Logged: {new Date(grv.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                      <div className="text-[10px] text-slate-400">Assigned: {grv.assignedOfficer || 'Desk Officer'}</div>
                    </div>
                    <div className="p-1 rounded bg-slate-100 text-slate-500">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-5 border-t border-slate-200 bg-slate-50/70 text-xs space-y-4 animate-fade-in">
                    <div>
                      <div className="font-bold text-[#0f172a] mb-1">Citizen Statement</div>
                      <p className="text-slate-700 bg-white p-3.5 rounded-lg border border-slate-200 leading-relaxed">
                        {grv.description}
                      </p>
                    </div>

                    {grv.officerRemarks && (
                      <div>
                        <div className="font-bold text-emerald-800 mb-1 flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-700" />
                          <span>Official Department Resolution Remarks</span>
                        </div>
                        <div className="bg-emerald-50 text-emerald-950 p-3.5 rounded-lg border border-emerald-200 leading-relaxed">
                          <p className="font-medium">{grv.officerRemarks}</p>
                          <div className="text-[10px] text-emerald-700 mt-2">Updated: {new Date(grv.updatedAt || grv.createdAt).toLocaleString()} by {grv.assignedOfficer}</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-slate-500">
            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <div className="font-bold text-base text-[#0f172a]">No Grievances Found</div>
            <p className="text-xs mt-1">You have not raised any active grievances or none match your filter criteria.</p>
          </div>
        )}
      </div>

      {/* New Grievance Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-slide-up text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
              <div>
                <h3 className="font-bold text-base text-[#0f172a]">File Official Grievance</h3>
                <p className="text-xs text-slate-500">Submitted directly to the Public Redressal Officer</p>
              </div>
              <button onClick={() => setShowNewModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Related Scheme</label>
                <select
                  value={formData.schemeId}
                  onChange={(e) => setFormData({ ...formData, schemeId: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600"
                >
                  {schemes.map(s => (
                    <option key={s.id} value={s.id}>{s.title}</option>
                  ))}
                  <option value="GENERAL">General Platform Query / Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Grievance Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600"
                  >
                    <option>Application Status</option>
                    <option>Document Verification</option>
                    <option>DBT Payment / Bank Credit</option>
                    <option>Technical / Portal Issue</option>
                    <option>Appeal against Rejection</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Priority Level</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High (Urgent)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Subject / Summary</label>
                <input
                  type="text"
                  required
                  placeholder="Brief headline of the issue..."
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Comprehensive Description</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide all relevant details, including application reference number or bank transaction details..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold inline-flex items-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" /> Submit Grievance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
