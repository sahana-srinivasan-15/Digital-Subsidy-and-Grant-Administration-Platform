import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Landmark, ShieldCheck, Lock, Mail, ArrowRight, User, Award, Settings, Building2, CheckCircle2, Shield, Eye, EyeOff, AlertCircle, Compass, KeyRound, X, CreditCard, Phone, Sparkles } from 'lucide-react';

// Strict Format Validation Helpers
const isValidEmailFormat = (val) => {
  if (!val || typeof val !== 'string') return false;
  const trimmed = val.trim();
  // Disallows consecutive dots, missing user, missing domain, missing TLD, or trailing dots
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(trimmed) && !trimmed.includes('..');
};

const isValidAadhaarFormat = (val) => {
  if (!val || typeof val !== 'string') return false;
  const clean = val.replace(/[\s-]/g, '');
  return /^\d{12}$/.test(clean);
};


// Preset logins configuration (Updated per Requirements 11 & 12)
const presetLogins = [
  { 
    role: 'APPLICANT', 
    email: '', 
    label: 'Citizen', 
    icon: User
  },
  { 
    role: 'VERIFIER', 
    email: 'sahana@gmail.com', 
    label: 'Field Officer', 
    icon: ShieldCheck
  },
  { 
    role: 'DISTRICT_OFFICER', 
    email: 'kavitha@gmail.com', 
    label: 'District Officer', 
    icon: Building2
  },
  { 
    role: 'AUTHORITY', 
    email: 'mayur@gmail.com', 
    label: 'Sanction Authority', 
    icon: Award
  },
  { 
    role: 'ADMINISTRATOR', 
    email: 'sachin@gmail.com', 
    label: 'Chief Administrator', 
    icon: Settings
  }
];

