import React, { useState, useMemo } from 'react';
import { useApp, deduplicateUsers } from '../context/AppContext';
import { getSafeAvatar } from '../utils/avatar';
import { SchemeFormModal } from '../components/admin/SchemeFormModal';
import { UserFormModal } from '../components/admin/UserFormModal';
import { StatusBadge } from '../components/common/Badge';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { 
  Settings, 
  Plus, 
  Users, 
  Landmark, 
  BarChart3, 
  Search, 
  Activity, 
  AlertTriangle, 
  MapPin,
  Power,
  Info,
  X,
  Check,
  Trash2,
  UserPlus,
  Shield
} from 'lucide-react';

export const AdminDashboard = ({ activeTab = 'dashboard', setActiveTab: setParentActiveTab }) => {
  const { 
    schemes, 
    users, 
    applications, 
    createScheme, 
    toggleSchemeStatus, 
    deleteScheme,
    addUser,
    removeUser,
    currentUser
  } = useApp();

  // Internal tab state: 'PULSE' (default), 'USERS'
  const [localTab, setLocalTab] = useState(() => {
    if (activeTab === 'users') return 'USERS';
    return 'PULSE';
  });

  const effectiveTab = localTab;

  const handleTabChange = (t) => {
    setLocalTab(t);
    if (setParentActiveTab) {
      if (t === 'PULSE') setParentActiveTab('dashboard');
      else setParentActiveTab(t.toLowerCase());
    }
  };

  // Modals state
  const [isSchemeModalOpen, setIsSchemeModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedSchemeDetails, setSelectedSchemeDetails] = useState(null);
  const [schemeToDelete, setSchemeToDelete] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  // Search & Filter state for Schemes Registry inside Pulse
  const [schemeSearch, setSchemeSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Search & Filter state for User RBAC Directory
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('ALL');

  // Strictly deduplicated list of accounts
  const uniqueUsers = useMemo(() => {
    return deduplicateUsers(users || []);
  }, [users]);

  const filteredSchemes = (schemes || []).filter(s => {
    const matchesSearch = (s.title || '').toLowerCase().includes(schemeSearch.toLowerCase()) ||
                          (s.code || '').toLowerCase().includes(schemeSearch.toLowerCase()) ||
                          (s.department || '').toLowerCase().includes(schemeSearch.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || s.category === selectedCategory;
    const matchesStatus = selectedStatus === 'ALL' || s.status === selectedStatus;
    return matchesSearch && matchesCat && matchesStatus;
  });

  const filteredUsers = uniqueUsers.filter(u => {
    const matchesSearch = (u.name || '').toLowerCase().includes(userSearch.toLowerCase()) ||
                          (u.email || '').toLowerCase().includes(userSearch.toLowerCase()) ||
                          (u.role || '').toLowerCase().includes(userSearch.toLowerCase()) ||
                          (u.department || u.district || '').toLowerCase().includes(userSearch.toLowerCase());

    const r = (u.role || '').toUpperCase();
    let matchesRole = true;
    if (userRoleFilter === 'CITIZENS') {
      matchesRole = r === 'APPLICANT' || r === 'CITIZEN' || r === 'BENEFICIARY';
    } else if (userRoleFilter === 'OFFICERS') {
      matchesRole = r === 'VERIFIER' || r === 'DISTRICT_OFFICER' || r === 'AUTHORITY';
    } else if (userRoleFilter === 'ADMIN') {
      matchesRole = r === 'ADMINISTRATOR' || r === 'ADMIN' || r === 'CHIEF_ADMINISTRATOR';
    }
    return matchesSearch && matchesRole;
  });

  const officerCount = uniqueUsers.filter(u => {
    const r = (u.role || '').toUpperCase();
    return r === 'VERIFIER' || r === 'DISTRICT_OFFICER' || r === 'AUTHORITY';
  }).length;

  const citizenCount = uniqueUsers.filter(u => {
    const r = (u.role || '').toUpperCase();
    return r === 'APPLICANT' || r === 'CITIZEN' || r === 'BENEFICIARY';
  }).length;

  const adminCount = uniqueUsers.filter(u => {
    const r = (u.role || '').toUpperCase();
    return r === 'ADMINISTRATOR' || r === 'ADMIN' || r === 'CHIEF_ADMINISTRATOR';
  }).length;

  // Financial aggregates
  const totalFundPool = schemes.reduce((sum, s) => sum + (Number(s.totalFund) || 0), 0);
  const totalDistributed = schemes.reduce((sum, s) => sum + (Number(s.distributedFund) || 0), 0);
  const totalApplicants = schemes.reduce((sum, s) => sum + (Number(s.applicantsCount) || 0), 0);

  // Analytical Charts Seed Data
  const trendData = [
    { month: 'Jan', applications: 2400, approved: 1800 },
    { month: 'Feb', applications: 3200, approved: 2400 },
    { month: 'Mar', applications: 4500, approved: 3100 },
    { month: 'Apr', applications: 5800, approved: 4200 },
    { month: 'May', applications: 7200, approved: 5600 },
    { month: 'Jun', applications: 8900, approved: 6800 },
    { month: 'Jul', applications: 10400, approved: 7900 },
    { month: 'Aug', applications: 11800, approved: 8500 },
    { month: 'Sep', applications: 12458, approved: 8932 }
  ];

  const pieData = [
    { name: 'Agriculture', value: 42, color: '#17324D' },
    { name: 'Housing', value: 28, color: '#287C5A' },
    { name: 'Education', value: 18, color: '#D97706' },
    { name: 'MSME & Women', value: 12, color: '#526270' }
  ];

  const districtData = [
    { district: 'Medak', applications: 3420, fundDisbursed: 12.4 },
    { district: 'Warangal', applications: 2850, fundDisbursed: 9.8 },
    { district: 'Nizamabad', applications: 2100, fundDisbursed: 7.6 },
    { district: 'Karimnagar', applications: 1980, fundDisbursed: 6.5 },
    { district: 'Hyderabad', applications: 2108, fundDisbursed: 6.5 }
  ];

  const rejectionReasons = [
    { reason: 'Income Ceiling Exceeded (> ₹5L)', count: 520, percent: 42, color: '#B84040' },
    { reason: 'Incomplete Land Revenue Records', count: 346, percent: 28, color: '#D97706' },
    { reason: 'Age Out of Scheme Criteria', count: 198, percent: 16, color: '#526270' },
    { reason: 'Aadhaar Biometric / OCR Mismatch', count: 173, percent: 14, color: '#665C8A' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Top Navigation Tabs for Admin Desk (Only Pulse & Schemes, and User RBAC) */}
      <div className="flex items-center justify-between border-b border-[#DDE3E7] pb-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'PULSE', label: `Executive Pulse & Schemes (${schemes.length})`, icon: BarChart3 },
            { id: 'USERS', label: `User & Officer RBAC (${uniqueUsers.length})`, icon: Users }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = effectiveTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#17324D] text-white shadow-md'
                    : 'bg-[#F8FAFC] text-[#526270] hover:text-[#17324D] hover:bg-[#EBF2F7] border border-[#DDE3E7]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#D97706]' : 'text-[#526270]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: EXECUTIVE PULSE TELEMETRY & SCHEMES (Primary Pulse Workspace)     */}
      {/* ========================================================================= */}
      {effectiveTab === 'PULSE' && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Executive Header Banner (Contains the SINGLE + Create New Scheme Button) */}
          <div className="bg-[#17324D] p-8 rounded-2xl text-white shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-t-4 border-[#D97706]">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0E2438] border border-[#D97706]/40 text-[#FFF3E0] text-xs font-semibold">
                <Settings className="w-4 h-4 text-[#D97706]" />
                <span>Chief Executive Administration Workspace • National DBT Oversight</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                Programme Analytics & Telemetry Room
              </h1>
              <p className="text-xs text-[#DDE3E7]">
                Real-time throughput, SLA metrics, budget allocation, and unified welfare scheme creation & governance.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setIsSchemeModalOpen(true)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-xs shadow-sm hover:shadow-md border border-blue-400/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 cursor-pointer flex-shrink-0"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Create New Scheme</span>
              </button>
              
              <button
                onClick={() => handleTabChange('USERS')}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition flex items-center gap-1.5 cursor-pointer flex-shrink-0"
              >
                <Users className="w-3.5 h-3.5 text-[#D97706]" />
                <span>Manage Personnel ({uniqueUsers.length})</span>
              </button>
            </div>
          </div>

          {/* Primary KPI Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="stat-box">
              <div className="text-[#526270] text-xs font-semibold uppercase tracking-wider mb-1">Total Submissions</div>
              <div className="text-2xl font-extrabold text-[#17324D] font-heading">12,458</div>
              <div className="text-[11px] text-[#287C5A] font-bold mt-1">↑ +12.4% vs last month</div>
            </div>

            <div className="stat-box">
              <div className="text-[#526270] text-xs font-semibold uppercase tracking-wider mb-1">Pending Scrutiny</div>
              <div className="text-2xl font-extrabold text-[#17324D] font-heading">1,245</div>
              <div className="text-[11px] text-[#B7791F] font-bold mt-1">● 18 SLA alerts</div>
            </div>

            <div className="stat-box">
              <div className="text-[#526270] text-xs font-semibold uppercase tracking-wider mb-1">Approved & Sanctioned</div>
              <div className="text-2xl font-extrabold text-[#17324D] font-heading">8,932</div>
              <div className="text-[11px] text-[#287C5A] font-bold mt-1">71.7% approval rate</div>
            </div>

            <div className="stat-box">
              <div className="text-[#526270] text-xs font-semibold uppercase tracking-wider mb-1">Treasury Disbursed</div>
              <div className="text-2xl font-extrabold text-[#287C5A] font-heading">₹{(totalDistributed / 10000000).toFixed(2)} Cr</div>
              <div className="text-[11px] text-[#287C5A] font-bold mt-1">Direct Bank Transfer (DBT)</div>
            </div>
          </div>

          {/* Operational SLA & Gateway Health Telemetry */}
          <div className="bg-white rounded-2xl p-6 border border-[#DDE3E7] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#DDE3E7] pb-3">
              <div className="flex items-center gap-2.5">
                <Activity className="w-5 h-5 text-[#D97706]" />
                <h3 className="text-base font-extrabold text-[#17324D] font-heading">Operational SLA & Gateway Health Telemetry</h3>
              </div>
              <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-[#EAF5EF] text-[#287C5A] border border-[#287C5A]/30">
                SYSTEM HEALTH: 99.98% OPTIMAL
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#DDE3E7] space-y-1">
                <div className="text-[10px] uppercase font-bold text-[#526270]">Field Verification SLA</div>
                <div className="text-xl font-extrabold text-[#17324D] font-heading">1.4 Days</div>
                <div className="text-[10px] text-[#287C5A] font-bold">Target: &lt; 2.0 Days (Passing)</div>
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#DDE3E7] space-y-1">
                <div className="text-[10px] uppercase font-bold text-[#526270]">Treasury Sanction SLA</div>
                <div className="text-xl font-extrabold text-[#17324D] font-heading">0.8 Days</div>
                <div className="text-[10px] text-[#287C5A] font-bold">Target: &lt; 1.0 Day (Passing)</div>
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#DDE3E7] space-y-1">
                <div className="text-[10px] uppercase font-bold text-[#526270]">PFMS Bank Disbursal Speed</div>
                <div className="text-xl font-extrabold text-[#287C5A] font-heading">4.2 Hours</div>
                <div className="text-[10px] text-[#287C5A] font-bold">Direct Credit Execution</div>
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#DDE3E7] space-y-1">
                <div className="text-[10px] uppercase font-bold text-[#526270]">DigiLocker OCR Match</div>
                <div className="text-xl font-extrabold text-[#17324D] font-heading">98.6%</div>
                <div className="text-[10px] text-[#287C5A] font-bold">Automated Integrity Check</div>
              </div>
            </div>
          </div>

          {/* Main Analytical Visualizers */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Monthly Trend Area Chart */}
            <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-[#DDE3E7] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-[#17324D] font-heading">Application Velocity & Approvals Trend</h3>
                  <p className="text-xs text-[#526270]">Monthly breakdown of citizen submissions vs sanctioned grants</p>
                </div>
                <span className="text-[10px] px-3 py-1 rounded-full bg-[#F8FAFC] text-[#17324D] border border-[#DDE3E7] font-mono font-bold">
                  2026 Year-to-Date
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorApp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#17324D" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#17324D" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorAppr" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#287C5A" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#287C5A" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="#526270" fontSize={11} />
                    <YAxis stroke="#526270" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#DDE3E7', borderRadius: '12px', fontSize: '12px', color: '#17324D' }} />
                    <Area type="monotone" dataKey="applications" stroke="#17324D" fillOpacity={1} fill="url(#colorApp)" strokeWidth={2} />
                    <Area type="monotone" dataKey="approved" stroke="#287C5A" fillOpacity={1} fill="url(#colorAppr)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Distribution Doughnut */}
            <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-[#DDE3E7] shadow-xs space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-[#17324D] font-heading">Scheme Category Distribution</h3>
                <p className="text-xs text-[#526270]">Distribution by sector budget allocation</p>
              </div>

              <div className="h-48 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#DDE3E7', borderRadius: '12px', fontSize: '12px', color: '#17324D' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                {pieData.map(p => (
                  <div key={p.name} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }}></div>
                    <span className="text-[#526270] text-[11px] truncate font-medium">{p.name} ({p.value}%)</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Secondary Analytical Visualizers: District Heatmap & Rejection Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-[#DDE3E7] shadow-xs space-y-4">
              <div>
                <h3 className="text-sm font-extrabold text-[#17324D] font-heading flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#D97706]" />
                  <span>District-wise Application & Disbursal Volume (₹ Cr)</span>
                </h3>
                <p className="text-xs text-[#526270]">Top revenue zones by grant throughput</p>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={districtData}>
                    <XAxis dataKey="district" stroke="#526270" fontSize={11} />
                    <YAxis stroke="#526270" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#DDE3E7', borderRadius: '12px', fontSize: '12px', color: '#17324D' }} />
                    <Bar dataKey="applications" fill="#17324D" radius={[6, 6, 0, 0]} name="Applications" />
                    <Bar dataKey="fundDisbursed" fill="#287C5A" radius={[6, 6, 0, 0]} name="Disbursed (Cr)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-[#DDE3E7] shadow-xs space-y-4">
              <div>
                <h3 className="text-sm font-extrabold text-[#17324D] font-heading flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#B84040]" />
                  <span>Ineligibility & Flagged Reason Analytics</span>
                </h3>
                <p className="text-xs text-[#526270]">Root cause breakdown of declined applications</p>
              </div>

              <div className="space-y-3 pt-2">
                {rejectionReasons.map((item) => (
                  <div key={item.reason} className="space-y-1 text-xs">
                    <div className="flex justify-between font-medium text-[#17324D]">
                      <span className="truncate pr-2">{item.reason}</span>
                      <span className="font-bold text-[#526270]">{item.percent}% ({item.count})</span>
                    </div>
                    <div className="w-full h-2 bg-[#F8FAFC] border border-[#DDE3E7] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* WELFARE SCHEMES REGISTRY & OVERSIGHT MATRIX (INTEGRATED INSIDE PULSE)     */}
          {/* ========================================================================= */}
          <div className="space-y-6 pt-4 border-t-2 border-[#DDE3E7]">
            
            {/* Section Header (Duplicate Button Removed) */}
            <div className="bg-[#17324D] p-6 sm:p-7 rounded-2xl text-white shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-5 border-t-4 border-[#D97706]">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0E2438] border border-[#D97706]/40 text-[#FFF3E0] text-xs font-semibold">
                  <Landmark className="w-4 h-4 text-[#D97706]" />
                  <span>National Welfare Schemes Policy & Allocation Desk</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
                  Welfare Schemes Registry & Portfolios
                </h2>
                <p className="text-xs text-[#DDE3E7]">
                  Monitor active welfare initiatives, configure subsidy ceilings, toggle status, and remove decommissioned schemes.
                </p>
              </div>
            </div>

            {/* Schemes Quick Stats Banner */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="stat-box">
                <div className="text-[#526270] text-xs font-semibold uppercase tracking-wider mb-1">Total Schemes</div>
                <div className="text-2xl font-extrabold text-[#17324D] font-heading">{schemes.length} Active</div>
                <div className="text-[11px] text-[#287C5A] font-bold mt-1">Across Central Ministries</div>
              </div>

              <div className="stat-box">
                <div className="text-[#526270] text-xs font-semibold uppercase tracking-wider mb-1">Total Allocated Pool</div>
                <div className="text-2xl font-extrabold text-[#17324D] font-heading">₹{(totalFundPool / 10000000).toFixed(1)} Cr</div>
                <div className="text-[11px] text-[#526270] font-bold mt-1">Authorized Treasury Budget</div>
              </div>

              <div className="stat-box">
                <div className="text-[#526270] text-xs font-semibold uppercase tracking-wider mb-1">Disbursed DBT Grants</div>
                <div className="text-2xl font-extrabold text-[#287C5A] font-heading">₹{(totalDistributed / 10000000).toFixed(2)} Cr</div>
                <div className="text-[11px] text-[#287C5A] font-bold mt-1">
                  {totalFundPool > 0 ? ((totalDistributed / totalFundPool) * 100).toFixed(1) : '0'}% Distributed via PFMS
                </div>
              </div>

              <div className="stat-box">
                <div className="text-[#526270] text-xs font-semibold uppercase tracking-wider mb-1">Total Applicants</div>
                <div className="text-2xl font-extrabold text-[#D97706] font-heading">{totalApplicants || applications.length}</div>
                <div className="text-[11px] text-[#526270] font-bold mt-1">Direct Benefit Claims</div>
              </div>
            </div>

            {/* Search, Filter & Controls Bar */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#DDE3E7] shadow-xs space-y-3.5">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                
                {/* Search Box */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#7C8992] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search scheme code, title, or department..."
                    value={schemeSearch}
                    onChange={(e) => setSchemeSearch(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#DDE3E7] rounded-xl !pl-11 pr-4 py-2 text-xs text-[#17324D] placeholder-[#7C8992] focus:outline-none focus:border-[#17324D] shadow-xs"
                    style={{ paddingLeft: '2.75rem' }}
                  />
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-[#526270] font-semibold">Status:</span>
                  {['ALL', 'ACTIVE', 'SUSPENDED'].map(st => (
                    <button
                      key={st}
                      onClick={() => setSelectedStatus(st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        selectedStatus === st
                          ? 'bg-[#17324D] text-white'
                          : 'bg-[#F8FAFC] text-[#526270] hover:bg-[#EBF2F7] border border-[#DDE3E7]'
                      }`}
                    >
                      {st === 'ALL' ? 'All Status' : st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
                <span className="text-xs text-[#526270] font-semibold whitespace-nowrap">Category:</span>
                {['ALL', 'AGRICULTURE', 'HOUSING', 'EDUCATION', 'ENERGY', 'WOMEN & BUSINESS'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-[#D97706] text-white shadow-xs'
                        : 'bg-[#F8FAFC] text-[#526270] hover:text-[#17324D] hover:bg-[#EBF2F7] border border-[#DDE3E7]'
                    }`}
                  >
                    {cat === 'ALL' ? 'All Categories' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Schemes Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredSchemes.length === 0 ? (
                <div className="col-span-2 bg-white rounded-2xl p-12 text-center border border-[#DDE3E7] shadow-xs space-y-3">
                  <Landmark className="w-12 h-12 text-[#7C8992] mx-auto opacity-50" />
                  <h3 className="text-base font-bold text-[#17324D]">No schemes match your filter criteria</h3>
                  <p className="text-xs text-[#526270]">Try clearing your search query or filter tags to view all published schemes.</p>
                  <button
                    onClick={() => { setSchemeSearch(''); setSelectedCategory('ALL'); setSelectedStatus('ALL'); }}
                    className="px-4 py-2 rounded-xl bg-[#17324D] text-white font-bold text-xs shadow-xs cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                filteredSchemes.map(s => {
                  const totalAmt = Number(s.totalFund) || 1;
                  const distAmt = Number(s.distributedFund) || 0;
                  const percent = Math.min(100, Math.round((distAmt / totalAmt) * 100));
                  const isActive = s.status === 'ACTIVE';

                  return (
                    <div 
                      key={s.id} 
                      className="bg-white rounded-2xl p-6 border border-[#DDE3E7] hover:border-[#17324D]/40 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5"
                    >
                      <div>
                        {/* Top Header & Badges */}
                        <div className="flex items-center justify-between gap-3 mb-2.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-mono text-[#17324D] bg-[#F8FAFC] px-2.5 py-0.5 rounded-full border border-[#DDE3E7] font-bold">
                              {s.code}
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#EBF2F7] text-[#17324D] border border-[#17324D]/20">
                              {s.category}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              isActive
                                ? 'bg-[#EAF5EF] text-[#287C5A] border border-[#287C5A]/30'
                                : 'bg-[#FDF2F2] text-[#B84040] border border-[#B84040]/30'
                            }`}>
                              {s.status}
                            </span>
                          </div>
                        </div>

                        {/* Title & Description */}
                        <h3 className="text-base font-extrabold text-[#17324D] font-heading mb-1.5 leading-snug">
                          {s.title}
                        </h3>
                        <p className="text-xs text-[#526270] font-medium leading-relaxed mb-4">
                          {s.shortDesc || s.description}
                        </p>

                        {/* Department */}
                        <div className="text-[11px] text-[#7C8992] font-semibold mb-4">
                          Authority: <span className="text-[#17324D]">{s.department}</span>
                        </div>

                        {/* Fund Allocation Progress */}
                        <div className="bg-[#F8FAFC] p-3.5 rounded-xl border border-[#DDE3E7] space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-[#526270]">Treasury Disbursed:</span>
                            <span className="font-bold text-[#287C5A]">
                              ₹{(distAmt / 100000).toFixed(1)}L <span className="text-[#7C8992] font-normal font-mono">/ ₹{(totalAmt / 100000).toFixed(1)}L ({percent}%)</span>
                            </span>
                          </div>
                          <div className="w-full h-2 bg-white border border-[#DDE3E7] rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${percent > 80 ? 'bg-[#D97706]' : 'bg-[#287C5A]'}`}
                              style={{ width: `${percent}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Key Parameters */}
                        <div className="grid grid-cols-2 gap-3 pt-4 text-xs">
                          <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#DDE3E7]">
                            <span className="text-[10px] text-[#526270] uppercase font-bold block">Grant Limit</span>
                            <span className="font-extrabold text-[#17324D] text-sm">₹{Number(s.maxAmount || 100000).toLocaleString('en-IN')}</span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#DDE3E7]">
                            <span className="text-[10px] text-[#526270] uppercase font-bold block">Deadline</span>
                            <span className="font-bold text-[#17324D] text-xs font-mono">{s.deadline || '2026-12-31'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="pt-3 border-t border-[#DDE3E7] flex items-center justify-between gap-2 flex-wrap">
                        <button
                          onClick={() => setSelectedSchemeDetails(s)}
                          className="px-3 py-1.5 rounded-xl bg-[#F8FAFC] hover:bg-[#EBF2F7] text-[#17324D] font-bold text-xs border border-[#DDE3E7] transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <Info className="w-3.5 h-3.5 text-[#D97706]" />
                          <span>Policy Rules</span>
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleSchemeStatus(s.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer ${
                              isActive
                                ? 'bg-[#FDF2F2] hover:bg-[#FCE8E8] text-[#B84040] border border-[#B84040]/30'
                                : 'bg-[#EAF5EF] hover:bg-[#D5EFE0] text-[#287C5A] border border-[#287C5A]/30'
                            }`}
                            title={isActive ? 'Suspend scheme from receiving applications' : 'Activate scheme'}
                          >
                            <Power className="w-3.5 h-3.5" />
                            <span>{isActive ? 'Suspend' : 'Activate'}</span>
                          </button>

                          <button
                            onClick={() => setSchemeToDelete(s)}
                            className="px-3 py-1.5 rounded-xl bg-[#FDF2F2] hover:bg-[#FCE8E8] text-[#B84040] font-bold text-xs border border-[#B84040]/30 transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                            title="Remove scheme permanently from registry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove Scheme</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: USER & OFFICER RBAC DIRECTORY                                      */}
      {/* ========================================================================= */}
      {effectiveTab === 'USERS' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Header Banner (Contains the SINGLE + Add User / Officer Button) */}
          <div className="bg-[#17324D] p-6 sm:p-8 rounded-2xl text-white shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-t-4 border-[#D97706]">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0E2438] border border-[#D97706]/40 text-[#FFF3E0] text-xs font-semibold">
                <Shield className="w-4 h-4 text-[#D97706]" />
                <span>Personnel Authorization & Identity Matrix</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                User & Officer RBAC Directory
              </h2>
              <p className="text-xs text-[#DDE3E7]">
                Chief Administrator authority to onboard or de-provision citizen beneficiaries, scrutiny inspectors, and treasury sanction authorities.
              </p>
            </div>

            <button
              onClick={() => setIsUserModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-xs shadow-sm hover:shadow-md border border-blue-400/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 cursor-pointer flex-shrink-0"
            >
              <UserPlus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add New User</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="stat-box">
              <div className="text-[#526270] text-xs font-semibold uppercase tracking-wider mb-1">Total Registered</div>
              <div className="text-2xl font-extrabold text-[#17324D] font-heading">{uniqueUsers.length} Personnel</div>
              <div className="text-[11px] text-[#287C5A] font-bold mt-1">Platform-wide credentials</div>
            </div>

            <div className="stat-box">
              <div className="text-[#526270] text-xs font-semibold uppercase tracking-wider mb-1">Officers & Authorities</div>
              <div className="text-2xl font-extrabold text-[#17324D] font-heading">{officerCount} Officers</div>
              <div className="text-[11px] text-[#D97706] font-bold mt-1">Field Verifiers & Sanction Desks</div>
            </div>

            <div className="stat-box">
              <div className="text-[#526270] text-xs font-semibold uppercase tracking-wider mb-1">Citizen Applicants</div>
              <div className="text-2xl font-extrabold text-[#287C5A] font-heading">{citizenCount} Citizens</div>
              <div className="text-[11px] text-[#287C5A] font-bold mt-1">Beneficiary Accounts</div>
            </div>

            <div className="stat-box">
              <div className="text-[#526270] text-xs font-semibold uppercase tracking-wider mb-1">Executive Administrators</div>
              <div className="text-2xl font-extrabold text-[#7C3AED] font-heading">{adminCount} Admins</div>
              <div className="text-[11px] text-[#526270] font-bold mt-1">Full System Governance</div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#DDE3E7] shadow-xs space-y-3.5">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              
              {/* Search Box */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#7C8992] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search personnel by name, official email, role, or jurisdiction..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-[#DDE3E7] rounded-xl !pl-11 pr-4 py-2.5 text-xs text-[#17324D] placeholder-[#7C8992] focus:outline-none focus:border-[#17324D] shadow-xs"
                  style={{ paddingLeft: '2.75rem' }}
                />
              </div>

              {/* Role Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
                {[
                  { id: 'ALL', label: `All Personnel (${uniqueUsers.length})` },
                  { id: 'OFFICERS', label: `Officers (${officerCount})` },
                  { id: 'CITIZENS', label: `Citizens (${citizenCount})` },
                  { id: 'ADMIN', label: `Administrators (${adminCount})` }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setUserRoleFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                      userRoleFilter === tab.id
                        ? 'bg-[#17324D] text-white shadow-xs'
                        : 'bg-[#F8FAFC] text-[#526270] hover:text-[#17324D] hover:bg-[#EBF2F7] border border-[#DDE3E7]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Personnel Table */}
          <div className="bg-white rounded-2xl border border-[#DDE3E7] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#526270]">
                <thead className="bg-[#17324D] text-white uppercase font-bold text-[11px] font-heading">
                  <tr>
                    <th className="px-6 py-4">User / Officer</th>
                    <th className="px-6 py-4">Official Email</th>
                    <th className="px-6 py-4">Assigned Role</th>
                    <th className="px-6 py-4">Jurisdiction / Dept</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Chief Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DDE3E7] bg-white">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-[#526270]">
                        <Users className="w-8 h-8 text-[#7C8992] mx-auto opacity-50 mb-2" />
                        <span className="font-semibold block">No personnel found matching the filter criteria.</span>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map(u => {
                      const isSelf = (currentUser?.email && u.email && currentUser.email.toLowerCase() === u.email.toLowerCase()) ||
                                     (currentUser?.id && u.id && String(currentUser.id) === String(u.id));

                      return (
                        <tr key={u.id} className="hover:bg-[#F8FAFC] transition">
                          <td className="px-6 py-4 font-bold text-[#17324D] flex items-center gap-3">
                            <img
                              src={getSafeAvatar(u)}
                              alt={u.name}
                              onError={(e) => { e.currentTarget.src = getSafeAvatar(u.name, u.role); }}
                              className="w-8 h-8 rounded-lg object-cover border border-[#DDE3E7]"
                            />
                            <div>
                              <span>{u.name}</span>
                              {u.phone && <span className="block text-[10px] text-[#7C8992] font-normal font-mono">{u.phone}</span>}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-[#526270] font-mono">{u.email}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold border ${
                              u.role === 'ADMINISTRATOR' || u.role === 'ADMIN'
                                ? 'bg-[#F3E8FF] text-[#7C3AED] border-[#7C3AED]/30'
                                : u.role === 'AUTHORITY'
                                ? 'bg-[#FFF8E6] text-[#D97706] border-[#D97706]/30'
                                : u.role === 'DISTRICT_OFFICER'
                                ? 'bg-[#EFF6FF] text-[#1D4ED8] border-[#1D4ED8]/30'
                                : u.role === 'VERIFIER'
                                ? 'bg-[#EBF2F7] text-[#17324D] border-[#17324D]/30'
                                : 'bg-[#EAF5EF] text-[#287C5A] border-[#287C5A]/30'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-[#17324D] font-medium">{u.department || u.district || 'National Platform'}</td>
                          <td className="px-6 py-4"><StatusBadge status="ACTIVE" /></td>
                          <td className="px-6 py-4 text-right">
                            {isSelf ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold text-[#287C5A] bg-[#EAF5EF] border border-[#287C5A]/30 rounded-lg">
                                <Check className="w-3 h-3" />
                                <span>Active Session</span>
                              </span>
                            ) : (
                              <button
                                onClick={() => setUserToDelete(u)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#B84040] hover:bg-[#FDF2F2] border border-[#B84040]/30 transition cursor-pointer shadow-xs"
                                title={`Remove ${u.name} from system`}
                              >
                                <Trash2 className="w-3.5 h-3.5 text-[#B84040]" />
                                <span>Remove</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALS & CONFIRMATION OVERLAYS                                            */}
      {/* ========================================================================= */}

      {/* 1. Policy Rules Modal */}
      {selectedSchemeDetails && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0E2438]/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-[#DDE3E7] shadow-2xl overflow-hidden animate-scale-up">
            <div className="bg-[#17324D] p-6 text-white relative border-b-4 border-[#D97706]">
              <button
                onClick={() => setSelectedSchemeDetails(null)}
                className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <span className="text-[10px] font-mono text-[#D97706] font-bold uppercase">{selectedSchemeDetails.code}</span>
              <h3 className="text-lg font-extrabold font-heading text-white mt-1">{selectedSchemeDetails.title}</h3>
              <p className="text-xs text-[#DDE3E7]">{selectedSchemeDetails.department}</p>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-[#526270] uppercase">Eligibility Criteria</div>
                <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#DDE3E7] space-y-1.5">
                  <div className="flex justify-between"><span className="text-[#526270]">Age Bracket:</span> <span className="font-bold text-[#17324D]">{selectedSchemeDetails.minAge || 18} to {selectedSchemeDetails.maxAge || 65} Years</span></div>
                  <div className="flex justify-between"><span className="text-[#526270]">Annual Income Cap:</span> <span className="font-bold text-[#287C5A]">Up to ₹{Number(selectedSchemeDetails.maxIncome || 500000).toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between"><span className="text-[#526270]">Allowed States:</span> <span className="font-bold text-[#17324D]">{(selectedSchemeDetails.allowedStates || ['All India']).join(', ')}</span></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[11px] font-bold text-[#526270] uppercase">Required Citizen Documents</div>
                <div className="space-y-1.5">
                  {(selectedSchemeDetails.requiredDocs || [
                    { name: 'Aadhaar e-KYC Verification' },
                    { name: 'Annual Income Certificate' }
                  ]).map((d, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-[#F8FAFC] border border-[#DDE3E7] text-[#17324D]">
                      <Check className="w-3.5 h-3.5 text-[#287C5A]" />
                      <span className="font-medium">{d.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-[#DDE3E7] flex justify-end">
                <button
                  onClick={() => setSelectedSchemeDetails(null)}
                  className="px-6 py-2.5 rounded-xl bg-[#17324D] hover:bg-[#0E2438] text-white font-bold text-xs transition cursor-pointer"
                >
                  Close Parameters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Scheme Creator Modal (Inside Pulse) */}
      {isSchemeModalOpen && (
        <SchemeFormModal
          onSubmit={(schemeData) => {
            createScheme(schemeData);
            setIsSchemeModalOpen(false);
          }}
          onClose={() => setIsSchemeModalOpen(false)}
        />
      )}

      {/* 3. User / Officer Onboarding Modal */}
      {isUserModalOpen && (
        <UserFormModal
          onSubmit={async (userData) => {
            const success = await addUser(userData);
            return success;
          }}
          onClose={() => setIsUserModalOpen(false)}
        />
      )}

      {/* 4. Scheme Removal Confirmation Modal */}
      {schemeToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0E2438]/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full border border-[#DDE3E7] shadow-2xl p-6 space-y-4 animate-scale-up">
            <div className="flex items-center gap-3 text-[#B84040]">
              <div className="w-10 h-10 rounded-full bg-[#FDF2F2] flex items-center justify-center border border-[#B84040]/30 flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-[#B84040]" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#17324D] font-heading">Remove Scheme from Registry?</h3>
                <p className="text-xs text-[#7C8992] font-mono font-bold">{schemeToDelete.code}</p>
              </div>
            </div>
            <p className="text-xs text-[#526270] leading-relaxed">
              Are you sure you want to permanently remove <strong className="text-[#17324D]">{schemeToDelete.title}</strong> from the active government schemes registry? This action will de-register this scheme and log a cryptographic audit record.
            </p>
            <div className="pt-3 border-t border-[#DDE3E7] flex justify-end gap-3">
              <button
                onClick={() => setSchemeToDelete(null)}
                className="px-4 py-2 rounded-xl border border-[#DDE3E7] bg-white text-[#526270] font-bold text-xs hover:bg-[#F8FAFC] transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteScheme(schemeToDelete.id);
                  setSchemeToDelete(null);
                }}
                className="px-5 py-2 rounded-xl bg-[#B84040] hover:bg-[#9B2C2C] text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirm Removal</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. User / Officer Removal Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0E2438]/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full border border-[#DDE3E7] shadow-2xl p-6 space-y-4 animate-scale-up">
            <div className="flex items-center gap-3 text-[#B84040]">
              <div className="w-10 h-10 rounded-full bg-[#FDF2F2] flex items-center justify-center border border-[#B84040]/30 flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-[#B84040]" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#17324D] font-heading">Remove Personnel Credentials?</h3>
                <p className="text-xs text-[#7C8992] font-mono">{userToDelete.email}</p>
              </div>
            </div>
            <p className="text-xs text-[#526270] leading-relaxed">
              Are you sure you want to remove <strong className="text-[#17324D]">{userToDelete.name}</strong> (<span className="font-mono font-bold text-[#287C5A]">{userToDelete.role}</span>)? Their administrative entitlements and login credentials will be revoked immediately.
            </p>
            <div className="pt-3 border-t border-[#DDE3E7] flex justify-end gap-3">
              <button
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 rounded-xl border border-[#DDE3E7] bg-white text-[#526270] font-bold text-xs hover:bg-[#F8FAFC] transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  removeUser(userToDelete.id);
                  setUserToDelete(null);
                }}
                className="px-5 py-2 rounded-xl bg-[#B84040] hover:bg-[#9B2C2C] text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirm De-provision</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
