export const initialUsers = [
  {
    id: 'usr-shama',
    name: 'Shama',
    email: 'shama@gmail.com',
    role: 'APPLICANT',
    password: 'password123',
    phone: '+91 98765 12345',
    address: 'H.No 12-4, Shanti Nagar, Hyderabad',
    state: 'Telangana',
    district: 'Hyderabad',
    income: 280000,
    age: 29,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    status: 'ACTIVE'
  },
  {
    id: 'usr-1',
    name: 'Rahul Kumar',
    email: 'applicant@gov.in',
    role: 'APPLICANT',
    password: 'password123',
    phone: '+91 98765 43210',
    address: 'H.No 4-12, Green Village, Medak',
    state: 'Telangana',
    district: 'Medak',
    income: 320000,
    age: 32,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    status: 'ACTIVE'
  },
  {
    id: 'usr-2',
    name: 'Sahana',
    email: 'sahana@gmail.com',
    role: 'VERIFIER',
    password: 'sahana$45',
    department: 'Field Document Inspector Office',
    district: 'Medak Zone',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    status: 'ACTIVE'
  },
  {
    id: 'usr-3',
    name: 'Mayur',
    email: 'mayur@gmail.com',
    role: 'AUTHORITY',
    password: 'mayur%34',
    department: 'State Grant Sanctioning Directorate',
    designation: 'Joint Director & Sanction Officer',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    status: 'ACTIVE'
  },
  {
    id: 'usr-4',
    name: 'Sachin',
    email: 'sachin@gmail.com',
    role: 'ADMINISTRATOR',
    password: 'sachin',
    department: 'Ministry of Digital Governance & Analytics',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=250',
    status: 'ACTIVE'
  },
  {
    id: 'usr-5',
    name: 'Kavitha Rao, IAS',
    email: 'kavitha@gmail.com',
    role: 'DISTRICT_OFFICER',
    password: 'kavitha$123',
    department: 'Office of the District Magistrate & Collector',
    designation: 'District Nodal Officer & Additional District Magistrate',
    district: 'Medak',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=250',
    status: 'ACTIVE'
  },
  {
    id: 'usr-105',
    name: 'Ananya Rao',
    email: 'ananya.rao@enterprise.org',
    role: 'APPLICANT',
    password: 'password123',
    phone: '+91 99120 44819',
    address: 'Plot 18, Kakatiya Industrial Estate, Warangal',
    state: 'Telangana',
    district: 'Warangal',
    income: 190000,
    age: 34,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
    status: 'ACTIVE'
  }
];

