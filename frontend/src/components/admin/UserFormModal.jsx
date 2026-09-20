import React, { useState, useEffect } from 'react';
import { 
  UserPlus, 
  X, 
  Shield, 
  Mail, 
  User, 
  Phone, 
  MapPin, 
  Lock, 
  Check, 
  AlertCircle 
} from 'lucide-react';

export const UserFormModal = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'VERIFIER',
    department: 'State Verification Directorate',
    phone: '',
    password: 'Password@2026'
  });

  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleRoleChange = (role) => {
    let defaultDept = 'State Verification Directorate';
    if (role === 'AUTHORITY') defaultDept = 'Department of Public Finance & Sanctions';
    else if (role === 'DISTRICT_OFFICER') defaultDept = 'Office of the District Magistrate & Collector';
    else if (role === 'ADMINISTRATOR') defaultDept = 'National DBT Secretariat & Governance';
    else if (role === 'APPLICANT') defaultDept = 'Medak District, Telangana';

    setFormData(prev => ({
      ...prev,
      role,
      department: defaultDept
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!formData.name.trim()) {
      setValidationError('Please enter the full name of the user/officer.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      setValidationError('Please enter a valid official email address.');
      return;
    }

    if (!formData.department.trim()) {
      setValidationError('Please specify the jurisdiction or department.');
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await onSubmit({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        role: formData.role,
        department: formData.department.trim(),
        district: formData.department.trim(),
        phone: formData.phone.trim() || '+91 98765 00000',
        password: formData.password || 'Password@2026'
      });
      if (success !== false) {
        onClose();
      }
    } catch (err) {
      setValidationError(err.message || 'Failed to onboard personnel.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0E2438]/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-[#DDE3E7] shadow-2xl overflow-hidden animate-scale-up">
        
        {/* Header Banner */}
        <div className="bg-[#17324D] p-6 text-white relative border-b-4 border-[#D97706]">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0E2438] border border-[#D97706]/40 text-[#FFF3E0] text-[11px] font-semibold mb-2">
            <Shield className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Chief Executive Administration Workspace</span>
          </div>

          <h2 className="text-xl font-extrabold font-heading text-white flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-[#D97706]" />
            <span>Onboard User or Government Officer</span>
          </h2>
          <p className="text-xs text-[#DDE3E7] mt-1">
            Provision RBAC credentials, assign administrative jurisdictions, and authorize platform entitlements.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          
          {validationError && (
            <div className="p-3 bg-[#FDF2F2] border border-[#B84040]/30 rounded-xl text-[#B84040] flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="font-semibold">{validationError}</span>
            </div>
          )}

          {/* Role Selection */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-[#526270] uppercase tracking-wider block">
              Designated Personnel Role *
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { 
                  id: 'VERIFIER', 
                  title: 'Verification Officer', 
                  desc: 'Field scrutiny & document check',
                  badgeColor: 'bg-[#EBF2F7] text-[#17324D] border-[#17324D]/30'
                },
                { 
                  id: 'DISTRICT_OFFICER', 
                  title: 'District Nodal Officer', 
                  desc: 'District scrutiny & quota endorsement',
                  badgeColor: 'bg-[#EFF6FF] text-[#1D4ED8] border-[#1D4ED8]/30'
                },
                { 
                  id: 'AUTHORITY', 
                  title: 'Sanction Authority', 
                  desc: 'Fund approval & treasury sanctions',
                  badgeColor: 'bg-[#FFF8E6] text-[#D97706] border-[#D97706]/30'
                },
                { 
                  id: 'APPLICANT', 
                  title: 'Citizen / Beneficiary', 
                  desc: 'Scheme applicant profile',
                  badgeColor: 'bg-[#EAF5EF] text-[#287C5A] border-[#287C5A]/30'
                },
                { 
                  id: 'ADMINISTRATOR', 
                  title: 'Administrator Officer', 
                  desc: 'Executive platform governance',
                  badgeColor: 'bg-[#F3E8FF] text-[#7C3AED] border-[#7C3AED]/30'
                }
              ].map(r => (
                <button
                  type="button"
                  key={r.id}
                  onClick={() => handleRoleChange(r.id)}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                    formData.role === r.id
                      ? 'border-[#17324D] bg-[#F7F9FA] shadow-xs ring-2 ring-[#17324D]/20'
                      : 'border-[#DDE3E7] bg-white hover:border-[#17324D]/40'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-extrabold text-[#17324D] text-xs">{r.title}</span>
                    {formData.role === r.id && (
                      <span className="w-4 h-4 rounded-full bg-[#17324D] text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-[#7C8992] leading-tight">{r.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* User Full Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#526270] uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#7C8992]" />
                <span>Full Name *</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Rajesh Mehra"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-[#F8FAFC] border border-[#DDE3E7] rounded-xl px-3.5 py-2.5 text-xs text-[#17324D] placeholder-[#7C8992] focus:outline-none focus:border-[#17324D]"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#526270] uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#7C8992]" />
                <span>Official Email *</span>
              </label>
              <input
                type="email"
                placeholder="e.g. rajesh.mehra@gov.in"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full bg-[#F8FAFC] border border-[#DDE3E7] rounded-xl px-3.5 py-2.5 text-xs text-[#17324D] placeholder-[#7C8992] focus:outline-none focus:border-[#17324D]"
                required
              />
            </div>
          </div>

          {/* Department / Jurisdiction & Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#526270] uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#7C8992]" />
                <span>Department / Jurisdiction *</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Field Verification Directorate"
                value={formData.department}
                onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                className="w-full bg-[#F8FAFC] border border-[#DDE3E7] rounded-xl px-3.5 py-2.5 text-xs text-[#17324D] placeholder-[#7C8992] focus:outline-none focus:border-[#17324D]"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#526270] uppercase tracking-wider flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#7C8992]" />
                <span>Mobile Phone</span>
              </label>
              <input
                type="text"
                placeholder="+91 98765 00000"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full bg-[#F8FAFC] border border-[#DDE3E7] rounded-xl px-3.5 py-2.5 text-xs text-[#17324D] placeholder-[#7C8992] focus:outline-none focus:border-[#17324D]"
              />
            </div>
          </div>

          {/* Default Password */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#526270] uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#7C8992]" />
              <span>Temporary Security Credential</span>
            </label>
            <input
              type="text"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="w-full bg-[#F8FAFC] border border-[#DDE3E7] rounded-xl px-3.5 py-2.5 text-xs text-[#17324D] font-mono focus:outline-none focus:border-[#17324D]"
            />
            <p className="text-[10px] text-[#7C8992]">Personnel will be prompted to change temporary credentials upon initial session authentication.</p>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-[#DDE3E7] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#DDE3E7] bg-white text-[#526270] font-bold hover:bg-[#F8FAFC] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isSubmitting ? 'Onboarding...' : 'Authorize & Create Account'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
