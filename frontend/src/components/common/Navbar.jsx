import React, { useState, useRef, useEffect } from 'react';
import { useApp, isNotificationForUser, isNotificationReadForUser } from '../../context/AppContext';
import { getSafeAvatar } from '../../utils/avatar';
import { NotificationDrawer } from './NotificationDrawer';
import { 
  Landmark, 
  Bell, 
  LogOut, 
  ChevronDown, 
  User, 
  Shield, 
  Layers, 
  BarChart3, 
  FileText, 
  CheckSquare, 
  Award,
  MessageSquare,
  Headphones,
  Info,
  Menu,
  X,
  Check,
  Compass,
  Tag,
  Scale,
  Building2
} from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab }) => {
  const { currentRole, currentUser, notifications, logoutUser, getSavedSchemes, comparedSchemeIds } = useApp();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const profileRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const user = currentUser || {
    name: 'Government User',
    role: currentRole || 'APPLICANT',
    avatar: getSafeAvatar('Government User', currentRole || 'APPLICANT'),
    email: 'user@gov.in'
  };

  const unreadCount = notifications.filter(
    n => isNotificationForUser(n, currentUser || user) && !isNotificationReadForUser(n, currentUser || user)
  ).length;

  const roleNavs = {
    APPLICANT: [
      { id: 'dashboard', label: 'Schemes', icon: Compass },
      { id: 'applications', label: 'Applications', icon: FileText },
      { id: 'saved-schemes', label: 'Saved', icon: Tag },
      { id: 'compare', label: 'Compare', icon: Scale },
      { id: 'payments', label: 'Receipts', icon: Award },
      { id: 'grievances', label: 'Grievances', icon: MessageSquare },
      { id: 'helpdesk', label: 'Helpdesk', icon: Headphones },
      { id: 'about', label: 'About', icon: Info }
    ],
    VERIFIER: [
      { id: 'dashboard', label: 'Verification Desk', icon: CheckSquare },
      { id: 'queue', label: 'Workload', icon: Layers },
      { id: 'history', label: 'Scrutiny Logs', icon: FileText },
      { id: 'about', label: 'About', icon: Info }
    ],
    DISTRICT_OFFICER: [
      { id: 'dashboard', label: 'District Pulse', icon: Building2 },
      { id: 'blocks', label: 'Taluk Units', icon: Layers },
      { id: 'funds', label: 'District Budget', icon: Landmark },
      { id: 'reports', label: 'District Reports', icon: BarChart3 },
      { id: 'about', label: 'About', icon: Info }
    ],
    AUTHORITY: [
      { id: 'dashboard', label: 'Sanction Desk', icon: Award },
      { id: 'funds', label: 'Treasury Pool', icon: Landmark },
      { id: 'reports', label: 'Disbursals', icon: BarChart3 },
      { id: 'about', label: 'About', icon: Info }
    ],
    ADMINISTRATOR: [
      { id: 'dashboard', label: 'Pulse', icon: BarChart3 },
      { id: 'funds', label: 'Treasury', icon: Landmark },
      { id: 'audit-logs', label: 'Audit Trail', icon: Shield },
      { id: 'grievances', label: 'Grievance Desk', icon: MessageSquare },
      { id: 'reports', label: 'Analytics', icon: BarChart3 },
      { id: 'about', label: 'About', icon: Info }
    ]
  };

  const normalizedRole = (() => {
    if (!currentRole) return 'APPLICANT';
    const r = String(currentRole).toUpperCase();
    if (r === 'CITIZEN' || r === 'BENEFICIARY') return 'APPLICANT';
    if (r === 'ADMIN' || r === 'CHIEF_ADMINISTRATOR' || r === 'CHIEF ADMINISTRATOR') return 'ADMINISTRATOR';
    if (r === 'DISTRICT' || r === 'DISTRICT_OFFICER' || r === 'DISTRICT OFFICER' || r === 'DISTRICT_NODAL_OFFICER') return 'DISTRICT_OFFICER';
    return r;
  })();

  const currentNavItems = roleNavs[normalizedRole] || roleNavs.APPLICANT;

  const toggleProfileMenu = () => {
    setIsProfileOpen(prev => !prev);
  };

  return (
    <>
      <header className="bg-white text-[#17324D] border-b border-[#DDE3E7] sticky top-0 z-40 shadow-xs w-full">
        {/* Tricolor Accent Stripe at Top */}
        <div className="tricolor-accent-bar"></div>

        {/* Full-width container: pushes GovGrant to far left corner, profile to far right corner, maximizes middle space */}
        <div className="w-full px-3 sm:px-5 lg:px-6 xl:px-8">
          <div className="flex items-center justify-between h-16 sm:h-[68px] gap-2 lg:gap-4">
            
            {/* Left: Brand Identity & Emblem - at the far left corner */}
            <div 
              className="flex items-center gap-2 sm:gap-2.5 cursor-pointer flex-shrink-0 group" 
              onClick={() => setActiveTab('dashboard')}
              title="Return to Primary Dashboard"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#17324D] flex items-center justify-center text-white shadow-xs group-hover:bg-[#0E2438] transition flex-shrink-0">
                <Landmark className="w-5 h-5 text-[#FFF3E0]" />
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm sm:text-base tracking-tight text-[#17324D] font-heading uppercase whitespace-nowrap">
                    GovGrant
                  </span>
                  <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#EAF5EF] text-[#287C5A] border border-[#287C5A]/30">
                    DBT
                  </span>
                </div>
                <p className="text-[10px] font-semibold text-[#7C8992] tracking-wide hidden 2xl:block whitespace-nowrap">
                  National Portal • DBT Mission
                </p>
              </div>
            </div>

            {/* Center: Desktop Navigation Bar with all feature letters clearly visible and vast margins */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 2xl:gap-2 justify-center flex-1 min-w-0 px-2 overflow-x-auto no-scrollbar">
              {currentNavItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                const savedCount = item.id === 'saved-schemes' && getSavedSchemes ? getSavedSchemes().length : 0;
                const compareCount = item.id === 'compare' && comparedSchemeIds ? comparedSchemeIds.length : 0;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`h-8.5 xl:h-9 px-2 xl:px-2.5 2xl:px-3.5 inline-flex items-center justify-center gap-1 xl:gap-1.5 rounded-xl text-xs xl:text-[13px] font-semibold transition-all whitespace-nowrap flex-shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-[#17324D] text-white shadow-xs font-bold'
                        : 'text-[#526270] hover:text-[#17324D] hover:bg-[#F3F6F8]'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-[#D97706]' : 'text-[#526270]'}`} />
                    <span className="tracking-normal">{item.label}</span>
                    {savedCount > 0 && (
                      <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-[#D97706] text-white text-[9px] font-bold font-mono">
                        {savedCount}
                      </span>
                    )}
                    {compareCount > 0 && (
                      <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-[#287C5A] text-white text-[9px] font-bold font-mono">
                        {compareCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right: Actions Cluster (Notifications, Profile Avatar, Mobile Toggle) */}
            <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0 z-10 bg-white">
              
              {/* Notification Bell */}
              <button
                onClick={() => setIsNotifOpen(true)}
                className="relative h-9 w-9 sm:h-10 sm:w-10 inline-flex items-center justify-center rounded-xl text-[#17324D] hover:bg-[#F3F6F8] transition border border-[#DDE3E7] shadow-xs flex-shrink-0 cursor-pointer"
                title="Notifications & Disbursal Alerts"
              >
                <Bell className="w-4 h-4 text-[#17324D]" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#D97706] text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-xs animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* User Avatar & Profile Card Dropdown */}
              <div className="relative flex-shrink-0" ref={profileRef}>
                <button
                  onClick={toggleProfileMenu}
                  className={`h-9 sm:h-10 inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 2xl:px-3 rounded-xl border transition shadow-xs flex-shrink-0 cursor-pointer ${
                    activeTab === 'profile' || isProfileOpen
                      ? 'bg-[#EBF2F7] border-[#17324D] ring-2 ring-[#17324D]/20'
                      : 'bg-white border-[#DDE3E7] hover:border-[#17324D]'
                  }`}
                  title="Account Details & Settings"
                >
                  <img
                    src={getSafeAvatar(user, currentRole)}
                    alt={user.name}
                    onError={(e) => { e.currentTarget.src = getSafeAvatar(user.name, user.role || currentRole); }}
                    className="w-7 h-7 rounded-lg object-cover border border-[#DDE3E7] flex-shrink-0"
                  />
                  <div className="text-left hidden sm:block leading-tight">
                    <div className="text-xs font-bold text-[#17324D] truncate max-w-[85px] lg:max-w-[105px] xl:max-w-[140px]">
                      {user.name}
                    </div>
                    <div className="text-[9px] text-[#526270] font-mono font-semibold uppercase">{user.role}</div>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#526270] flex-shrink-0 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile Popup Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-[#DDE3E7] rounded-2xl shadow-xl p-2.5 z-50 animate-fade-in text-[#17324D]">
                    
                    {/* User Header Summary */}
                    <div className="px-3 py-2.5 border-b border-[#DDE3E7] mb-1.5 bg-[#F8FAFC] rounded-xl">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={getSafeAvatar(user, currentRole)}
                          alt={user.name}
                          onError={(e) => { e.currentTarget.src = getSafeAvatar(user.name, user.role || currentRole); }}
                          className="w-9 h-9 rounded-xl object-cover border border-[#DDE3E7] flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-[#17324D] truncate">{user.name}</p>
                          <p className="text-[10px] text-[#526270] truncate">{user.email}</p>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#EAF5EF] text-[#287C5A] border border-[#287C5A]/20">
                          {user.role}
                        </span>
                        <span className="text-[9px] text-[#287C5A] font-bold flex items-center gap-1">
                          <Check className="w-3 h-3 text-[#287C5A]" />
                          Verified
                        </span>
                      </div>
                    </div>

                    {/* Navigation Actions */}
                    <button
                      onClick={() => { 
                        setActiveTab('profile'); 
                        setIsProfileOpen(false); 
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                        activeTab === 'profile'
                          ? 'bg-[#17324D] text-white shadow-xs font-bold'
                          : 'text-[#526270] hover:bg-[#F3F6F8] hover:text-[#17324D]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <User className={`w-4 h-4 ${activeTab === 'profile' ? 'text-[#D97706]' : 'text-[#17324D]'}`} />
                        <span>My Profile & e-KYC Data</span>
                      </div>
                      {activeTab === 'profile' && <Check className="w-3.5 h-3.5 text-[#D97706]" />}
                    </button>

                    <div className="border-t border-[#DDE3E7] my-1.5"></div>

                    <button
                      onClick={() => { 
                        if (logoutUser) logoutUser();
                        setActiveTab('login'); 
                        setIsProfileOpen(false); 
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs text-[#B84040] hover:bg-[#FDF2F2] font-bold transition cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 flex-shrink-0" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden h-10 w-10 inline-flex items-center justify-center rounded-xl text-[#17324D] hover:bg-[#F3F6F8] border border-[#DDE3E7] shadow-xs transition cursor-pointer"
                aria-label="Toggle navigation drawer"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-[#DDE3E7] px-4 py-3 space-y-1 shadow-lg animate-slide-down">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#7C8992] px-3 py-1">
              {currentRole} Workspace
            </div>
            
            {currentNavItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#17324D] text-white shadow-xs'
                      : 'text-[#526270] hover:text-[#17324D] hover:bg-[#F3F6F8]'
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#D97706]' : 'text-[#526270]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Mobile Profile & System Actions */}
            <div className="pt-2 mt-2 border-t border-[#DDE3E7] space-y-1">
              <button
                onClick={() => {
                  setActiveTab('profile');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-[#17324D] text-white shadow-xs'
                    : 'text-[#526270] hover:text-[#17324D] hover:bg-[#F3F6F8]'
                }`}
              >
                <User className={`w-4 h-4 flex-shrink-0 ${activeTab === 'profile' ? 'text-[#D97706]' : 'text-[#526270]'}`} />
                <span>My Profile & e-KYC Data</span>
              </button>
              <button
                onClick={() => {
                  if (logoutUser) logoutUser();
                  setActiveTab('login');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-[#B84040] hover:bg-[#FDF2F2] transition cursor-pointer"
              >
                <LogOut className="w-4 h-4 flex-shrink-0" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Notification Slide-Over Drawer */}
      <NotificationDrawer isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
    </>
  );
};
