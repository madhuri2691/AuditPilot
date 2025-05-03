
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
  const cinNumber = additionalData?.cinNumber || "___________";

  const doc = createConsentLetter(client, date, cinNumber);
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
            alignment: AlignmentType.CENTER,
            heading: HeadingLevel.HEADING_1,
            children: [
              new TextRun({
                text: "MANAGEMENT REPRESENTATION LETTER – CORPORATE ENTITY",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "[On the Letterhead of the Company]",
                italics: true,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: `Date: ${date}`,
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: "To," }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: "Muralidhar & Associates" }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: "Chartered Accountants" }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: "Elamakkara, Kochi-682026" }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: "Dear Sirs," }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: `Subject: Management Representation Letter for the Financial Year Ended ${financialYearEnded}`,
                bold: true,
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({
                text: `This representation letter is provided in connection with your audit of the financial statements of ${client.name} for the year ended ${financialYearEnded}, for the purpose of expressing an opinion as to whether the financial statements give a true and fair view in accordance with the applicable financial reporting framework.`,
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({
                text: "We acknowledge our responsibility for the fair presentation of the financial statements in accordance with the applicable financial reporting framework.",
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({
                text: "We confirm, to the best of our knowledge and belief, the following representations:",
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({
                text: "1. The financial statements are free from material misstatements, including omissions.",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "2. All records, documents, and other matters relevant to the preparation and presentation of the financial statements have been made available to you.",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "3. All transactions have been recorded and are reflected in the financial statements.",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "4. We have complied with all applicable laws and regulations.",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "5. No events have occurred subsequent to the balance sheet date that would require adjustment or disclosure.",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "6. All contingent liabilities and capital commitments have been disclosed.",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "7. The company has complied with provisions of all applicable statutes and regulatory requirements.",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "8. No frauds or suspected frauds involving management or employees have occurred.",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "9. Related party transactions have been disclosed and accounted for appropriately.",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "10. We have made available all minutes of meetings of shareholders, board of directors, and committees.",
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({
                text: "We confirm that the above representations are true and complete.",
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({
                text: `For ${client.name}`,
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({
                text: "________________________________________",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "[Name of the Authorized Signatory]",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Designation: __________",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "DIN _________",
              }),
            ],
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
            alignment: AlignmentType.CENTER,
            heading: HeadingLevel.HEADING_1,
            children: [
              new TextRun({
                text: "MANAGEMENT REPRESENTATION LETTER – PARTNERSHIP FIRM",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "[On the Letterhead of the Firm]",
                italics: true,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: `Date: ${date}`,
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: "To," }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: "Muralidhar & Associates" }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: "Chartered Accountants" }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: "Elamakkara, Kochi-682026" }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: "Dear Sirs," }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: `Subject: Management Representation Letter for the Year Ended ${financialYearEnded}`,
                bold: true,
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({
                text: `This letter is provided in connection with your audit of the financial statements of ${client.name}, for the year ended ${financialYearEnded}, for the purpose of expressing an opinion on the financial statements.`,
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({
                text: "We acknowledge our responsibility for the fair presentation of the financial statements and confirm the following representations:",
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({
                text: "1. The financial statements are prepared in accordance with applicable accounting principles and fairly present the financial position and results.",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "2. We have provided all relevant records and information for the audit.",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "3. All financial transactions are properly recorded and disclosed.",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "4. The firm has complied with all applicable laws and regulations.",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "5. There have been no known frauds or irregularities involving any partner or employee.",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "6. All related party transactions have been fully disclosed.",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "7. No significant events have occurred after the balance sheet date that require adjustment or disclosure.",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "8. All liabilities, contingencies, and capital commitments have been properly disclosed.",
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({
                text: "We confirm the completeness and accuracy of the above representations.",
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({
                text: `For ${client.name}`,
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({
                text: "________________________________________",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "[Name of Partner]",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Designation: Partner",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Date: ${date}`,
              }),
            ],
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
            alignment: AlignmentType.CENTER,
            heading: HeadingLevel.HEADING_1,
            children: [
              new TextRun({
                text: "MANAGEMENT REPRESENTATION LETTER – TRUST",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "[On the Letterhead of the Trust]",
                italics: true,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: `Date: ${date}`,
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: "To," }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: "Muralidhar & Associates" }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: "Chartered Accountants" }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: "Elamakkara, Kochi-682026" }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: "Dear Sirs," }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: `Subject: Management Representation Letter for the Financial Year Ended ${financialYearEnded}`,
                bold: true,
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({
                text: `This representation letter is furnished in connection with your audit of the financial statements of ${client.name} for the year ended ${financialYearEnded} for the purpose of expressing an opinion thereon.`,
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({
                text: "We, the undersigned trustees, hereby confirm the following:",
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({
                text: "1. The financial statements are complete and present a true and fair view in accordance with applicable laws and accounting policies.",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "2. All records and documents have been made available to you for your audit.",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "3. All income and expenditure, including donations and grants, have been properly accounted for.",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "4. The Trust has complied with the provisions of the Trust Deed, applicable laws, and regulatory requirements.",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "5. There are no known frauds or irregularities.",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "6. Related party transactions and disclosures have been made in accordance with applicable laws.",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "7. There are no undisclosed liabilities, contingencies, or subsequent events requiring adjustment or disclosure.",
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({
                text: "We confirm that the representations made are accurate to the best of our knowledge.",
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({
                text: `For ${client.name}`,
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({
                text: "________________________________________",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "[Name of Trustee]",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Designation: Trustee",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Date: ${date}`,
              }),
            ],
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
            alignment: AlignmentType.CENTER,
            heading: HeadingLevel.HEADING_1,
            children: [
              new TextRun({
                text: "MANAGEMENT REPRESENTATION LETTER – PROPRIETORSHIP",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "[On the Letterhead of the Proprietorship]",
                italics: true,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: `Date: ${date}`,
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: "To," }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: "Muralidhar & Associates" }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: "Chartered Accountants" }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: "Elamakkara, Kochi-682026" }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: "Dear Sirs," }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: `Subject: Management Representation Letter for the Year Ended ${financialYearEnded}`,
                bold: true,
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({
                text: `This letter is provided in connection with your audit of the financial statements of ${client.name}, for the year ended ${financialYearEnded}, for the purpose of expressing an opinion on the financial statements.`,
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({
                text: "I acknowledge our responsibility for the fair presentation of the financial statements and confirm the following representations:",
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({
                text: "1. The financial statements are prepared in accordance with applicable accounting principles and fairly present the financial position and results.",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "2. I have provided all relevant records and information for the audit.",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "3. All financial transactions are properly recorded and disclosed.",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "4. The business has complied with all applicable laws and regulations.",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "5. There have been no known frauds or irregularities involving any partner or employee.",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "6. All related party transactions have been fully disclosed.",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "7. No significant events have occurred after the balance sheet date that require adjustment or disclosure.",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "8. All liabilities, contingencies, and capital commitments have been properly disclosed.",
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({
                text: "I confirm the completeness and accuracy of the above representations.",
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({
                text: `For ${client.name}`,
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({
                text: "________________________________________",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "[Name of Proprietorship]",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Designation: Proprietor",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Date: ${date}`,
              }),
            ],
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
            alignment: AlignmentType.CENTER,
            heading: HeadingLevel.HEADING_1,
            children: [
              new TextRun({
                text: "ENGAGEMENT LETTER – CORPORATE ENTITY",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "[Letterhead of the Auditor]",
                italics: true,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: `Date: ${date}`,
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: "To," }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: "The Board of Directors," }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: `${client.name}` }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: `${client.address || "[Registered Office Address]"}` }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: "Dear Sirs," }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: `Subject: Audit Engagement Letter for the Financial Year Ended ${financialYearEnded}`,
                bold: true,
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({
                text: `We are pleased to confirm our acceptance and understanding of the terms of our engagement to audit the financial statements of ${client.name}, which comprise the Balance Sheet as at ${financialYearEnded}, the Statement of Profit and Loss, the Cash Flow Statement for the year then ended, and notes to the financial statements including a summary of significant accounting policies.`,
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({
                text: "This audit will be conducted in accordance with the Standards on Auditing (SAs) issued by the Institute of Chartered Accountants of India. These Standards require that we comply with ethical requirements and plan and perform the audit to obtain reasonable assurance about whether the financial statements are free from material misstatement.",
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Management is responsible for the preparation and fair presentation of these financial statements in accordance with the applicable financial reporting framework and for providing us with:",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "1. All relevant information and access to records.",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "2. Unrestricted access to persons within the company.",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "3. Written representations confirming certain matters.",
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Our report is intended solely for the information and use of the management and those charged with governance and should not be used for any other purpose without our written consent.",
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Kindly sign and return the duplicate copy of this letter to indicate your acknowledgment of and agreement with the arrangements for our audit of the financial statements.",
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Yours faithfully,",
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({
                text: "For Muralidhar & Associates",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Chartered Accountants",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Firm Reg. No. XXXXXX",
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Signing Partner[_________]",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Partner",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "M. No. [______]",
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Acknowledged and Agreed",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `For ${client.name}`,
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({
                text: "[Name]",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "[Designation – e.g., Managing Director / CFO]",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "DIN / PAN: __________",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Date: ${date}`,
              }),
            ],
          }),
        ],
      },
    ],
  });
};

// Partnership engagement letter implementation
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
            alignment: AlignmentType.CENTER,
            heading: HeadingLevel.HEADING_1,
            children: [
              new TextRun({
                text: "ENGAGEMENT LETTER – PARTNERSHIP FIRM",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "[Letterhead of the Auditor]",
                italics: true,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: `Date: ${date}`,
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: "To," }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: "The Partners," }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: `${client.name}` }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: `${client.address || "[Registered Address]"}` }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: "Dear Sirs," }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: `Subject: Engagement Letter for Statutory Audit for FY ${financialYearEnded}`,
                bold: true,
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: `We are pleased to confirm our acceptance and understanding of the terms of our engagement to audit the financial statements of ${client.name} for the financial year ended ${financialYearEnded}.`,
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: "Our audit will be conducted in accordance with the Standards on Auditing issued by the Institute of Chartered Accountants of India. We will plan and perform the audit to obtain reasonable assurance about whether the financial statements are free from material misstatement.",
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: "As part of our audit process, we will request written representations from management concerning assertions made in connection with the audit.",
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: "Fees for our services will be based on standard rates, plus out-of-pocket expenses. Invoices will be submitted as work progresses.",
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: "Please sign and return the attached copy of this letter to indicate your acknowledgment of, and agreement with, the arrangements for our audit of the financial statements.",
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: "Yours faithfully,",
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: "For Muralidhar & Associates",
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: "_________________________",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: "Partner",
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: "Acknowledged and Agreed:",
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: "_________________________",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: `For ${client.name}`,
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: `Date: ${date}`,
              }),
            ],
          }),
        ],
      },
    ],
  });
};

// Trust engagement letter implementation
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
            alignment: AlignmentType.CENTER,
            heading: HeadingLevel.HEADING_1,
            children: [
              new TextRun({
                text: "ENGAGEMENT LETTER – TRUST",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "[Letterhead of the Auditor]",
                italics: true,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: `Date: ${date}`,
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: "To," }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: "The Trustees," }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: `${client.name}` }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: `${client.address || "[Registered Address]"}` }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: "Dear Sirs," }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: `Subject: Engagement Letter for Statutory Audit for FY ${financialYearEnded}`,
                bold: true,
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: `We are pleased to confirm our acceptance and understanding of the terms of our engagement to audit the financial statements of ${client.name} for the financial year ended ${financialYearEnded}.`,
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: "Our audit will be conducted in accordance with the Standards on Auditing issued by the Institute of Chartered Accountants of India. We will plan and perform the audit to obtain reasonable assurance about whether the financial statements are free from material misstatement.",
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: "As part of our audit process, we will request written representations from management concerning assertions made in connection with the audit.",
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: "Fees for our services will be based on standard rates, plus out-of-pocket expenses. Invoices will be submitted as work progresses.",
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: "Please sign and return the attached copy of this letter to indicate your acknowledgment of, and agreement with, the arrangements for our audit of the financial statements.",
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: "Yours faithfully,",
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: "For Muralidhar & Associates",
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: "_________________________",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: "Partner",
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: "Acknowledged and Agreed:",
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: "_________________________",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: `For ${client.name}`,
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: `Date: ${date}`,
              }),
            ],
          }),
        ],
      },
    ],
  });
};

// Proprietorship engagement letter implementation
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
            alignment: AlignmentType.CENTER,
            heading: HeadingLevel.HEADING_1,
            children: [
              new TextRun({
                text: "ENGAGEMENT LETTER – PROPRIETORSHIP",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "[Letterhead of the Auditor]",
                italics: true,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: `Date: ${date}`,
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: "To," }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: "The Proprietor," }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: `${client.name}` }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: `${client.address || "[Registered Address]"}` }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: "Dear Sir," }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: `Subject: Engagement Letter for Statutory Audit for FY ${financialYearEnded}`,
                bold: true,
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: `We are pleased to confirm our acceptance and understanding of the terms of our engagement to audit the financial statements of ${client.name} for the financial year ended ${financialYearEnded}.`,
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: "Our audit will be conducted in accordance with the Standards on Auditing issued by the Institute of Chartered Accountants of India. We will plan and perform the audit to obtain reasonable assurance about whether the financial statements are free from material misstatement.",
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: "As part of our audit process, we will request written representations from management concerning assertions made in connection with the audit.",
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: "Fees for our services will be based on standard rates, plus out-of-pocket expenses. Invoices will be submitted as work progresses.",
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: "Please sign and return the attached copy of this letter to indicate your acknowledgment of, and agreement with, the arrangements for our audit of the financial statements.",
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: "Yours faithfully,",
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: "For Muralidhar & Associates",
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: "_________________________",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: "Partner",
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: "Acknowledged and Agreed:",
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: "_________________________",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: `For ${client.name}`,
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: `Date: ${date}`,
              }),
            ],
          }),
        ],
      },
    ],
  });
};

// Consent letter implementation
const createConsentLetter = (
  client: Client,
  date: string,
  cinNumber: string
): Document => {
  return new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            heading: HeadingLevel.HEADING_1,
            children: [
              new TextRun({
                text: "AUDITOR'S CONSENT LETTER",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "[Auditor's Letterhead]",
                italics: true,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: `Date: ${date}`,
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: "To," }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: "The Board of Directors," }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: `${client.name}` }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: `${client.address || "[Registered Address of the Company]"}` }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: `CIN: ${cinNumber}` }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({ text: "Dear Sir/Madam," }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: "Subject: Consent to act as Statutory Auditor under Section 139 of the Companies Act, 2013",
                bold: true,
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({
                text: `With reference to your intimation regarding my/our proposed appointment as the Statutory Auditor of ${client.name} in accordance with the provisions of Section 139 of the Companies Act, 2013 read with the rules made thereunder, I/we hereby give my/our consent to act as the Statutory Auditor of the Company, if appointed at the forthcoming Annual General Meeting/Extraordinary General Meeting of the Company.`,
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({
                text: "I/We confirm that:",
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({
                text: "I/We meet the eligibility criteria prescribed under Section 141 of the Companies Act, 2013.",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "I/We are not disqualified to be appointed as auditor under the provisions of the said Act.",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "The appointment, if made, shall be within the limits prescribed under Section 141(3)(g) of the Companies Act, 2013.",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "I/We are eligible to be appointed as an auditor of the company and are not disqualified under the Chartered Accountants Act, 1949 and the rules or regulations made thereunder.",
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Kindly take the above on record.",
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Thanking you,",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Yours faithfully,",
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({
                text: "For Muralidhar & Associates",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Chartered Accountants",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Firm Registration Number: XXXXXX",
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({
                text: "_________________________",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Partner",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Membership Number: XXXXXX",
              }),
            ],
          }),
        ],
      },
    ],
  });
};

// Audit plan implementation
const createAuditPlan = (
  client: Client,
  date: string,
  financialYearEnded: string,
  task?: Task
): Document => {
  return new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            heading: HeadingLevel.HEADING_1,
            children: [
              new TextRun({
                text: "AUDIT PLAN",
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({
                text: "Client Details",
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Client Name: ${client.name}`,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Entity Type: ${client.constitution?.charAt(0).toUpperCase() + client.constitution?.slice(1) || "Company"}`,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Financial Year Ending: ${financialYearEnded}`,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Industry: ${client.industry || "_________________"}`,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Engagement Partner: ${client.auditPartner || "_________________"}`,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Audit Team Members: ${client.assignmentStaff || "_________________"}`,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Date of Planning: ${date}`,
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({
                text: "1. Engagement Objectives",
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "To express an opinion on whether the financial statements give a true and fair view in accordance with the applicable financial reporting framework.",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "To identify and assess the risks of material misstatement.",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "To obtain sufficient and appropriate audit evidence.",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `${task ? `To perform ${task.typeOfService} for the client.` : "[Add specific objectives, e.g., checking compliance with specific statutes.]"}`,
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({
                text: "2. Understanding the Entity",
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Nature of Business: ${client.industry || "_________________"}`,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Key Business Processes: _______________________________",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Significant Changes During the Year: _____________________",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Internal Controls Summary: _____________________________",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Related Parties / Group Structure: _______________________",
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({
                text: "3. Risk Assessment",
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Inherent Risks: ${client.risk === "High" ? "High risk identified in key areas." : "Standard industry risks identified."}`,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Control Risks: To be assessed during fieldwork",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Fraud Risk Indicators: To be assessed during fieldwork",
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({
                text: "4. Materiality Levels",
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Planning Materiality: _________________________________",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Performance Materiality: _____________________________",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Threshold for Trivial Misstatements: _________________",
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({
                text: "5. Significant Accounts & Areas of Focus",
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Revenue: High - Substantive testing, Cut-off tests",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Purchases: Medium - Tests of controls, Substantive sampling",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Fixed Assets: Medium - Physical verification, Depreciation recalculation",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Loans & Borrowings: Low - External confirmations",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Provisions/Contingent Liabilities: High - Legal letters, Management representations",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "GST/Income Tax Compliance: High - Detailed compliance testing",
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({
                text: "6. Audit Strategy",
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Nature, Timing & Extent of Procedures:",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Interim testing: No",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Final audit procedures planned for: ${client.auditCompletionDate || "___________"}`,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Use of Sampling Techniques: Yes",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Use of Specialists (e.g., Valuers, Lawyers): No",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "IT Environment Assessment: Yes",
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({
                text: "7. Team Roles and Responsibilities",
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `${client.auditPartner || "___________________"} - Partner - Overall engagement supervision`,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Manager - Planning, risk assessment",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `${client.assignmentStaff || "___________________"} - Audit Assistant - Fieldwork, documentation`,
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({
                text: "8. Timeline",
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Client Communication: ${client.auditStartDate || "__________________"}`,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Fieldwork Start: ${client.auditStartDate || "__________________"}`,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Completion of Fieldwork: ${client.auditCompletionDate || "__________________"}`,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Review & Finalization: __________________",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Signing of Audit Report: __________________",
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({
                text: "9. Client Requirements",
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Trial Balance as on ___________",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Ledger & Sub-ledger Reports",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Fixed Asset Register",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Statutory Returns (GST, TDS, PF, etc.)",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "MOA, AOA / Partnership Deed / Trust Deed",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Minutes of Meetings, if applicable",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Previous year's audit report and financials",
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [
              new TextRun({
                text: "10. Sign-Off",
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Prepared By: ______________________",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Date: ${date}`,
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Reviewed By: ______________________",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Date: ___________",
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Approved By: ______________________",
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Date: ___________",
              }),
            ],
          }),
        ],
      },
    ],
  });
};
