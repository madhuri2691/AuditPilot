
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FinancialAnalysis = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-audit-primary">Financial Analysis</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Financial Analysis Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This feature will include trial balance level variance analysis, financial ratio analysis, 
              and other financial analysis tools to assist with audit procedures.
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default FinancialAnalysis;
