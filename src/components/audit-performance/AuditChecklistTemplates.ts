
import { ChecklistItem } from "./AuditChecklistModel";

// Generate Tax Audit checklist items based on the program sheet
export const generateTaxAuditItems = (): ChecklistItem[] => {
  return [
    {
      id: "tax_1",
      area: "Appointment Letter",
      procedure: "Obtain signed engagement letter from client",
      responsibility: "Audit Team Lead",
      timeline: "Day 1",
      isDone: false,
      remarks: ""
    },
    {
      id: "tax_2",
      area: "Preliminary Discussions",
      procedure: "Understand nature of business, systems, changes in law",
      responsibility: "Audit Team",
      timeline: "Day 1–2",
      isDone: false,
      remarks: ""
    },
    {
      id: "tax_3",
      area: "Books of Accounts",
      procedure: "Obtain and review ledgers, trial balance, journal, cash book, bank book",
      responsibility: "Article/Junior Auditor",
      timeline: "Day 2–3",
      isDone: false,
      remarks: ""
    },
    {
      id: "tax_4",
      area: "Turnover Computation",
      procedure: "Verify gross receipts/turnover as per books and reconcile with GST returns, if any",
      responsibility: "Article/Junior Auditor",
      timeline: "Day 3",
      isDone: false,
      remarks: ""
    },
    {
      id: "tax_5",
      area: "Expenses Scrutiny",
      procedure: "Verify nature and allowability of major expenses (rent, salaries, repairs, etc.)",
      responsibility: "Audit Team",
      timeline: "Day 3–4",
      isDone: false,
      remarks: ""
    },
    {
      id: "tax_6",
      area: "Depreciation",
      procedure: "Review depreciation schedule as per Income Tax Act",
      responsibility: "Audit Senior",
      timeline: "Day 4",
      isDone: false,
      remarks: ""
    },
    {
      id: "tax_7",
      area: "TDS Compliance",
      procedure: "Check for TDS deduction, deposit & return filing",
      responsibility: "TDS Specialist",
      timeline: "Day 4–5",
      isDone: false,
      remarks: ""
    },
    {
      id: "tax_8",
      area: "Section 40A(3) Payments",
      procedure: "Identify payments above ₹10,000 in cash",
      responsibility: "Article",
      timeline: "Day 4–5",
      isDone: false,
      remarks: ""
    },
    {
      id: "tax_9",
      area: "Related Party Transactions",
      procedure: "Verify and report under Clause 23",
      responsibility: "Audit Senior",
      timeline: "Day 5",
      isDone: false,
      remarks: ""
    },
    {
      id: "tax_10",
      area: "Loans and Advances",
      procedure: "Review all loans taken/given and compliance with Sections 269SS/269T",
      responsibility: "Audit Senior",
      timeline: "Day 5–6",
      isDone: false,
      remarks: ""
    },
    {
      id: "tax_11",
      area: "GST & Income Reconciliation",
      procedure: "Reconcile turnover and input credits with GST and ITR",
      responsibility: "Audit Team",
      timeline: "Day 6",
      isDone: false,
      remarks: ""
    },
    {
      id: "tax_12",
      area: "Reporting in Form 3CD",
      procedure: "Clause-wise filling of Form 3CD",
      responsibility: "Audit Manager",
      timeline: "Day 6–7",
      isDone: false,
      remarks: ""
    },
    {
      id: "tax_13",
      area: "Management Representation Letter",
      procedure: "Obtain signed MRL for disclosures and confirmations",
      responsibility: "Audit Team Lead",
      timeline: "Day 7",
      isDone: false,
      remarks: ""
    },
    {
      id: "tax_14",
      area: "Finalization and Sign-off",
      procedure: "Review by Partner/Manager, sign Form 3CB & 3CD, upload to portal",
      responsibility: "Partner/Manager",
      timeline: "Day 8",
      isDone: false,
      remarks: ""
    }
  ];
};

