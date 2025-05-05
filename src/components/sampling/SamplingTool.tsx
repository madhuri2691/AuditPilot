
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/sampling/FileUpload";
import { SamplingConfig } from "@/components/sampling/SamplingConfig";
import { SampleResults } from "@/components/sampling/SampleResults";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

// Define transaction data structure
export interface TransactionItem {
  id: string;
  date: string;
  amount: number;
  description: string;
  vendor?: string;
  customer?: string;
  invoiceNumber?: string;
  category?: string;
  paymentMethod?: string;
}

export type SamplingModuleType = "purchase" | "sales" | "expense";

interface SamplingToolProps {
  moduleType: SamplingModuleType;
}

// Define sampling method types
export type SamplingMethod = "systematic" | "stratified" | "random" | "risk-based";

export interface SamplingToolProps {
  moduleType: SamplingModuleType;
}

export function SamplingTool({ moduleType }: SamplingToolProps) {
  const [transactionData, setTransactionData] = useState<TransactionItem[]>([]);
  const [selectedSamples, setSelectedSamples] = useState<TransactionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [samplingComplete, setSamplingComplete] = useState(false);
  
  // Handle data from file upload
  const handleDataUploaded = (data: TransactionItem[]) => {
    setTransactionData(data);
    setUploadComplete(true);
    setSamplingComplete(false);
    setSelectedSamples([]);
  };
  
  // Handle sampling configuration
  const handleSamplingComplete = (samples: TransactionItem[]) => {
    setSelectedSamples(samples);
    setSamplingComplete(true);
    toast.success(`Selected ${samples.length} samples out of ${transactionData.length} transactions`);
  };

  // Get module title
  const getModuleTitle = () => {
    switch (moduleType) {
      case "purchase": return "Purchase";
      case "sales": return "Sales";
      case "expense": return "Expense";
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{getModuleTitle()} Sampling Tool</CardTitle>
          <CardDescription>
            Upload transaction data, configure sampling parameters, and generate audit samples.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!uploadComplete ? (
            <FileUpload 
              moduleType={moduleType} 
              onDataUploaded={handleDataUploaded} 
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          ) : !samplingComplete ? (
            <SamplingConfig 
              data={transactionData}
              moduleType={moduleType}
              onSamplingComplete={handleSamplingComplete}
              onReset={() => setUploadComplete(false)}
            />
          ) : (
            <SampleResults 
              samples={selectedSamples} 
              totalTransactions={transactionData.length}
              totalValue={transactionData.reduce((sum, item) => sum + item.amount, 0)}
              moduleType={moduleType}
              onResetConfig={() => setSamplingComplete(false)}
              onFullReset={() => {
                setUploadComplete(false);
                setSamplingComplete(false);
              }}
            />
          )}
        </CardContent>
      </Card>
      
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          This sampling tool allows you to generate audit samples using various statistical methods. 
          For a complete implementation, you would define your sampling parameters including related parties, 
          and download the sampling results as an Excel workpaper.
        </AlertDescription>
      </Alert>
    </div>
  );
}
