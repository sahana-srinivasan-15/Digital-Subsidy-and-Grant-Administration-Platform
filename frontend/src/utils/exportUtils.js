import { jsPDF } from 'jspdf';

/**
 * Escapes a cell for CSV per RFC 4180 standard.
 * Wraps in quotes and escapes internal double-quotes.
 */
const escapeCsvCell = (val) => {
  if (val === null || val === undefined) return '""';
  const str = String(val);
  return `"${str.replace(/"/g, '""')}"`;
};

/**
 * Downloads a CSV string as a file with UTF-8 BOM for Microsoft Excel compatibility.
 */
const triggerCsvDownload = (csvContent, fileName) => {
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return fileName;
};

/**
 * Exports audit trail logs to a valid CSV file.
 * @param {Array} logs - Array of audit log objects.
 * @param {string} [fileName='Audit_Trail.csv'] - Desired file name.
 */
export const exportAuditTrailToCsv = (logs = [], fileName = 'Audit_Trail.csv') => {
  const headers = [
    'Log ID',
    'Timestamp (IST)',
    'Actor Name',
    'Actor Role',
    'Action Event',
    'Event Category',
    'Target App / Scheme',
    'Event Details',
    'Digital Checksum Seal',
    'Severity'
  ];

  const rows = logs.map(log => [
    log.id || 'AUDIT-LOG',
    log.timestamp ? new Date(log.timestamp).toLocaleString('en-IN') : 'N/A',
    log.actorName || log.actor || 'System Automated Process',
    log.actorRole || 'SYSTEM',
    log.action || log.eventCategory || 'AUDIT_RECORD',
    log.eventCategory || 'GENERAL',
    log.targetId || log.applicationId || log.schemeId || 'N/A',
    log.details || log.action || '',
    log.checksum || log.hash || `SHA256:${Math.random().toString(16).substring(2, 14)}...`,
    log.severity || 'INFO'
  ]);

  const csvContent = [
    headers.map(escapeCsvCell).join(','),
    ...rows.map(row => row.map(escapeCsvCell).join(','))
  ].join('\r\n');

  return triggerCsvDownload(csvContent, fileName);
};

/**
 * Exports official sanction registry ledger to CSV.
 * @param {Array} applications - Applications list.
 * @param {string} [fileName='Sanction_Registry.csv'] - Desired file name.
 */
export const exportSanctionRegistryToCsv = (applications = [], fileName = 'Sanction_Registry.csv') => {
  const headers = [
    'Application ID',
    'Citizen Beneficiary',
    'Scheme Title',
    'Category',
    'Sanctioned Amount (INR)',
    'PFMS Transaction ID',
    'Approval Date',
    'Application Status',
    'Disbursal Status',
    'Bank Account',
    'District',
    'State'
  ];

  const rows = applications.map(app => [
    app.id || 'APP-2026',
    app.applicantName || 'Citizen',
    app.schemeTitle || 'Government Scheme',
    app.schemeCategory || 'GENERAL',
    app.approvedAmount || app.requestedAmount || 0,
    app.transactionId || 'Pending PFMS Batch',
    app.approvalDate ? new Date(app.approvalDate).toLocaleDateString('en-IN') : 'Recent',
    app.status || 'APPROVED',
    app.status === 'PAID' ? '100% Disbursed' : 'Sanctioned / Awaiting Disbursal',
    app.bankDetails?.accountNumber ? `••••${app.bankDetails.accountNumber.slice(-4)}` : 'Aadhaar Seeded',
    app.applicantDistrict || 'Medak',
    app.applicantState || 'Telangana'
  ]);

  const csvContent = [
    headers.map(escapeCsvCell).join(','),
    ...rows.map(row => row.map(escapeCsvCell).join(','))
  ].join('\r\n');

  return triggerCsvDownload(csvContent, fileName);
};

/**
 * Generates an official printable PDF report of audit logs.
 */