export const Login = ({ onLoginSuccess, onExploreSchemes }) => {
  const { loginUser, registerUser, resetPassword, showToast } = useApp();
  const [authMode, setAuthMode] = useState('LOGIN'); // 'LOGIN' | 'REGISTER'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [regError, setRegError] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Registration state: For Citizen role, all personal/input fields start empty
  const [regForm, setRegForm] = useState({
    fullName: '',
    email: '',
    mobile: '',
    aadhaar: '',
    district: '',
    password: '',
    confirmPassword: ''
  });

  const clearRegistrationForm = () => {
    setRegForm({
      fullName: '',
      email: '',
      mobile: '',
      aadhaar: '',
      district: '',
      password: '',
      confirmPassword: ''
    });
    setRegError('');
  };
  
  // Selected role state
  const [selectedRole, setSelectedRole] = useState(() => {
    const saved = localStorage.getItem('dsga_auth_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.role && parsed.role !== 'APPLICANT') return parsed.role;
      } catch (e) {
        console.warn('Saved user parse notice:', e);
      }
    }
    return 'APPLICANT';
  });

  // Login credentials state:
  // IF selected role = CITIZEN/PERSON -> All personal/input fields = EMPTY
  // IF selected role = ANY OTHER EXISTING ROLE -> Keep current auto-fill behaviour
  const [email, setEmail] = useState(() => {
    const saved = localStorage.getItem('dsga_auth_user');
    let initialRole = 'APPLICANT';
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.role) initialRole = parsed.role;
        if (initialRole !== 'APPLICANT' && parsed?.email) return parsed.email;
      } catch (e) {
        console.warn('Saved user parse notice:', e);
      }
    }
    if (initialRole === 'APPLICANT') {
      return '';
    }
    const preset = presetLogins.find(p => p.role === initialRole);
    return preset?.email || '';
  });

  // Password must start empty (Requirements 5 & 11: no exposed or pre-filled passwords)
  const [password, setPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [showForgotNewPass, setShowForgotNewPass] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanEmail = String(email || '').trim();
    if (!isValidEmailFormat(cleanEmail)) {
      const msg = 'Please enter a valid email address';
      setErrorMessage(msg);
      showToast(msg, 'error');
      return;
    }

    if (!password) {
      const msg = 'Invalid email address or password';
      setErrorMessage(msg);
      showToast(msg, 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const ok = await loginUser(cleanEmail, password, selectedRole);
      if (ok && onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (err) {
      console.warn('[Login] Authentication rejected:', err.message);
      const displayMsg = err.message || 'Invalid email address or password';
      setErrorMessage(displayMsg);
      showToast(displayMsg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');

    const cleanEmail = String(forgotEmail || '').trim();
    if (!isValidEmailFormat(cleanEmail)) {
      setForgotError('Please enter a valid email address');
      return;
    }

    if (!forgotNewPassword || forgotNewPassword.length < 4) {
      setForgotError('New password must be at least 4 characters long');
      return;
    }

    if (forgotNewPassword !== forgotConfirmPassword) {
      setForgotError('Passwords do not match');
      return;
    }

    setIsResetting(true);
    try {
      await resetPassword(cleanEmail, forgotNewPassword);
      setForgotSuccess('Password updated successfully! You can now sign in.');
      setEmail(cleanEmail);
      setPassword(forgotNewPassword);
      setTimeout(() => {
        setShowForgotModal(false);
      }, 1500);
    } catch (err) {
      setForgotError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsResetting(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegError('');

    // 1. Full Legal Name validation
    if (!regForm.fullName || regForm.fullName.trim().length < 2) {
      const msg = 'Please enter your full legal name';
      setRegError(msg);
      showToast(msg, 'error');
      return;
    }

    // 2. Aadhaar format validation (exactly 12 numeric digits)
    const cleanAadhaar = String(regForm.aadhaar || '').replace(/[\s-]/g, '');
    if (!isValidAadhaarFormat(cleanAadhaar)) {
      const msg = 'Aadhaar number must contain exactly 12 digits';
      setRegError(msg);
      showToast(msg, 'error');
      return;
    }

    // 3. Email format validation
    const cleanEmail = String(regForm.email || '').trim();
    if (!isValidEmailFormat(cleanEmail)) {
      const msg = 'Please enter a valid email address';
      setRegError(msg);
      showToast(msg, 'error');
      return;
    }

    // 4. Mobile number validation (10 numeric digits)
    const cleanMobile = String(regForm.mobile || '').replace(/[\s-]/g, '');
    if (!/^\d{10}$/.test(cleanMobile)) {
      const msg = 'Mobile number must contain exactly 10 digits';
      setRegError(msg);
      showToast(msg, 'error');
      return;
    }

    // 5. Password minimum 4 chars
    if (!regForm.password || regForm.password.length < 4) {
      const msg = 'Password must be at least 4 characters long';
      setRegError(msg);
      showToast(msg, 'error');
      return;
    }

    // 6. Confirm password
    if (regForm.password !== regForm.confirmPassword) {
      const msg = 'Passwords do not match!';
      setRegError(msg);
      showToast(msg, 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await registerUser({
        fullName: regForm.fullName.trim(),
        email: cleanEmail.toLowerCase(),
        password: regForm.password,
        mobile: cleanMobile,
        aadhaar: cleanAadhaar,
        district: regForm.district || 'General'
      });
      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      const errMsg = err.message || 'Registration failed. Please try again.';
      setRegError(errMsg);
      showToast(errMsg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 relative animate-fade-in">
      
      {/* Background Subtle Tricolor Decorative Accent Bars */}
      <div className="absolute top-0 left-0 right-0 h-1.5 tricolor-accent-bar z-10"></div>

      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column: Official Government Visual Hero */}
        <div className="lg:col-span-5 bg-[#17324D] p-8 sm:p-10 rounded-2xl text-white shadow-card border-t-4 border-[#D97706] flex flex-col justify-between relative overflow-hidden">
          
          {/* Decorative Corner Watermark Seal */}
          <div className="absolute -bottom-10 -right-10 opacity-10 pointer-events-none">
            <Landmark className="w-64 h-64 text-white" />
          </div>

          <div className="space-y-6 z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0E2438] border border-[#D97706]/40 text-[#FFF3E0] text-xs font-bold tracking-wide uppercase">
              <Shield className="w-4 h-4 text-[#D97706]" />
              <span>National DBT & Subsidy Infrastructure</span>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#0E2438] border border-[#D97706]/40 flex items-center justify-center text-white shadow-xs">
                <Landmark className="w-7 h-7 text-[#FFF3E0]" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-white font-heading">
                  GOVERNMENT PORTAL
                </h1>
                <p className="text-xs text-[#D97706] font-bold tracking-wide font-heading">
                  Digital Subsidy & Grant Administration Platform
                </p>
              </div>
            </div>

            <p className="text-[#DDE3E7] text-xs sm:text-sm leading-relaxed">
              Unified digital governance portal for direct bank transfer (DBT) subsidies, automated paperless eligibility screening, and multi-stage sanction audit trails.
            </p>

            <div className="space-y-3 pt-1">
              {[
                { title: 'Aadhaar e-KYC & DigiLocker', sub: 'Instant paperless verification' },
                { title: 'Direct Bank Transfer (DBT)', sub: 'Zero-delay treasury disbursal' },
                { title: 'Transparent Audit Trail', sub: 'Full lifecycle application tracking' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs text-[#FFF3E0]">
                  <div className="w-5 h-5 rounded-full bg-[#287C5A] text-white flex items-center justify-center font-extrabold text-[11px] mt-0.5 shadow-xs">
                    ✓
                  </div>
                  <div>
                    <div className="font-bold text-white leading-tight">{item.title}</div>
                    <div className="text-[10px] text-[#DDE3E7]">{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Metrics Footer */}
          <div className="mt-8 pt-6 border-t border-[#0E2438] grid grid-cols-3 gap-2 text-center z-10">
            <div className="p-2.5 rounded-lg bg-[#0E2438]/80 border border-[#17324D]">
              <div className="text-base font-extrabold text-white font-heading">₹42.8 Cr+</div>
              <div className="text-[10px] text-[#7C8992] font-semibold">Disbursed</div>
            </div>
            <div className="p-2.5 rounded-lg bg-[#0E2438]/80 border border-[#17324D]">
              <div className="text-base font-extrabold text-[#287C5A] font-heading">98.4%</div>
              <div className="text-[10px] text-[#7C8992] font-semibold">Accuracy</div>
            </div>
            <div className="p-2.5 rounded-lg bg-[#0E2438]/80 border border-[#17324D]">
              <div className="text-base font-extrabold text-[#D97706] font-heading">12.4K+</div>
              <div className="text-[10px] text-[#7C8992] font-semibold">Citizens</div>
            </div>
          </div>
        </div>

        {/* Right Column: Creative Interactive Auth Card */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <div className="gov-card p-6 sm:p-8 bg-white text-[#17324D] shadow-card rounded-2xl border border-[#DDE3E7]">
            
            {/* Public Transparency Portal Quick Access Banner */}
            <div className="mb-5 p-3 rounded-xl bg-gradient-to-r from-[#FFF8EE] to-[#FFF3E0] border border-[#D97706]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs shadow-2xs">
              <div className="flex items-center gap-2 text-[#17324D] font-medium">
                <Compass className="w-4 h-4 text-[#D97706] flex-shrink-0" />
                <span>Want to explore government welfare schemes first?</span>
              </div>
              <button
                type="button"
                onClick={() => onExploreSchemes?.()}
                className="font-bold text-[#D97706] hover:text-[#B45309] hover:underline flex items-center gap-1 font-heading cursor-pointer whitespace-nowrap"
              >
                <span>Explore Public Schemes (No Login Required) →</span>
              </button>
            </div>



            {/* Header Badge (Informational banner, not a button) */}
            <div className="flex items-center justify-center p-2.5 rounded-xl bg-[#17324D] text-white mb-6 shadow-xs gap-2 font-heading text-xs font-bold uppercase tracking-wider">
              {authMode === 'LOGIN' ? (
                <>
                  <Lock className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>SIGN IN TO WORKSPACE</span>
                </>
              ) : (
                <>
                  <User className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>REGISTER CITIZEN ACCOUNT</span>
                </>
              )}
            </div>

            {authMode === 'LOGIN' ? (
              /* TAB 1: LOGIN FORM */
              <div className="space-y-5 animate-fade-in">
                <div>
                  <h2 className="text-xl font-extrabold text-[#17324D] font-heading">Official Portal Sign In</h2>
                  <p className="text-xs text-[#526270] mt-1">Select your designated role persona or enter authorized login credentials</p>
                </div>

                {/* Role Selection */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[11px] font-bold text-[#17324D] uppercase tracking-wider block font-heading">
                      Select Your Role:
                    </label>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                    {presetLogins.map((p) => {
                      const Icon = p.icon;
                      const isSel = selectedRole === p.role;
                      return (
                        <div key={p.role} className="relative">
                          <button
                            type="button"
                            id={`role-btn-${p.role.toLowerCase()}`}
                            onClick={() => {
                              setSelectedRole(p.role);
                              if (p.role === 'APPLICANT') {
                                setEmail('');
                              } else {
                                setEmail(p.email);
                              }
                              // Requirement 11: Do not auto-fill default password; user enters authorized password
                              setPassword('');
                              if (errorMessage) setErrorMessage('');
                            }}
                            className={`group w-full p-3 rounded-xl border text-center transition-all duration-200 cursor-pointer ${
                              isSel
                                ? 'bg-[#17324D] text-white border-[#17324D] shadow-xs ring-2 ring-[#D97706]/50 scale-[1.02]'
                                : 'bg-[#F8FAFC] border-[#CBD5E1] hover:bg-[#17324D] hover:border-[#17324D] hover:shadow-md'
                            }`}
                          >
                            <div className="flex items-center justify-center mb-1.5">
                              <Icon
                                className={`w-5 h-5 transition-colors duration-200 ${
                                  isSel
                                    ? 'text-[#D97706]'
                                    : 'text-[#D97706] group-hover:text-white'
                                }`}
                              />
                            </div>
                            <div
                              className={`text-xs font-bold truncate leading-tight font-heading transition-colors duration-200 ${
                                isSel
                                  ? 'text-white'
                                  : 'text-[#17324D] group-hover:text-white'
                              }`}
                            >
                              {p.label}
                            </div>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-4 pt-1" autoComplete="off">
                  {errorMessage && (
                    <div
                      id="login-error-message"
                      className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2.5 animate-fade-in"
                      role="alert"
                    >
                      <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-bold text-[#17324D] block mb-1">Official Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#7C8992] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="email"
                        value={email}
                        autoComplete="off"
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errorMessage) setErrorMessage('');
                        }}
                        required
                        className="w-full bg-white border border-[#DDE3E7] rounded-lg py-2.5 !pl-11 pr-4 text-xs text-[#17324D] focus:outline-none focus:border-[#17324D] input-with-icon-left"
                        style={{ paddingLeft: '2.75rem' }}
                        placeholder="name@gov.in"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#17324D] block mb-1">Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#7C8992] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type={showLoginPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (errorMessage) setErrorMessage('');
                        }}
                        required
                        className="w-full bg-white border border-[#DDE3E7] rounded-lg py-2.5 !pl-11 !pr-10 text-xs text-[#17324D] focus:outline-none focus:border-[#17324D] input-with-icon-left"
                        style={{ paddingLeft: '2.75rem', paddingRight: '2.5rem' }}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7C8992] hover:text-[#17324D] p-1 transition"
                        tabIndex={-1}
                      >
                        {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 text-[#526270] cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded bg-white border-[#DDE3E7] text-[#17324D] focus:ring-0" />
                      <span>Keep me logged in</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotEmail(email || '');
                        setForgotNewPassword('');
                        setForgotConfirmPassword('');
                        setForgotError('');
                        setForgotSuccess('');
                        setShowForgotModal(true);
                      }}
                      className="text-[#D97706] hover:text-[#B45309] font-bold hover:underline cursor-pointer bg-transparent border-none p-0 text-xs font-sans"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-lg bg-[#D97706] hover:bg-[#B45309] disabled:opacity-60 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 uppercase tracking-wider font-heading"
                  >
                    <span>{isSubmitting ? 'Authenticating...' : `Sign In as ${presetLogins.find(p => p.role === selectedRole)?.label || 'Authorized User'}`}</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>
                </form>
              </div>
            ) : (
              /* TAB 2: REGISTER CITIZEN ACCOUNT FORM */
              <div className="space-y-4 animate-fade-in">
                <div>
                  <h2 className="text-xl font-extrabold text-[#17324D] font-heading">Register Citizen Beneficiary Account</h2>
                  <p className="text-xs text-[#526270] mt-1">Provide your Aadhaar ID and contact details for paperless DBT eligibility</p>
                </div>

                <form onSubmit={handleRegisterSubmit} className="space-y-3.5" autoComplete="off">
                  {regError && (
                    <div
                      id="reg-error-message"
                      className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2.5 animate-fade-in"
                      role="alert"
                    >
                      <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                      <span>{regError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-[#17324D] block mb-1">Full Legal Name</label>
                      <div className="relative">
                        <User className="w-3.5 h-3.5 text-[#7C8992] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={regForm.fullName}
                          autoComplete="off"
                          onChange={(e) => {
                            setRegForm(prev => ({ ...prev, fullName: e.target.value }));
                            if (regError) setRegError('');
                          }}
                          required
                          className="w-full bg-white border border-[#DDE3E7] rounded-lg py-2.5 !pl-10 pr-3 text-xs text-[#17324D] input-with-icon-left"
                          style={{ paddingLeft: '2.5rem' }}
                          placeholder="As on Aadhaar Card"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-[#17324D] block mb-1">Aadhaar Number (e-KYC)</label>
                      <div className="relative">
                        <CreditCard className="w-3.5 h-3.5 text-[#7C8992] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={regForm.aadhaar}
                          autoComplete="off"
                          maxLength={12}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 12);
                            setRegForm(prev => ({ ...prev, aadhaar: val }));
                            if (regError) setRegError('');
                          }}
                          required
                          className="w-full bg-white border border-[#DDE3E7] rounded-lg py-2.5 !pl-10 pr-3 text-xs text-[#17324D] font-mono input-with-icon-left"
                          style={{ paddingLeft: '2.5rem' }}
                          placeholder="12-digit Aadhaar ID"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-[#17324D] block mb-1">Email Address</label>
                      <div className="relative">
                        <Mail className="w-3.5 h-3.5 text-[#7C8992] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="email"
                          value={regForm.email}
                          autoComplete="off"
                          onChange={(e) => {
                            setRegForm(prev => ({ ...prev, email: e.target.value }));
                            if (regError) setRegError('');
                          }}
                          required
                          className="w-full bg-white border border-[#DDE3E7] rounded-lg py-2.5 !pl-10 pr-3 text-xs text-[#17324D] input-with-icon-left"
                          style={{ paddingLeft: '2.5rem' }}
                          placeholder="citizen@mail.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-[#17324D] block mb-1">Mobile Number (Aadhaar linked)</label>
                      <div className="relative">
                        <Phone className="w-3.5 h-3.5 text-[#7C8992] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={regForm.mobile}
                          autoComplete="off"
                          maxLength={10}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                            setRegForm(prev => ({ ...prev, mobile: val }));
                            if (regError) setRegError('');
                          }}
                          required
                          className="w-full bg-white border border-[#DDE3E7] rounded-lg py-2.5 !pl-10 pr-3 text-xs text-[#17324D] input-with-icon-left"
                          style={{ paddingLeft: '2.5rem' }}
                          placeholder="10-digit mobile number"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-[#17324D] block mb-1">Password</label>
                      <div className="relative">
                        <Lock className="w-3.5 h-3.5 text-[#7C8992] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type={showRegPassword ? "text" : "password"}
                          value={regForm.password}
                          autoComplete="new-password"
                          onChange={(e) => {
                            setRegForm(prev => ({ ...prev, password: e.target.value }));
                            if (regError) setRegError('');
                          }}
                          required
                          className="w-full bg-white border border-[#DDE3E7] rounded-lg py-2.5 !pl-10 !pr-9 text-xs text-[#17324D] input-with-icon-left"
                          style={{ paddingLeft: '2.5rem', paddingRight: '2.25rem' }}
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegPassword(!showRegPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7C8992] hover:text-[#17324D] p-1 cursor-pointer"
                          tabIndex={-1}
                        >
                          {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-[#17324D] block mb-1">Confirm Password</label>
                      <div className="relative">
                        <Lock className="w-3.5 h-3.5 text-[#7C8992] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type={showRegPassword ? "text" : "password"}
                          value={regForm.confirmPassword}
                          autoComplete="new-password"
                          onChange={(e) => {
                            setRegForm(prev => ({ ...prev, confirmPassword: e.target.value }));
                            if (regError) setRegError('');
                          }}
                          required
                          className="w-full bg-white border border-[#DDE3E7] rounded-lg py-2.5 !pl-10 !pr-9 text-xs text-[#17324D] input-with-icon-left"
                          style={{ paddingLeft: '2.5rem', paddingRight: '2.25rem' }}
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                  </div>

                  {/* e-KYC Verification Consent Banner */}
                  <div className="p-3 rounded-lg bg-[#EAF5EF] border border-[#287C5A]/30 text-xs text-[#17324D] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#287C5A] flex-shrink-0" />
                    <span>I consent to instant e-KYC document verification via DigiLocker and National DBT Portal.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-lg bg-[#287C5A] hover:bg-[#1E5E44] disabled:opacity-60 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 uppercase tracking-wider font-heading mt-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-white" />
                    <span>{isSubmitting ? 'Registering Citizen Account...' : 'Create Account & Verify e-KYC'}</span>
                  </button>
                </form>
              </div>
            )}

            {/* Citizen Account Prompt (Text link, NOT like a button) */}
            <div className="mt-6 pt-4 border-t border-[#DDE3E7] text-center text-xs text-[#526270]">
              {authMode === 'LOGIN' ? (
                <span>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    id="register-citizen-link"
                    onClick={() => {
                      setAuthMode('REGISTER');
                      setErrorMessage('');
                      clearRegistrationForm();
                    }}
                    className="text-[#D97706] hover:text-[#B45309] font-bold hover:underline bg-transparent border-none p-0 cursor-pointer inline text-xs font-sans"
                  >
                    Register
                  </button>
                </span>
              ) : (
                <span>
                  Already have an account?{' '}
                  <button
                    type="button"
                    id="signin-citizen-link"
                    onClick={() => {
                      setAuthMode('LOGIN');
                      setErrorMessage('');
                      setRegError('');
                      if (selectedRole === 'APPLICANT') {
                        setEmail('');
                        setPassword('');
                      }
                    }}
                    className="text-[#17324D] hover:text-[#0E2438] font-bold hover:underline bg-transparent border-none p-0 cursor-pointer inline text-xs font-sans"
                  >
                    Sign In
                  </button>
                </span>
              )}
            </div>

          </div>
        </div>

      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#DDE3E7] w-full max-w-md overflow-hidden animate-scale-in">
            {/* Modal Header */}
            <div className="bg-[#17324D] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#0E2438] flex items-center justify-center text-[#D97706] border border-[#D97706]/40">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-heading">Reset Account Password</h3>
                  <p className="text-[11px] text-[#DDE3E7]">Update your portal login credentials</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="text-[#DDE3E7] hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleForgotPasswordSubmit} className="p-6 space-y-4">
              {forgotError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2 animate-fade-in">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span>{forgotError}</span>
                </div>
              )}

              {forgotSuccess && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{forgotSuccess}</span>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-[#17324D] block mb-1">
                  Registered Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#7C8992] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => {
                      setForgotEmail(e.target.value);
                      if (forgotError) setForgotError('');
                    }}
                    required
                    className="w-full bg-white border border-[#DDE3E7] rounded-lg py-2.5 !pl-11 pr-4 text-xs text-[#17324D] focus:outline-none focus:border-[#17324D] input-with-icon-left"
                    style={{ paddingLeft: '2.75rem' }}
                    placeholder="name@gov.in or citizen email"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#17324D] block mb-1">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#7C8992] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showForgotNewPass ? "text" : "password"}
                    value={forgotNewPassword}
                    onChange={(e) => {
                      setForgotNewPassword(e.target.value);
                      if (forgotError) setForgotError('');
                    }}
                    required
                    className="w-full bg-white border border-[#DDE3E7] rounded-lg py-2.5 !pl-11 !pr-10 text-xs text-[#17324D] focus:outline-none focus:border-[#17324D] input-with-icon-left"
                    style={{ paddingLeft: '2.75rem', paddingRight: '2.5rem' }}
                    placeholder="Enter new password (min 4 chars)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowForgotNewPass(!showForgotNewPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7C8992] hover:text-[#17324D] p-1 transition cursor-pointer"
                    tabIndex={-1}
                  >
                    {showForgotNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#17324D] block mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#7C8992] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showForgotNewPass ? "text" : "password"}
                    value={forgotConfirmPassword}
                    onChange={(e) => {
                      setForgotConfirmPassword(e.target.value);
                      if (forgotError) setForgotError('');
                    }}
                    required
                    className="w-full bg-white border border-[#DDE3E7] rounded-lg py-2.5 !pl-11 !pr-10 text-xs text-[#17324D] focus:outline-none focus:border-[#17324D] input-with-icon-left"
                    style={{ paddingLeft: '2.75rem', paddingRight: '2.5rem' }}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#526270] hover:text-[#17324D] rounded-lg border border-[#DDE3E7] hover:bg-[#F0F4F7] transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isResetting}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#17324D] hover:bg-[#0E2438] disabled:opacity-60 rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer font-heading uppercase tracking-wide"
                >
                  <KeyRound className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>{isResetting ? 'Updating...' : 'Reset Password'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
