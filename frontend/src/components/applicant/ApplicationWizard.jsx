import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User, 
  Trash2, 
  Plus, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Upload, 
  Landmark, 
  ShieldCheck, 
  Sparkles,
  FileCheck,
  RotateCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { schemeSpecificFieldsMap, schemeRequiredDocumentsMap } from '../../mockData/schemeFormFields';

const FromPrevBadge = ({ show }) => show ? (
  <span className="inline-block ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
    From Previous Application
  </span>
) : null;

export const ApplicationWizard = ({ scheme, previousApplication = null, isRenewal = false, onComplete, onCancel }) => {
  const { currentUser, submitApplication } = useApp();
  const [step, setStep] = useState(1);

  const schemeId = scheme ? scheme.id : (previousApplication?.schemeId || 'SCH-2026-01');
  const specificFields = schemeSpecificFieldsMap[schemeId] || [];
  const requiredDocList = schemeRequiredDocumentsMap[schemeId] || [
    { id: 'doc-aadhaar', name: 'Aadhaar Identity Card', required: true },
    { id: 'doc-income', name: 'Income Certificate', required: true },
    { id: 'doc-bank', name: 'Aadhaar Seeded Bank Passbook', required: true }
  ];

  // Form State - prefilled from previousApplication if in Renewal mode
  const [formData, setFormData] = useState({
    schemeId,
    isRenewal: Boolean(isRenewal),
    previousApplicationId: previousApplication?.id || null,
    requestedAmount: previousApplication?.requestedAmount || (scheme ? scheme.maxAmount : 150000),
    fullName: previousApplication?.applicantName || currentUser?.name || 'Citizen Applicant',
    age: previousApplication?.applicantAge || currentUser?.age || 32,
    phone: previousApplication?.applicantPhone || currentUser?.phone || '+91 98765 43210',
    address: previousApplication?.applicantAddress || currentUser?.address || 'H.No 4-12, Green Village',
    state: previousApplication?.applicantState || currentUser?.state || 'Telangana',
    district: previousApplication?.applicantDistrict || currentUser?.district || 'Medak',
    income: previousApplication?.applicantIncome || currentUser?.income || 320000,
    bankName: previousApplication?.bankDetails?.bankName || 'State Bank of India',
    accountName: previousApplication?.bankDetails?.accountName || currentUser?.name || 'Citizen Beneficiary',
    accountNumber: previousApplication?.bankDetails?.accountNumber || '918200391024',
    ifsc: previousApplication?.bankDetails?.ifsc || 'SBIN0001024',
    branch: previousApplication?.bankDetails?.branch || 'Medak Main Branch',
    schemeSpecificDetails: previousApplication?.schemeSpecificDetails || {},
    uploadedDocuments: (isRenewal && previousApplication?.documents && previousApplication.documents.length > 0)
      ? previousApplication.documents.map(d => ({ ...d, uploadedAt: 'From Previous Application' }))
      : requiredDocList.map((doc, idx) => ({
          id: `doc-${idx + 1}`,
          name: `${doc.name.replace(/[^a-zA-Z0-9]/g, '_')}_Verified.pdf`,
          type: doc.name,
          status: 'VERIFIED',
          size: `${(0.8 + idx * 0.4).toFixed(1)} MB`,
          uploadedAt: 'Just now',
          ocrConfidence: '98%'
        }))
  });

  const [newDocName, setNewDocName] = useState('');
  const [newDocType, setNewDocType] = useState('Supporting Certificate');

  const handleNext = () => setStep(prev => Math.min(prev + 1, 5));
  const handlePrev = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSpecificFieldChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      schemeSpecificDetails: {
        ...prev.schemeSpecificDetails,
        [fieldName]: value
      }
    }));
  };

  const handleAddCustomDoc = () => {
    if (!newDocName.trim()) return;
    const newDoc = {
      id: `doc-custom-${Date.now()}`,
      name: `${newDocName.trim().replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
      type: newDocType,
      status: 'PENDING',
      size: '1.1 MB',
      uploadedAt: 'Just now',
      ocrConfidence: '96%'
    };
    setFormData(prev => ({
      ...prev,
      uploadedDocuments: [...prev.uploadedDocuments, newDoc]
    }));
    setNewDocName('');
  };

  const handleRemoveDoc = (docId) => {
    setFormData(prev => ({
      ...prev,
      uploadedDocuments: prev.uploadedDocuments.filter(d => d.id !== docId)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Confetti fallback
    }

    const newAppId = submitApplication(formData);
    if (onComplete) onComplete(newAppId);
  };

  const steps = isRenewal
    ? [
        '1. Review Previous Details',
        '2. Update Information',
        '3. Scheme Criteria',
        '4. Review Documents',
        '5. Submit Renewal'
      ]
    : [
        '1. Personal Info',
        '2. Financial & Bank',
        '3. Scheme Criteria',
        '4. Document Dossier',
        '5. Review & Submit'
      ];

  return (
    <div className="ds-card p-6 sm:p-8 bg-white border border-slate-200 shadow-md max-w-4xl mx-auto my-6 text-slate-800">
      {/* Renewal Notification Banner */}
      {isRenewal && previousApplication && (
        <div className="mb-5 p-4 rounded-xl bg-[#FFF8EE] border border-[#D97706]/40 text-[#17324D] flex items-start gap-3 animate-fade-in shadow-2xs">
          <RotateCw className="w-5 h-5 text-[#D97706] mt-0.5 shrink-0" />
          <div className="text-xs">
            <div className="font-bold flex items-center gap-2">
              <span className="text-sm font-heading">{previousApplication.status === 'REJECTED' ? 'Re-Application Mode' : 'Renewal Application Mode'}</span>
              <span className="px-2 py-0.5 rounded bg-[#D97706]/20 text-[#D97706] text-[10px] font-mono font-extrabold">
                Ref: {previousApplication.id}
              </span>
            </div>
            <p className="text-[#526270] mt-1">
              Information pre-filled from your prior submission. Please review all fields, update any details that may have changed, and re-verify your documents before submitting your renewal.
            </p>
          </div>
        </div>
      )}

      {/* Wizard Header */}
      <div className="border-b border-slate-200 pb-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200">
              {isRenewal ? 'Renewal / Re-Application Form' : 'Official Grant Application Form'}
            </span>
            <h2 className="text-xl font-bold text-[#0f172a] mt-2">{scheme ? scheme.title : (previousApplication?.schemeTitle || 'Government Subsidy Application')}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{scheme?.department || 'Department of Welfare & Benefit Administration'}</p>
          </div>
          <button onClick={onCancel} className="text-xs text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-md bg-slate-100 border border-slate-300">
            Cancel
          </button>
        </div>

        {/* Stepper Header */}
        <div className="grid grid-cols-5 gap-2 text-center pt-2">
          {steps.map((st, idx) => {
            const num = idx + 1;
            const isCompleted = step > num;
            const isCurrent = step === num;
            return (
              <div key={idx} className="space-y-1">
                <div className={`h-1.5 rounded-full transition-all ${
                  isCompleted ? 'bg-emerald-600' : isCurrent ? 'bg-[#1d4ed8]' : 'bg-slate-200'
                }`}></div>
                <span className={`text-[10px] font-semibold block truncate ${
                  isCurrent ? 'text-blue-700 font-bold' : isCompleted ? 'text-emerald-700' : 'text-slate-400'
                }`}>
                  {st}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 1: Personal Details */}
      {step === 1 && (
        <div className="space-y-4 animate-fade-in">
          <h3 className="text-sm font-bold text-[#0f172a] mb-2 flex items-center gap-2">
            <User className="w-4 h-4 text-blue-700" />
            <span>{isRenewal ? 'Step 1: Review Previous Personal Information' : 'Step 1: Tell us about yourself'}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-700 font-medium block mb-1">
                Full Name (As per Aadhaar)
                <FromPrevBadge show={isRenewal} />
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none shadow-sm"
              />
            </div>

            <div>
              <label className="text-slate-700 font-medium block mb-1">
                Age
                <FromPrevBadge show={isRenewal} />
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none shadow-sm"
              />
            </div>

            <div>
              <label className="text-slate-700 font-medium block mb-1">
                Mobile Phone Number
                <FromPrevBadge show={isRenewal} />
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none shadow-sm"
              />
            </div>

            <div>
              <label className="text-slate-700 font-medium block mb-1">
                State & District
                <FromPrevBadge show={isRenewal} />
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none shadow-sm"
                  placeholder="State"
                />
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none shadow-sm"
                  placeholder="District"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="text-slate-700 font-medium block mb-1">
                Full Residential Address
                <FromPrevBadge show={isRenewal} />
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none shadow-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Financial & Bank */}
      {step === 2 && (
        <div className="space-y-4 animate-fade-in">
          <h3 className="text-sm font-bold text-[#0f172a] mb-2 flex items-center gap-2">
            <Landmark className="w-4 h-4 text-blue-700" />
            <span>{isRenewal ? 'Step 2: Update Financial & Direct Bank Transfer (DBT) Information' : 'Step 2: Income & Direct Bank Transfer (DBT) Account'}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-700 font-medium block mb-1">
                Annual Household Income (₹)
                <FromPrevBadge show={isRenewal} />
              </label>
              <input
                type="number"
                value={formData.income}
                onChange={(e) => setFormData({ ...formData, income: Number(e.target.value) })}
                className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none shadow-sm"
              />
            </div>

            <div>
              <label className="text-slate-700 font-medium block mb-1">
                Requested Grant Assistance (₹)
                <FromPrevBadge show={isRenewal} />
              </label>
              <input
                type="number"
                value={formData.requestedAmount}
                max={scheme ? scheme.maxAmount : 200000}
                onChange={(e) => setFormData({ ...formData, requestedAmount: Number(e.target.value) })}
                className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none shadow-sm"
              />
              <span className="text-[10px] text-slate-500">Max limit for scheme: ₹{scheme ? scheme.maxAmount.toLocaleString('en-IN') : '2,00,000'}</span>
            </div>

            <div>
              <label className="text-slate-700 font-medium block mb-1">
                Bank Name
                <FromPrevBadge show={isRenewal} />
              </label>
              <input
                type="text"
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none shadow-sm"
              />
            </div>

            <div>
              <label className="text-slate-700 font-medium block mb-1">
                Bank Account Number (Aadhaar Linked)
                <FromPrevBadge show={isRenewal} />
              </label>
              <input
                type="text"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none shadow-sm"
              />
            </div>

            <div>
              <label className="text-slate-700 font-medium block mb-1">
                Bank IFSC Code
                <FromPrevBadge show={isRenewal} />
              </label>
              <input
                type="text"
                value={formData.ifsc}
                onChange={(e) => setFormData({ ...formData, ifsc: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none shadow-sm"
              />
            </div>

            <div>
              <label className="text-slate-700 font-medium block mb-1">
                Branch Name
                <FromPrevBadge show={isRenewal} />
              </label>
              <input
                type="text"
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none shadow-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Scheme-Specific Questions & Eligibility */}
      {step === 3 && (
        <div className="space-y-4 animate-fade-in text-xs">
          <h3 className="text-sm font-bold text-[#0f172a] mb-2 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-700" />
            <span>Step 3: Scheme Eligibility & Specific Details</span>
          </h3>

          {/* Dynamic Scheme Questions from application-schemes01 */}
          {specificFields.length > 0 ? (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="text-xs font-bold text-[#0f172a] mb-2">
                Mandatory Declarations for {scheme?.title || 'Selected Scheme'}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {specificFields.map((field) => (
                  <div key={field.name} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
                    <label className="text-slate-700 font-medium block mb-1">
                      {field.label} {field.required && <span className="text-rose-600">*</span>}
                    </label>

                    {field.type === 'select' ? (
                      <select
                        value={formData.schemeSpecificDetails[field.name] || ''}
                        onChange={(e) => handleSpecificFieldChange(field.name, e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none shadow-sm"
                      >
                        <option value="">Select option...</option>
                        {field.options.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type || 'text'}
                        placeholder={field.placeholder || ''}
                        value={formData.schemeSpecificDetails[field.name] || ''}
                        onChange={(e) => handleSpecificFieldChange(field.name, e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-slate-900 focus:border-blue-600 focus:outline-none shadow-sm"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-600">
              No additional special declarations required. Standard eligibility criteria apply.
            </div>
          )}

          {/* Automated Eligibility Parameters */}
          <div className="space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="font-bold text-[#0f172a] mb-1">Rule Engine Preliminary Match</div>
            <div className="flex items-center justify-between p-2.5 rounded bg-white border border-slate-200">
              <span className="text-slate-700">Age Bracket ({scheme?.minAge || 18}–{scheme?.maxAge || 65} Years):</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> {formData.age} Years (Eligible)
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded bg-white border border-slate-200">
              <span className="text-slate-700">Annual Income Ceiling (&lt; ₹{scheme?.maxIncome ? scheme.maxIncome.toLocaleString('en-IN') : '5,00,000'}):</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> ₹{formData.income.toLocaleString('en-IN')} (Eligible)
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded bg-white border border-slate-200">
              <span className="text-slate-700">Jurisdiction Verification:</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> {formData.state} (Approved State)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Document Dossier Upload */}
      {step === 4 && (
        <div className="space-y-4 animate-fade-in text-xs">
          <h3 className="text-sm font-bold text-[#0f172a] mb-2 flex items-center gap-2">
            <Upload className="w-4 h-4 text-blue-700" />
            <span>Step 4: Upload Required Verification Documents</span>
          </h3>

          <div className="p-5 rounded-xl border-2 border-dashed border-blue-300 bg-blue-50/50 text-center hover:border-blue-500 transition">
            <Upload className="w-7 h-7 text-blue-700 mx-auto mb-2" />
            <p className="text-[#0f172a] font-semibold">DigiLocker & Direct Document Upload</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Supports PDF, JPG, PNG (Auto OCR Verification enabled)</p>
          </div>

          {/* Quick upload supplementary document */}
          <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <input
              type="text"
              placeholder="Add supplementary certificate name (e.g. Land Records, Ration Card)..."
              value={newDocName}
              onChange={(e) => setNewDocName(e.target.value)}
              className="flex-1 bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-900 focus:outline-none"
            />
            <select
              value={newDocType}
              onChange={(e) => setNewDocType(e.target.value)}
              className="bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-900 focus:outline-none"
            >
              <option>Supporting Certificate</option>
              <option>Income Proof</option>
              <option>Property Deed</option>
              <option>Caste Certificate</option>
            </select>
            <button
              type="button"
              onClick={handleAddCustomDoc}
              className="px-3 py-1.5 rounded bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs inline-flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>

          <div className="space-y-2">
            {formData.uploadedDocuments.map((doc) => (
              <div key={doc.id} className="p-3 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileCheck className="w-5 h-5 text-blue-700 shrink-0" />
                  <div>
                    <div className="font-semibold text-[#0f172a]">{doc.name}</div>
                    <div className="text-[10px] text-slate-500">{doc.type} • {doc.size}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    OCR {doc.ocrConfidence} Match
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveDoc(doc.id)}
                    className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 5: Review & Submit */}
      {step === 5 && (
        <div className="space-y-4 animate-fade-in text-xs">
          <h3 className="text-sm font-bold text-[#0f172a] mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-700" />
            <span>Step 5: Final Review before Official Submission</span>
          </h3>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-200">
              <div><span className="text-slate-500">Applicant:</span> <span className="text-[#0f172a] font-semibold">{formData.fullName}</span></div>
              <div><span className="text-slate-500">Phone:</span> <span className="text-[#0f172a] font-semibold">{formData.phone}</span></div>
              <div><span className="text-slate-500">Location:</span> <span className="text-[#0f172a] font-semibold">{formData.district}, {formData.state}</span></div>
              <div><span className="text-slate-500">Annual Income:</span> <span className="text-[#0f172a] font-semibold">₹{formData.income.toLocaleString('en-IN')}</span></div>
            </div>

            <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-200">
              <div><span className="text-slate-500">Target Scheme:</span> <span className="text-blue-700 font-semibold">{scheme ? scheme.title : 'Grant'}</span></div>
              <div><span className="text-slate-500">Requested Assistance:</span> <span className="text-emerald-700 font-bold">₹{formData.requestedAmount.toLocaleString('en-IN')}</span></div>
            </div>

            {Object.keys(formData.schemeSpecificDetails).length > 0 && (
              <div className="pb-3 border-b border-slate-200">
                <span className="text-slate-500 block mb-1 font-semibold">Scheme Specific Declarations:</span>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(formData.schemeSpecificDetails).map(([k, v]) => (
                    <div key={k} className="text-slate-700">
                      <span className="capitalize text-slate-500">{k.replace(/([A-Z])/g, ' $1')}:</span> <span className="font-semibold">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <span className="text-slate-500 block mb-1">Direct Bank Transfer Account:</span>
              <span className="text-[#0f172a] font-semibold">{formData.bankName} • A/C: {formData.accountNumber} (IFSC: {formData.ifsc})</span>
            </div>

            <div className="pt-2">
              <span className="text-slate-500 block mb-1">Attached Documents ({formData.uploadedDocuments.length}):</span>
              <div className="flex flex-wrap gap-1.5">
                {formData.uploadedDocuments.map(d => (
                  <span key={d.id} className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px] font-medium">
                    ✓ {d.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] leading-relaxed">
            By submitting this application, I solemnly declare that the information provided is accurate and authentic. Direct Benefit Transfer will be credited to my Aadhaar-linked bank account subject to field inspection and authority approval.
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-200 mt-6">
        {step > 1 ? (
          <button
            onClick={handlePrev}
            className="px-4 py-2 rounded-lg bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-200 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>
        ) : <div></div>}

        {step < 5 ? (
          <button
            onClick={handleNext}
            className="px-5 py-2.5 rounded-lg bg-[#1d4ed8] hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <span>Continue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isRenewal ? (previousApplication?.status === 'REJECTED' ? 'Submit Re-Application' : 'Submit Renewal Application') : 'Submit Official Application'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
