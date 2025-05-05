
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUpload } from "@/components/financial-analysis/FileUpload";
import { TrialBalanceAnalysis } from "@/components/financial-analysis/TrialBalanceAnalysis";
import { toast } from "sonner";

// Define data structure for trial balance items
export interface TrialBalanceItem {
  accountCode: string;
  accountDescription: string;
  currentYearBalance: number;
  priorYearBalance: number;
  variance: number;
  variancePercentage: number;
  flag: "none" | "moderate" | "significant";
}

const FinancialAnalysis = () => {
  const [trialBalanceData, setTrialBalanceData] = useState<TrialBalanceItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDataProcessed, setIsDataProcessed] = useState<boolean>(false);
  const [materialityThreshold, setMaterialityThreshold] = useState<number>(10); // Default 10%
  const [significantThreshold, setSignificantThreshold] = useState<number>(25); // Default 25%
  
  // Handle the processed data from FileUpload component
  const handleProcessedData = (data: TrialBalanceItem[]) => {
    if (!data.length) {
      toast.error("No valid data could be processed");
      return;
    }
    
    // Apply materiality thresholds to flag variances
    const flaggedData = data.map(item => {
      const absPercentage = Math.abs(item.variancePercentage);
      let flag: "none" | "moderate" | "significant" = "none";
      
      if (absPercentage >= significantThreshold) {
        flag = "significant";
      } else if (absPercentage >= materialityThreshold) {
        flag = "moderate";
      }
      
      return { ...item, flag };
    });
    
    setTrialBalanceData(flaggedData);
    setIsDataProcessed(true);
    toast.success(`Successfully processed ${flaggedData.length} trial balance items`);
  };

  // Handle materiality threshold changes
  const handleMaterialityChange = (value: number) => {
    setMaterialityThreshold(value);
    
    // Re-apply flags based on new threshold
    if (trialBalanceData.length > 0) {
      const updatedData = trialBalanceData.map(item => {
        const absPercentage = Math.abs(item.variancePercentage);
        let flag: "none" | "moderate" | "significant" = "none";
        
        if (absPercentage >= significantThreshold) {
          flag = "significant";
        } else if (absPercentage >= value) {
          flag = "moderate";
        }
        
        return { ...item, flag };
      });
      
      setTrialBalanceData(updatedData);
    }
  };

  // Handle significant threshold changes
  const handleSignificantChange = (value: number) => {
    setSignificantThreshold(value);
    
    // Re-apply flags based on new threshold
    if (trialBalanceData.length > 0) {
      const updatedData = trialBalanceData.map(item => {
        const absPercentage = Math.abs(item.variancePercentage);
        let flag: "none" | "moderate" | "significant" = "none";
        
        if (absPercentage >= value) {
          flag = "significant";
        } else if (absPercentage >= materialityThreshold) {
          flag = "moderate";
        }
        
        return { ...item, flag };
      });
      
      setTrialBalanceData(updatedData);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-audit-primary">Financial Analysis</h1>
        </div>

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="upload">Upload & Process</TabsTrigger>
            <TabsTrigger value="analysis" disabled={!isDataProcessed}>Analysis & Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle>Trial Balance Upload</CardTitle>
              </CardHeader>
              <CardContent>
                <FileUpload 
                  onDataProcessed={handleProcessedData}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analysis">
            <TrialBalanceAnalysis 
              data={trialBalanceData} 
              materialityThreshold={materialityThreshold}
              significantThreshold={significantThreshold}
              onMaterialityChange={handleMaterialityChange}
              onSignificantChange={handleSignificantChange}
            />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default FinancialAnalysis;
