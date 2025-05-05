
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Download, FileExcel, FilePdf, BarChart } from "lucide-react";
import { TrialBalanceItem } from "@/pages/FinancialAnalysis";
import { toast } from "sonner";
import { VarianceChart } from "./VarianceChart";
import { exportToExcel, exportToPdf } from "@/utils/exportUtils";

interface TrialBalanceAnalysisProps {
  data: TrialBalanceItem[];
  materialityThreshold: number;
  significantThreshold: number;
  onMaterialityChange: (value: number) => void;
  onSignificantChange: (value: number) => void;
}

export function TrialBalanceAnalysis({ 
  data, 
  materialityThreshold, 
  significantThreshold,
  onMaterialityChange,
  onSignificantChange
}: TrialBalanceAnalysisProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [notesByAccount, setNotesByAccount] = useState<Record<string, string>>({});
  const [followUpByAccount, setFollowUpByAccount] = useState<Record<string, boolean>>({});
  
  // Calculate summary statistics
  const summaryStats = {
    totalAccounts: data.length,
    totalCurrentYearBalance: data.reduce((sum, item) => sum + item.currentYearBalance, 0),
    totalPriorYearBalance: data.reduce((sum, item) => sum + item.priorYearBalance, 0),
    totalVariance: data.reduce((sum, item) => sum + item.variance, 0),
    flaggedItems: data.filter(item => item.flag !== "none").length,
    significantItems: data.filter(item => item.flag === "significant").length,
    moderateItems: data.filter(item => item.flag === "moderate").length
  };
  
  // Find top variances by amount
  const topVariancesByAmount = [...data]
    .sort((a, b) => Math.abs(b.variance) - Math.abs(a.variance))
    .slice(0, 5);
  
  // Find top variances by percentage
  const topVariancesByPercentage = [...data]
    .filter(item => item.priorYearBalance !== 0) // Avoid infinite percentages
    .sort((a, b) => Math.abs(b.variancePercentage) - Math.abs(a.variancePercentage))
    .slice(0, 5);
  
  // Filter data based on search term
  const filteredData = data.filter(item => 
    item.accountCode.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.accountDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Update note for an account
  const handleNoteChange = (accountCode: string, note: string) => {
    setNotesByAccount(prev => ({
      ...prev,
      [accountCode]: note
    }));
  };
  
  // Toggle follow-up status for an account
  const handleFollowUpToggle = (accountCode: string) => {
    setFollowUpByAccount(prev => ({
      ...prev,
      [accountCode]: !prev[accountCode]
    }));
  };
  
  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    }).format(value);
  };
  
  // Get flag icon based on flag value
  const getFlagIcon = (flag: "none" | "moderate" | "significant") => {
    switch (flag) {
      case "moderate": return <Badge className="bg-yellow-500">⚠️</Badge>;
      case "significant": return <Badge className="bg-red-500">🔴</Badge>;
      default: return <Badge className="bg-green-500">✓</Badge>;
    }
  };
  
  // Calculate the percentage of explained variance items
  const explainedItems = Object.keys(notesByAccount).length;
  const explainedPercentage = data.length > 0 
    ? Math.round((explainedItems / summaryStats.flaggedItems) * 100) || 0
    : 0;
  
  // Export functions
  const handleExportToExcel = () => {
    // Prepare data for export
    const exportData = data.map(item => ({
      'Account Code': item.accountCode,
      'Account Description': item.accountDescription,
      'Current Year Balance': item.currentYearBalance,
      'Prior Year Balance': item.priorYearBalance,
      'Variance (₹)': item.variance,
      'Variance (%)': `${item.variancePercentage.toFixed(2)}%`,
      'Flag': item.flag,
      'Notes': notesByAccount[item.accountCode] || '',
      'Requires Follow-up': followUpByAccount[item.accountCode] ? 'Yes' : 'No'
    }));
    
    const summaryData = [
      { 'Summary': 'Total Accounts', 'Value': summaryStats.totalAccounts },
      { 'Summary': 'Total Current Year Balance', 'Value': summaryStats.totalCurrentYearBalance },
      { 'Summary': 'Total Prior Year Balance', 'Value': summaryStats.totalPriorYearBalance },
      { 'Summary': 'Total Variance', 'Value': summaryStats.totalVariance },
      { 'Summary': 'Flagged Items', 'Value': summaryStats.flaggedItems },
      { 'Summary': 'Explanation Completion', 'Value': `${explainedPercentage}%` }
    ];
    
    exportToExcel(exportData, summaryData, 'Trial_Balance_Analysis');
    toast.success("Excel file downloaded successfully");
  };
  
  const handleExportToPdf = () => {
    exportToPdf(data, notesByAccount, followUpByAccount, summaryStats, 'Trial_Balance_Analysis');
    toast.success("PDF file downloaded successfully");
  };

  return (
    <div className="space-y-6">
      {/* Summary statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Variance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm text-muted-foreground">Total Accounts</p>
              <p className="text-2xl font-bold">{summaryStats.totalAccounts}</p>
            </div>
            
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm text-muted-foreground">Total Variance</p>
              <p className="text-2xl font-bold">{formatCurrency(summaryStats.totalVariance)}</p>
            </div>
            
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm text-muted-foreground">Flagged Items</p>
              <p className="text-2xl font-bold">{summaryStats.flaggedItems}</p>
            </div>
            
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm text-muted-foreground">Explanation Completion</p>
              <p className="text-2xl font-bold">{explainedPercentage}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Materiality thresholds */}
      <Card>
        <CardHeader>
          <CardTitle>Materiality Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label>Moderate Variance Threshold ({materialityThreshold}%)</Label>
              <div className="flex items-center space-x-4">
                <Slider 
                  min={1} 
                  max={50} 
                  step={1} 
                  value={[materialityThreshold]}
                  onValueChange={(values) => onMaterialityChange(values[0])}
                />
                <Input 
                  type="number" 
                  className="w-20" 
                  value={materialityThreshold} 
                  onChange={(e) => onMaterialityChange(Number(e.target.value))}
                  min={1}
                  max={50}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <Label>Significant Variance Threshold ({significantThreshold}%)</Label>
              <div className="flex items-center space-x-4">
                <Slider 
                  min={1} 
                  max={100} 
                  step={1} 
                  value={[significantThreshold]}
                  onValueChange={(values) => onSignificantChange(values[0])}
                />
                <Input 
                  type="number" 
                  className="w-20" 
                  value={significantThreshold} 
                  onChange={(e) => onSignificantChange(Number(e.target.value))}
                  min={1}
                  max={100}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Analysis tabs */}
      <Tabs defaultValue="table">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="table">Detailed Analysis</TabsTrigger>
          <TabsTrigger value="chart">Variance Chart</TabsTrigger>
        </TabsList>
        
        <TabsContent value="table">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Trial Balance Comparison</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleExportToExcel} className="gap-2">
                  <FileExcel size={16} />
                  Export to Excel
                </Button>
                <Button variant="outline" onClick={handleExportToPdf} className="gap-2">
                  <FilePdf size={16} />
                  Export to PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  placeholder="Search by account code or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-md"
                />
                
                <div className="border rounded-md overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Account Code</TableHead>
                        <TableHead className="w-[250px]">Description</TableHead>
                        <TableHead className="w-[150px]">Current Year</TableHead>
                        <TableHead className="w-[150px]">Prior Year</TableHead>
                        <TableHead className="w-[150px]">Variance (₹)</TableHead>
                        <TableHead className="w-[100px]">Variance (%)</TableHead>
                        <TableHead className="w-[80px]">Flag</TableHead>
                        <TableHead className="w-[250px]">Notes</TableHead>
                        <TableHead className="w-[120px]">Follow-up</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.length > 0 ? (
                        filteredData.map((item) => (
                          <TableRow key={item.accountCode}>
                            <TableCell>{item.accountCode}</TableCell>
                            <TableCell>{item.accountDescription}</TableCell>
                            <TableCell>{formatCurrency(item.currentYearBalance)}</TableCell>
                            <TableCell>{formatCurrency(item.priorYearBalance)}</TableCell>
                            <TableCell 
                              className={item.variance > 0 ? "text-green-600" : item.variance < 0 ? "text-red-600" : ""}
                            >
                              {formatCurrency(item.variance)}
                            </TableCell>
                            <TableCell 
                              className={item.variancePercentage > 0 ? "text-green-600" : item.variancePercentage < 0 ? "text-red-600" : ""}
                            >
                              {item.variancePercentage.toFixed(2)}%
                            </TableCell>
                            <TableCell>{getFlagIcon(item.flag)}</TableCell>
                            <TableCell>
                              <Input 
                                placeholder="Add explanation..."
                                value={notesByAccount[item.accountCode] || ""}
                                onChange={(e) => handleNoteChange(item.accountCode, e.target.value)}
                                className="h-8 text-xs"
                              />
                            </TableCell>
                            <TableCell>
                              <Button 
                                size="sm" 
                                variant={followUpByAccount[item.accountCode] ? "destructive" : "outline"}
                                onClick={() => handleFollowUpToggle(item.accountCode)}
                                className="h-8 w-full"
                              >
                                {followUpByAccount[item.accountCode] ? "Required" : "Mark"}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-4">
                            No items match your search criteria
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="chart">
          <VarianceChart data={data} />
        </TabsContent>
      </Tabs>
      
      {/* Top variances */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Variances by Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Variance (₹)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topVariancesByAmount.map((item) => (
                  <TableRow key={item.accountCode}>
                    <TableCell>{item.accountCode}</TableCell>
                    <TableCell>{item.accountDescription}</TableCell>
                    <TableCell 
                      className={item.variance > 0 ? "text-green-600" : "text-red-600"}
                    >
                      {formatCurrency(item.variance)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Top Variances by Percentage</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Variance (%)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topVariancesByPercentage.map((item) => (
                  <TableRow key={item.accountCode}>
                    <TableCell>{item.accountCode}</TableCell>
                    <TableCell>{item.accountDescription}</TableCell>
                    <TableCell 
                      className={item.variancePercentage > 0 ? "text-green-600" : "text-red-600"}
                    >
                      {item.variancePercentage.toFixed(2)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
