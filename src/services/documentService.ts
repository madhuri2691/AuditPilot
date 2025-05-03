import { Client } from "@/components/clients/ClientsList";
import { Task } from "@/components/tasks/TaskModel";
import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  AlignmentType,
  HeadingLevel,
} from "docx";

export type DocumentType = 
  | "managementRepresentation" 
  | "engagement" 
  | "consent" 
  | "auditPlan";

export type ConstitutionType = 
  | "corporate" 
  | "partnership" 
  | "trust" 
  | "proprietorship";

interface DocumentData {
  client: Client;
  task?: Task;
  additionalData?: Record<string, string>;
}

// Helper function to format the current date
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Generate management representation letter based on constitution
export const generateManagementRepresentationLetter = async (
  data: DocumentData, 
  constitution: ConstitutionType
): Promise<Blob> => {
  const { client, additionalData } = data;
  const date = additionalData?.date || formatDate(new Date());
  const financialYearEnded = additionalData?.financialYearEnded || client.fiscalYearEnd || "___________";
  
  let doc: Document;
  
  switch (constitution) {
    case "corporate":
      doc = createCorporateManagementLetter(client, date, financialYearEnded);
      break;
    case "partnership":
      doc = createPartnershipManagementLetter(client, date, financialYearEnded);
      break;
    case "trust":
      doc = createTrustManagementLetter(client, date, financialYearEnded);
      break;
    case "proprietorship":
      doc = createProprietorshipManagementLetter(client, date, financialYearEnded);
      break;
    default:
      doc = createCorporateManagementLetter(client, date, financialYearEnded);
  }

  return Packer.toBlob(doc);
};

// Generate engagement letter based on constitution
export const generateEngagementLetter = async (
  data: DocumentData, 
  constitution: ConstitutionType
): Promise<Blob> => {
  const { client, additionalData } = data;
  const date = additionalData?.date || formatDate(new Date());
  const financialYearEnded = additionalData?.financialYearEnded || client.fiscalYearEnd || "___________";

  let doc: Document;
  
  switch (constitution) {
    case "corporate":
      doc = createCorporateEngagementLetter(client, date, financialYearEnded);
      break;
    case "partnership":
      doc = createPartnershipEngagementLetter(client, date, financialYearEnded);
      break;
    case "trust":
      doc = createTrustEngagementLetter(client, date, financialYearEnded);
      break;
    case "proprietorship":
      doc = createProprietorshipEngagementLetter(client, date, financialYearEnded);
      break;
    default:
      doc = createCorporateEngagementLetter(client, date, financialYearEnded);
  }

  return Packer.toBlob(doc);
};

// Generate consent letter
export const generateConsentLetter = async (
  data: DocumentData
): Promise<Blob> => {
  const { client, additionalData } = data;
  const date = additionalData?.date || formatDate(new Date());

  const doc = createConsentLetter(client, date);
  return Packer.toBlob(doc);
};

// Generate audit plan
export const generateAuditPlan = async (
  data: DocumentData
): Promise<Blob> => {
  const { client, additionalData, task } = data;
  const date = additionalData?.date || formatDate(new Date());
  const financialYearEnded = additionalData?.financialYearEnded || client.fiscalYearEnd || "___________";

  const doc = createAuditPlan(client, date, financialYearEnded, task);
  return Packer.toBlob(doc);
};

// Helper function to download document
export const downloadDocument = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

