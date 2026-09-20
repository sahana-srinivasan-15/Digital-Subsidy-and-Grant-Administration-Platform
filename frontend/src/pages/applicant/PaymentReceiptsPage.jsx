import React from 'react';
import { useApp } from '../../context/AppContext';
import { Award, CheckCircle2, Download } from 'lucide-react';
import { downloadVoucherPdf } from '../../utils/voucherPdf';

export const PaymentReceiptsPage = () => {
  const { currentUser, applications, showToast } = useApp();

  const paidApps = applications.filter(a =>
    (a.applicantId === currentUser.id || a.applicantEmail === currentUser.email) &&
    (a.status === 'PAID' || a.status === 'APPROVED' || a.paymentStatus === 'PAID')
  );

  const handleDownloadReceipt = (app) => {
    try {
      const fileName = downloadVoucherPdf(app, currentUser);
      showToast(`Downloaded Official Direct Bank Transfer Receipt (${fileName})!`, 'success');
    } catch (err) {
      console.error('[PaymentReceiptsPage] Failed to download voucher PDF:', err);
      showToast('Could not generate voucher PDF. Please try again.', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="bg-[#17324D] p-6 sm:p-8 rounded-xl border-t-4 border-[#D97706] text-white shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#0E2438] border border-[#D97706]/40 text-[#FFF3E0] text-xs font-semibold mb-2">
            <Award className="w-4 h-4 text-[#D97706]" />
            <span>Public Finance Direct Transfer Authority • Government Scheme Portal</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white font-heading">Direct Bank Transfer (DBT) Receipts</h1>
          <p className="text-xs text-[#DDE3E7]">View official payment vouchers and verified treasury disbursement receipts.</p>
        </div>

        <div className="p-4 rounded-xl bg-[#0E2438] border border-[#D97706]/30 text-right">
          <div className="text-xs text-[#526270]">Total Grant Received</div>
          <div className="text-2xl font-extrabold text-[#287C5A] font-heading">
            ₹{paidApps.reduce((sum, a) => sum + (a.approvedAmount || 0), 0).toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Receipts Grid */}
      <div className="space-y-4">
        {paidApps.length === 0 ? (
          <div className="gov-card p-12 text-center text-[#7C8992] rounded-xl bg-white border border-[#DDE3E7]">
            <Award className="w-12 h-12 text-[#7C8992] mx-auto mb-3 opacity-50" />
            <h3 className="text-sm font-bold text-[#17324D] font-heading">No Disbursed Grants Yet</h3>
            <p className="text-xs text-[#526270] mt-1">Once your application passes sanction approval, direct bank transfer receipts will appear here.</p>
          </div>
        ) : (
          paidApps.map(app => (
            <div key={app.id} className="gov-card p-6 rounded-xl border border-[#DDE3E7] bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#17324D] bg-[#F8FAFC] px-2.5 py-0.5 rounded border border-[#DDE3E7]">
                    {app.id}
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#EAF5EF] text-[#287C5A] border border-[#287C5A]/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Direct Bank Transfer Successful
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#17324D] font-heading">{app.schemeTitle}</h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                  <div>
                    <span className="text-[#526270] text-[10px] uppercase font-semibold block">Disbursed Amount</span>
                    <span className="text-[#287C5A] font-extrabold text-sm font-heading">₹{app.approvedAmount?.toLocaleString('en-IN')}</span>
                  </div>

                  <div>
                    <span className="text-[#526270] text-[10px] uppercase font-semibold block">Transaction Reference</span>
                    <span className="text-[#17324D] font-mono text-[11px] font-bold">{app.transactionId || 'TXN-DBT-2026-89481920'}</span>
                  </div>

                  <div>
                    <span className="text-[#526270] text-[10px] uppercase font-semibold block">Bank Account</span>
                    <span className="text-[#17324D] font-bold">{app.bankDetails?.bankName || 'State Bank of India'} (A/C: ****{app.bankDetails?.accountNumber?.slice(-4) || '1024'})</span>
                  </div>

                  <div>
                    <span className="text-[#526270] text-[10px] uppercase font-semibold block">Disbursal Date</span>
                    <span className="text-[#17324D] font-medium">{app.paymentDate ? new Date(app.paymentDate).toLocaleDateString('en-IN') : 'Recent'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-[#DDE3E7]">
                <button
                  id={`download-voucher-btn-${app.id}`}
                  onClick={() => handleDownloadReceipt(app)}
                  className="w-full md:w-auto px-4 py-2.5 rounded bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition uppercase tracking-wider cursor-pointer"
                >
                  <Download className="w-4 h-4 text-white" />
                  <span>Download Voucher PDF</span>
                </button>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