export const initialSchemes = [
  {
    id: 'SCH-2026-01',
    code: 'AGRI-EQUIP-01',
    title: 'Agriculture Machinery Modernization Subsidy',
    category: 'AGRICULTURE',
    department: 'Department of Agriculture & Farmers Welfare',
    shortDesc: 'Up to 60% financial grant for eligible small farmers purchasing modern tractors and automated harvesters.',
    description: 'This scheme aims to enhance agricultural output by providing direct financial assistance to small and marginal farmers for buying approved farming technology, drip irrigation kits, and power tillers.',
    maxAmount: 200000,
    totalFund: 100000000, // ₹10 Cr
    distributedFund: 34500000, // ₹3.45 Cr
    deadline: '2026-10-31',
    status: 'ACTIVE',
    minAge: 18,
    maxAge: 65,
    maxIncome: 500000,
    allowedStates: ['Telangana', 'Andhra Pradesh', 'Karnataka'],
    requiredDocs: [
      { id: 'doc-aadhaar', name: 'Aadhaar Card Verification', type: 'IDENTITY' },
      { id: 'doc-income', name: 'Annual Income Certificate (< ₹5L)', type: 'INCOME' },
      { id: 'doc-land', name: 'Pattadar Passbook / Land Ownership Record', type: 'PROPERTY' },
      { id: 'doc-bank', name: 'Bank Account Passbook (Aadhaar Seeded)', type: 'FINANCIAL' }
    ],
    applicantsCount: 1420,
    approvedCount: 915,
    lastUpdated: '2026-09-12',
    processingDays: '4–7 Working Days'
  },
  {
    id: 'SCH-2026-02',
    code: 'HOUSING-RURAL-02',
    title: 'Pradhan Affordable Housing Digital Subsidy',
    category: 'HOUSING',
    department: 'Housing & Urban Infrastructure Ministry',
    shortDesc: 'Direct Bank Transfer (DBT) subsidy of up to ₹1,50,000 for constructing pucca houses in rural areas.',
    description: 'Providing financial aid to families living in kutcha or makeshift dwellings to construct resilient, weatherproof residential units with electricity and sanitation connections.',
    maxAmount: 150000,
    totalFund: 250000000, // ₹25 Cr
    distributedFund: 142000000, // ₹14.2 Cr
    deadline: '2026-11-15',
    status: 'ACTIVE',
    minAge: 21,
    maxAge: 70,
    maxIncome: 450000,
    allowedStates: ['All India'],
    requiredDocs: [
      { id: 'doc-aadhaar', name: 'Aadhaar Card', type: 'IDENTITY' },
      { id: 'doc-income', name: 'Income Certificate', type: 'INCOME' },
      { id: 'doc-address', name: 'Ration Card / Address Proof', type: 'ADDRESS' },
      { id: 'doc-site', name: 'Geo-tagged Site Land Document', type: 'PROPERTY' }
    ],
    applicantsCount: 3890,
    approvedCount: 2450,
    lastUpdated: '2026-09-08',
    processingDays: '10–14 Working Days'
  },
  {
    id: 'SCH-2026-03',
    code: 'EDU-LAPTOP-03',
    title: 'Higher Education Digital Inclusion Laptop Subsidy',
    category: 'EDUCATION',
    department: 'Department of Higher Education',
    shortDesc: '100% financial reimbursement (up to ₹40,000) for laptop purchases for meritorious university students.',
    description: 'Empowering economically weaker section students pursuing technical, medical, and STEM degree courses with high-performance computing devices to bridge the digital divide.',
    maxAmount: 40000,
    totalFund: 50000000, // ₹5 Cr
    distributedFund: 28000000, // ₹2.8 Cr
    deadline: '2026-09-30',
    status: 'ACTIVE',
    minAge: 17,
    maxAge: 26,
    maxIncome: 350000,
    allowedStates: ['All India'],
    requiredDocs: [
      { id: 'doc-aadhaar', name: 'Aadhaar Card', type: 'IDENTITY' },
      { id: 'doc-college', name: 'College Admission & Student ID', type: 'EDUCATION' },
      { id: 'doc-marks', name: '12th / Diploma Marksheet (>75%)', type: 'EDUCATION' },
      { id: 'doc-bank', name: 'Student Bank Account', type: 'FINANCIAL' }
    ],
    applicantsCount: 2150,
    approvedCount: 1680,
    lastUpdated: '2026-09-14',
    processingDays: '5–8 Working Days'
  },
  {
    id: 'SCH-2026-04',
    code: 'MSME-WOMEN-04',
    title: 'Women Entrepreneurship Seed Capital Assistance',
    category: 'WOMEN & BUSINESS',
    department: 'Ministry of Micro, Small & Medium Enterprises',
    shortDesc: 'Capital grant up to ₹3,00,000 for women-owned micro-enterprises and self-help groups (SHGs).',
    description: 'Fostering financial independence and local job creation by supporting women-led ventures in handicrafts, food processing, eco-textiles, and digital services.',
    maxAmount: 300000,
    totalFund: 150000000, // ₹15 Cr
    distributedFund: 68000000, // ₹6.8 Cr
    deadline: '2026-12-01',
    status: 'ACTIVE',
    minAge: 18,
    maxAge: 55,
    maxIncome: 600000,
    allowedStates: ['All India'],
    requiredDocs: [
      { id: 'doc-aadhaar', name: 'Aadhaar Card', type: 'IDENTITY' },
      { id: 'doc-udyam', name: 'Udyam MSME Registration Certificate', type: 'BUSINESS' },
      { id: 'doc-project', name: 'Business Project Report', type: 'BUSINESS' },
      { id: 'doc-bank', name: 'Enterprise Bank Statement', type: 'FINANCIAL' }
    ],
    applicantsCount: 840,
    approvedCount: 420,
    lastUpdated: '2026-09-16',
    processingDays: '7–12 Working Days'
  },
  {
    id: 'SCH-1001',
    code: 'PM-KISAN-01',
    title: 'PM-KISAN Samman Nidhi Income Support',
    category: 'AGRICULTURE',
    department: 'Ministry of Agriculture & Farmers Welfare',
    shortDesc: '₹6,000 per year in three equal installments of ₹2,000 via Direct Benefit Transfer.',
    description: 'Central Sector Scheme providing assured income support to eligible landholding farmer families having cultivable land across all states.',
    maxAmount: 6000,
    totalFund: 600000000,
    distributedFund: 420000000,
    deadline: '2026-12-31',
    status: 'ACTIVE',
    minAge: 18,
    maxAge: 75,
    maxIncome: 400000,
    allowedStates: ['All India'],
    requiredDocs: [
      { id: 'doc-aadhaar', name: 'Aadhaar Card', type: 'IDENTITY' },
      { id: 'doc-land', name: 'Cultivable Land Record (Khasra)', type: 'PROPERTY' },
      { id: 'doc-bank', name: 'Aadhaar-Seeded Bank Passbook', type: 'FINANCIAL' }
    ],
    applicantsCount: 15400,
    approvedCount: 14200,
    lastUpdated: '2026-09-11',
    processingDays: '4–6 Working Days'
  },
  {
    id: 'SCH-1002',
    code: 'PM-USP-CSSS-02',
    title: 'PM-USP Central Sector Scholarship (CSSS)',
    category: 'EDUCATION',
    department: 'Department of Higher Education',
    shortDesc: 'Annual scholarship assistance up to ₹20,000 for university & college degree students.',
    description: 'Supporting meritorious students from economically weaker families pursuing graduation and professional degree courses in recognized institutions.',
    maxAmount: 20000,
    totalFund: 80000000,
    distributedFund: 51000000,
    deadline: '2026-10-31',
    status: 'ACTIVE',
    minAge: 17,
    maxAge: 25,
    maxIncome: 450000,
    allowedStates: ['All India'],
    requiredDocs: [
      { id: 'doc-aadhaar', name: 'Student Aadhaar Card', type: 'IDENTITY' },
      { id: 'doc-marks', name: 'Class 12th Board Marksheet (>80%)', type: 'EDUCATION' },
      { id: 'doc-college', name: 'College Admission Fee Receipt', type: 'EDUCATION' },
      { id: 'doc-income', name: 'Parental Income Certificate', type: 'INCOME' }
    ],
    applicantsCount: 4320,
    approvedCount: 3100,
    lastUpdated: '2026-09-05',
    processingDays: '5–7 Working Days'
  },
  {
    id: 'SCH-1003',
    code: 'AB-PMJAY-03',
    title: 'Ayushman Bharat - PM-JAY Health Coverage',
    category: 'HEALTHCARE',
    department: 'National Health Authority',
    shortDesc: 'Cashless health assurance cover of up to ₹5,00,000 per family per year.',
    description: 'Providing cashless secondary and tertiary hospitalisation coverage across 27,000+ empanelled government and private hospitals across the country.',
    maxAmount: 500000,
    totalFund: 1000000000,
    distributedFund: 680000000,
    deadline: '2026-12-31',
    status: 'ACTIVE',
    minAge: 0,
    maxAge: 99,
    maxIncome: 300000,
    allowedStates: ['All India'],
    requiredDocs: [
      { id: 'doc-aadhaar', name: 'Aadhaar Card of Family Head', type: 'IDENTITY' },
      { id: 'doc-ration', name: 'Ration Card / NFSA Database Proof', type: 'ADDRESS' }
    ],
    applicantsCount: 28900,
    approvedCount: 26400,
    lastUpdated: '2026-09-15',
    processingDays: '3–5 Working Days'
  },
  {
    id: 'SCH-1004',
    code: 'PMKVY-SKILL-04',
    title: 'Pradhan Mantri Kaushal Vikas Yojana (PMKVY 4.0)',
    category: 'SKILL & EMPLOYMENT',
    department: 'Ministry of Skill Development and Entrepreneurship',
    shortDesc: 'Free industry-aligned certification and training stipend of up to ₹8,000.',
    description: 'Industry-aligned certified skill training in Industry 4.0 trades, green jobs, and digital technologies with placement facilitation.',
    maxAmount: 8000,
    totalFund: 40000000,
    distributedFund: 22000000,
    deadline: '2026-11-30',
    status: 'ACTIVE',
    minAge: 15,
    maxAge: 45,
    maxIncome: 500000,
    allowedStates: ['All India'],
    requiredDocs: [
      { id: 'doc-aadhaar', name: 'Aadhaar Card', type: 'IDENTITY' },
      { id: 'doc-edu', name: 'Highest Education Certificate', type: 'EDUCATION' },
      { id: 'doc-bank', name: 'Bank Account Passbook', type: 'FINANCIAL' }
    ],
    applicantsCount: 5200,
    approvedCount: 4600,
    lastUpdated: '2026-09-09',
    processingDays: '5–8 Working Days'
  },
  {
    id: 'SCH-1005',
    code: 'PMAY-URBAN-05',
    title: 'Pradhan Mantri Awas Yojana (PMAY Housing)',
    category: 'HOUSING',
    department: 'Ministry of Housing and Urban Affairs',
    shortDesc: 'Interest subsidy and financial grant up to ₹2,67,000 for affordable housing.',
    description: 'Providing pucca houses to eligible urban and semi-urban poor families including basic civic infrastructure.',
    maxAmount: 267000,
    totalFund: 400000000,
    distributedFund: 230000000,
    deadline: '2026-12-31',
    status: 'ACTIVE',
    minAge: 21,
    maxAge: 70,
    maxIncome: 600000,
    allowedStates: ['All India'],
    requiredDocs: [
      { id: 'doc-aadhaar', name: 'Aadhaar Card', type: 'IDENTITY' },
      { id: 'doc-income', name: 'Income Certificate', type: 'INCOME' },
      { id: 'doc-land', name: 'Plot Title / Ownership Document', type: 'PROPERTY' }
    ],
    applicantsCount: 6800,
    approvedCount: 4900,
    lastUpdated: '2026-09-07',
    processingDays: '10–14 Working Days'
  },
  {
    id: 'SCH-1006',
    code: 'MUDRA-LOAN-06',
    title: 'Pradhan Mantri MUDRA Yojana Micro-Credit Subsidy',
    category: 'BUSINESS & MSME',
    department: 'Department of Financial Services',
    shortDesc: 'Collateral-free micro-credit subsidy up to ₹10,00,000 for small businesses.',
    description: 'Providing institutional credit to micro enterprises in manufacturing, trading, and service sectors with interest rebate subsidies.',
    maxAmount: 1000000,
    totalFund: 350000000,
    distributedFund: 210000000,
    deadline: '2026-11-30',
    status: 'ACTIVE',
    minAge: 18,
    maxAge: 65,
    maxIncome: 1200000,
    allowedStates: ['All India'],
    requiredDocs: [
      { id: 'doc-aadhaar', name: 'Identity Proof (Aadhaar/PAN)', type: 'IDENTITY' },
      { id: 'doc-business', name: 'Proof of Business Address & DPR', type: 'BUSINESS' },
      { id: 'doc-bank', name: 'Bank Statement (Last 6 Months)', type: 'FINANCIAL' }
    ],
    applicantsCount: 7100,
    approvedCount: 5400,
    lastUpdated: '2026-09-13',
    processingDays: '7–10 Working Days'
  },
  {
    id: 'SCH-1007',
    code: 'STANDUP-INDIA-07',
    title: 'Stand-Up India Scheme for SC, ST & Women',
    category: 'ENTREPRENEURSHIP',
    department: 'Department of Financial Services',
    shortDesc: 'Bank loan subsidy between ₹10 Lakh and ₹1 Crore for greenfield enterprises.',
    description: 'Promoting entrepreneurship among women and SC/ST communities to set up greenfield enterprises in manufacturing, services, or trading sectors.',
    maxAmount: 1000000,
    totalFund: 200000000,
    distributedFund: 110000000,
    deadline: '2026-12-31',
    status: 'ACTIVE',
    minAge: 18,
    maxAge: 65,
    maxIncome: 2000000,
    allowedStates: ['All India'],
    requiredDocs: [
      { id: 'doc-aadhaar', name: 'Promoter Aadhaar Card', type: 'IDENTITY' },
      { id: 'doc-caste', name: 'Caste Certificate / Woman Category ID', type: 'IDENTITY' },
      { id: 'doc-project', name: 'Detailed Greenfield Project Report', type: 'BUSINESS' },
      { id: 'doc-pan', name: 'Business PAN / GSTIN', type: 'FINANCIAL' }
    ],
    applicantsCount: 1950,
    approvedCount: 1240
  }
];