// Create corporate management representation letter
const createCorporateManagementLetter = (
  client: Client, 
  date: string,
  financialYearEnded: string
): Document => {
  return new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: "MANAGEMENT REPRESENTATION LETTER – CORPORATE ENTITY",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: "[On the Letterhead of the Company]",
            alignment: AlignmentType.CENTER,
            italics: true,
          }),
          new Paragraph({
            text: `Date: ${date}`,
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "To,",
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({
            text: "Muralidhar & Associates",
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({
            text: "Chartered Accountants",
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({
            text: "Elamakkara, Kochi-682026",
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "Dear Sirs,",
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({
            text: `Subject: Management Representation Letter for the Financial Year Ended ${financialYearEnded}`,
            alignment: AlignmentType.LEFT,
            bold: true,
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: `This representation letter is provided in connection with your audit of the financial statements of ${client.name} for the year ended ${financialYearEnded}, for the purpose of expressing an opinion as to whether the financial statements give a true and fair view in accordance with the applicable financial reporting framework.`,
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "We acknowledge our responsibility for the fair presentation of the financial statements in accordance with the applicable financial reporting framework.",
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "We confirm, to the best of our knowledge and belief, the following representations:",
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "1. The financial statements are free from material misstatements, including omissions.",
          }),
          new Paragraph({
            text: "2. All records, documents, and other matters relevant to the preparation and presentation of the financial statements have been made available to you.",
          }),
          new Paragraph({
            text: "3. All transactions have been recorded and are reflected in the financial statements.",
          }),
          new Paragraph({
            text: "4. We have complied with all applicable laws and regulations.",
          }),
          new Paragraph({
            text: "5. No events have occurred subsequent to the balance sheet date that would require adjustment or disclosure.",
          }),
          new Paragraph({
            text: "6. All contingent liabilities and capital commitments have been disclosed.",
          }),
          new Paragraph({
            text: "7. The company has complied with provisions of all applicable statutes and regulatory requirements.",
          }),
          new Paragraph({
            text: "8. No frauds or suspected frauds involving management or employees have occurred.",
          }),
          new Paragraph({
            text: "9. Related party transactions have been disclosed and accounted for appropriately.",
          }),
          new Paragraph({
            text: "10. We have made available all minutes of meetings of shareholders, board of directors, and committees.",
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "We confirm that the above representations are true and complete.",
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: `For ${client.name}`,
          }),
          new Paragraph({ text: "" }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "________________________________________",
          }),
          new Paragraph({
            text: "[Name of the Authorized Signatory]",
          }),
          new Paragraph({
            text: "Designation: __________",
          }),
          new Paragraph({
            text: "DIN _________",
          }),
        ],
      },
    ],
  });
};

// Create partnership management representation letter
const createPartnershipManagementLetter = (
  client: Client, 
  date: string,
  financialYearEnded: string
): Document => {
  return new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: "MANAGEMENT REPRESENTATION LETTER – PARTNERSHIP FIRM",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: "[On the Letterhead of the Firm]",
            alignment: AlignmentType.CENTER,
            italics: true,
          }),
          new Paragraph({
            text: `Date: ${date}`,
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "To,",
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({
            text: "Muralidhar & Associates",
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({
            text: "Chartered Accountants",
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({
            text: "Elamakkara, Kochi-682026",
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "Dear Sirs,",
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({
            text: `Subject: Management Representation Letter for the Year Ended ${financialYearEnded}`,
            alignment: AlignmentType.LEFT,
            bold: true,
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: `This letter is provided in connection with your audit of the financial statements of ${client.name}, for the year ended ${financialYearEnded}, for the purpose of expressing an opinion on the financial statements.`,
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "We acknowledge our responsibility for the fair presentation of the financial statements and confirm the following representations:",
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "1. The financial statements are prepared in accordance with applicable accounting principles and fairly present the financial position and results.",
          }),
          new Paragraph({
            text: "2. We have provided all relevant records and information for the audit.",
          }),
          new Paragraph({
            text: "3. All financial transactions are properly recorded and disclosed.",
          }),
          new Paragraph({
            text: "4. The firm has complied with all applicable laws and regulations.",
          }),
          new Paragraph({
            text: "5. There have been no known frauds or irregularities involving any partner or employee.",
          }),
          new Paragraph({
            text: "6. All related party transactions have been fully disclosed.",
          }),
          new Paragraph({
            text: "7. No significant events have occurred after the balance sheet date that require adjustment or disclosure.",
          }),
          new Paragraph({
            text: "8. All liabilities, contingencies, and capital commitments have been properly disclosed.",
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "We confirm the completeness and accuracy of the above representations.",
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: `For ${client.name}`,
          }),
          new Paragraph({ text: "" }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "________________________________________",
          }),
          new Paragraph({
            text: "[Name of Partner]",
          }),
          new Paragraph({
            text: "Designation: Partner",
          }),
          new Paragraph({
            text: `Date: ${date}`,
          }),
        ],
      },
    ],
  });
};

// Create trust management representation letter
const createTrustManagementLetter = (
  client: Client,
  date: string,
  financialYearEnded: string
): Document => {
  return new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: "MANAGEMENT REPRESENTATION LETTER – TRUST",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: "[On the Letterhead of the Trust]",
            alignment: AlignmentType.CENTER,
            italics: true,
          }),
          new Paragraph({
            text: `Date: ${date}`,
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "To,",
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({
            text: "Muralidhar & Associates",
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({
            text: "Chartered Accountants",
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({
            text: "Elamakkara, Kochi-682026",
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "Dear Sirs,",
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({
            text: `Subject: Management Representation Letter for the Financial Year Ended ${financialYearEnded}`,
            alignment: AlignmentType.LEFT,
            bold: true,
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: `This representation letter is furnished in connection with your audit of the financial statements of ${client.name} for the year ended ${financialYearEnded} for the purpose of expressing an opinion thereon.`,
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "We, the undersigned trustees, hereby confirm the following:",
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "1. The financial statements are complete and present a true and fair view in accordance with applicable laws and accounting policies.",
          }),
          new Paragraph({
            text: "2. All records and documents have been made available to you for your audit.",
          }),
          new Paragraph({
            text: "3. All income and expenditure, including donations and grants, have been properly accounted for.",
          }),
          new Paragraph({
            text: "4. The Trust has complied with the provisions of the Trust Deed, applicable laws, and regulatory requirements.",
          }),
          new Paragraph({
            text: "5. There are no known frauds or irregularities.",
          }),
          new Paragraph({
            text: "6. Related party transactions and disclosures have been made in accordance with applicable laws.",
          }),
          new Paragraph({
            text: "7. There are no undisclosed liabilities, contingencies, or subsequent events requiring adjustment or disclosure.",
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "We confirm that the representations made are accurate to the best of our knowledge.",
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: `For ${client.name}`,
          }),
          new Paragraph({ text: "" }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "________________________________________",
          }),
          new Paragraph({
            text: "[Name of Trustee]",
          }),
          new Paragraph({
            text: "Designation: Trustee",
          }),
          new Paragraph({
            text: `Date: ${date}`,
          }),
        ],
      },
    ],
  });
};

// Create proprietorship management representation letter
const createProprietorshipManagementLetter = (
  client: Client,
  date: string,
  financialYearEnded: string
): Document => {
  return new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: "MANAGEMENT REPRESENTATION LETTER – PROPRIETORSHIP",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: "[On the Letterhead of the Proprietorship]",
            alignment: AlignmentType.CENTER,
            italics: true,
          }),
          new Paragraph({
            text: `Date: ${date}`,
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "To,",
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({
            text: "Muralidhar & Associates",
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({
            text: "Chartered Accountants",
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({
            text: "Elamakkara, Kochi-682026",
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "Dear Sirs,",
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({
            text: `Subject: Management Representation Letter for the Year Ended ${financialYearEnded}`,
            alignment: AlignmentType.LEFT,
            bold: true,
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: `This letter is provided in connection with your audit of the financial statements of ${client.name}, for the year ended ${financialYearEnded}, for the purpose of expressing an opinion on the financial statements.`,
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "I acknowledge our responsibility for the fair presentation of the financial statements and confirm the following representations:",
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "1. The financial statements are prepared in accordance with applicable accounting principles and fairly present the financial position and results.",
          }),
          new Paragraph({
            text: "2. I have provided all relevant records and information for the audit.",
          }),
          new Paragraph({
            text: "3. All financial transactions are properly recorded and disclosed.",
          }),
          new Paragraph({
            text: "4. The business has complied with all applicable laws and regulations.",
          }),
          new Paragraph({
            text: "5. There have been no known frauds or irregularities involving any partner or employee.",
          }),
          new Paragraph({
            text: "6. All related party transactions have been fully disclosed.",
          }),
          new Paragraph({
            text: "7. No significant events have occurred after the balance sheet date that require adjustment or disclosure.",
          }),
          new Paragraph({
            text: "8. All liabilities, contingencies, and capital commitments have been properly disclosed.",
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "I confirm the completeness and accuracy of the above representations.",
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: `For ${client.name}`,
          }),
          new Paragraph({ text: "" }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "________________________________________",
          }),
          new Paragraph({
            text: "[Name of Proprietorship]",
          }),
          new Paragraph({
            text: "Designation: Proprietor",
          }),
          new Paragraph({
            text: `Date: ${date}`,
          }),
        ],
      },
    ],
  });
};

// Similar implementation for engagement letters for different constitution types
const createCorporateEngagementLetter = (
  client: Client,
  date: string,
  financialYearEnded: string
): Document => {
  return new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: "ENGAGEMENT LETTER – CORPORATE ENTITY",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: "[Letterhead of the Auditor]",
            alignment: AlignmentType.CENTER,
            italics: true,
          }),
          new Paragraph({
            text: `Date: ${date}`,
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "To,",
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({
            text: "The Board of Directors,",
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({
            text: `${client.name}`,
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({
            text: `${client.address || "[Registered Office Address]"}`,
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "Dear Sirs,",
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({
            text: `Subject: Audit Engagement Letter for the Financial Year Ended ${financialYearEnded}`,
            alignment: AlignmentType.LEFT,
            bold: true,
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: `We are pleased to confirm our acceptance and understanding of the terms of our engagement to audit the financial statements of ${client.name}, which comprise the Balance Sheet as at ${financialYearEnded}, the Statement of Profit and Loss, the Cash Flow Statement for the year then ended, and notes to the financial statements including a summary of significant accounting policies.`,
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "This audit will be conducted in accordance with the Standards on Auditing (SAs) issued by the Institute of Chartered Accountants of India. These Standards require that we comply with ethical requirements and plan and perform the audit to obtain reasonable assurance about whether the financial statements are free from material misstatement.",
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "Management is responsible for the preparation and fair presentation of these financial statements in accordance with the applicable financial reporting framework and for providing us with:",
          }),
          new Paragraph({
            text: "1. All relevant information and access to records.",
          }),
          new Paragraph({
            text: "2. Unrestricted access to persons within the company.",
          }),
          new Paragraph({
            text: "3. Written representations confirming certain matters.",
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "Our report is intended solely for the information and use of the management and those charged with governance and should not be used for any other purpose without our written consent.",
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "Kindly sign and return the duplicate copy of this letter to indicate your acknowledgment of and agreement with the arrangements for our audit of the financial statements.",
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "Yours faithfully,",
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "For Muralidhar & Associates",
          }),
          new Paragraph({
            text: "Chartered Accountants",
          }),
          new Paragraph({
            text: "Firm Reg. No. XXXXXX",
          }),
          new Paragraph({ text: "" }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "Signing Partner[_________]",
          }),
          new Paragraph({
            text: "Partner",
          }),
          new Paragraph({
            text: "M. No. [______]",
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "Acknowledged and Agreed",
          }),
          new Paragraph({
            text: `For ${client.name}`,
          }),
          new Paragraph({ text: "" }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "[Name]",
          }),
          new Paragraph({
            text: "[Designation – e.g., Managing Director / CFO]",
          }),
          new Paragraph({
            text: "DIN / PAN: __________",
          }),
          new Paragraph({
            text: `Date: ${date}`,
          }),
        ],
      },
    ],
  });
};

