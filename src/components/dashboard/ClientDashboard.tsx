
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Client } from "@/components/clients/ClientsList";
import { ArrowRight, Filter, Search } from "lucide-react";
import { Link } from "react-router-dom";

interface ClientDashboardProps {
  clients: Client[];
}

export function ClientDashboard({ clients }: ClientDashboardProps) {
  const [filteredClients, setFilteredClients] = useState<Client[]>(clients);
  const [search, setSearch] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [feeFilter, setFeeFilter] = useState("all");
  const [yearEndFilter, setYearEndFilter] = useState("all");

  // Get unique industries, statuses, and fiscal year ends for filter options
  const industries = Array.from(new Set(clients.map(client => client.industry)));
  const statuses = Array.from(new Set(clients.map(client => client.status)));
  const fiscalYearEnds = Array.from(new Set(clients.map(client => client.fiscalYearEnd)));

  // Fee range options
  const feeRanges = [
    { label: "Up to ₹100,000", min: 0, max: 100000 },
    { label: "₹100,000 - ₹200,000", min: 100000, max: 200000 },
    { label: "₹200,000 - ₹300,000", min: 200000, max: 300000 },
    { label: "Above ₹300,000", min: 300000, max: Infinity },
  ];

  // Apply filters
  const applyFilters = () => {
    let result = clients;
    
    // Apply search filter
    if (search) {
      result = result.filter(client => 
        client.name.toLowerCase().includes(search.toLowerCase()) || 
        client.contactPerson.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Apply industry filter
    if (industryFilter !== "all") {
      result = result.filter(client => client.industry === industryFilter);
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(client => client.status === statusFilter);
    }
    
    // Apply fee filter
    if (feeFilter !== "all") {
      const range = feeRanges.find(r => r.label === feeFilter);
      if (range) {
        result = result.filter(client => {
          // Remove non-numeric characters and convert to number
          const feeValue = parseFloat(client.auditFee?.replace(/[^\d.]/g, '') || "0");
          return feeValue >= range.min && feeValue <= range.max;
        });
      }
    }
    
    // Apply fiscal year end filter
    if (yearEndFilter !== "all") {
      result = result.filter(client => client.fiscalYearEnd === yearEndFilter);
    }
    
    setFilteredClients(result);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearch("");
    setIndustryFilter("all");
    setStatusFilter("all");
    setFeeFilter("all");
    setYearEndFilter("all");
    setFilteredClients(clients);
  };

  // Apply filters whenever any filter changes
  const handleFilterChange = () => {
    applyFilters();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center pb-3">
        <CardTitle>Client List</CardTitle>
        <Link to="/clients">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            Manage Clients <ArrowRight size={16} />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clients..."
                className="pl-9"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  handleFilterChange();
                }}
              />
            </div>
            <div>
              <Select 
                value={industryFilter} 
                onValueChange={(value) => {
                  setIndustryFilter(value);
                  handleFilterChange();
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  {industries.map(industry => (
                    <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select 
                value={statusFilter} 
                onValueChange={(value) => {
                  setStatusFilter(value);
                  handleFilterChange();
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {statuses.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select 
                value={feeFilter} 
                onValueChange={(value) => {
                  setFeeFilter(value);
                  handleFilterChange();
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Fee Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Fee Ranges</SelectItem>
                  {feeRanges.map(range => (
                    <SelectItem key={range.label} value={range.label}>{range.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select 
                value={yearEndFilter} 
                onValueChange={(value) => {
                  setYearEndFilter(value);
                  handleFilterChange();
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Year End" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Year Ends</SelectItem>
                  {fiscalYearEnds.map(yearEnd => (
                    <SelectItem key={yearEnd} value={yearEnd}>{yearEnd}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-6 flex justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={resetFilters}
              >
                <Filter size={16} /> Reset Filters
              </Button>
            </div>
          </div>
          
          {/* Client List Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Fiscal Year End</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Audit Fee</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => (
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
                    <TableCell>{client.auditFee}</TableCell>
                    <TableCell className="text-right">
                      <Link to={`/clients/${client.id}`}>
                        <Button variant="ghost" size="icon">
                          <ArrowRight size={16} />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6">
                    No clients found matching your filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
