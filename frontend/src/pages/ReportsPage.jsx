import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area,
  Legend
} from 'recharts';
import { 
  Download, 
  Printer 
} from 'lucide-react';

export const ReportsPage = () => {
  const { schemes, applications } = useApp();
  const [reportPeriod] = useState('2026-Q3');

  // Application Status breakdown for Pie Chart
  const statusCounts = {
    'Submitted / In Scrutiny': applications.filter(a => a.status === 'SUBMITTED' || a.status === 'UNDER_VERIFICATION').length,
    'Verified by Inspector': applications.filter(a => a.status === 'VERIFIED').length,
    'Sanctioned & Paid': applications.filter(a => a.status === 'APPROVED' || a.status === 'PAID').length,
    'Rejected / Ineligible': applications.filter(a => a.status === 'REJECTED').length
  };

  const statusPieData = [
    { name: 'Under Review', value: statusCounts['Submitted / In Scrutiny'] || 1, color: '#1d4ed8' },
    { name: 'Verified', value: statusCounts['Verified by Inspector'] || 1, color: '#f59e0b' },
    { name: 'Sanctioned & Paid', value: statusCounts['Sanctioned & Paid'] || 2, color: '#10b981' },
    { name: 'Rejected', value: statusCounts['Rejected / Ineligible'] || 1, color: '#ef4444' }
  ];

  // Scheme Beneficiary Chart Data
  const schemeChartData = schemes.slice(0, 6).map(s => ({
    name: s.code || s.title.slice(0, 12),
    applicants: s.applicantsCount || 10,
    approved: s.approvedCount || 5,
    budgetLakhs: Number((s.distributedFund / 100000).toFixed(1))
  }));

  // Monthly Disbursal Trend Data
  const trendData = [
    { month: 'Apr 2026', disbursement: 420, applications: 1850 },
    { month: 'May 2026', disbursement: 680, applications: 2400 },
    { month: 'Jun 2026', disbursement: 980, applications: 3400 },
    { month: 'Jul 2026', disbursement: 1450, applications: 4800 },
    { month: 'Aug 2026', disbursement: 2100, applications: 6200 },
    { month: 'Sep 2026', disbursement: 2850, applications: 7800 }
  ];

  const exportCSV = () => {
    try {
      const headers = 'Application ID,Applicant Name,Scheme Title,Amount (INR),Status,Submission Date\r\n';
      const rows = applications.map(a => 
        `"${(a.id || '').replace(/"/g, '""')}","${(a.applicantName || '').replace(/"/g, '""')}","${(a.schemeTitle || '').replace(/"/g, '""')}","${a.approvedAmount || a.requestedAmount || 0}","${a.status || ''}","${a.submittedDate ? new Date(a.submittedDate).toLocaleDateString('en-IN') : ''}"`
      ).join('\r\n');

      const blob = new Blob(['\uFEFF' + headers + rows], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const fileName = `DSGA_Analytics_Report_${reportPeriod}.csv`;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast?.(`Downloaded Analytics CSV Dataset (${fileName})!`, 'success');
    } catch (err) {
      console.error('[ReportsPage] Failed to export CSV dataset:', err);
      showToast?.('Failed to export CSV dataset. Please try again.', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
              National DBT Dashboard
            </span>
            <span className="text-xs text-slate-500">Live Telemetry & Audited Reporting</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Direct Benefit Transfer Analytics & Reports</h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Statistical breakdown of scheme distribution, verification velocity, fund disbursal trends, and district performance metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center gap-2 border border-slate-300 transition"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Print Report</span>
          </button>
          <button
            onClick={exportCSV}
            className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV Dataset</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8 text-xs">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-slate-500 block">Total Grant Volume</span>
          <div className="text-2xl font-extrabold text-[#0f172a] mt-1">₹34.8 Cr</div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">↑ 18.4% vs previous quarter</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-slate-500 block">Active Beneficiaries</span>
          <div className="text-2xl font-extrabold text-[#0f172a] mt-1">68,410</div>
          <span className="text-[11px] text-slate-500 mt-1 block">100% Aadhaar Seeded</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-slate-500 block">Verification Turnaround SLA</span>
          <div className="text-2xl font-extrabold text-blue-700 mt-1">4.2 Days</div>
          <span className="text-[11px] text-blue-600 font-semibold mt-1 block">Within 7-day statutory limit</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-slate-500 block">PFMS Transaction Success</span>
          <div className="text-2xl font-extrabold text-emerald-700 mt-1">99.82%</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Zero intermediary leaks</span>
        </div>
      </div>

      {/* Main Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Chart 1: Disbursement Trend Over Time */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#0f172a]">Cumulative DBT Disbursement Trend</h3>
              <p className="text-xs text-slate-500">Total funds credited (in Lakhs ₹) by month</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700">FY 2026-27</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="disburseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} 
                />
                <Area type="monotone" dataKey="disbursement" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#disburseGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Application Pipeline Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#0f172a]">Application Lifecycle Distribution</h3>
              <p className="text-xs text-slate-500">Live status breakdown across all schemes</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700">Real-time</span>
          </div>

          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} 
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Chart 3: Scheme-wise Performance & Beneficiaries */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-[#0f172a]">Scheme-wise Application & Approval Comparison</h3>
            <p className="text-xs text-slate-500">Applicants applied vs verified approvals across key welfare schemes</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700">Top Schemes</span>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={schemeChartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} 
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="applicants" name="Total Applicants" fill="#93c5fd" radius={[6, 6, 0, 0]} />
              <Bar dataKey="approved" name="Sanctioned Approvals" fill="#1d4ed8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
