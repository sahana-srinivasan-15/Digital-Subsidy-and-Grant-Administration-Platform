import { jsPDF } from 'jspdf';

/**
 * Generates and triggers download of an official DBT Payment Voucher PDF.
 * @param {Object} app - The application object containing scheme, applicant, and transaction data.
 * @param {Object} [currentUser] - Optional current user object for fallback metadata.
 */
export const downloadVoucherPdf = (app, currentUser = null) => {
  if (!app) {
    throw new Error('Application data is missing for voucher generation');
  }

  const cleanAppId = app.id || 'APP-2026';
  const fileName = `Voucher_${cleanAppId}.pdf`;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  // 1. Tricolor Top Accent Bands
  doc.setFillColor(217, 119, 6); // Saffron (#D97706)
  doc.rect(0, 0, pageWidth, 4, 'F');
  doc.setFillColor(40, 124, 90); // Green (#287C5A)
  doc.rect(0, 4, pageWidth, 2, 'F');

  // 2. Header Banner
  doc.setFillColor(23, 50, 77); // Deep Navy (#17324D)
  doc.rect(margin, 12, contentWidth, 28, 'F');

  doc.setTextColor(255, 243, 224); // Saffron accent text
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('GOVERNMENT OF INDIA • MINISTRY OF FINANCE & PUBLIC WELFARE', margin + 6, 18);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('DIRECT BENEFIT TRANSFER (DBT) PAYMENT VOUCHER', margin + 6, 26);

  doc.setTextColor(221, 227, 231);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Digital Subsidy & Grant Administration Platform (DSGA) • Official Treasury Record', margin + 6, 33);

  // Status Badge in Header (Positioned to ensure ample clearance from header title)
  const badgeWidth = 32;
  const badgeHeight = 15;
  const badgeX = pageWidth - margin - badgeWidth - 4; // Starts at x = 159mm (title ends at 135mm, giving 24mm clear gap)
  const badgeY = 18.5;

  doc.setFillColor(40, 124, 90); // Green badge (#287C5A)
  doc.roundedRect(badgeX, badgeY, badgeWidth, badgeHeight, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('STATUS: SUCCESS', badgeX + badgeWidth / 2, badgeY + 6, { align: 'center' });
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.text('100% DISBURSED', badgeX + badgeWidth / 2, badgeY + 11, { align: 'center' });

  let curY = 46;

  // 3. Voucher Reference Summary Box
  doc.setFillColor(252, 251, 248);
  doc.setDrawColor(221, 227, 231);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, curY, contentWidth, 22, 2, 2, 'FD');

  doc.setTextColor(82, 98, 112);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('VOUCHER NUMBER', margin + 5, curY + 6);
  doc.text('APPLICATION ID', margin + 50, curY + 6);
  doc.text('TRANSACTION REFERENCE (PFMS)', margin + 95, curY + 6);
  doc.text('DISBURSAL DATE', margin + 145, curY + 6);

  const txnRef = app.transactionId || 'TXN-DBT-2026-89481920';
  const disbursalDate = app.paymentDate 
    ? new Date(app.paymentDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  doc.setTextColor(23, 50, 77);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(`VCH-${cleanAppId.replace('APP-', '')}`, margin + 5, curY + 14);
  doc.text(cleanAppId, margin + 50, curY + 14);
  doc.setFont('courier', 'bold');
  doc.setFontSize(8.5);
  doc.text(txnRef, margin + 95, curY + 14);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(disbursalDate, margin + 145, curY + 14);

  curY += 28;

  // Helper for drawing Section Headers
  const drawSectionHeader = (title, y) => {
    doc.setFillColor(245, 247, 249);
    doc.rect(margin, y, contentWidth, 7, 'F');
    doc.setDrawColor(217, 119, 6);
    doc.setLineWidth(1);
    doc.line(margin, y, margin, y + 7);

    doc.setTextColor(23, 50, 77);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.text(title.toUpperCase(), margin + 4, y + 5);
    return y + 11;
  };

  // 4. Beneficiary Information Section
  curY = drawSectionHeader('1. Beneficiary & Identity Details', curY);

  const beneficiaryName = app.applicantName || currentUser?.name || 'Citizen Beneficiary';
  const beneficiaryPhone = app.applicantPhone || currentUser?.phone || '+91 98765 43210';
  const beneficiaryLocation = `${app.applicantDistrict || 'Medak'}, ${app.applicantState || 'Telangana'}`;
  const beneficiaryAadhaar = app.applicantAadhaar || 'XXXXXXXX4892 (e-KYC Verified)';

  const drawRow = (label1, val1, label2, val2, y) => {
    doc.setTextColor(82, 98, 112);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(label1, margin + 4, y);
    doc.text(label2, margin + 95, y);

    doc.setTextColor(23, 50, 77);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.text(String(val1 || 'N/A'), margin + 4, y + 4.5);
    doc.text(String(val2 || 'N/A'), margin + 95, y + 4.5);
    return y + 10;
  };

  curY = drawRow('Beneficiary Full Legal Name', beneficiaryName, 'Aadhaar Registered Mobile', beneficiaryPhone, curY);
  curY = drawRow('Aadhaar Verification Status', beneficiaryAadhaar, 'Registered District & State', beneficiaryLocation, curY);

  curY += 2;

  // 5. Scheme & Disbursal Grant Details
  curY = drawSectionHeader('2. Scheme & Grant Disbursal Specification', curY);

  const schemeTitle = app.schemeTitle || 'Central / State Direct Welfare Assistance Scheme';
  const requestedAmt = `INR ${Number(app.requestedAmount || 0).toLocaleString('en-IN')}`;
  const approvedAmt = `INR ${Number(app.approvedAmount || app.requestedAmount || 0).toLocaleString('en-IN')}`;

  curY = drawRow('Welfare Scheme Name', schemeTitle, 'Category / Scheme Code', app.schemeId || 'SCH-DBT-2026', curY);
  curY = drawRow('Requested Subsidy Amount', requestedAmt, 'Approved Disbursal Amount (100%)', approvedAmt, curY);

  curY += 2;

  // 6. Direct Bank Transfer (DBT) Treasury Details
  curY = drawSectionHeader('3. DBT Bank Account & Electronic Clearance Details', curY);

  const bankName = app.bankDetails?.bankName || 'State Bank of India';
  const accNum = app.bankDetails?.accountNumber ? `•••• •••• ${app.bankDetails.accountNumber.slice(-4)}` : '•••• •••• 1024';
  const ifsc = app.bankDetails?.ifsc || 'SBIN0001024';
  const branch = app.bankDetails?.branch || 'Central Government DBT Clearing Branch';

  curY = drawRow('Destination Bank Name', bankName, 'Account Number (Masked)', accNum, curY);
  curY = drawRow('Bank IFSC Code', ifsc, 'Clearing Treasury Branch', branch, curY);

  curY += 2;

  // 7. Payment Summary Box (Highlighted)
  doc.setFillColor(234, 245, 239); // Soft green
  doc.setDrawColor(40, 124, 90);
  doc.setLineWidth(0.8);
  doc.roundedRect(margin, curY, contentWidth, 20, 2, 2, 'FD');

  doc.setTextColor(40, 124, 90);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL AMOUNT CREDITED VIA DIRECT BANK TRANSFER (DBT):', margin + 6, curY + 7);

  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text(approvedAmt, margin + 6, curY + 15);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(23, 50, 77);
  doc.text('Mode of Payment: PFMS Direct Credit  |  Settlement: Immediate Clearing', margin + 70, curY + 14);

  curY += 26;

  // 8. Signatures & Audit Footers
  doc.setDrawColor(221, 227, 231);
  doc.setLineWidth(0.5);
  doc.line(margin, curY, pageWidth - margin, curY);
  curY += 6;

  // Verifier and Sanction Signatures
  doc.setTextColor(82, 98, 112);
  doc.setFontSize(7.5);
  doc.text('FIELD SCRUTINY VERIFIER', margin + 4, curY);
  doc.text('SANCTIONING & TREASURY AUTHORITY', margin + 105, curY);

  doc.setTextColor(23, 50, 77);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text(app.verifierName || 'Anil Sharma (Field Inspector)', margin + 4, curY + 4.5);
  doc.text('Joint Director, Grant Sanction Directorate', margin + 105, curY + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(40, 124, 90);
  doc.text('Digitally Verified via Aadhaar e-KYC', margin + 4, curY + 8.5);
  doc.text('Cryptographically Approved via DSC Warrant', margin + 105, curY + 8.5);

  // 9. Official Security Notice Footer
  const footerY = 275;
  doc.setFillColor(245, 247, 249);
  doc.rect(0, footerY, pageWidth, 22, 'F');
  doc.setDrawColor(221, 227, 231);
  doc.setLineWidth(0.3);
  doc.line(0, footerY, pageWidth, footerY);

  doc.setTextColor(82, 98, 112);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('SECURE OFFICIAL VOUCHER • DIGITAL SUBSIDY & GRANT ADMINISTRATION PLATFORM', margin, footerY + 6);
  doc.setFont('helvetica', 'normal');
  doc.text('This is an electronically generated valid payment voucher issued pursuant to Direct Benefit Transfer (DBT) rules.', margin, footerY + 10);
  doc.text('For grievance appeals or verification disputes, visit https://dsga.gov.in/grievance or call Toll-Free: 1800-11-2026.', margin, footerY + 14);

  // Trigger download directly to user's Downloads folder
  doc.save(fileName);
  return fileName;
};
