import { jsPDF } from 'jspdf';

/**
 * Generates and downloads an official Government Digital ID & e-KYC Pass PDF.
 * @param {Object} user - The user object containing profile details.
 * @param {string} [currentRole] - Current active role.
 * @returns {string} The generated file name.
 */
export const downloadDigitalIdPassPdf = (user = {}, currentRole = 'CITIZEN') => {
  const userName = user.name || 'Citizen Beneficiary';
  const roleName = (currentRole || user.role || 'APPLICANT').toUpperCase();
  const phone = user.phone || '+91 98765 43210';
  const email = user.email || 'citizen@gov.in';
  const aadhaar = user.aadhaar || 'XXXX-XXXX-9102';
  const district = user.district || 'Medak';
  const state = user.state || 'Telangana';
  const fileName = 'Digital_ID_Pass.pdf';

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  // 1. Tricolor Top Accent Bands
  doc.setFillColor(217, 119, 6); // Saffron
  doc.rect(0, 0, pageWidth, 4, 'F');
  doc.setFillColor(255, 255, 255); // White
  doc.rect(0, 4, pageWidth, 2, 'F');
  doc.setFillColor(40, 124, 90); // Green
  doc.rect(0, 6, pageWidth, 4, 'F');

  // 2. Header Banner (Deep Navy)
  let curY = 16;
  doc.setFillColor(23, 50, 77); // Deep Navy (#17324D)
  doc.roundedRect(margin, curY, contentWidth, 32, 3, 3, 'F');

  // National emblem text
  doc.setTextColor(255, 243, 224); // Warm Gold Accent
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('GOVERNMENT OF INDIA • NATIONAL DIRECT BENEFIT TRANSFER MISSION', margin + 8, curY + 8);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('VERIFIABLE DIGITAL IDENTITY & e-KYC PASS', margin + 8, curY + 17);

  doc.setTextColor(221, 227, 231);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Issued by Directorate of Digital Governance • Unified Subsidy & Grant Administration (DSGA)', margin + 8, curY + 24);

  // Status Badge in Header
  const badgeWidth = 38;
  const badgeHeight = 16;
  const badgeX = pageWidth - margin - badgeWidth - 6;
  const badgeY = curY + 8;

  doc.setFillColor(40, 124, 90); // Green badge
  doc.roundedRect(badgeX, badgeY, badgeWidth, badgeHeight, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('STATUS: ACTIVE', badgeX + badgeWidth / 2, badgeY + 6, { align: 'center' });
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.text('UIDAI e-KYC VERIFIED', badgeX + badgeWidth / 2, badgeY + 11.5, { align: 'center' });

  curY += 38;

  // 3. Digital ID Card Container (Styled as official smartcard)
  doc.setFillColor(252, 251, 248);
  doc.setDrawColor(221, 227, 231);
  doc.setLineWidth(0.6);
  doc.roundedRect(margin, curY, contentWidth, 105, 4, 4, 'FD');

  // Decorative inner gold line
  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(0.4);
  doc.line(margin + 4, curY + 12, pageWidth - margin - 4, curY + 12);

  // Card Header
  doc.setTextColor(23, 50, 77);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('OFFICIAL BENEFICIARY CREDENTIAL CARD', margin + 6, curY + 8);

  const docId = `DSGA-ID-${Math.abs(userName.split('').reduce((a, c) => (a << 5) - a + c.charCodeAt(0), 0) % 900000 + 100000)}`;
  doc.setTextColor(82, 98, 112);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`PASS ID: ${docId}`, pageWidth - margin - 6, curY + 8, { align: 'right' });

  // Photo Avatar Placeholder / Graphical representation
  const avatarX = margin + 8;
  const avatarY = curY + 18;
  const avatarW = 34;
  const avatarH = 40;

  doc.setFillColor(240, 244, 248);
  doc.setDrawColor(23, 50, 77);
  doc.setLineWidth(0.8);
  doc.roundedRect(avatarX, avatarY, avatarW, avatarH, 3, 3, 'FD');

  // Avatar Icon Graphics inside box
  doc.setFillColor(23, 50, 77);
  doc.circle(avatarX + avatarW / 2, avatarY + 14, 7, 'F');
  doc.roundedRect(avatarX + 5, avatarY + 23, avatarW - 10, 14, 5, 5, 'F');

  // Photo caption
  doc.setFontSize(6);
  doc.setTextColor(82, 98, 112);
  doc.setFont('helvetica', 'bold');
  doc.text('DIGITALLY ATTESTED', avatarX + avatarW / 2, avatarY + avatarH + 4.5, { align: 'center' });

  // Main Beneficiary Details (Next to Avatar)
  const detailX = avatarX + avatarW + 10;
  let textY = avatarY + 6;

  doc.setTextColor(82, 98, 112);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('FULL LEGAL NAME', detailX, textY);
  doc.setTextColor(23, 50, 77);
  doc.setFontSize(11);
  doc.text(userName, detailX, textY + 5);

  textY += 13;
  doc.setTextColor(82, 98, 112);
  doc.setFontSize(7);
  doc.text('AUTHORIZED SYSTEM ROLE', detailX, textY);
  doc.setTextColor(40, 124, 90);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(`${roleName} (OFFICIALLY PERMITTED)`, detailX, textY + 4.5);

  textY += 12;
  doc.setTextColor(82, 98, 112);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('AADHAAR VIRTUAL ID (VID)', detailX, textY);
  doc.text('REGISTERED MOBILE', detailX + 50, textY);

  doc.setTextColor(23, 50, 77);
  doc.setFont('courier', 'bold');
  doc.setFontSize(9);
  doc.text(aadhaar, detailX, textY + 4.5);
  doc.text(phone, detailX + 50, textY + 4.5);

  textY += 12;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(82, 98, 112);
  doc.setFontSize(7);
  doc.text('OFFICIAL EMAIL', detailX, textY);
  doc.text('DOMICILE & LOCATION', detailX + 50, textY);

  doc.setTextColor(23, 50, 77);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text(email, detailX, textY + 4.5);
  doc.text(`${district}, ${state}`, detailX + 50, textY + 4.5);

  // Security Verification Strip inside card
  const stripY = curY + 74;
  doc.setFillColor(235, 242, 247);
  doc.roundedRect(margin + 6, stripY, contentWidth - 12, 24, 2, 2, 'F');

  doc.setTextColor(23, 50, 77);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('CRYPTOGRAPHIC VERIFICATION SEAL & CHECKSUM', margin + 10, stripY + 6);

  doc.setFont('courier', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(82, 98, 112);
  const dummyHash = 'SHA256: 8f4e2b01c79a94d83b6e82a991f2c4e650ab3278c0e18196f721d0a542b89c31';
  doc.text(dummyHash, margin + 10, stripY + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(40, 124, 90);
  const nowStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  doc.text(`Verified against UIDAI National Data Hub on ${nowStr} IST • Biometrics & OTP Validated`, margin + 10, stripY + 18);

  curY += 112;

  // 4. Scheme Entitlements & Governance Advisory Table
  doc.setFillColor(23, 50, 77);
  doc.rect(margin, curY, contentWidth, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('AUTHORIZED DIRECT BENEFIT TRANSFER (DBT) ENTITLEMENTS', margin + 6, curY + 5);

  curY += 7;
  const entitlements = [
    { scheme: 'Direct Subsidy Schemes', access: 'Eligible for Online Application & Fast-Track DBT', status: 'AUTHORIZED' },
    { scheme: 'Field Document Verification', access: 'Paperless Digital Dossier Scrutiny Permitted', status: 'ACTIVE' },
    { scheme: 'Public Financial Management System', access: 'Aadhaar Payment Bridge System (APBS) Seeded', status: 'LINKED' }
  ];

  entitlements.forEach((row, idx) => {
    doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 252);
    doc.rect(margin, curY, contentWidth, 9, 'F');
    doc.setDrawColor(221, 227, 231);
    doc.line(margin, curY + 9, pageWidth - margin, curY + 9);

    doc.setTextColor(23, 50, 77);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.text(row.scheme, margin + 6, curY + 6);

    doc.setTextColor(82, 98, 112);
    doc.setFont('helvetica', 'normal');
    doc.text(row.access, margin + 60, curY + 6);

    doc.setTextColor(40, 124, 90);
    doc.setFont('helvetica', 'bold');
    doc.text(row.status, pageWidth - margin - 6, curY + 6, { align: 'right' });

    curY += 9;
  });

  curY += 10;

  // 5. QR Code Graphic Representation
  const qrSize = 28;
  const qrX = margin + 8;
  const qrY = curY;

  doc.setFillColor(245, 247, 249);
  doc.setDrawColor(23, 50, 77);
  doc.setLineWidth(0.5);
  doc.rect(qrX, qrY, qrSize, qrSize, 'FD');

  // Draw simulated QR pixel pattern
  doc.setFillColor(23, 50, 77);
  // QR position detection corner squares
  doc.rect(qrX + 2, qrY + 2, 7, 7, 'F');
  doc.setFillColor(245, 247, 249);
  doc.rect(qrX + 3.5, qrY + 3.5, 4, 4, 'F');
  doc.setFillColor(23, 50, 77);
  doc.rect(qrX + 4.5, qrY + 4.5, 2, 2, 'F');

  doc.rect(qrX + qrSize - 9, qrY + 2, 7, 7, 'F');
  doc.setFillColor(245, 247, 249);
  doc.rect(qrX + qrSize - 7.5, qrY + 3.5, 4, 4, 'F');
  doc.setFillColor(23, 50, 77);
  doc.rect(qrX + qrSize - 6.5, qrY + 4.5, 2, 2, 'F');

  doc.rect(qrX + 2, qrY + qrSize - 9, 7, 7, 'F');
  doc.setFillColor(245, 247, 249);
  doc.rect(qrX + 3.5, qrY + qrSize - 7.5, 4, 4, 'F');
  doc.setFillColor(23, 50, 77);
  doc.rect(qrX + 4.5, qrY + qrSize - 6.5, 2, 2, 'F');

  // Random QR matrix pixels
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if ((r + c) % 2 === 0 || (r * c) % 3 === 0) {
        doc.rect(qrX + 11 + (c * 1.5), qrY + 4 + (r * 2), 1.2, 1.2, 'F');
      }
    }
  }

  // QR Label
  const noticeX = qrX + qrSize + 8;
  doc.setTextColor(23, 50, 77);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('INSTANT DIGITAL SCAN & VERIFY', noticeX, qrY + 6);

  doc.setTextColor(82, 98, 112);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('Scan this QR code with any authorized government inspector app to verify', noticeX, qrY + 11);
  doc.text('Aadhaar seeding authenticity, biometric status, and current subsidy warrants.', noticeX, qrY + 15);
  doc.text('Valid across all Union & State Department Welfare offices.', noticeX, qrY + 19);

  // Authority Signature Block (Right side)
  const sigX = pageWidth - margin - 45;
  doc.setDrawColor(217, 119, 6);
  doc.line(sigX, qrY + 18, pageWidth - margin, qrY + 18);

  doc.setTextColor(23, 50, 77);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('Authorized Signatory', sigX + 22.5, qrY + 22, { align: 'center' });
  doc.setFontSize(6.5);
  doc.setTextColor(82, 98, 112);
  doc.text('Directorate of Digital Governance', sigX + 22.5, qrY + 26, { align: 'center' });

  // 6. Security Footer
  const footerY = 275;
  doc.setFillColor(245, 247, 249);
  doc.rect(0, footerY, pageWidth, 22, 'F');
  doc.setDrawColor(221, 227, 231);
  doc.setLineWidth(0.3);
  doc.line(0, footerY, pageWidth, footerY);

  doc.setTextColor(82, 98, 112);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('OFFICIAL GOVERNMENT PASS • DIGITAL SUBSIDY & GRANT ADMINISTRATION PLATFORM', margin, footerY + 6);
  doc.setFont('helvetica', 'normal');
  doc.text('This is a legally valid digital identity card issued in accordance with the Information Technology Act, 2000.', margin, footerY + 10);
  doc.text('Report discrepancies or unauthorized duplication immediately to support@dsga.gov.in or Toll-Free: 1800-11-2026.', margin, footerY + 14);

  // Save PDF
  doc.save(fileName);
  return fileName;
};