// Similar implementation for other engagement letter types (partnership, trust, proprietorship)
const createPartnershipEngagementLetter = (
  client: Client,
  date: string,
  financialYearEnded: string
): Document => {
  return new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: "ENGAGEMENT LETTER – PARTNERSHIP FIRM",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: "[Letterhead of the Auditor]",
            alignment: AlignmentType.CENTER,
            italics: true,
          }),
          new Paragraph({
            text: `Date: ${date}`,
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "To,",
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({
            text: "The Partners,",
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({
            text: `${client.name}`,
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({
            text: `${client.address || "[Registered Address]"}`,
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "Dear Sirs,",
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({
            text: `Subject: Engagement Letter for Statutory Audit for FY ${financialYearEnded}`,
            alignment: AlignmentType.LEFT,
            bold: true,
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "We are pleased to confirm our acceptance and understanding of the terms of our engagement to audit the financial statements of " + client.name + " for the financial year ended " + financialYearEnded + ".",
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "Our audit will be conducted in accordance with the Standards on Auditing issued by the Institute of Chartered Accountants of India. We will plan and perform the audit to obtain reasonable assurance about whether the financial statements are free from material misstatement.",
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "As part of our audit process, we will request written representations from management concerning assertions made in connection with the audit.",
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "Fees for our services will be based on standard rates, plus out-of-pocket expenses. Invoices will be submitted as work progresses.",
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "Please sign and return the attached copy of this letter to indicate your acknowledgment of, and agreement with, the arrangements for our audit of the financial statements.",
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "Yours faithfully,",
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "For Muralidhar & Associates",
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "_________________________",
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({
            text: "Partner",
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "Acknowledged and Agreed:",
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "_________________________",
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({
            text: "For " + client.name,
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "Date: " + date,
            alignment: AlignmentType.LEFT,
          }),
        ],
      },
    ],
  });
};

const createTrustEngagementLetter = (
  client: Client,
  date: string,
  financialYearEnded: string
): Document => {
  return new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: "ENGAGEMENT LETTER – TRUST",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: "[Letterhead of the Auditor]",
            alignment: AlignmentType.CENTER,
            italics: true,
          }),
          new Paragraph({
            text: `Date: ${date}`,
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "To,",
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({
            text: "The Trustees,",
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({
            text: `${client.name}`,
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({
            text: `${client.address || "[Registered Address]"}`,
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "Dear Sirs,",
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({
            text: `Subject: Engagement Letter for Statutory Audit for FY ${financialYearEnded}`,
            alignment: AlignmentType.LEFT,
            bold: true,
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "We are pleased to confirm our acceptance and understanding of the terms of our engagement to audit the financial statements of " + client.name + " for the financial year ended " + financialYearEnded + ".",
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "Our audit will be conducted in accordance with the Standards on Auditing issued by the Institute of Chartered Accountants of India. We will plan and perform the audit to obtain reasonable assurance about whether the financial statements are free from material misstatement.",
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "As part of our audit process, we will request written representations from management concerning assertions made in connection with the audit.",
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "Fees for our services will be based on standard rates, plus out-of-pocket expenses. Invoices will be submitted as work progresses.",
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "Please sign and return the attached copy of this letter to indicate your acknowledgment of, and agreement with, the arrangements for our audit of the financial statements.",
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "Yours faithfully,",
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "For Muralidhar & Associates",
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "_________________________",
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({
            text: "Partner",
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "Acknowledged and Agreed:",
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "_________________________",
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({
            text: "For " + client.name,
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "Date: " + date,
            alignment: AlignmentType.LEFT,
          }),
        ],
      },
    ],
  });
};

const createProprietorshipEngagementLetter = (
  client: Client,
  date: string,
  financialYearEnded: string
): Document => {
  return new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: "ENGAGEMENT LETTER – PROPRIETORSHIP",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: "[Letterhead of the Auditor]",
            alignment: AlignmentType.CENTER,
            italics: true,
          }),
          new Paragraph({
            text: `Date: ${date}`,
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "To,",
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({
            text: "The Proprietor,",
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({
            text: `${client.name}`,
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({
            text: `${client.address || "[Registered Address]"}`,
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "Dear Sir,",
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({
            text: `Subject: Engagement Letter for Statutory Audit for FY ${financialYearEnded}`,
            alignment: AlignmentType.LEFT,
            bold: true,
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "We are pleased to confirm our acceptance and understanding of the terms of our engagement to audit the financial statements of " + client.name + " for the financial year ended " + financialYearEnded + ".",
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "Our audit will be conducted in accordance with the Standards on Auditing issued by the Institute of Chartered Accountants of India. We will plan and perform the audit to obtain reasonable assurance about whether the financial statements are free from material misstatement.",
            alignment: AlignmentType.LEFT,
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "As part of our audit process, we will request written representations from management concerning assertions made in connection with the audit.",
            alignment:
