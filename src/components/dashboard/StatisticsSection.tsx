
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { TrendingUp, Sparkles, IndianRupee, AlertCircle } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Transaction {
  id: string;
  name: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  category: string;
}

interface StatisticsSectionProps {
  transactions: Transaction[];
  monthlyIncome: number;
  monthlyExpenses: number;
}

const StatisticsSection = ({ transactions, monthlyIncome, monthlyExpenses }: StatisticsSectionProps) => {
  const [timeframe, setTimeframe] = useState<'week' | 'month'>('week');
  
  // Calculate potential savings based on category analysis
  const calculatePotentialSavings = () => {
    // Group expenses by category
    const expensesByCategory: Record<string, number> = {};
    transactions
      .filter(tx => tx.type === 'expense')
      .forEach(tx => {
        expensesByCategory[tx.category] = (expensesByCategory[tx.category] || 0) + tx.amount;
      });
    
    // Calculate potential savings (for this demo, assume we can save 15% on discretionary spending categories)
    const discretionaryCategories = ['Shopping', 'Entertainment', 'Food and Drinks'];
    let potentialSavings = 0;
    
    discretionaryCategories.forEach(category => {
      if (expensesByCategory[category]) {
        potentialSavings += expensesByCategory[category] * 0.15; // 15% potential savings
      }
    });
    
    return Math.round(potentialSavings);
  };
  
  // Generate spending analysis data
  const generateSpendingData = () => {
    const today = new Date();
    const periods = timeframe === 'week' ? 7 : 30;
    
    // Create array with last X days
    const data = Array.from({ length: periods }, (_, i) => {
      const date = new Date();
      date.setDate(today.getDate() - (periods - 1 - i));
      
      return {
        date: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        spending: 0,
        optimal: 0
      };
    });
    
    // Fill with actual spending data
    transactions
      .filter(tx => tx.type === 'expense')
      .forEach(tx => {
        const txDate = tx.date.split(' ')[1] + ' ' + tx.date.split(' ')[0];
        const dataPoint = data.find(d => d.date === txDate);
        if (dataPoint) {
          dataPoint.spending += tx.amount;
        }
      });
    
    // Add optimal spending line (for this demo, use simple calculation)
    const dailyBudget = monthlyExpenses / 30;
    data.forEach(d => {
      d.optimal = dailyBudget * 0.85; // 15% less than current average
    });
    
    return data;
  };
  
  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover text-popover-foreground p-2 rounded-md shadow-md text-sm">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center mt-1">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="mr-2">{entry.name}:</span>
              <span className="flex items-center">
                <IndianRupee className="h-3 w-3 mr-0.5" />
                {entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };
  
  // Calculate savings recommendations
  const savingsAmount = calculatePotentialSavings();
  const savingsPercentage = monthlyExpenses > 0 ? (savingsAmount / monthlyExpenses) * 100 : 0;
  
  // Generate category-based savings opportunities
  const savingsOpportunities = () => {
    const categories = ['Food and Drinks', 'Shopping', 'Entertainment'];
    const expensesByCategory: Record<string, number> = {};
    
    transactions
      .filter(tx => tx.type === 'expense' && categories.includes(tx.category))
      .forEach(tx => {
        expensesByCategory[tx.category] = (expensesByCategory[tx.category] || 0) + tx.amount;
      });
    
    return categories
      .filter(cat => expensesByCategory[cat])
      .map(cat => ({
        category: cat,
        current: expensesByCategory[cat],
        potential: Math.round(expensesByCategory[cat] * 0.15),
      }));
  };
  
  return (
    <Card className="budget-card">
      <CardHeader>
        <CardTitle className="text-lg">Savings Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-4 rounded-lg bg-muted/50 flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-budget-purple" />
            <div>
              <h3 className="font-medium">Potential Monthly Savings</h3>
              <p className="text-sm text-muted-foreground">Based on your recent spending patterns</p>
            </div>
            <div className="ml-auto flex items-center text-lg font-bold text-budget-purple">
              <IndianRupee className="h-4 w-4 mr-0.5" />
              {savingsAmount.toLocaleString()}
            </div>
          </div>
          
          <div className="text-sm">
            <p>You could save approximately <span className="font-semibold">{savingsPercentage.toFixed(1)}%</span> of your monthly expenses by optimizing spending in discretionary categories.</p>
          </div>
        </div>
        
        <Tabs defaultValue="spending" className="mt-6">
          <TabsList className="mb-4">
            <TabsTrigger value="spending">Spending Analysis</TabsTrigger>
            <TabsTrigger value="opportunities">Savings Opportunities</TabsTrigger>
          </TabsList>
          
          <TabsContent value="spending">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium">Daily Spending vs Optimal</h3>
              <div className="flex gap-2">
                <button 
                  className={`text-xs px-2 py-1 rounded ${timeframe === 'week' ? 'bg-budget-purple text-white' : 'bg-muted'}`}
                  onClick={() => setTimeframe('week')}
                >
                  Weekly
                </button>
                <button 
                  className={`text-xs px-2 py-1 rounded ${timeframe === 'month' ? 'bg-budget-purple text-white' : 'bg-muted'}`}
                  onClick={() => setTimeframe('month')}
                >
                  Monthly
                </button>
              </div>
            </div>
            
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={generateSpendingData()} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis 
                    tick={{ fontSize: 10 }} 
                    tickFormatter={(value) => `₹${value}`} 
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="spending" 
                    stroke="#7E69AB" 
                    name="Actual Spending"
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="optimal" 
                    stroke="#4CAF50" 
                    name="Optimal Spending"
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="opportunities">
            <div className="space-y-4">
              {savingsOpportunities().length > 0 ? (
                savingsOpportunities().map((item, index) => (
                  <div key={index} className="p-3 rounded-lg border">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-medium">{item.category}</div>
                      <div className="flex items-center text-budget-green font-semibold text-sm">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        Save ₹{item.potential.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Current spending: ₹{item.current.toLocaleString()}
                      <div className="mt-1">
                        Reduce spending by 15% to save ₹{item.potential.toLocaleString()} per month
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-lg border flex items-center gap-2 text-muted-foreground">
                  <AlertCircle className="h-5 w-5" />
                  <span>Not enough transaction data to generate savings opportunities.</span>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default StatisticsSection;
