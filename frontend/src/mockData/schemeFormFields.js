// Dynamic form fields for schemes ported from application-schemes01
export const schemeSpecificFieldsMap = {
  // Agriculture Schemes
  'SCH-2026-01': [
    { name: 'landHolding', label: 'Land Holding (in acres)', type: 'number', placeholder: 'e.g. 2.5', required: true },
    { name: 'khasraNumber', label: 'Khasra / Survey Number', type: 'text', placeholder: 'e.g. 142/B', required: true },
    { name: 'soilHealthCard', label: 'Soil Health Card Number (Optional)', type: 'text', placeholder: 'SHC-XXXXXXXX' },
    { name: 'machineryType', label: 'Intended Machinery', type: 'select', options: ['Mini Tractor (25HP)', 'Automated Harvester', 'Solar Drip Irrigation Unit', 'Power Tiller'], required: true }
  ],
  'SCH-1001': [
    { name: 'landHolding', label: 'Land Holding (in acres)', type: 'number', placeholder: 'e.g. 2.5', required: true },
    { name: 'khasraNumber', label: 'Khasra / Survey Number', type: 'text', placeholder: 'e.g. 84/3', required: true },
    { name: 'farmingCategory', label: 'Farmer Category', type: 'select', options: ['Small Farmer (<2 Hectares)', 'Marginal Farmer (<1 Hectare)', 'Tenant Farmer'], required: true }
  ],

  // Housing Schemes
  'SCH-2026-02': [
    { name: 'housingStatus', label: 'Current Housing Type', type: 'select', options: ['Kutcha House', 'Makeshift / Tin Roof', 'Rented Dilapidated', 'Homeless'], required: true },
    { name: 'plotOwnership', label: 'Plot Ownership Status', type: 'select', options: ['Self-owned Patta', 'Ancestral Land', 'Allotted Gram Sabha Land'], required: true },
    { name: 'monthlyIncome', label: 'Monthly Household Income (₹)', type: 'number', placeholder: 'e.g. 18000', required: true }
  ],
  'SCH-1005': [
    { name: 'housingStatus', label: 'Current Housing Status', type: 'select', options: ['Own Kutcha House', 'Rented', 'Homeless', 'Slum Dweller'], required: true },
    { name: 'monthlyIncome', label: 'Monthly Household Income (₹)', type: 'number', placeholder: 'e.g. 15000', required: true },
    { name: 'familyMembers', label: 'Total Number of Family Members', type: 'number', placeholder: '4', required: true }
  ],

  // Education Schemes
  'SCH-2026-03': [
    { name: 'courseName', label: 'Enrolled Course / Program Name', type: 'text', placeholder: 'e.g. B.Tech Computer Science', required: true },
    { name: 'institutionName', label: 'University / College Name', type: 'text', placeholder: 'e.g. Osmania University College of Engineering', required: true },
    { name: 'currentYear', label: 'Current Academic Year', type: 'select', options: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgraduate 1st Year'], required: true },
    { name: 'marksPercentage', label: 'Previous Qualifying Exam Marks (%)', type: 'number', placeholder: 'e.g. 84.5', required: true }
  ],
  'SCH-1002': [
    { name: 'courseName', label: 'Course / Program Name', type: 'text', placeholder: 'e.g. B.Tech / B.Sc / MBBS', required: true },
    { name: 'institutionName', label: 'Institution Name', type: 'text', placeholder: 'Name of college/university', required: true },
    { name: 'currentYear', label: 'Current Year / Semester', type: 'text', placeholder: 'e.g. 3rd Year / 6th Sem', required: true }
  ],

  // Healthcare Schemes
  'SCH-1003': [
    { name: 'rationCardNumber', label: 'Ration Card Number / NFSA ID', type: 'text', placeholder: 'e.g. RC-991283921', required: true },
    { name: 'familyMembers', label: 'Number of Family Members to Cover', type: 'number', placeholder: 'e.g. 5', required: true },
    { name: 'existingHealthInsurance', label: 'Any Existing Private Insurance?', type: 'select', options: ['No Private Insurance', 'Yes (Partial)'], required: true }
  ],

  // Skill Training Schemes
  'SCH-1004': [
    { name: 'preferredJobRole', label: 'Preferred Job Role / Trade', type: 'select', options: ['Solar Panel Installation Technician', 'Data Entry & Digital Assistant', 'Healthcare General Duty Assistant', 'Electrician & Wireman', 'Automotive Service Technician'], required: true },
    { name: 'qualification', label: 'Highest Educational Qualification', type: 'select', options: ['10th Pass', '12th Pass', 'ITI Certified', 'Diploma Holder', 'Graduate'], required: true }
  ],

  // Business & MSME Schemes
  'SCH-2026-04': [
    { name: 'enterpriseName', label: 'Enterprise / Startup Name', type: 'text', placeholder: 'e.g. Sri Shakti Handloom & Handicrafts', required: true },
    { name: 'udyamNumber', label: 'Udyam Registration Number', type: 'text', placeholder: 'UDYAM-XX-00-0000000', required: true },
    { name: 'businessType', label: 'Sector / Industry', type: 'select', options: ['Textiles & Apparel', 'Food Processing', 'Agri-Tech', 'Handicrafts & Artisans', 'IT / Digital Services'], required: true },
    { name: 'currentEmployees', label: 'Number of Women Employed', type: 'number', placeholder: 'e.g. 6', required: true }
  ],
  'SCH-1006': [
    { name: 'enterpriseName', label: 'Proposed / Existing Business Name', type: 'text', placeholder: 'e.g. Lakshmi Grocery Store', required: true },
    { name: 'businessCategory', label: 'MUDRA Loan Category', type: 'select', options: ['Shishu (Up to ₹50,000)', 'Kishore (₹50,000 to ₹5 Lakh)', 'Tarun (₹5 Lakh to ₹10 Lakh)'], required: true },
    { name: 'loanAmount', label: 'Required Loan Amount (₹)', type: 'number', placeholder: 'e.g. 250000', required: true }
  ],
  'SCH-1007': [
    { name: 'applicantCategory', label: 'Target Beneficiary Category', type: 'select', options: ['Woman Entrepreneur', 'Scheduled Caste (SC)', 'Scheduled Tribe (ST)'], required: true },
    { name: 'projectCost', label: 'Estimated Greenfield Project Cost (₹)', type: 'number', placeholder: 'e.g. 1500000', required: true },
    { name: 'promoterContribution', label: 'Promoter Contribution (Min 10%)', type: 'number', placeholder: 'e.g. 150000', required: true }
  ]
};

// Required documents checklist by scheme
export const schemeRequiredDocumentsMap = {
  'SCH-2026-01': [
    { id: 'doc-aadhaar', name: 'Aadhaar Card (UIDAI)', required: true },
    { id: 'doc-income', name: 'Income Certificate (< ₹5 Lakh)', required: true },
    { id: 'doc-land', name: 'Land Passbook / Pattadar Record', required: true },
    { id: 'doc-bank', name: 'Aadhaar-Seeded Bank Passbook', required: true }
  ],
  'SCH-1001': [
    { id: 'doc-aadhaar', name: 'Aadhaar Card', required: true },
    { id: 'doc-land', name: 'Cultivable Land Record (Khasra/Khatauni)', required: true },
    { id: 'doc-bank', name: 'Bank Passbook / Cancelled Cheque', required: true }
  ],
  'SCH-2026-02': [
    { id: 'doc-aadhaar', name: 'Aadhaar Card', required: true },
    { id: 'doc-income', name: 'Annual Income Certificate', required: true },
    { id: 'doc-site', name: 'Land Allotment / Ownership Document', required: true },
    { id: 'doc-photo', name: 'Photograph of Existing Kutcha Dwelling', required: true }
  ],
  'SCH-1005': [
    { id: 'doc-aadhaar', name: 'Aadhaar Card of Family Head', required: true },
    { id: 'doc-ration', name: 'BPL Ration Card / NFSA Card', required: true },
    { id: 'doc-land', name: 'Plot Ownership / NOC Document', required: true }
  ],
  'SCH-2026-03': [
    { id: 'doc-aadhaar', name: 'Student Aadhaar Card', required: true },
    { id: 'doc-college', name: 'College Bonafide / Admission Letter', required: true },
    { id: 'doc-marks', name: 'Previous Academic Year Marksheet', required: true },
    { id: 'doc-bank', name: 'Student Bank Account Details', required: true }
  ],
  'SCH-1002': [
    { id: 'doc-aadhaar', name: 'Aadhaar Card', required: true },
    { id: 'doc-marks', name: 'Class 12th Board Marksheet', required: true },
    { id: 'doc-college', name: 'College Admission Fee Receipt', required: true },
    { id: 'doc-income', name: 'Parental Income Certificate', required: true }
  ],
  'SCH-1003': [
    { id: 'doc-aadhaar', name: 'Aadhaar Card of all Beneficiaries', required: true },
    { id: 'doc-ration', name: 'Ration Card / SECC 2011 Document', required: true }
  ],
  'SCH-1004': [
    { id: 'doc-aadhaar', name: 'Aadhaar Card', required: true },
    { id: 'doc-edu', name: 'Educational Certificate', required: true },
    { id: 'doc-bank', name: 'Bank Account Passbook', required: true }
  ],
  'SCH-2026-04': [
    { id: 'doc-aadhaar', name: 'Woman Entrepreneur Aadhaar Card', required: true },
    { id: 'doc-udyam', name: 'Udyam Registration Certificate', required: true },
    { id: 'doc-project', name: 'Detailed Project Report (DPR)', required: true },
    { id: 'doc-bank', name: 'Enterprise Bank Account Statement', required: true }
  ],
  'SCH-1006': [
    { id: 'doc-aadhaar', name: 'Identity Proof (Aadhaar / Voter ID)', required: true },
    { id: 'doc-business', name: 'Proof of Business Address & Plan', required: true },
    { id: 'doc-bank', name: 'Last 6 Months Bank Statement', required: true }
  ],
  'SCH-1007': [
    { id: 'doc-aadhaar', name: 'Promoter Aadhaar Card', required: true },
    { id: 'doc-caste', name: 'SC/ST Certificate (if applicable)', required: false },
    { id: 'doc-project', name: 'Greenfield Project Proposal', required: true },
    { id: 'doc-pan', name: 'Company / Firm PAN Card', required: true }
  ]
};
