import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { RoleSwitcherHeader } from './components/common/RoleSwitcherHeader';
import { Navbar } from './components/common/Navbar';
import { Toast } from './components/common/Toast';
import { Login } from './pages/Login';
import { ApplicantDashboard } from './pages/ApplicantDashboard';
import { ApplicationsHistoryPage } from './pages/applicant/ApplicationsHistoryPage';
import { PaymentReceiptsPage } from './pages/applicant/PaymentReceiptsPage';
import { GrievanceRedressalPage } from './pages/applicant/GrievanceRedressalPage';
import { VerifierDashboard } from './pages/VerifierDashboard';
import { DistrictOfficerDashboard } from './pages/DistrictOfficerDashboard';
import { AuthorityDashboard } from './pages/AuthorityDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { FundsManagementPage } from './pages/FundsManagementPage';
import { ReportsPage } from './pages/ReportsPage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { HelpdeskPage } from './pages/HelpdeskPage';
import { AboutPage } from './pages/AboutPage';
import { ProfilePage } from './pages/ProfilePage';
import { SavedSchemesPage } from './pages/applicant/SavedSchemesPage';
import { SchemeComparisonPage } from './pages/applicant/SchemeComparisonPage';
import { PublicSchemesPage } from './pages/PublicSchemesPage';

// Strict Role-Based Allowed Tabs Mapping
const ROLE_ALLOWED_TABS = {
  APPLICANT: ['dashboard', 'schemes', 'applications', 'saved-schemes', 'compare', 'payments', 'grievances', 'helpdesk', 'about', 'profile'],
  VERIFIER: ['dashboard', 'queue', 'history', 'about', 'profile'],
  DISTRICT_OFFICER: ['dashboard', 'blocks', 'funds', 'reports', 'about', 'profile'],
  AUTHORITY: ['dashboard', 'funds', 'reports', 'about', 'profile'],
  ADMINISTRATOR: ['dashboard', 'schemes', 'funds', 'audit-logs', 'grievances', 'reports', 'about', 'profile']
};

const getNormalizedRole = (role) => {
  if (!role) return 'APPLICANT';
  const r = String(role).toUpperCase();
  if (r === 'CITIZEN' || r === 'BENEFICIARY') return 'APPLICANT';
  if (r === 'ADMIN' || r === 'CHIEF_ADMINISTRATOR' || r === 'CHIEF ADMINISTRATOR') return 'ADMINISTRATOR';
  if (r === 'DISTRICT' || r === 'DISTRICT_OFFICER' || r === 'DISTRICT OFFICER' || r === 'DISTRICT_NODAL_OFFICER') return 'DISTRICT_OFFICER';
  return r;
};

