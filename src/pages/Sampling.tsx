
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Sampling = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-audit-primary">Sampling Tools</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Audit Sampling</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This feature will provide tools for purchase register sampling, sales register sampling,
              related party transaction analysis, and other audit sampling procedures.
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Sampling;
