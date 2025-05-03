
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Calendar = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-audit-primary">Calendar</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Audit Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This feature will allow you to view and manage deadlines, milestones, and scheduled tasks in a calendar format.
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Calendar;