const MainLayout = () => {
  const { currentRole } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoggedOut, setIsLoggedOut] = useState(true); // First page is the login page

  const normalizedRole = getNormalizedRole(currentRole);
  const allowedTabs = ROLE_ALLOWED_TABS[normalizedRole] || ROLE_ALLOWED_TABS.APPLICANT;

  // Frontend Route Protection: Derive safe tab if unauthorized tab is requested
  const currentActiveTab = (!allowedTabs.includes(activeTab) && activeTab !== 'login' && activeTab !== 'public-schemes')
    ? 'dashboard'
    : activeTab;

  // Unauthenticated routing: Allow public transparency page or login
  if (isLoggedOut || currentActiveTab === 'login') {
    if (currentActiveTab === 'public-schemes') {
      return (
        <PublicSchemesPage
          onNavigateLogin={() => setActiveTab('login')}
          onStartApply={(sch) => {
            try {
              sessionStorage.setItem('dsga_pending_apply_scheme', sch.id);
            } catch (e) {
              console.warn('Session storage notice:', e);
            }
            setActiveTab('login');
          }}
        />
      );
    }

    return (
      <Login
        onLoginSuccess={() => {
          setIsLoggedOut(false);
          setActiveTab('dashboard');
        }}
        onExploreSchemes={() => {
          setActiveTab('public-schemes');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-[#17324D] flex flex-col font-sans selection:bg-[#17324D] selection:text-white w-full max-w-full overflow-x-hidden">
      {/* Role Switcher Demo Bar at top */}
      <RoleSwitcherHeader setActiveTab={setActiveTab} onLogout={() => setIsLoggedOut(true)} />

      {/* Primary Navigation - Strictly renders current role navigation */}
      <Navbar activeTab={currentActiveTab} setActiveTab={(tab) => {
        if (tab === 'login') setIsLoggedOut(true);
        else setActiveTab(tab);
      }} />

      {/* Main Workspace Page View based Strictly on Logged-in Role & Allowed Tab */}
      <main className="flex-1 pb-16">
        
        {/* COMMON PROFILE & GENERAL VIEWS (Only if explicitly allowed for the active role) */}
        {currentActiveTab === 'profile' && allowedTabs.includes('profile') && (
          <ProfilePage setActiveTab={setActiveTab} />
        )}

        {currentActiveTab === 'about' && allowedTabs.includes('about') && (
          <AboutPage setActiveTab={setActiveTab} />
        )}

        {currentActiveTab === 'helpdesk' && allowedTabs.includes('helpdesk') && (
          <HelpdeskPage setActiveTab={setActiveTab} />
        )}

        {/* CITIZEN (APPLICANT) EXCLUSIVE VIEWS */}
        {normalizedRole === 'APPLICANT' && (
          <>
            {(currentActiveTab === 'dashboard' || currentActiveTab === 'schemes') && (
              <ApplicantDashboard activeTab={currentActiveTab} setActiveTab={setActiveTab} />
            )}
            {currentActiveTab === 'applications' && (
              <ApplicationsHistoryPage onFileGrievance={() => setActiveTab('grievances')} />
            )}
            {currentActiveTab === 'saved-schemes' && (
              <SavedSchemesPage
                onStartApply={(sch) => {
                  if (sch?.id) {
                    try { sessionStorage.setItem('dsga_pending_apply_scheme', sch.id); } catch {}
                  }
                  setActiveTab('dashboard');
                }}
                onExploreSchemes={() => setActiveTab('dashboard')}
                setActiveTab={setActiveTab}
              />
            )}
            {currentActiveTab === 'compare' && (
              <SchemeComparisonPage
                onStartApply={(sch) => {
                  if (sch?.id) {
                    try { sessionStorage.setItem('dsga_pending_apply_scheme', sch.id); } catch {}
                  }
                  setActiveTab('dashboard');
                }}
                onBackToDashboard={() => setActiveTab('dashboard')}
              />
            )}
            {currentActiveTab === 'payments' && (
              <PaymentReceiptsPage />
            )}
            {currentActiveTab === 'grievances' && (
              <GrievanceRedressalPage onBackToDashboard={() => setActiveTab('dashboard')} />
            )}
          </>
        )}

        {/* FIELD VERIFIER EXCLUSIVE VIEWS */}
        {normalizedRole === 'VERIFIER' && (
          <>
            {(currentActiveTab === 'dashboard' || currentActiveTab === 'queue' || currentActiveTab === 'history') && (
              <VerifierDashboard activeTab={currentActiveTab} setActiveTab={setActiveTab} />
            )}
          </>
        )}

        {/* DISTRICT NODAL OFFICER EXCLUSIVE VIEWS */}
        {normalizedRole === 'DISTRICT_OFFICER' && (
          <>
            {(currentActiveTab === 'dashboard' || currentActiveTab === 'applications' || currentActiveTab === 'blocks' || currentActiveTab === 'funds' || currentActiveTab === 'reports') && (
              <DistrictOfficerDashboard activeTab={currentActiveTab} setActiveTab={setActiveTab} />
            )}
          </>
        )}

        {/* SANCTION AUTHORITY EXCLUSIVE VIEWS */}
        {normalizedRole === 'AUTHORITY' && (
          <>
            {currentActiveTab === 'dashboard' && (
              <AuthorityDashboard activeTab={currentActiveTab} setActiveTab={setActiveTab} />
            )}
            {currentActiveTab === 'funds' && (
              <FundsManagementPage />
            )}
            {currentActiveTab === 'reports' && (
              <ReportsPage />
            )}
          </>
        )}

        {/* ADMINISTRATOR / CHIEF ADMINISTRATOR EXCLUSIVE VIEWS */}
        {normalizedRole === 'ADMINISTRATOR' && (
          <>
            {(currentActiveTab === 'dashboard' || currentActiveTab === 'schemes' || currentActiveTab === 'users') && (
              <AdminDashboard activeTab={currentActiveTab} setActiveTab={setActiveTab} />
            )}
            {currentActiveTab === 'funds' && (
              <FundsManagementPage />
            )}
            {currentActiveTab === 'audit-logs' && (
              <AuditLogsPage />
            )}
            {currentActiveTab === 'grievances' && (
              <GrievanceRedressalPage onBackToDashboard={() => setActiveTab('dashboard')} />
            )}
            {currentActiveTab === 'reports' && (
              <ReportsPage />
            )}
          </>
        )}
      </main>

      {/* Global Footer */}
      <footer className="bg-[#0E2438] text-white border-t border-[#DDE3E7]/20 py-8 text-center text-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#D97706] font-heading">GovGrant</span>
            <span className="text-[#DDE3E7]">• Direct Benefit Transfer (DBT) & Scheme Monitoring Platform</span>
          </div>
          <div className="text-[#DDE3E7] text-[11px]">
            <span>Ministry of Electronics & Information Technology • Official Governance Portal</span>
          </div>
        </div>
      </footer>

      {/* Global Toast Alerts */}
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
