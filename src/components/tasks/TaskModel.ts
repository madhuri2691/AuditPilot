
export interface Task {
  id: string;
  name: string;
  client: string;
  assignee: string;
  status: "Not Started" | "In Progress" | "Review" | "Complete";
  progress: number;
  deadline: string;
  typeOfService?: string;
  sacCode?: string;
  description?: string;
}

export const INITIAL_TASK: Task = {
  id: '',
  name: '',
  client: '',
  assignee: '',
  status: 'Not Started',
  progress: 0,
  deadline: '',
  typeOfService: '',
  sacCode: '',
  description: ''
};

export interface InvoiceDetails {
  firmName: string;
  address: string;
  gstin: string;
  isIGST: boolean;
}

export const DEFAULT_INVOICE_DETAILS: InvoiceDetails = {
  firmName: "ABC & Associates",
  address: "Elamakkara",
  gstin: "32ABCDE1234E1Z",
  isIGST: false
};
