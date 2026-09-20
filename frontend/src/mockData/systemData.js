// System Audit Logs, Grievances, Scheme Budgets, and FAQs
// Consolidated from dsgaProject/frontend and Digital-Subsidy-Grant-Platform

export const initialGrievances = [
  {
    id: 'GRV-2026-1842',
    ticketNo: 'GRV/2026/09/1842',
    citizenId: 'usr-1',
    citizenName: 'Rahul Kumar',
    citizenPhone: '+91 98765 43210',
    citizenEmail: 'applicant@gov.in',
    schemeId: 'SCH-2026-01',
    schemeTitle: 'Agriculture Machinery Modernization Subsidy',
    category: 'Application Status',
    subject: 'Verification pending beyond 7 business days',
    description: 'I submitted my agriculture machinery application along with passbook and revenue records 8 days ago, but the verification status has not changed from under review. Kindly expedite.',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS', // OPEN -> IN_PROGRESS -> RESOLVED -> CLOSED
    createdAt: '2026-09-10T14:20:00Z',
    updatedAt: '2026-09-11T09:30:00Z',
    assignedOfficer: 'Anil Sharma (Field Inspector)',
    officerRemarks: 'Verification scheduled for field site inspection on 13th Sept 2026. Land records verified on online revenue portal.'
  },
  {
    id: 'GRV-2026-1809',
    ticketNo: 'GRV/2026/09/1809',
    citizenId: 'usr-102',
    citizenName: 'Sunita Devi',
    citizenPhone: '+91 94123 88112',
    citizenEmail: 'sunita.devi@example.com',
    schemeId: 'SCH-2026-02',
    schemeTitle: 'Pradhan Affordable Housing Digital Subsidy',
    category: 'Document Verification',
    subject: 'DigiLocker certificate mismatch clarification',
    description: 'The automated portal flagged a spelling discrepancy in my middle name between Aadhaar and Income certificate. I have uploaded the Tehsildar affidavit.',
    priority: 'HIGH',
    status: 'RESOLVED',
    createdAt: '2026-09-08T11:15:00Z',
    updatedAt: '2026-09-09T16:45:00Z',
    assignedOfficer: 'Priya Varma (Sanction Officer)',
    officerRemarks: 'Affidavit reviewed and accepted. Name clarification verified with UIDAI records. Application status updated to Verified.'
  },
  {
    id: 'GRV-2026-1755',
    ticketNo: 'GRV/2026/08/1755',
    citizenId: 'usr-103',
    citizenName: 'Vikram Singh',
    citizenPhone: '+91 98112 34567',
    citizenEmail: 'vikram.singh@example.com',
    schemeId: 'SCH-2026-03',
    schemeTitle: 'Higher Education Digital Inclusion Laptop Subsidy',
    category: 'DBT Payment',
    subject: 'First installment credited, bank SMS not received',
    description: 'Sanction order indicates ₹40,000 disbursed on Aug 28th via PFMS, requesting UTR confirmation.',
    priority: 'LOW',
    status: 'RESOLVED',
    createdAt: '2026-08-30T10:00:00Z',
    updatedAt: '2026-08-31T12:00:00Z',
    assignedOfficer: 'Accounts Officer (PFMS Desk)',
    officerRemarks: 'Transaction reference UTR20260828001928 confirmed credited to PNB Account ending with 9812 on 28 Aug 2026 14:22.'
  }
];

export const initialSchemeBudgets = [
  {
    schemeId: 'SCH-2026-01',
    schemeCode: 'AGRI-EQUIP-01',
    schemeName: 'Agriculture Machinery Subsidy',
    department: 'Dept of Agriculture & Farmers Welfare',
    financialYear: '2026-2027',
    totalBudget: 100000000, // ₹10 Cr
    releasedBudget: 34500000, // ₹3.45 Cr
    committedBudget: 18500000,
    availableBalance: 47000000,
    beneficiariesCovered: 915,
    utilizationRate: 34.5,
    tranches: [
      { trancheNo: 'TR-1', date: '2026-05-15', amount: 15000000, beneficiaries: 400, utrBatch: 'UTR20260515901' },
      { trancheNo: 'TR-2', date: '2026-07-20', amount: 19500000, beneficiaries: 515, utrBatch: 'UTR20260720442' }
    ]
  },
  {
    schemeId: 'SCH-2026-02',
    schemeCode: 'HOUSING-RURAL-02',
    schemeName: 'Pradhan Affordable Housing Digital Subsidy',
    department: 'Ministry of Housing & Urban Affairs',
    financialYear: '2026-2027',
    totalBudget: 250000000, // ₹25 Cr
    releasedBudget: 142000000, // ₹14.2 Cr
    committedBudget: 38000000,
    availableBalance: 70000000,
    beneficiariesCovered: 2450,
    utilizationRate: 56.8,
    tranches: [
      { trancheNo: 'TR-1', date: '2026-04-10', amount: 70000000, beneficiaries: 1200, utrBatch: 'UTR20260410112' },
      { trancheNo: 'TR-2', date: '2026-07-01', amount: 72000000, beneficiaries: 1250, utrBatch: 'UTR20260701887' }
    ]
  },
  {
    schemeId: 'SCH-2026-03',
    schemeCode: 'EDU-LAPTOP-03',
    schemeName: 'Higher Education Laptop Subsidy',
    department: 'Department of Higher Education',
    financialYear: '2026-2027',
    totalBudget: 50000000, // ₹5 Cr
    releasedBudget: 28000000, // ₹2.8 Cr
    committedBudget: 8000000,
    availableBalance: 14000000,
    beneficiariesCovered: 1680,
    utilizationRate: 56.0,
    tranches: [
      { trancheNo: 'TR-1', date: '2026-06-12', amount: 28000000, beneficiaries: 1680, utrBatch: 'UTR20260612304' }
    ]
  },
  {
    schemeId: 'SCH-2026-04',
    schemeCode: 'MSME-WOMEN-04',
    schemeName: 'Women Entrepreneurship Seed Capital',
    department: 'Ministry of MSME',
    financialYear: '2026-2027',
    totalBudget: 150000000, // ₹15 Cr
    releasedBudget: 68000000, // ₹6.8 Cr
    committedBudget: 22000000,
    availableBalance: 60000000,
    beneficiariesCovered: 420,
    utilizationRate: 45.3,
    tranches: [
      { trancheNo: 'TR-1', date: '2026-05-30', amount: 35000000, beneficiaries: 210, utrBatch: 'UTR20260530519' },
      { trancheNo: 'TR-2', date: '2026-08-15', amount: 33000000, beneficiaries: 210, utrBatch: 'UTR20260815772' }
    ]
  }
];

