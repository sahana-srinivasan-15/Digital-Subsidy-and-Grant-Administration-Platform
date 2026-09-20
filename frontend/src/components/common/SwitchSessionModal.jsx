import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  UserCheck, 
  ShieldCheck, 
  Award, 
  Settings, 
  Building2,
  X, 
  ArrowRight, 
  LogOut,
  Shield,
  Check
} from 'lucide-react';

export const SwitchSessionModal = ({ isOpen, onClose, setActiveTab }) => {
  const { currentRole, currentUser, switchRole, showToast } = useApp();

  if (!isOpen) return null;

  const personas = [
    {
      role: 'APPLICANT',
      name: (currentUser?.role === 'APPLICANT' && currentUser?.name) ? currentUser.name : 'Citizen Beneficiary',
      email: (currentUser?.role === 'APPLICANT' && currentUser?.email) ? currentUser.email : 'applicant@gov.in',
      designation: 'Citizen / Grant Applicant',
      zone: currentUser?.district ? `${currentUser.district}` : 'Medak District, Telangana',
      desc: 'Submit subsidy applications, track e-KYC status, view DBT bank payment vouchers, and register grievances.',
      icon: UserCheck,
      color: '#D97706',
      badge: 'CITIZEN'
    },
    {
      role: 'VERIFIER',
      name: 'Sahana',
      email: 'sahana@gmail.com',
      designation: 'Field Document Inspector',
      zone: 'Medak Zone',
      desc: 'Inspect applicant documentation, verify land revenue & identity records, complete geo-tagging, and forward scrutiny reports.',
      icon: ShieldCheck,
      color: '#287C5A',
      badge: 'INSPECTOR'
    },
    {
      role: 'DISTRICT_OFFICER',
      name: 'Kavitha Rao, IAS',
      email: 'kavitha@gmail.com',
      designation: 'District Nodal Officer & Addl. Collector',
      zone: 'Medak District Collectorate',
      desc: 'Review taluk/block inspection dossiers, endorse district quota approvals, monitor block SLAs, and forward to State Directorate.',
      icon: Building2,
      color: '#1D4ED8',
      badge: 'DISTRICT'
    },
    {
      role: 'AUTHORITY',
      name: 'Mayur',
      email: 'mayur@gmail.com',
      designation: 'Joint Director & Sanction Officer',
      zone: 'State Grant Sanctioning Directorate',
      desc: 'Review verified applications, issue official grant sanction warrants, apply DSC digital signature, and approve fund disbursals.',
      icon: Award,
      color: '#17324D',
      badge: 'AUTHORITY'
    },
    {
      role: 'ADMINISTRATOR',
      name: 'Sachin',
      email: 'sachin@gmail.com',
      designation: 'Chief Administrator',
      zone: 'Ministry of Digital Governance & Analytics',
      desc: 'Oversee national schemes registry, monitor operational SLAs & budget telemetry, trigger PFMS DBT batch payouts, and inspect audit trails.',
      icon: Settings,
      color: '#665C8A',
      badge: 'ADMIN'
    }
  ];

  const handleSelectSession = (persona) => {
    switchRole(persona.role);
    if (setActiveTab) setActiveTab('dashboard');
    showToast(`Switched session to ${persona.name} (${persona.role})`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0E2438]/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-[#DDE3E7] shadow-2xl overflow-hidden animate-scale-up">
        
        {/* Modal Header */}
        <div className="bg-[#17324D] p-6 text-white relative border-b-4 border-[#D97706]">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#0E2438] border border-[#D97706]/40 text-[#D97706]">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#D97706] font-bold">
                MULTI-PERSONA GOVERNANCE ENVIRONMENT
              </span>
              <h3 className="text-xl font-extrabold font-heading text-white">
                Switch Governance Session
              </h3>
            </div>
          </div>
          <p className="text-xs text-[#DDE3E7] mt-2">
            Select an official authorized profile below to switch your live session context instantly.
          </p>
        </div>

        {/* Persona Cards List */}
        <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
          {personas.map(p => {
            const Icon = p.icon;
            const isCurrent = currentRole === p.role;

            return (
              <div
                key={p.role}
                onClick={() => handleSelectSession(p)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isCurrent
                    ? 'bg-[#EBF2F7] border-[#17324D] ring-2 ring-[#17324D]/20 shadow-xs'
                    : 'bg-[#F8FAFC] border-[#DDE3E7] hover:border-[#17324D] hover:bg-white hover:shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div 
                    className="p-3 rounded-xl text-white flex-shrink-0 shadow-xs mt-0.5"
                    style={{ backgroundColor: p.color }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-[#17324D] text-sm font-heading">{p.name}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-[#DDE3E7] text-[#526270] font-mono">
                        {p.designation}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#287C5A] text-white flex items-center gap-1">
                          <Check className="w-3 h-3" /> ACTIVE SESSION
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#526270] font-mono">{p.email} • {p.zone}</p>
                    <p className="text-[11px] text-[#7C8992] leading-relaxed pt-0.5">{p.desc}</p>
                  </div>
                </div>

                <div className="w-full sm:w-auto flex-shrink-0 flex justify-end">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectSession(p);
                    }}
                    className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                      isCurrent
                        ? 'bg-[#17324D] text-white shadow-xs'
                        : 'bg-white text-[#17324D] border border-[#DDE3E7] hover:bg-[#17324D] hover:text-white'
                    }`}
                  >
                    <span>{isCurrent ? 'Current Session' : 'Switch Here'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-[#F8FAFC] border-t border-[#DDE3E7] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => {
              if (setActiveTab) setActiveTab('login');
              onClose();
            }}
            className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold text-[#B84040] hover:bg-[#FDF2F2] border border-[#B84040]/30 transition flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign In with Another Account</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 rounded-xl bg-white border border-[#DDE3E7] hover:bg-[#EBF2F7] text-xs font-bold text-[#526270] transition"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};