export const initialApplications = [
  {
    id: 'APP-2026-1024',
    applicantId: 'usr-1',
    applicantName: 'Rahul Kumar',
    applicantEmail: 'applicant@gov.in',
    applicantPhone: '+91 98765 43210',
    applicantAge: 32,
    applicantIncome: 320000,
    applicantState: 'Telangana',
    applicantDistrict: 'Medak',
    schemeId: 'SCH-2026-01',
    schemeTitle: 'Agriculture Machinery Modernization Subsidy',
    requestedAmount: 150000,
    approvedAmount: null,
    submittedDate: '2026-09-08T10:30:00Z',
    status: 'UNDER_VERIFICATION', // DRAFT -> SUBMITTED -> UNDER_VERIFICATION -> VERIFIED -> APPROVED -> DISBURSED
    verifierId: 'usr-2',
    verifierName: 'Anil Sharma',
    verifierRemarks: 'Applicant land records verified against revenue registry. Awaiting document clarity check.',
    verificationDate: null,
    authorityId: 'usr-3',
    authorityRemarks: null,
    approvalDate: null,
    paymentStatus: 'NOT_INITIATED', // NOT_INITIATED -> PROCESSING -> PAID -> FAILED
    transactionId: null,
    paymentDate: null,
    bankDetails: {
      accountName: 'Rahul Kumar',
      accountNumber: '918237465012',
      bankName: 'State Bank of India',
      ifsc: 'SBIN0004812',
      branch: 'Medak Main'
    },
    documents: [
      {
        id: 'doc-1',
        name: 'Aadhaar_Card_Rahul.pdf',
        type: 'Aadhaar Card',
        status: 'VERIFIED',
        size: '1.2 MB',
        uploadedAt: '2026-09-08T10:20:00Z',
        ocrConfidence: '98%',
        extractedData: { name: 'Rahul Kumar', aadhaarNo: 'XXXX-XXXX-4892', dob: '1994-05-14' },
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
      },
      {
        id: 'doc-2',
        name: 'Income_Certificate_2026.pdf',
        type: 'Income Certificate',
        status: 'PENDING',
        size: '850 KB',
        uploadedAt: '2026-09-08T10:22:00Z',
        ocrConfidence: '94%',
        extractedData: { declaredIncome: '₹ 3,20,000 / annum', issuingAuthority: 'Tehsildar Medak' },
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
      },
      {
        id: 'doc-3',
        name: 'Pattadar_Land_Passbook.pdf',
        type: 'Land Record',
        status: 'VERIFIED',
        size: '2.4 MB',
        uploadedAt: '2026-09-08T10:25:00Z',
        ocrConfidence: '96%',
        extractedData: { surveyNo: '142/B', landArea: '2.5 Acres', village: 'Green Village' },
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
      }
    ],
    timeline: [
      { status: 'SUBMITTED', title: 'Application Submitted', date: '2026-09-08 10:30 AM', by: 'Rahul Kumar (Citizen)' },
      { status: 'UNDER_VERIFICATION', title: 'Assigned to Verification Desk', date: '2026-09-08 02:15 PM', by: 'System Automation' }
    ]
  },
  {
    id: 'APP-2026-1025',
    applicantId: 'usr-102',
    applicantName: 'Sunita Devi',
    applicantEmail: 'sunita.devi@example.com',
    applicantPhone: '+91 94123 88112',
    applicantAge: 41,
    applicantIncome: 240000,
    applicantState: 'Telangana',
    applicantDistrict: 'Rangareddy',
    schemeId: 'SCH-2026-02',
    schemeTitle: 'Pradhan Affordable Housing Digital Subsidy',
    requestedAmount: 150000,
    approvedAmount: null,
    submittedDate: '2026-09-07T14:20:00Z',
    status: 'VERIFIED', // Ready for Authority Sanction
    verifierId: 'usr-2',
    verifierName: 'Anil Sharma',
    verifierRemarks: 'All 4 documents verified physically and digitally via DigiLocker OCR. Applicant household income meets eligibility criteria.',
    verificationDate: '2026-09-09T11:00:00Z',
    authorityId: null,
    authorityRemarks: null,
    approvalDate: null,
    paymentStatus: 'NOT_INITIATED',
    transactionId: null,
    paymentDate: null,
    bankDetails: {
      accountName: 'Sunita Devi',
      accountNumber: '501002938102',
      bankName: 'HDFC Bank',
      ifsc: 'HDFC0001245',
      branch: 'Hyderabad Central'
    },
    documents: [
      { id: 'doc-201', name: 'Aadhaar_Sunita.pdf', type: 'Aadhaar Card', status: 'VERIFIED', size: '1.1 MB', uploadedAt: '2026-09-07T14:00:00Z', ocrConfidence: '99%' },
      { id: 'doc-202', name: 'Income_Cert_Sunita.pdf', type: 'Income Certificate', status: 'VERIFIED', size: '920 KB', uploadedAt: '2026-09-07T14:05:00Z', ocrConfidence: '97%' }
    ],
    timeline: [
      { status: 'SUBMITTED', title: 'Application Submitted', date: '2026-09-07 02:20 PM', by: 'Sunita Devi' },
      { status: 'UNDER_VERIFICATION', title: 'Documents Under Scrutiny', date: '2026-09-08 09:00 AM', by: 'Anil Sharma (Verifier)' },
      { status: 'VERIFIED', title: 'Field & Document Verification Passed', date: '2026-09-09 11:00 AM', by: 'Anil Sharma (Verifier)' }
    ]
  },
  {
    id: 'APP-2026-1026',
    applicantId: 'usr-103',
    applicantName: 'Vikram Singh',
    applicantEmail: 'vikram.singh@example.com',
    applicantPhone: '+91 97711 00234',
    applicantAge: 20,
    applicantIncome: 180000,
    applicantState: 'Telangana',
    applicantDistrict: 'Hyderabad',
    schemeId: 'SCH-2026-03',
    schemeTitle: 'Higher Education Digital Inclusion Laptop Subsidy',
    requestedAmount: 40000,
    approvedAmount: 40000,
    submittedDate: '2026-09-05T09:10:00Z',
    status: 'PAID',
    verifierId: 'usr-2',
    verifierName: 'Anil Sharma',
    verifierRemarks: 'Student admission verified with Osmania University portal.',
    verificationDate: '2026-09-06T15:30:00Z',
    authorityId: 'usr-3',
    authorityName: 'Dr. Priya Varma',
    authorityRemarks: 'Full ₹40,000 sanctioned for computer hardware purchase under Education Empowerment quota.',
    approvalDate: '2026-09-07T10:15:00Z',
    paymentStatus: 'PAID',
    transactionId: 'TXN-DBT-2026-89481920',
    paymentDate: '2026-09-08T16:45:00Z',
    bankDetails: {
      accountName: 'Vikram Singh',
      accountNumber: '309201948102',
      bankName: 'Canara Bank',
      ifsc: 'CNRB0001092',
      branch: 'University Branch'
    },
    documents: [
      { id: 'doc-301', name: 'Aadhaar_Vikram.pdf', type: 'Aadhaar Card', status: 'VERIFIED', size: '1.4 MB', uploadedAt: '2026-09-05T09:00:00Z', ocrConfidence: '99%' },
      { id: 'doc-302', name: 'College_ID_Bonafide.pdf', type: 'Student ID', status: 'VERIFIED', size: '1.0 MB', uploadedAt: '2026-09-05T09:05:00Z', ocrConfidence: '95%' }
    ],
    timeline: [
      { status: 'SUBMITTED', title: 'Application Submitted', date: '2026-09-05 09:10 AM', by: 'Vikram Singh' },
      { status: 'VERIFIED', title: 'Documents Verified', date: '2026-09-06 03:30 PM', by: 'Anil Sharma' },
      { status: 'APPROVED', title: 'Sanction Approved (₹40,000)', date: '2026-09-07 10:15 AM', by: 'Dr. Priya Varma' },
      { status: 'PAID', title: 'Direct Bank Transfer Processed', date: '2026-09-08 04:45 PM', by: 'Reserve Bank DBT Gateway' }
    ]
  },
  {
    id: 'APP-2026-1027',
    applicantId: 'usr-104',
    applicantName: 'Rajesh Patel',
    applicantEmail: 'rajesh.patel@farmer.in',
    applicantPhone: '+91 98451 22910',
    applicantAge: 38,
    applicantIncome: 280000,
    applicantState: 'Telangana',
    applicantDistrict: 'Medak',
    schemeId: 'SCH-2026-01',
    schemeTitle: 'Agriculture Machinery Modernization Subsidy',
    requestedAmount: 120000,
    approvedAmount: null,
    submittedDate: '2026-09-10T11:15:00Z',
    status: 'UNDER_VERIFICATION',
    verifierId: 'usr-2',
    verifierName: 'Anil Sharma',
    verifierRemarks: 'Applicant land registry records uploaded. Awaiting physical field verification.',
    verificationDate: null,
    authorityId: null,
    authorityRemarks: null,
    approvalDate: null,
    paymentStatus: 'NOT_INITIATED',
    transactionId: null,
    paymentDate: null,
    bankDetails: {
      accountName: 'Rajesh Patel',
      accountNumber: '621004928103',
      bankName: 'State Bank of India',
      ifsc: 'SBIN0002194',
      branch: 'Medak Rural'
    },
    documents: [
      {
        id: 'doc-401',
        name: 'Aadhaar_Card_Rajesh.pdf',
        type: 'Aadhaar Card',
        status: 'VERIFIED',
        size: '1.3 MB',
        uploadedAt: '2026-09-10T11:00:00Z',
        ocrConfidence: '99%',
        extractedData: { name: 'Rajesh Patel', aadhaarNo: 'XXXX-XXXX-9102', dob: '1988-03-12' }
      },
      {
        id: 'doc-402',
        name: 'Land_Pattadar_Passbook.pdf',
        type: 'Land Record',
        status: 'PENDING',
        size: '1.8 MB',
        uploadedAt: '2026-09-10T11:05:00Z',
        ocrConfidence: '96%',
        extractedData: { surveyNo: '88/A', landArea: '3.2 Acres', village: 'Medak West' }
      }
    ],
    timeline: [
      { status: 'SUBMITTED', title: 'Application Submitted', date: '2026-09-10 11:15 AM', by: 'Rajesh Patel (Citizen)' },
      { status: 'UNDER_VERIFICATION', title: 'Assigned to Inspector Anil Sharma', date: '2026-09-10 01:00 PM', by: 'System Automation' }
    ]
  },
  {
    id: 'APP-2026-1028',
    applicantId: 'usr-105',
    applicantName: 'Ananya Rao',
    applicantEmail: 'ananya.rao@enterprise.org',
    applicantPhone: '+91 99120 44819',
    applicantAge: 34,
    applicantIncome: 190000,
    applicantState: 'Telangana',
    applicantDistrict: 'Warangal',
    schemeId: 'SCH-2026-04',
    schemeTitle: 'Women Entrepreneurship Seed Capital Subsidy',
    requestedAmount: 250000,
    approvedAmount: null,
    submittedDate: '2026-09-11T14:30:00Z',
    status: 'UNDER_VERIFICATION',
    verifierId: 'usr-2',
    verifierName: 'Anil Sharma',
    verifierRemarks: 'Self-help group affiliation and Udyam MSME certificate in order.',
    verificationDate: null,
    authorityId: null,
    authorityRemarks: null,
    approvalDate: null,
    paymentStatus: 'NOT_INITIATED',
    transactionId: null,
    paymentDate: null,
    bankDetails: {
      accountName: 'Kavitha Rao',
      accountNumber: '201948201928',
      bankName: 'Union Bank of India',
      ifsc: 'UBIN0532104',
      branch: 'Warangal Main'
    },
    documents: [
      {
        id: 'doc-501',
        name: 'Aadhaar_Kavitha_Rao.pdf',
        type: 'Aadhaar Card',
        status: 'VERIFIED',
        size: '1.1 MB',
        uploadedAt: '2026-09-11T14:10:00Z',
        ocrConfidence: '99%',
        extractedData: { name: 'Kavitha Rao', aadhaarNo: 'XXXX-XXXX-3341', dob: '1992-07-22' }
      },
      {
        id: 'doc-502',
        name: 'MSME_Udyam_Registration.pdf',
        type: 'Business Registration',
        status: 'VERIFIED',
        size: '890 KB',
        uploadedAt: '2026-09-11T14:15:00Z',
        ocrConfidence: '97%',
        extractedData: { enterpriseName: 'Kavitha Organic Agro', category: 'Micro Enterprise' }
      }
    ],
    timeline: [
      { status: 'SUBMITTED', title: 'Application Submitted', date: '2026-09-11 02:30 PM', by: 'Kavitha Rao' },
      { status: 'UNDER_VERIFICATION', title: 'Enqueued for Field Scrutiny', date: '2026-09-11 03:45 PM', by: 'Workflow Engine' }
    ]
  },
  {
    id: 'APP-2026-1029',
    applicantId: 'usr-106',
    applicantName: 'Chandrasekhar Goud',
    applicantEmail: 'chandra.goud@telangana.in',
    applicantPhone: '+91 99882 11099',
    applicantAge: 46,
    applicantIncome: 160000,
    applicantState: 'Telangana',
    applicantDistrict: 'Medak',
    applicantTaluk: 'Ramayampet',
    schemeId: 'SCH-2026-01',
    schemeTitle: 'Agriculture Machinery Modernization Subsidy',
    requestedAmount: 180000,
    approvedAmount: null,
    submittedDate: '2026-09-12T08:30:00Z',
    status: 'VERIFIED',
    verifierId: 'usr-2',
    verifierName: 'Sahana',
    verifierRemarks: 'Field inspection completed at Ramayampet. Land documents and geo-tagged tractor shed photos verified.',
    verificationDate: '2026-09-14T11:20:00Z',
    districtEndorsed: false,
    authorityId: null,
    authorityRemarks: null,
    approvalDate: null,
    paymentStatus: 'NOT_INITIATED',
    transactionId: null,
    paymentDate: null,
    bankDetails: {
      accountName: 'Chandrasekhar Goud',
      accountNumber: '409182371902',
      bankName: 'State Bank of India',
      ifsc: 'SBIN0001094',
      branch: 'Ramayampet'
    },
    documents: [
      { id: 'doc-601', name: 'Aadhaar_Chandra.pdf', type: 'Aadhaar Card', status: 'VERIFIED', size: '1.2 MB', uploadedAt: '2026-09-12T08:15:00Z', ocrConfidence: '99%' },
      { id: 'doc-602', name: 'Land_Pattadar_Passbook.pdf', type: 'Land Record', status: 'VERIFIED', size: '2.1 MB', uploadedAt: '2026-09-12T08:20:00Z', ocrConfidence: '98%' }
    ],
    timeline: [
      { status: 'SUBMITTED', title: 'Application Submitted', date: '2026-09-12 08:30 AM', by: 'Chandrasekhar Goud' },
      { status: 'VERIFIED', title: 'Field Scrutiny Passed (Ramayampet)', date: '2026-09-14 11:20 AM', by: 'Sahana (Inspector)' }
    ]
  },
  {
    id: 'APP-2026-1030',
    applicantId: 'usr-107',
    applicantName: 'Fathima Begum',
    applicantEmail: 'fathima.b@welfare.in',
    applicantPhone: '+91 97001 55432',
    applicantAge: 29,
    applicantIncome: 140000,
    applicantState: 'Telangana',
    applicantDistrict: 'Medak',
    applicantTaluk: 'Narsapur',
    schemeId: 'SCH-2026-04',
    schemeTitle: 'Women Entrepreneurship Seed Capital Subsidy',
    requestedAmount: 200000,
    approvedAmount: null,
    submittedDate: '2026-09-13T10:00:00Z',
    status: 'VERIFIED',
    verifierId: 'usr-2',
    verifierName: 'Sahana',
    verifierRemarks: 'Handloom weaving cooperative unit verified. Meets priority tribal & minority quota.',
    verificationDate: '2026-09-15T16:00:00Z',
    districtEndorsed: true,
    districtEndorsementDate: '2026-09-16T10:30:00Z',
    districtRemarks: 'Endorsed under District Collectorate Special Priority Empowerment Quota.',
    authorityId: null,
    authorityRemarks: null,
    approvalDate: null,
    paymentStatus: 'NOT_INITIATED',
    transactionId: null,
    paymentDate: null,
    bankDetails: {
      accountName: 'Fathima Begum',
      accountNumber: '319028471920',
      bankName: 'Canara Bank',
      ifsc: 'CNRB0002148',
      branch: 'Narsapur'
    },
    documents: [
      { id: 'doc-701', name: 'Aadhaar_Fathima.pdf', type: 'Aadhaar Card', status: 'VERIFIED', size: '1.0 MB', uploadedAt: '2026-09-13T09:45:00Z', ocrConfidence: '99%' },
      { id: 'doc-702', name: 'SHG_Certificate.pdf', type: 'Self Help Group Registration', status: 'VERIFIED', size: '1.4 MB', uploadedAt: '2026-09-13T09:50:00Z', ocrConfidence: '96%' }
    ],
    timeline: [
      { status: 'SUBMITTED', title: 'Application Submitted', date: '2026-09-13 10:00 AM', by: 'Fathima Begum' },
      { status: 'VERIFIED', title: 'Field Scrutiny Passed (Narsapur)', date: '2026-09-15 04:00 PM', by: 'Sahana (Inspector)' },
      { status: 'DISTRICT_ENDORSED', title: 'District Nodal Officer Endorsement Signed', date: '2026-09-16 10:30 AM', by: 'Kavitha Rao, IAS' }
    ]
  }
];