export const initialAuditLogs = [
  {
    id: 'LOG-99120',
    timestamp: '2026-09-12T14:45:10Z',
    actorName: 'Dr. Priya Varma',
    actorRole: 'AUTHORITY',
    eventCategory: 'SANCTION_APPROVED',
    action: 'Sanction Approved for Application #APP-2026-1025',
    details: 'Sanctioned grant ₹1,50,000 under Pradhan Affordable Housing Digital Subsidy.',
    ipAddress: '10.14.88.21',
    severity: 'INFO'
  },
  {
    id: 'LOG-99119',
    timestamp: '2026-09-12T11:20:45Z',
    actorName: 'Anil Sharma',
    actorRole: 'VERIFIER',
    eventCategory: 'DOCS_VERIFIED',
    action: 'Physical & OCR Document Verification Completed',
    details: 'Verified Land Revenue Records and Aadhaar for Rahul Kumar (#APP-2026-1024).',
    ipAddress: '10.14.92.104',
    severity: 'INFO'
  },
  {
    id: 'LOG-99118',
    timestamp: '2026-09-11T16:02:18Z',
    actorName: 'Chief Admin Officer',
    actorRole: 'ADMINISTRATOR',
    eventCategory: 'SCHEME_MODIFIED',
    action: 'Updated Scheme Deadline for SCH-2026-01',
    details: 'Extended application window to 31st October 2026 with budget re-allocation.',
    ipAddress: '10.12.4.15',
    severity: 'WARN'
  },
  {
    id: 'LOG-99117',
    timestamp: '2026-09-11T09:30:00Z',
    actorName: 'Anil Sharma',
    actorRole: 'VERIFIER',
    eventCategory: 'GRIEVANCE_UPDATED',
    action: 'Grievance Resolution Updated (GRV-2026-1842)',
    details: 'Assigned inspection schedule and updated remarks.',
    ipAddress: '10.14.92.104',
    severity: 'INFO'
  },
  {
    id: 'LOG-99116',
    timestamp: '2026-09-10T14:20:00Z',
    actorName: 'Rahul Kumar',
    actorRole: 'APPLICANT',
    eventCategory: 'GRIEVANCE_FILED',
    action: 'New Grievance Registered (GRV-2026-1842)',
    details: 'Filed grievance regarding verification turnaround time for SCH-2026-01.',
    ipAddress: '157.48.201.55',
    severity: 'INFO'
  },
  {
    id: 'LOG-99115',
    timestamp: '2026-09-08T10:30:00Z',
    actorName: 'Rahul Kumar',
    actorRole: 'APPLICANT',
    eventCategory: 'APPLICATION_SUBMITTED',
    action: 'New Application Submitted (#APP-2026-1024)',
    details: 'Applied for Agriculture Machinery Modernization Subsidy with 3 uploaded documents.',
    ipAddress: '157.48.201.55',
    severity: 'INFO'
  },
  {
    id: 'LOG-99114',
    timestamp: '2026-09-08T09:00:12Z',
    actorName: 'PFMS Gateway',
    actorRole: 'SYSTEM',
    eventCategory: 'DBT_DISBURSED',
    action: 'DBT Batch Tranche Execution',
    details: 'Processed 45 Direct Benefit Transfers totaling ₹18,00,000 under PFMS Batch #40192.',
    ipAddress: '10.0.1.200',
    severity: 'INFO'
  }
];

export const helpdeskFaqs = [
  {
    question: 'What is the Digital Subsidy & Grant Administration Platform (DSGA)?',
    answer: 'DSGA is the official unified Direct Benefit Transfer (DBT) and subsidy tracking portal. It connects citizens, field verifiers, sanctioning authorities, and administrators into an auditable, transparent digital lifecycle from scheme application to bank account credit.'
  },
  {
    question: 'How long does the verification process take?',
    answer: 'Standard document and field inspections are completed within 5 to 7 working days. You can track live stage-by-stage status in the "My Applications" tracking desk.'
  },
  {
    question: 'Which documents are required for applying?',
    answer: 'All schemes require Aadhaar identity verification and an Aadhaar-seeded bank account. Scheme-specific documents (such as Land Passbooks for agriculture, College Admission letters for education grants, or Udyam certificates for MSME grants) are dynamically prompted during the 5-step application wizard.'
  },
  {
    question: 'How are DBT funds disbursed?',
    answer: 'Once approved by the Sanctioning Authority, funds are routed through the Public Financial Management System (PFMS) and credited directly to the beneficiary’s Aadhaar-linked bank account via NPCI / APBS.'
  },
  {
    question: 'What should I do if my application has an objection or rejection?',
    answer: 'You can review the verifier’s specific remarks on your application status timeline. If documents were unclear or missing, you can re-upload corrections or submit a ticket directly via the "Grievance Redressal" desk.'
  }
];
