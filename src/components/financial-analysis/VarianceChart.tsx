
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrialBalanceItem } from "@/pages/FinancialAnalysis";

interface VarianceChartProps {
  data: TrialBalanceItem[];
}

export function VarianceChart({ data }: VarianceChartProps) {
  // Filter to the top 10 items by variance amount (absolute value)
  const chartData = [...data]
    .sort((a, b) => Math.abs(b.variance) - Math.abs(a.variance))
    .slice(0, 10)
    .map(item => ({
      name: item.accountDescription.length > 15 
        ? item.accountDescription.slice(0, 15) + '...' 
        : item.accountDescription,
      currentYear: item.currentYearBalance,
      priorYear: item.priorYearBalance,
      variance: item.variance,
      accountCode: item.accountCode
    }));
  
  // Prepare data for percentage chart
  const percentageData = [...data]
    .filter(item => item.priorYearBalance !== 0)
    .sort((a, b) => Math.abs(b.variancePercentage) - Math.abs(a.variancePercentage))
    .slice(0, 10)
    .map(item => ({
      name: item.accountDescription.length > 15 
        ? item.accountDescription.slice(0, 15) + '...' 
        : item.accountDescription,
      percentage: item.variancePercentage,
      accountCode: item.accountCode
    }));

  // Format currency for the tooltip
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Custom tooltip for amount chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border p-2 rounded-md shadow">
          <p className="font-medium">{label}</p>
          <p className="text-sm">Current Year: {formatCurrency(payload[0].value)}</p>
          <p className="text-sm">Prior Year: {formatCurrency(payload[1].value)}</p>
          <p className="text-sm font-medium">
            Variance: {formatCurrency(payload[2].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for percentage chart
  const PercentageTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border p-2 rounded-md shadow">
          <p className="font-medium">{label}</p>
          <p className="text-sm font-medium">
            Variance: {payload[0].value.toFixed(2)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Top 10 Accounts by Variance Amount</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 30, bottom: 70 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end"
                  height={70}
                />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="currentYear" name="Current Year" fill="#4f46e5" />
                <Bar dataKey="priorYear" name="Prior Year" fill="#64748b" />
                <Bar dataKey="variance" name="Variance" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top 10 Accounts by Variance Percentage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={percentageData}
                margin={{ top: 20, right: 30, left: 30, bottom: 70 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end"
                  height={70}
                />
                <YAxis unit="%" />
                <Tooltip content={<PercentageTooltip />} />
                <Legend />
                <Bar 
                  dataKey="percentage" 
                  name="Variance %" 
                  fill="#4f46e5" 
                  // Set bar fill color based on positive/negative values
                  fill={(entry) => entry.percentage >= 0 ? "#22c55e" : "#ef4444"}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
