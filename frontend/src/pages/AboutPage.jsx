import React from 'react';
import { 
  ShieldCheck, 
  LockKeyhole, 
  MessageSquare, 
  ArrowRight 
} from 'lucide-react';

export const AboutPage = ({ setActiveTab }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#1e3a8a] text-white p-8 sm:p-14 mb-10 shadow-xl">
        <div className="max-w-2xl relative z-10 space-y-4">
          <span className="text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 inline-block">
            Government Public Service Charter
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white !text-white">
            A Clearer Path Between Public Funds and Public Good.
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            The Digital Subsidy & Grant Administration Platform (DSGA) consolidates scheme discovery, paperless multi-step applications, field verification, sanctioning decisions, and Direct Benefit Transfer (DBT) disbursement into one accountable national record.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button 
              onClick={() => setActiveTab('schemes')}
              className="px-6 py-3 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs inline-flex items-center gap-2 shadow-lg transition"
            >
              <span>Explore Available Schemes</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setActiveTab('helpdesk')}
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition"
            >
              View Helpdesk & FAQs
            </button>
          </div>
        </div>
      </div>

      {/* 3 Core Pillars */}
      <div className="mb-12">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
            Our Guiding Philosophy
          </span>
          <h2 className="text-2xl font-bold text-[#0f172a] mt-2">Plain Language. Clear Status. No Dead Ends.</h2>
          <p className="text-xs text-slate-500 mt-1">Each application shows who acts next, what is needed, and where your direct benefit stands.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#0f172a] mb-1.5">Accountable Governance</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every action carries a verifiable cryptographic timestamp and actor ID. Field verification and financial sanctions are visible in public audit summaries.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4">
              <LockKeyhole className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#0f172a] mb-1.5">Responsible & Secure</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Documents and income declarations are handled strictly around purpose and citizen consent, with automated DigiLocker OCR verification preventing fraud.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#0f172a] mb-1.5">Approachable for Citizens</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Assistance and appeal channels are open at every stage, not just at the end. Citizens can track progress live or contact facilitation desks toll-free.
            </p>
          </div>
        </div>
      </div>

      {/* Multi-Role Lifecycle */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <h3 className="text-lg font-bold text-[#0f172a] mb-2">One Platform for Many Programmes</h3>
        <p className="text-xs text-slate-500 mb-6">Designed to integrate departments across Agriculture, Housing, Education, Health, and Skill Development.</p>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="font-bold text-blue-700 mb-1">1. Citizen / Applicant</div>
            <p className="text-slate-600">Discovers eligible schemes, uploads documents, and receives DBT funds directly into bank accounts.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="font-bold text-amber-700 mb-1">2. Field Verifier</div>
            <p className="text-slate-600">Performs side-by-side document inspection, OCR comparison, and issues verified remarks.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="font-bold text-emerald-700 mb-1">3. Sanction Authority</div>
            <p className="text-slate-600">Approves grant allocations, monitors scheme budget envelopes, and authorizes PFMS tranche releases.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="font-bold text-purple-700 mb-1">4. Administrator</div>
            <p className="text-slate-600">Publishes new welfare schemes, manages audit trails, oversees grievances, and evaluates national telemetry.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
