import { Client } from "@/services/clientService";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface ClientsListProps {
  clients: Client[];
  onDelete?: (id: string) => void;
}

export function ClientsList({ clients, onDelete }: ClientsListProps) {
  return (
    <div className="w-full">
      <Table>
        <TableCaption>A list of your clients.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Risk</TableHead>
            <TableHead>Fiscal Year End</TableHead>
            <TableHead>Contact Person</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="font-medium">{client.name}</TableCell>
              <TableCell>{client.industry}</TableCell>
              <TableCell>{client.status}</TableCell>
              <TableCell>{client.risk}</TableCell>
              <TableCell>{client.fiscalYearEnd}</TableCell>
              <TableCell>{client.contactPerson}</TableCell>
              <TableCell className="text-right">
                <button 
                  className="text-red-500 hover:text-red-700"
                  onClick={() => onDelete && onDelete(client.id || '')}
                >
                  Delete
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={7}>
              {clients.length} client(s) in total
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}

export type { Client };
