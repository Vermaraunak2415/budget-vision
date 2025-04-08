
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { IndianRupee } from "lucide-react";

interface ExpenseData {
  name: string;
  value: number;
  color: string;
}

interface ExpensePieChartProps {
  data: ExpenseData[];
}

const ExpensePieChart = ({ data }: ExpensePieChartProps) => {
  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover text-popover-foreground p-2 rounded-md shadow-md text-sm">
          <p className="font-medium">{payload[0].name}</p>
          <div className="flex items-center mt-1">
            <IndianRupee className="h-3 w-3 mr-0.5" />
            <span className="mr-1">{payload[0].value.toLocaleString()}</span>
            <span>({payload[0].payload.percentage}%)</span>
          </div>
        </div>
      );
    }
    return null;
  };

  // Calculate total to compute percentage
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // Add percentage to data
  const dataWithPercentage = data.map(item => ({
    ...item,
    percentage: ((item.value / total) * 100).toFixed(1)
  }));
  
  return (
    <Card className="budget-card">
      <CardHeader>
        <CardTitle className="text-lg">Expense Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dataWithPercentage}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {dataWithPercentage.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend 
                layout="vertical" 
                verticalAlign="middle" 
                align="right"
                formatter={(value, entry: any) => (
                  <span className="text-xs">
                    {value} ({entry.payload.percentage}%)
                  </span>
                )} 
              />
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpensePieChart;
