
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Sparkles } from "lucide-react";
import { IndianRupee } from "lucide-react";

interface FutureInsightsProps {
  profileType: string;
  currentSavings: number;
  monthlyIncome: number;
  monthlyExpenses: number;
}

const FutureInsights = ({ profileType, currentSavings, monthlyIncome, monthlyExpenses }: FutureInsightsProps) => {
  // Calculate projected savings over the next 12 months
  const monthlySavings = monthlyIncome - monthlyExpenses;
  const projectionData = Array.from({ length: 12 }, (_, i) => {
    const month = new Date();
    month.setMonth(month.getMonth() + i + 1);
    
    // Estimated savings projection based on the profile type
    let growthRate = 0;
    switch (profileType) {
      case 'business':
        growthRate = 0.05; // Higher growth rate for business owners
        break;
      case 'salary':
        growthRate = 0.025; // Medium growth for salary employees
        break;
      case 'student':
        growthRate = 0.015; // Lower growth for students
        break;
      case 'housewife':
        growthRate = 0.02; // Medium-low growth for housewives
        break;
      default:
        growthRate = 0.02;
    }
    
    const projectedSavings = currentSavings + monthlySavings * (i + 1) * (1 + growthRate * i);
    
    return {
      name: month.toLocaleString('default', { month: 'short' }),
      savings: Math.round(projectedSavings)
    };
  });
  
  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover text-popover-foreground p-2 rounded-md shadow-md text-sm">
          <p className="font-medium">{label}</p>
          <div className="flex items-center mt-1">
            <span className="mr-2">Projected Savings:</span>
            <span className="flex items-center font-semibold">
              <IndianRupee className="h-3 w-3 mr-0.5" />
              {payload[0].value.toLocaleString()}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };
  
  // Get personalized insights based on user profile
  const getInsight = () => {
    const savingsRatio = monthlySavings / monthlyIncome;
    
    if (savingsRatio < 0.1) {
      return {
        icon: <TrendingDown className="h-5 w-5 text-budget-red" />,
        text: "Your current saving rate is low. Consider reducing non-essential expenses."
      };
    } else if (savingsRatio >= 0.1 && savingsRatio < 0.2) {
      return {
        icon: <TrendingUp className="h-5 w-5 text-budget-yellow" />,
        text: "You're saving, but aim to increase your rate to at least 20% of income."
      };
    } else {
      return {
        icon: <Sparkles className="h-5 w-5 text-budget-green" />,
        text: "Great saving habits! You're on track to build substantial wealth."
      };
    }
  };
  
  const insight = getInsight();
  
  return (
    <Card className="budget-card">
      <CardHeader>
        <CardTitle className="text-lg">Future Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 rounded-lg bg-muted/50 flex items-start gap-3">
          {insight.icon}
          <p className="text-sm">{insight.text}</p>
        </div>
        
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={projectionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis 
                tick={{ fontSize: 12 }} 
                tickFormatter={(value) => `₹${value/1000}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="savings"
                stroke="#673AB7"
                fill="#ede7f6"
                name="Projected Savings"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default FutureInsights;