export const initialNotifications = [
  {
    id: 'notif-1',
    userId: 'usr-1',
    userEmail: 'applicant@gov.in',
    userRole: 'APPLICANT',
    title: 'Application Received',
    message: 'Your application APP-2026-1024 for Agriculture Machinery Subsidy was successfully registered.',
    timestamp: '2 hours ago',
    read: false,
    type: 'INFO'
  },
  {
    id: 'notif-1b',
    userId: 'usr-1',
    userEmail: 'applicant@gov.in',
    userRole: 'APPLICANT',
    title: 'Document Verification Update',
    message: 'Field officer has scheduled physical inspection for your PM-KISAN subsidy.',
    timestamp: '1 day ago',
    read: false,
    type: 'SUCCESS'
  },
  {
    id: 'notif-2',
    userId: 'usr-2',
    userEmail: 'verifier@gov.in',
    userRole: 'VERIFIER',
    title: 'New Verification Request',
    message: 'Application APP-2026-1024 requires document verification in your queue.',
    timestamp: '3 hours ago',
    read: false,
    type: 'WARNING'
  },
  {
    id: 'notif-3',
    userId: 'usr-3',
    userEmail: 'authority@gov.in',
    userRole: 'AUTHORITY',
    title: 'Sanction Approval Pending',
    message: 'Application APP-2026-1025 has been verified by Inspector Anil Sharma and is awaiting your sanction decision.',
    timestamp: '1 day ago',
    read: false,
    type: 'SUCCESS'
  },
  {
    id: 'notif-4',
    userId: 'usr-4',
    userEmail: 'admin@gov.in',
    userRole: 'ADMINISTRATOR',
    title: 'Monthly Fund Utilization Alert',
    message: 'Education Laptop Subsidy scheme has reached 56% fund utilization for Q3.',
    timestamp: '2 days ago',
    read: true,
    type: 'INFO'
  },
  {
    id: 'notif-5',
    userId: 'usr-105',
    userEmail: 'kavitha.rao@enterprise.org',
    userRole: 'APPLICANT',
    title: 'MSME Seed Capital Subsidy Registered',
    message: 'Your Women Entrepreneurship application APP-2026-1028 was successfully registered.',
    timestamp: '4 hours ago',
    read: false,
    type: 'SUCCESS'
  },
  {
    id: 'notif-global',
    isGlobal: true,
    userRole: 'ALL',
    title: 'DBT Gateway Scheduled Maintenance',
    message: 'Scheduled maintenance for the Direct Bank Transfer (DBT) gateway on Sunday 02:00 AM - 04:00 AM IST.',
    timestamp: 'Yesterday',
    read: false,
    type: 'INFO'
  }
];

export const initialAuditLogs = [
  { id: 'log-1', timestamp: '2026-09-08 16:45:00', actor: 'DBT Payment System', action: 'PAYMENT_DISBURSED', details: 'Transferred ₹40,000 to APP-2026-1026 (Txn: TXN-DBT-2026-89481920)', ip: '10.0.4.12' },
  { id: 'log-2', timestamp: '2026-09-07 10:15:00', actor: 'Dr. Priya Varma (Authority)', action: 'SANCTION_APPROVED', details: 'Approved ₹40,000 grant for APP-2026-1026', ip: '10.0.2.88' },
  { id: 'log-3', timestamp: '2026-09-06 15:30:00', actor: 'Anil Sharma (Verifier)', action: 'DOCUMENTS_VERIFIED', details: 'Verified all attached student records for APP-2026-1026', ip: '10.0.1.45' },
  { id: 'log-4', timestamp: '2026-09-05 09:10:00', actor: 'Vikram Singh (Applicant)', action: 'APPLICATION_SUBMITTED', details: 'Created and submitted APP-2026-1026', ip: '182.74.12.9' }
];
