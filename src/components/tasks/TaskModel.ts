
export interface Task {
  id: string;
  name: string;
  client: string;
  client_id?: string;
  assignee: string;
  assignee_id?: string;
  status: "Not Started" | "In Progress" | "Review" | "Complete";
  progress: number;
  deadline: string;
  typeOfService?: string;
  type_of_service?: string;
  sacCode?: string;
  sac_code?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
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