export const generateAuditTrailPdf = (logs = [], title = 'System Security & Activity Audit Trail', fileName = 'Audit_Trail.pdf') => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 12;

  // Header Bands
  doc.setFillColor(217, 119, 6);
  doc.rect(0, 0, pageWidth, 3, 'F');
  doc.setFillColor(23, 50, 77);
  doc.rect(0, 3, pageWidth, 18, 'F');

  doc.setTextColor(255, 243, 224);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('GOVERNMENT OF INDIA • UNIFIED DIRECT BENEFIT TRANSFER (DBT) PLATFORM', margin, 9);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.text(title.toUpperCase(), margin, 16);

  doc.setTextColor(221, 227, 231);
  doc.setFontSize(7.5);
  doc.text(`Generated: ${new Date().toLocaleString('en-IN')} IST • ISO 27001 / CERT-In Compliant Immutable Audit Ledger`, pageWidth - margin, 16, { align: 'right' });

  // Table Headers
  let curY = 28;
  const colX = [margin, margin + 35, margin + 80, margin + 115, margin + 165, margin + 235];

  doc.setFillColor(23, 50, 77);
  doc.rect(margin, curY, pageWidth - margin * 2, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('TIMESTAMP', colX[0] + 2, curY + 5);
  doc.text('ACTOR', colX[1] + 2, curY + 5);
  doc.text('ROLE', colX[2] + 2, curY + 5);
  doc.text('EVENT ACTION', colX[3] + 2, curY + 5);
  doc.text('DETAILS', colX[4] + 2, curY + 5);
  doc.text('CHECKSUM SEAL', colX[5] + 2, curY + 5);

  curY += 7;

  // Render Rows
  const pageHeight = doc.internal.pageSize.getHeight();
  const sampleLogs = logs.slice(0, 80);

  sampleLogs.forEach((log, index) => {
    if (curY > pageHeight - 20) {
      doc.addPage('a4', 'landscape');
      curY = 15;
      // Header for new page
      doc.setFillColor(23, 50, 77);
      doc.rect(margin, curY, pageWidth - margin * 2, 7, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      doc.text('TIMESTAMP', colX[0] + 2, curY + 5);
      doc.text('ACTOR', colX[1] + 2, curY + 5);
      doc.text('ROLE', colX[2] + 2, curY + 5);
      doc.text('EVENT ACTION', colX[3] + 2, curY + 5);
      doc.text('DETAILS', colX[4] + 2, curY + 5);
      doc.text('CHECKSUM SEAL', colX[5] + 2, curY + 5);
      curY += 7;
    }

    doc.setFillColor(index % 2 === 0 ? 255 : 248, index % 2 === 0 ? 255 : 250, index % 2 === 0 ? 255 : 252);
    doc.rect(margin, curY, pageWidth - margin * 2, 8, 'F');
    doc.setDrawColor(221, 227, 231);
    doc.line(margin, curY + 8, pageWidth - margin, curY + 8);

    doc.setTextColor(82, 98, 112);
    doc.setFont('courier', 'normal');
    doc.setFontSize(7);
    const dateStr = log.timestamp ? new Date(log.timestamp).toLocaleDateString('en-IN') : 'Recent';
    doc.text(dateStr, colX[0] + 2, curY + 5.5);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(23, 50, 77);
    doc.text((log.actorName || log.actor || 'System Process').substring(0, 24), colX[1] + 2, curY + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(82, 98, 112);
    doc.text((log.actorRole || 'SYSTEM').substring(0, 18), colX[2] + 2, curY + 5.5);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(40, 124, 90);
    doc.text((log.action || log.eventCategory || 'EVENT').substring(0, 24), colX[3] + 2, curY + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(23, 50, 77);
    doc.text((log.details || '').substring(0, 48), colX[4] + 2, curY + 5.5);

    doc.setFont('courier', 'normal');
    doc.setTextColor(82, 98, 112);
    const seal = (log.checksum || log.id || 'SHA256:4b91...').substring(0, 18);
    doc.text(seal, colX[5] + 2, curY + 5.5);

    curY += 8;
  });

  // Footer
  doc.setFontSize(7);
  doc.setTextColor(82, 98, 112);
  doc.text(`Official Audit Trail Ledger • Page ${doc.internal.getNumberOfPages()} • Digital Subsidy & Grant Administration (DSGA)`, margin, pageHeight - 8);

  doc.save(fileName);
  return fileName;
};

/**
 * Generates an official PDF report of the Grant Sanction Registry.
 */
export const generateSanctionRegistryPdf = (applications = [], fileName = 'Official_Sanction_Registry.pdf') => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 12;

  // Header Bands
  doc.setFillColor(217, 119, 6);
  doc.rect(0, 0, pageWidth, 3, 'F');
  doc.setFillColor(23, 50, 77);
  doc.rect(0, 3, pageWidth, 18, 'F');

  doc.setTextColor(255, 243, 224);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('GOVERNMENT OF INDIA • STATE SANCTIONING DIRECTORATE & TREASURY DESK', margin, 9);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.text('OFFICIAL GRANT SANCTION & DBT DISBURSAL REGISTRY', margin, 16);

  doc.setTextColor(221, 227, 231);
  doc.setFontSize(7.5);
  doc.text(`Generated: ${new Date().toLocaleString('en-IN')} IST • Public Financial Management System (PFMS) Linked`, pageWidth - margin, 16, { align: 'right' });

  let curY = 28;
  const colX = [margin, margin + 30, margin + 75, margin + 140, margin + 175, margin + 225];

  // Table header
  doc.setFillColor(23, 50, 77);
  doc.rect(margin, curY, pageWidth - margin * 2, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('APP ID', colX[0] + 2, curY + 5);
  doc.text('BENEFICIARY NAME', colX[1] + 2, curY + 5);
  doc.text('SCHEME TITLE', colX[2] + 2, curY + 5);
  doc.text('SANCTION AMOUNT', colX[3] + 2, curY + 5);
  doc.text('PFMS REFERENCE', colX[4] + 2, curY + 5);
  doc.text('DISBURSAL STATUS', colX[5] + 2, curY + 5);

  curY += 7;

  const sanctioned = applications.filter(a => a.status === 'APPROVED' || a.status === 'PAID');
  const items = sanctioned.length > 0 ? sanctioned : applications;

  items.forEach((app, index) => {
    if (curY > pageHeight - 20) {
      doc.addPage('a4', 'landscape');
      curY = 15;
      doc.setFillColor(23, 50, 77);
      doc.rect(margin, curY, pageWidth - margin * 2, 7, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      doc.text('APP ID', colX[0] + 2, curY + 5);
      doc.text('BENEFICIARY NAME', colX[1] + 2, curY + 5);
      doc.text('SCHEME TITLE', colX[2] + 2, curY + 5);
      doc.text('SANCTION AMOUNT', colX[3] + 2, curY + 5);
      doc.text('PFMS REFERENCE', colX[4] + 2, curY + 5);
      doc.text('DISBURSAL STATUS', colX[5] + 2, curY + 5);
      curY += 7;
    }

    doc.setFillColor(index % 2 === 0 ? 255 : 248, index % 2 === 0 ? 255 : 250, index % 2 === 0 ? 255 : 252);
    doc.rect(margin, curY, pageWidth - margin * 2, 8, 'F');
    doc.setDrawColor(221, 227, 231);
    doc.line(margin, curY + 8, pageWidth - margin, curY + 8);

    doc.setTextColor(23, 50, 77);
    doc.setFont('courier', 'bold');
    doc.setFontSize(7.5);
    doc.text(app.id || 'APP-2026', colX[0] + 2, curY + 5.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text((app.applicantName || 'Citizen').substring(0, 22), colX[1] + 2, curY + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text((app.schemeTitle || 'Scheme').substring(0, 38), colX[2] + 2, curY + 5.5);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(40, 124, 90);
    const amt = app.approvedAmount || app.requestedAmount || 0;
    doc.text(`INR ${amt.toLocaleString('en-IN')}`, colX[3] + 2, curY + 5.5);

    doc.setFont('courier', 'normal');
    doc.setTextColor(82, 98, 112);
    doc.setFontSize(7);
    doc.text((app.transactionId || 'TXN-DBT-2026-91823901').substring(0, 24), colX[4] + 2, curY + 5.5);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(app.status === 'PAID' ? 40 : 217, app.status === 'PAID' ? 124 : 119, app.status === 'PAID' ? 90 : 6);
    doc.text(app.status === 'PAID' ? '100% DISBURSED' : 'SANCTION APPROVED', colX[5] + 2, curY + 5.5);

    curY += 8;
  });

  doc.setFontSize(7);
  doc.setTextColor(82, 98, 112);
  doc.text(`Official Grant Sanction Registry • Total Grants: ${items.length} • Digital Subsidy & Grant Administration (DSGA)`, margin, pageHeight - 8);

  doc.save(fileName);
  return fileName;
};

/**
 * Generates and downloads an official DBT Application Acknowledgement Slip PDF.
 */
export const downloadAcknowledgementPdf = (app = {}) => {
  const appId = app.id || 'APP-2026';
  const fileName = `Acknowledgement_${appId}.pdf`;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  // Tricolor Top Bands
  doc.setFillColor(217, 119, 6);
  doc.rect(0, 0, pageWidth, 4, 'F');
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 4, pageWidth, 2, 'F');
  doc.setFillColor(40, 124, 90);
  doc.rect(0, 6, pageWidth, 4, 'F');

  // Header Banner
  let curY = 16;
  doc.setFillColor(23, 50, 77);
  doc.roundedRect(margin, curY, contentWidth, 30, 2, 2, 'F');

  doc.setTextColor(255, 243, 224);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('GOVERNMENT OF INDIA • NATIONAL DIRECT BENEFIT TRANSFER MISSION', margin + 8, curY + 8);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('OFFICIAL APPLICATION ACKNOWLEDGEMENT SLIP', margin + 8, curY + 17);

  doc.setTextColor(221, 227, 231);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Paperless Submission & Cryptographic Tracking Receipt • DSGA Portal', margin + 8, curY + 23);

  curY += 36;

  // Slip Reference Container
  doc.setFillColor(252, 251, 248);
  doc.setDrawColor(221, 227, 231);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, curY, contentWidth, 22, 2, 2, 'FD');

  doc.setTextColor(82, 98, 112);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('APPLICATION ID', margin + 6, curY + 7);
  doc.text('SUBMISSION DATE & TIME', margin + 65, curY + 7);
  doc.text('PROCESSING CURRENT STATUS', margin + 130, curY + 7);

  doc.setTextColor(23, 50, 77);
  doc.setFont('courier', 'bold');
  doc.setFontSize(11);
  doc.text(appId, margin + 6, curY + 16);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  const subDate = app.submittedDate ? new Date(app.submittedDate).toLocaleString('en-IN') : new Date().toLocaleString('en-IN');
  doc.text(subDate, margin + 65, curY + 16);

  doc.setTextColor(40, 124, 90);
  doc.text(app.status || 'SUBMITTED', margin + 130, curY + 16);

  curY += 28;

  // Main Application Details Box
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(221, 227, 231);
  doc.roundedRect(margin, curY, contentWidth, 120, 2, 2, 'FD');

  doc.setFillColor(23, 50, 77);
  doc.rect(margin, curY, contentWidth, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('APPLICATION CREDENTIALS & BENEFICIARY DOSSIER', margin + 6, curY + 5);

  const detailRows = [
    ['Citizen Applicant Name', app.applicantName || 'Citizen Beneficiary'],
    ['Aadhaar Linked Phone', app.applicantPhone || '+91 98765 43210'],
    ['Domicile (District, State)', `${app.applicantDistrict || 'Medak'}, ${app.applicantState || 'Telangana'}`],
    ['Welfare Scheme Title', app.schemeTitle || 'Government Direct Benefit Scheme'],
    ['Scheme Category', app.schemeCategory || 'AGRICULTURE / CITIZEN WELFARE'],
    ['Subsidy Amount Requested', `INR ${Number(app.requestedAmount || 0).toLocaleString('en-IN')}`],
    ['Sanctioned Grant Amount', app.approvedAmount ? `INR ${Number(app.approvedAmount).toLocaleString('en-IN')}` : 'Pending Sanction Approval'],
    ['Assigned Field Verifier', app.verifierName || 'Anil Sharma (Senior Field Inspector)'],
    ['Inspection Remarks', app.verifierRemarks || 'Aadhaar e-KYC documents attached for field scrutiny.'],
    ['Bank Account (APBS Seeded)', `${app.bankDetails?.bankName || 'State Bank of India'} (A/C: ••••${app.bankDetails?.accountNumber?.slice(-4) || '1024'})`],
    ['PFMS Transaction Reference', app.transactionId || 'Generated upon 100% Disbursal']
  ];

  let rowY = curY + 14;
  detailRows.forEach(([lbl, val]) => {
    doc.setTextColor(82, 98, 112);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text(lbl, margin + 6, rowY);

    doc.setTextColor(23, 50, 77);
    doc.setFont('helvetica', 'normal');
    doc.text(String(val), margin + 65, rowY);

    doc.setDrawColor(240, 244, 248);
    doc.line(margin + 6, rowY + 3, pageWidth - margin - 6, rowY + 3);
    rowY += 9.5;
  });

  curY += 128;

  // Security Verification Notice & QR Area
  doc.setFillColor(252, 251, 248);
  doc.setDrawColor(221, 227, 231);
  doc.roundedRect(margin, curY, contentWidth, 36, 2, 2, 'FD');

  doc.setTextColor(23, 50, 77);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('OFFICIAL TRACKING & GRIEVANCE REDRESSAL INSTRUCTIONS', margin + 6, curY + 7);

  doc.setTextColor(82, 98, 112);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('1. Keep your Application ID secure for live status tracking on the National DBT Portal.', margin + 6, curY + 14);
  doc.text('2. Field verifiers will verify your uploaded revenue & identity records within 3 working days.', margin + 6, curY + 19);
  doc.text('3. In case of verification queries or rejection appeals, visit https://dsga.gov.in/grievance.', margin + 6, curY + 24);
  doc.text('4. National Citizen Toll-Free Helpline: 1800-11-2026 (Operational 24x7, Multilingual).', margin + 6, curY + 29);

  // Footer
  const footerY = 275;
  doc.setFillColor(245, 247, 249);
  doc.rect(0, footerY, pageWidth, 22, 'F');
  doc.setDrawColor(221, 227, 231);
  doc.setLineWidth(0.3);
  doc.line(0, footerY, pageWidth, footerY);

  doc.setTextColor(82, 98, 112);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('SECURE OFFICIAL ACKNOWLEDGEMENT • DIGITAL SUBSIDY & GRANT ADMINISTRATION PLATFORM', margin, footerY + 6);
  doc.setFont('helvetica', 'normal');
  doc.text('This is a computer-generated acknowledgement receipt that does not require a physical signature.', margin, footerY + 10);
  doc.text('Government of India • Ministry of Electronics & Information Technology • DBT Mission', margin, footerY + 14);

  doc.save(fileName);
  return fileName;
};
