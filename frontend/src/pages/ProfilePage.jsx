import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getSafeAvatar } from '../utils/avatar';
import {
  User,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  Award,
  Building2,
  ArrowRight,
  Shield,
  Edit3,
  Save,
  X,
  Download,
  Check,
  Lock,
  Eye
} from 'lucide-react';
import { downloadDigitalIdPassPdf } from '../utils/digitalIdPdf';

export const ProfilePage = ({ setActiveTab }) => {
  const { currentUser, currentRole, updateUserProfile, showToast } = useApp();

  // Safe fallback user details
  const user = currentUser || {
    id: 'usr-default',
    name: 'Authorized Citizen',
    email: 'citizen@gov.in',
    role: currentRole || 'APPLICANT',
    avatar: getSafeAvatar('Authorized Citizen', currentRole || 'APPLICANT'),
    phone: '+91 98765 43210',
    address: 'H.No 4-12, Green Village, Medak',
    state: 'Telangana',
    district: 'Medak',
    status: 'ACTIVE'
  };

  // Edit Mode state
  const [isEditing, setIsEditing] = useState(false);
  const [showIdCardModal, setShowIdCardModal] = useState(false);

  const handleDownloadDigitalIdPass = () => {
    try {
      const fileName = downloadDigitalIdPassPdf(user, currentRole);
      showToast?.(`Downloaded Official Digital ID Pass (${fileName})!`, 'success');
    } catch (err) {
      console.error('[ProfilePage] Failed to download Digital ID Pass:', err);
      showToast?.('Failed to download Digital ID Pass. Please try again.', 'error');
    }
  };

  // Form State initialized from user
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '+91 98765 43210',
    address: user.address || 'H.No 4-12, Green Village, Medak',
    district: user.district || 'Medak',
    state: user.state || 'Telangana',
    bankName: user.bankName || 'State Bank of India',
    bankAccount: user.bankAccount || '•••• •••• 1024',
    ifsc: user.ifsc || 'SBIN0001024',
    notificationsEmail: true,
    notificationsSMS: true
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (updateUserProfile) {
      updateUserProfile(formData);
    } else {
      showToast?.('Profile changes saved successfully!', 'success');
    }
    setIsEditing(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-[#17324D] p-6 sm:p-8 rounded-2xl text-white shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-t-4 border-[#D97706]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="relative">
            <img
              src={getSafeAvatar(user, currentRole)}
              alt={user.name}
              onError={(e) => { e.currentTarget.src = getSafeAvatar(user.name, user.role || currentRole); }}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-[#D97706] shadow-md"
            />
            <span className="absolute -bottom-1 -right-1 p-1 bg-[#287C5A] rounded-full text-white border-2 border-[#17324D]" title="Identity Verified">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0E2438] border border-[#D97706]/40 text-[#FFF3E0] text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#D97706]" />
              <span>Verified Government Identity • e-KYC Complete</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
              {user.name}
            </h1>
            <p className="text-xs sm:text-sm text-[#DDE3E7] font-mono flex flex-wrap items-center gap-2">
              <span>{user.email}</span>
              <span>•</span>
              <span>{user.phone || '+91 98765 43210'}</span>
              <span>•</span>
              <span className="text-[#D97706] font-semibold">{user.district || 'Medak'}, {user.state || 'Telangana'}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-start md:justify-end">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition shadow-xs ${
              isEditing 
                ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20' 
                : 'bg-[#D97706] hover:bg-[#B45309] text-white'
            }`}
          >
            {isEditing ? (
              <>
                <X className="w-4 h-4" />
                <span>Cancel Editing</span>
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadDigitalIdPass}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs flex items-center gap-2 transition shadow-xs cursor-pointer"
            title="Download Official Digital ID Pass PDF"
          >
            <Download className="w-4 h-4 text-[#D97706]" />
            <span>Digital ID Pass</span>
          </button>

          <button
            onClick={() => setShowIdCardModal(true)}
            className="px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs flex items-center gap-1.5 transition shadow-xs cursor-pointer"
            title="Preview Verifiable Digital Identity Card"
          >
            <Eye className="w-4 h-4 text-[#FFF3E0]" />
            <span>View Pass</span>
          </button>

          <span className="px-4 py-2.5 rounded-xl bg-[#287C5A] text-white text-xs font-extrabold uppercase tracking-wider shadow-xs flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5" />
            <span>{currentRole || user.role} ACTIVE</span>
          </span>
        </div>
      </div>

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Profile & Credentials */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Identity & Account Card */}
          <div className="bg-white rounded-2xl p-6 border border-[#DDE3E7] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#DDE3E7] pb-3">
              <h3 className="text-sm font-extrabold text-[#17324D] uppercase font-heading tracking-wider flex items-center gap-2">
                <User className="w-4 h-4 text-[#D97706]" />
                <span>Official Identity & e-KYC Data</span>
              </h3>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#EAF5EF] text-[#287C5A] border border-[#287C5A]/30">
                UIDAI Linked
              </span>
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-[#526270] uppercase mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#DDE3E7] rounded-xl px-3.5 py-2.5 text-xs text-[#17324D] focus:outline-none focus:border-[#17324D] font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#526270] uppercase mb-1">Official Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#DDE3E7] rounded-xl px-3.5 py-2.5 text-xs text-[#17324D] focus:outline-none focus:border-[#17324D]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#526270] uppercase mb-1">Mobile Number (Aadhaar Linked)</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#DDE3E7] rounded-xl px-3.5 py-2.5 text-xs text-[#17324D] focus:outline-none focus:border-[#17324D] font-mono"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#526270] uppercase mb-1">District</label>
                    <input
                      type="text"
                      value={formData.district}
                      onChange={(e) => handleInputChange('district', e.target.value)}
                      className="w-full bg-[#F8FAFC] border border-[#DDE3E7] rounded-xl px-3.5 py-2.5 text-xs text-[#17324D] focus:outline-none focus:border-[#17324D]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#526270] uppercase mb-1">State</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className="w-full bg-[#F8FAFC] border border-[#DDE3E7] rounded-xl px-3.5 py-2.5 text-xs text-[#17324D] focus:outline-none focus:border-[#17324D]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#526270] uppercase mb-1">Residential Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#DDE3E7] rounded-xl px-3.5 py-2.5 text-xs text-[#17324D] focus:outline-none focus:border-[#17324D]"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-[#17324D] hover:bg-[#0E2438] text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition"
                  >
                    <Save className="w-4 h-4 text-[#D97706]" />
                    <span>Save Profile Changes</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 bg-[#F8FAFC] hover:bg-[#EBF2F7] text-[#526270] border border-[#DDE3E7] py-2.5 rounded-xl font-bold text-xs transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3 text-xs divide-y divide-[#DDE3E7]">
                <div className="flex justify-between py-2 items-center">
                  <span className="text-[#526270]">Full Name:</span> 
                  <span className="font-bold text-[#17324D]">{user.name}</span>
                </div>
                <div className="flex justify-between py-2 items-center">
                  <span className="text-[#526270]">Primary Email:</span> 
                  <span className="font-bold text-[#17324D]">{user.email}</span>
                </div>
                <div className="flex justify-between py-2 items-center">
                  <span className="text-[#526270]">Mobile Number:</span> 
                  <span className="font-mono font-bold text-[#17324D]">{user.phone || '+91 98765 43210'}</span>
                </div>
                <div className="flex justify-between py-2 items-center">
                  <span className="text-[#526270]">Aadhaar Virtual ID:</span> 
                  <span className="font-mono font-bold text-[#287C5A]">XXXX-XXXX-9102</span>
                </div>
                <div className="flex justify-between py-2 items-center">
                  <span className="text-[#526270]">District & State:</span> 
                  <span className="font-semibold text-[#17324D]">{user.district || 'Medak'}, {user.state || 'Telangana'}</span>
                </div>
                <div className="flex justify-between py-2 items-center">
                  <span className="text-[#526270]">Address:</span> 
                  <span className="font-medium text-[#17324D] text-right truncate max-w-[200px]">{user.address || 'H.No 4-12, Green Village, Medak'}</span>
                </div>
                <div className="flex justify-between py-2 items-center">
                  <span className="text-[#526270]">Account Status:</span> 
                  <span className="font-extrabold text-[#287C5A] bg-[#EAF5EF] px-2.5 py-0.5 rounded-full border border-[#287C5A]/20">
                    Active & e-KYC Verified
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Role-Specific Governance Credentials Card */}
          {currentRole === 'APPLICANT' && (
            <div className="bg-white rounded-2xl p-6 border border-[#DDE3E7] shadow-xs space-y-4">
              <h3 className="text-sm font-extrabold text-[#17324D] uppercase font-heading tracking-wider flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#287C5A]" />
                <span>Direct Bank Transfer (DBT) Account</span>
              </h3>

              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#DDE3E7] space-y-2 text-xs font-mono">
                <div className="text-[10px] text-[#526270] uppercase font-bold">Primary Disbursal Account</div>
                <div className="text-[#17324D] font-extrabold text-sm flex items-center justify-between">
                  <span>State Bank of India</span>
                  <span className="text-[10px] bg-[#EAF5EF] text-[#287C5A] px-2 py-0.5 rounded font-sans font-bold">Verified</span>
                </div>
                <div className="text-[#526270]">Account No: <span className="text-[#17324D] font-bold">•••• •••• 1024</span></div>
                <div className="text-[#526270]">IFSC Code: <span className="text-[#17324D] font-bold">SBIN0001024</span></div>
                <div className="text-[#287C5A] font-bold text-[11px] pt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> PFMS Public Treasury Linked
                </div>
              </div>
            </div>
          )}

          {currentRole === 'VERIFIER' && (
            <div className="bg-white rounded-2xl p-6 border border-[#DDE3E7] shadow-xs space-y-4">
              <h3 className="text-sm font-extrabold text-[#17324D] uppercase font-heading tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D97706]" />
                <span>Field Inspector Commission</span>
              </h3>

              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#DDE3E7] space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-[#526270]">Inspector Badge:</span> <span className="font-mono font-bold text-[#17324D]">INS-TEL-2026-88</span></div>
                <div className="flex justify-between"><span className="text-[#526270]">Jurisdiction Zone:</span> <span className="font-bold text-[#17324D]">Medak & Sangareddy</span></div>
                <div className="flex justify-between"><span className="text-[#526270]">Department:</span> <span className="font-medium text-[#17324D]">Field Inspection Office</span></div>
                <div className="flex justify-between"><span className="text-[#526270]">GPS Verification:</span> <span className="font-bold text-[#287C5A]">Active & Geotagged</span></div>
                <div className="pt-2 border-t border-[#DDE3E7] text-[11px] text-[#287C5A] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Authorized for On-Site Asset & Revenue Scrutiny
                </div>
              </div>
            </div>
          )}

          {currentRole === 'DISTRICT_OFFICER' && (
            <div className="bg-white rounded-2xl p-6 border border-[#DDE3E7] shadow-xs space-y-4">
              <h3 className="text-sm font-extrabold text-[#17324D] uppercase font-heading tracking-wider flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#1D4ED8]" />
                <span>District Nodal Officer Warrant</span>
              </h3>

              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#DDE3E7] space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-[#526270]">Officer ID:</span> <span className="font-mono font-bold text-[#17324D]">DIST-NODAL-TEL-04</span></div>
                <div className="flex justify-between"><span className="text-[#526270]">Cadre & Rank:</span> <span className="font-bold text-[#17324D]">Indian Administrative Service (IAS)</span></div>
                <div className="flex justify-between"><span className="text-[#526270]">Jurisdiction District:</span> <span className="font-bold text-[#1D4ED8]">{currentUser?.district || 'Medak District Collectorate'}</span></div>
                <div className="flex justify-between"><span className="text-[#526270]">Statutory Authority:</span> <span className="font-medium text-[#17324D]">District Level Grant Scrutiny Committee</span></div>
                <div className="pt-2 border-t border-[#DDE3E7] text-[11px] text-[#287C5A] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Authorized for District Quota Endorsement & Taluk Oversight
                </div>
              </div>
            </div>
          )}

          {currentRole === 'AUTHORITY' && (
            <div className="bg-white rounded-2xl p-6 border border-[#DDE3E7] shadow-xs space-y-4">
              <h3 className="text-sm font-extrabold text-[#17324D] uppercase font-heading tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4 text-[#17324D]" />
                <span>Sanction Officer Warrant</span>
              </h3>

              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#DDE3E7] space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-[#526270]">Officer ID:</span> <span className="font-mono font-bold text-[#17324D]">AUTH-DIR-901</span></div>
                <div className="flex justify-between"><span className="text-[#526270]">Designation:</span> <span className="font-bold text-[#17324D]">Joint Director & Sanction Officer</span></div>
                <div className="flex justify-between"><span className="text-[#526270]">Single Sanction Limit:</span> <span className="font-bold text-[#287C5A]">₹5,00,000 / Grant</span></div>
                <div className="flex justify-between"><span className="text-[#526270]">Digital Signature:</span> <span className="font-bold text-[#17324D]">DSC-eMudhra Class 3 Valid</span></div>
                <div className="pt-2 border-t border-[#DDE3E7] text-[11px] text-[#287C5A] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Treasury Direct Disbursal Approval Warrant
                </div>
              </div>
            </div>
          )}

          {currentRole === 'ADMINISTRATOR' && (
            <div className="bg-white rounded-2xl p-6 border border-[#DDE3E7] shadow-xs space-y-4">
              <h3 className="text-sm font-extrabold text-[#17324D] uppercase font-heading tracking-wider flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#D97706]" />
                <span>System Administration Clearance</span>
              </h3>

              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#DDE3E7] space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-[#526270]">Admin Clearance:</span> <span className="font-mono font-bold text-[#17324D]">SYS-ADM-ROOT-01</span></div>
                <div className="flex justify-between"><span className="text-[#526270]">Department:</span> <span className="font-bold text-[#17324D]">Digital Governance & Analytics</span></div>
                <div className="flex justify-between"><span className="text-[#526270]">Hardware Security:</span> <span className="font-bold text-[#287C5A]">YubiKey Linked</span></div>
                <div className="flex justify-between"><span className="text-[#526270]">Disbursal Gate:</span> <span className="font-bold text-[#17324D]">Full Treasury Override</span></div>
                <div className="pt-2 border-t border-[#DDE3E7] text-[11px] text-[#287C5A] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Comprehensive Platform Governance Access
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Security Safeguards & Current Workspace Scope */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Security & Access Posture Card */}
          <div className="bg-white rounded-2xl p-6 border border-[#DDE3E7] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#DDE3E7] pb-3">
              <div>
                <h3 className="text-base font-extrabold text-[#17324D] font-heading">Security & Access Posture</h3>
                <p className="text-xs text-[#526270]">Government identity safeguards and network connection standards</p>
              </div>
              <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-[#EAF5EF] text-[#287C5A] border border-[#287C5A]/30">
                TLS 1.3 • AES-256
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#DDE3E7] space-y-1">
                <div className="text-[10px] font-bold text-[#526270] uppercase">Two-Factor Auth</div>
                <div className="text-sm font-extrabold text-[#287C5A] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Enabled (OTP)
                </div>
                <div className="text-[10px] text-[#7C8992]">Aadhaar / Mobile 2FA</div>
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#DDE3E7] space-y-1">
                <div className="text-[10px] font-bold text-[#526270] uppercase">Authorized Node</div>
                <div className="text-sm font-extrabold text-[#17324D] font-mono">10.14.88.21</div>
                <div className="text-[10px] text-[#287C5A] font-semibold">Government Network Node</div>
              </div>
            </div>
          </div>

          {/* Active Session Role Card */}
          <div className="bg-white rounded-2xl p-6 border border-[#DDE3E7] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#DDE3E7] pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-[#17324D] uppercase font-heading tracking-wider flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#D97706]" />
                  <span>Current Session Scope</span>
                </h3>
                <p className="text-xs text-[#526270]">Active portal role authorized for this session:</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#EAF5EF] text-[#287C5A] border border-[#287C5A]/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-[#287C5A]" /> Active
              </span>
            </div>
            
            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#DDE3E7] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#7C8992] uppercase block">Designated Persona</span>
                <span className="text-xs font-extrabold text-[#17324D] font-heading">
                  {currentRole === 'APPLICANT' && 'Citizen Beneficiary'}
                  {currentRole === 'VERIFIER' && 'Field Verification Inspector'}
                  {currentRole === 'DISTRICT_OFFICER' && 'District Nodal Officer & Additional Collector'}
                  {currentRole === 'AUTHORITY' && 'Sanctioning Officer'}
                  {currentRole === 'ADMINISTRATOR' && 'Chief Platform Administrator'}
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-[#17324D]">{currentRole}</span>
            </div>

            <div className="pt-3 border-t border-[#DDE3E7] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <span className="text-[11px] text-[#7C8992]">
                To switch roles, sign out to return to the role selection portal.
              </span>
              <button
                onClick={() => setActiveTab('dashboard')}
                className="px-5 py-2.5 rounded-xl bg-[#17324D] hover:bg-[#0E2438] text-white font-bold text-xs flex items-center gap-2 shadow-xs transition whitespace-nowrap"
              >
                <span>Return to Dashboard</span>
                <ArrowRight className="w-4 h-4 text-[#D97706]" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Modal: Verifiable Digital Identity Card */}
      {showIdCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0E2438]/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full border border-[#DDE3E7] shadow-2xl overflow-hidden animate-scale-up">
            <div className="bg-[#17324D] p-6 text-white text-center relative border-b-4 border-[#D97706]">
              <button
                onClick={() => setShowIdCardModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="inline-block p-2 rounded-2xl bg-[#0E2438] mb-2 border border-[#D97706]/40">
                <ShieldCheck className="w-8 h-8 text-[#D97706]" />
              </div>
              <h3 className="text-lg font-extrabold font-heading">Digital Identity & e-KYC Pass</h3>
              <p className="text-xs text-[#DDE3E7]">Government of India • Unified Subsidy Platform</p>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex items-center gap-4 bg-[#F8FAFC] p-4 rounded-2xl border border-[#DDE3E7]">
                <img
                  src={getSafeAvatar(user, currentRole)}
                  alt={user.name}
                  onError={(e) => { e.currentTarget.src = getSafeAvatar(user.name, user.role || currentRole); }}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-[#D97706]"
                />
                <div className="space-y-1 text-xs">
                  <div className="font-extrabold text-[#17324D] text-sm">{user.name}</div>
                  <div className="text-[#526270] font-mono">{user.phone || '+91 98765 43210'}</div>
                  <div className="text-[10px] font-bold text-[#287C5A] uppercase bg-[#EAF5EF] px-2 py-0.5 rounded-full inline-block">
                    {currentRole || user.role} AUTHORIZED
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs divide-y divide-[#DDE3E7]">
                <div className="flex justify-between py-1.5"><span className="text-[#526270]">Aadhaar Virtual ID:</span> <span className="font-mono font-bold text-[#17324D]">XXXX-XXXX-9102</span></div>
                <div className="flex justify-between py-1.5"><span className="text-[#526270]">Location:</span> <span className="font-semibold text-[#17324D]">{user.district || 'Medak'}, {user.state || 'Telangana'}</span></div>
                <div className="flex justify-between py-1.5"><span className="text-[#526270]">e-KYC Status:</span> <span className="font-bold text-[#287C5A]">Verified via Biometrics/OTP</span></div>
                <div className="flex justify-between py-1.5"><span className="text-[#526270]">Issuer:</span> <span className="font-semibold text-[#17324D]">Digital Governance Directorate</span></div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => {
                    handleDownloadDigitalIdPass();
                    setShowIdCardModal(false);
                  }}
                  className="flex-1 bg-[#17324D] hover:bg-[#0E2438] text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
                >
                  <Download className="w-4 h-4 text-[#D97706]" />
                  <span>Download Pass PDF</span>
                </button>
                <button
                  onClick={() => setShowIdCardModal(false)}
                  className="px-5 bg-[#F8FAFC] hover:bg-[#EBF2F7] text-[#526270] border border-[#DDE3E7] py-2.5 rounded-xl font-bold text-xs transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
