import React, { useState } from 'react';
import { 
  MessageSquare, 
  Building2, 
  ChevronDown, 
  ChevronUp, 
  FileQuestion,
  PhoneCall,
  Mail
} from 'lucide-react';
import { helpdeskFaqs } from '../mockData/systemData';

export const HelpdeskPage = ({ setActiveTab }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
              Citizen Support Central
            </span>
            <span className="text-xs text-slate-500">Available Mon–Sat, 8:00 AM – 8:00 PM</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Helpdesk & Frequently Asked Questions</h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Need help discovering a scheme, uploading documentation, or checking your Direct Benefit Transfer credit? Connect with our dedicated facilitation network.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('grievances')}
          className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition"
        >
          <MessageSquare className="w-4 h-4" />
          <span>File a Formal Grievance</span>
        </button>
      </div>

      {/* Support Channels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <PhoneCall className="w-6 h-6" />
          </div>
          <div className="space-y-1 text-xs">
            <h3 className="font-bold text-sm text-[#0f172a]">National Toll-Free Helpline</h3>
            <div className="text-base font-extrabold text-blue-700">1800-11-2026</div>
            <p className="text-slate-500">Available in Hindi, English, and regional languages.</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Mail className="w-6 h-6" />
          </div>
          <div className="space-y-1 text-xs">
            <h3 className="font-bold text-sm text-[#0f172a]">Email Assistance</h3>
            <div className="text-sm font-extrabold text-emerald-700">helpdesk@dsga.gov.in</div>
            <p className="text-slate-500">Guaranteed response within 2 working days.</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div className="space-y-1 text-xs">
            <h3 className="font-bold text-sm text-[#0f172a]">District Facilitation Centers</h3>
            <div className="text-sm font-bold text-slate-800">540+ CSC Centers</div>
            <p className="text-slate-500">Walk-in biometric Aadhaar seeding & document scanning.</p>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions Accordion */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <FileQuestion className="w-5 h-5 text-blue-700" />
          <h2 className="text-lg font-bold text-[#0f172a]">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {helpdeskFaqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div 
                key={idx} 
                className="border border-slate-200 rounded-xl overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full text-left p-4 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition"
                >
                  <span className="font-bold text-xs sm:text-sm text-[#0f172a]">{faq.question}</span>
                  <span className="p-1 rounded bg-slate-100 text-slate-500 shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                </button>

                {isOpen && (
                  <div className="p-4 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/40">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
