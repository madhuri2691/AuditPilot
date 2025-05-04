
export interface ChecklistItem {
  id: string;
  area: string;
  procedure: string;
  responsibility: string;
  timeline: string;
  isDone: boolean;
  remarks: string;
}

export interface AuditChecklist {
  id: string;
  taskId: string;
  taskName: string;
  clientName: string;
  type: "Tax Audit" | "Statutory Audit";
  items: ChecklistItem[];
  startDate: string;
  assessmentYear?: string;
  financialYear?: string;
}