// Generate Statutory Audit checklist items based on the program sheet
export const generateStatutoryAuditItems = (): ChecklistItem[] => {
  return [
    {
      id: "stat_1",
      area: "Audit Planning & Engagement",
      procedure: "Issue engagement letter, define scope, assess risks",
      responsibility: "Audit Partner/Manager",
      timeline: "Pre-Audit",
      isDone: false,
      remarks: ""
    },
    {
      id: "stat_2",
      area: "Understanding Internal Controls",
      procedure: "Evaluate internal controls & accounting systems",
      responsibility: "Audit Senior",
      timeline: "Day 1–2",
      isDone: false,
      remarks: ""
    },
    {
      id: "stat_3",
      area: "Verification of Fixed Assets",
      procedure: "Physical verification, check additions/deletions, depreciation",
      responsibility: "Article/Senior Auditor",
      timeline: "Day 2–3",
      isDone: false,
      remarks: ""
    },
    {
      id: "stat_4",
      area: "Inventory Verification",
      procedure: "Observe stock-taking, confirm valuation method",
      responsibility: "Audit Team",
      timeline: "As per schedule",
      isDone: false,
      remarks: ""
    },
    {
      id: "stat_5",
      area: "Revenue Audit",
      procedure: "Vouch sales invoices, check cutoff, confirm with debtors",
      responsibility: "Audit Team",
      timeline: "Day 3–4",
      isDone: false,
      remarks: ""
    },
    {
      id: "stat_6",
      area: "Purchases & Expenses",
      procedure: "Vouch major purchases & expenses, verify authorization and cut-off",
      responsibility: "Audit Team",
      timeline: "Day 4–5",
      isDone: false,
      remarks: ""
    },
    {
      id: "stat_7",
      area: "Payroll and Statutory Dues",
      procedure: "Verify payroll, PF, ESI, TDS compliance",
      responsibility: "Junior Auditor",
      timeline: "Day 4–5",
      isDone: false,
      remarks: ""
    },
    {
      id: "stat_8",
      area: "Debtors and Loans Review",
      procedure: "Ageing analysis, confirmations, provision for doubtful debts",
      responsibility: "Article",
      timeline: "Day 5–6",
      isDone: false,
      remarks: ""
    },
    {
      id: "stat_9",
      area: "Creditors and Provisions",
      procedure: "Review vendor balances, verify provision calculations",
      responsibility: "Audit Senior",
      timeline: "Day 6",
      isDone: false,
      remarks: ""
    },
    {
      id: "stat_10",
      area: "Bank Reconciliation & Loans",
      procedure: "Review BRS, verify term loans, interest and charges",
      responsibility: "Junior Auditor",
      timeline: "Day 6",
      isDone: false,
      remarks: ""
    },
    {
      id: "stat_11",
      area: "Contingent Liabilities",
      procedure: "Check for legal cases, guarantees, and other off-balance sheet items",
      responsibility: "Manager/Senior",
      timeline: "Day 7",
      isDone: false,
      remarks: ""
    },
    {
      id: "stat_12",
      area: "Compliance with Laws",
      procedure: "Check ROC filings, board minutes, statutory registers",
      responsibility: "Manager/Senior",
      timeline: "Day 7",
      isDone: false,
      remarks: ""
    },
    {
      id: "stat_13",
      area: "Tax Audit & Income Tax",
      procedure: "Verify ITR, tax payments, deferred tax workings, provisions",
      responsibility: "Tax Specialist",
      timeline: "Day 7",
      isDone: false,
      remarks: ""
    },
    {
      id: "stat_14",
      area: "Final Analytical Review",
      procedure: "Compare current vs. previous year, ratio analysis",
      responsibility: "Manager",
      timeline: "Day 8",
      isDone: false,
      remarks: ""
    },
    {
      id: "stat_15",
      area: "Drafting Financial Statements",
      procedure: "Review financials, notes to accounts, compliance with Schedule III",
      responsibility: "Audit Team Lead",
      timeline: "Day 8",
      isDone: false,
      remarks: ""
    },
    {
      id: "stat_16",
      area: "Management Representation Letter",
      procedure: "Obtain MRL covering key areas and uncertainties",
      responsibility: "Audit Team Lead",
      timeline: "Day 8",
      isDone: false,
      remarks: ""
    },
    {
      id: "stat_17",
      area: "Final Review & Sign-off",
      procedure: "Review working papers, finalize audit report, sign Form 3CA/3CB",
      responsibility: "Partner",
      timeline: "Day 9",
      isDone: false,
      remarks: ""
    }
  ];
};
