
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';
import { IndianRupee } from "lucide-react";

interface IncomeChartProps {
  data: {
    name: string;
    value: number;
  }[];
}

const IncomeChart = ({ data }: IncomeChartProps) => {
  // Custom tooltip for the bar chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover text-popover-foreground p-2 rounded-md shadow-md text-sm">
          <p className="font-medium">{label}</p>
          <div className="flex items-center mt-1">
            <IndianRupee className="h-3 w-3 mr-0.5" />
            <span>{payload[0].value.toLocaleString()}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="budget-card">
      <CardHeader>
        <CardTitle className="text-lg">Income Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          {data.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">No income data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis 
                  tick={{ fontSize: 12 }} 
                  tickFormatter={(value) => `₹${value}`} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="value" 
                  fill="#4CAF50" 
                  radius={[4, 4, 0, 0]} 
                  name="Income"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default IncomeChart;
