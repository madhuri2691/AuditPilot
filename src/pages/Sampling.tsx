
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SamplingTool } from "@/components/sampling/SamplingTool";

// Define the types of sampling modules
type SamplingModuleType = "purchase" | "sales" | "expense";

const Sampling = () => {
  const [activeModule, setActiveModule] = useState<SamplingModuleType>("purchase");

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-audit-primary">Sampling Tools</h1>
        </div>

        <Tabs 
          value={activeModule} 
          onValueChange={(value) => setActiveModule(value as SamplingModuleType)}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="purchase">Purchase Sampling</TabsTrigger>
            <TabsTrigger value="sales">Sales Sampling</TabsTrigger>
            <TabsTrigger value="expense">Expense Sampling</TabsTrigger>
          </TabsList>
          
          <TabsContent value="purchase">
            <SamplingTool moduleType="purchase" />
          </TabsContent>
          
          <TabsContent value="sales">
            <SamplingTool moduleType="sales" />
          </TabsContent>
          
          <TabsContent value="expense">
            <SamplingTool moduleType="expense" />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Sampling;
