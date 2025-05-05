
import * as XLSX from 'xlsx';
import { toast } from "sonner";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { TrialBalanceItem } from '@/pages/FinancialAnalysis';

// Type declaration for jsPDF-autotable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

/**
 * Export data to Excel format
 */
export const exportToExcel = (
  mainData: Record<string, any>[],
  summaryData: Record<string, any>[],
  fileName: string
) => {
  try {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    
    // Create Trial Balance Analysis worksheet
    const worksheet = XLSX.utils.json_to_sheet(mainData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Trial Balance Analysis");
    
    // Create Summary worksheet
    const summaryWorksheet = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summaryWorksheet, "Summary");
    
    // Set column widths for better readability
    worksheet['!cols'] = [
      { wch: 15 }, // Account Code
      { wch: 30 }, // Account Description
      { wch: 15 }, // Current Year Balance
      { wch: 15 }, // Prior Year Balance
      { wch: 15 }, // Variance (₹)
      { wch: 15 }, // Variance (%)
      { wch: 10 }, // Flag
      { wch: 40 }, // Notes
      { wch: 15 }, // Requires Follow-up
    ];
    
    // Apply additional formatting (would require more complex Excel libraries for full formatting)
    
    // Generate the Excel file
    XLSX.writeFile(workbook, `${fileName}-${new Date().toISOString().split('T')[0]}.xlsx`);
    
    return true;
  } catch (error) {
    console.error("Error exporting to Excel:", error);
    toast.error("Failed to export to Excel");
    return false;
  }
};

/**
 * Export data to PDF format
 */
export const exportToPdf = (
  data: TrialBalanceItem[],
  notesByAccount: Record<string, string>,
  followUpByAccount: Record<string, boolean>,
  summaryStats: {
    totalAccounts: number;
    totalCurrentYearBalance: number;
    totalPriorYearBalance: number;
    totalVariance: number;
    flaggedItems: number;
    significantItems: number;
    moderateItems: number;
  },
  fileName: string
) => {
  try {
    // Create a new PDF document
    const doc = new jsPDF('l', 'mm', 'a4');
    
    // Add title
    doc.setFontSize(18);
    doc.text('Trial Balance Analysis Report', 14, 20);
    
    // Add date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 26);
    
    // Add summary statistics
    doc.setFontSize(12);
    doc.text('Summary Statistics', 14, 35);
    
    const formatCurrency = (value: number) => {
      return new Intl.NumberFormat('en-IN', { 
        style: 'currency', 
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(value);
    };
    
    const summaryData = [
      ['Total Accounts', summaryStats.totalAccounts.toString()],
      ['Current Year Total', formatCurrency(summaryStats.totalCurrentYearBalance)],
      ['Prior Year Total', formatCurrency(summaryStats.totalPriorYearBalance)],
      ['Total Variance', formatCurrency(summaryStats.totalVariance)],
      ['Flagged Items', summaryStats.flaggedItems.toString()],
      ['- Significant Variances', summaryStats.significantItems.toString()],
      ['- Moderate Variances', summaryStats.moderateItems.toString()]
    ];
    
    // Add summary table
    doc.autoTable({
      startY: 40,
      head: [['Metric', 'Value']],
      body: summaryData,
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] },
      margin: { left: 14, right: 14 }
    });
    
    // Add main data table
    const tableData = data.map(item => [
      item.accountCode,
      item.accountDescription.length > 20 ? item.accountDescription.substring(0, 20) + '...' : item.accountDescription,
      formatCurrency(item.currentYearBalance),
      formatCurrency(item.priorYearBalance),
      formatCurrency(item.variance),
      `${item.variancePercentage.toFixed(2)}%`,
      item.flag !== 'none' ? (item.flag === 'significant' ? '🔴' : '⚠️') : '',
      notesByAccount[item.accountCode] || '',
      followUpByAccount[item.accountCode] ? 'Yes' : 'No'
    ]);
    
    doc.autoTable({
      startY: (doc as any).lastAutoTable.finalY + 15,
      head: [['Code', 'Description', 'Current Year', 'Prior Year', 'Variance (₹)', 'Variance (%)', 'Flag', 'Notes', 'Follow-up']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] },
      margin: { left: 14, right: 14 },
      columnStyles: {
        0: { cellWidth: 20 }, // Account Code
        1: { cellWidth: 40 }, // Description
        2: { cellWidth: 25 }, // Current Year
        3: { cellWidth: 25 }, // Prior Year
        4: { cellWidth: 25 }, // Variance
        5: { cellWidth: 20 }, // Percentage
        6: { cellWidth: 15 }, // Flag
        7: { cellWidth: 50 }, // Notes
        8: { cellWidth: 20 }, // Follow-up
      }
    });
    
    // Save the PDF
    doc.save(`${fileName}-${new Date().toISOString().split('T')[0]}.pdf`);
    
    return true;
  } catch (error) {
    console.error("Error exporting to PDF:", error);
    toast.error("Failed to export to PDF");
    return false;
  }
};
