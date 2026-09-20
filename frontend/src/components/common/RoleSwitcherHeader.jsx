import React from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, LogOut } from 'lucide-react';

export const RoleSwitcherHeader = ({ setActiveTab, onLogout }) => {
  const { currentRole } = useApp();

  const roleLabels = {
    APPLICANT: 'Citizen Portal',
    VERIFIER: 'Field Verifier Desk',
    DISTRICT_OFFICER: 'District Nodal Officer Desk',
    AUTHORITY: 'Sanction Authority Desk',
    ADMINISTRATOR: 'Chief Administrator Workspace'
  };

  const activeLabel = roleLabels[currentRole] || 'Government Portal';

  return (
    <div className="bg-[#0E2438] border-b border-[#17324D] text-white w-full flex-shrink-0">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-10 flex items-center justify-between text-xs gap-2">
        
        {/* Official Government Identity */}
        <div className="flex items-center gap-2 flex-shrink-0 min-w-0">
          <span className="text-base leading-none select-none">🇮🇳</span>
          <div className="flex items-center gap-2 truncate">
            <span className="font-bold tracking-wide text-white uppercase font-heading text-[11px] sm:text-xs whitespace-nowrap">
              भारत सरकार <span className="text-[#A0B0C0] font-normal hidden sm:inline">| Government of India</span>
            </span>
            <span className="text-[#DDE3E7]/40 hidden md:inline">•</span>
            <span className="text-[10px] text-[#D97706] font-semibold hidden md:inline tracking-wide font-heading whitespace-nowrap">
              Direct Benefit Transfer (DBT) Mission
            </span>
          </div>
        </div>

        {/* Active Role Status & Direct Sign Out */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          
          {/* Active Role Indicator Badge (Read-Only) */}
          <div className="flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-[#17324D] border border-[#D97706]/40 text-[#FFF3E0] font-bold text-[10px] sm:text-[11px] whitespace-nowrap">
            <Shield className="w-3 h-3 text-[#D97706] flex-shrink-0" />
            <span className="truncate max-w-[110px] sm:max-w-none">{activeLabel}</span>
          </div>

          {/* Direct Sign Out Button */}
          <button
            onClick={() => {
              if (onLogout) onLogout();
              else if (setActiveTab) setActiveTab('login');
            }}
            className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-semibold text-[#FFB3B3] hover:bg-[#B84040]/30 hover:text-white transition whitespace-nowrap cursor-pointer"
            title="Sign Out to Role Selection Portal"
          >
            <LogOut className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
