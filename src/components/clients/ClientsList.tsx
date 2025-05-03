
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export interface Client {
  id: string;
  name: string;
  industry: string;
  status: "Active" | "Completed" | "On Hold";
  risk: "High" | "Medium" | "Low";
  fiscalYearEnd: string;
  contactPerson: string;
  email?: string;
  phone?: string;
  address?: string;
  constitution?: string;
  auditFee?: string;
  engagementType?: string;
  auditStartDate?: string;
  auditCompletionDate?: string;
  assignmentStaff?: string;
  auditPartner?: string;
}

const clients: Client[] = [
  {
    id: "1",
    name: "ABC Corporation",
    industry: "Manufacturing",
    status: "Active",
    risk: "Medium",
    fiscalYearEnd: "Dec 31",
    contactPerson: "John Smith"
  },
  {
    id: "2",
    name: "XYZ Industries",
    industry: "Technology",
    status: "Active",
    risk: "High",
    fiscalYearEnd: "Jun 30",
    contactPerson: "Jane Doe"
  },
  {
    id: "3",
    name: "Acme Ltd",
    industry: "Retail",
    status: "Completed",
    risk: "Low",
    fiscalYearEnd: "Mar 31",
    contactPerson: "Robert Johnson"
  },
  {
    id: "4",
    name: "Global Services Inc",
    industry: "Services",
    status: "Active",
    risk: "Medium",
    fiscalYearEnd: "Dec 31",
    contactPerson: "Sarah Williams"
  },
  {
    id: "5",
    name: "Tech Solutions",
    industry: "Technology",
    status: "On Hold",
    risk: "High",
    fiscalYearEnd: "Jun 30",
    contactPerson: "Mike Brown"
  }
];

export function ClientsList() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Industry</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Risk</TableHead>
          <TableHead>Fiscal Year End</TableHead>
          <TableHead>Contact Person</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients.map((client) => (
          <TableRow key={client.id}>
            <TableCell className="font-medium">{client.name}</TableCell>
            <TableCell>{client.industry}</TableCell>
            <TableCell>
              <Badge
                variant={
                  client.status === "Active"
                    ? "default"
                    : client.status === "Completed"
                    ? "secondary"
                    : "outline"
                }
              >
                {client.status}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  client.risk === "High"
                    ? "destructive"
                    : client.risk === "Medium"
                    ? "secondary"
                    : "outline"
                }
              >
                {client.risk}
              </Badge>
            </TableCell>
            <TableCell>{client.fiscalYearEnd}</TableCell>
            <TableCell>{client.contactPerson}</TableCell>
            <TableCell>
              <Button variant="ghost" size="icon">
                <ArrowRight size={16} />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
