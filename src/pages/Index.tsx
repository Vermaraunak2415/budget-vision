
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IndianRupee, Search } from "lucide-react";

// Custom components
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import OverviewCard from "@/components/dashboard/OverviewCard";
import BudgetCategory from "@/components/dashboard/BudgetCategory";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import CashFlowChart from "@/components/dashboard/CashFlowChart";
import ExpensePieChart from "@/components/dashboard/ExpensePieChart";
import ReminderNotification from "@/components/dashboard/ReminderNotification";
import ProfileSelection from "@/components/dashboard/ProfileSelection";
import SavingsTips from "@/components/dashboard/SavingsTips";
import ExportData from "@/components/dashboard/ExportData";
import FutureInsights from "@/components/dashboard/FutureInsights";
import AddTransactionDialog from "@/components/dashboard/AddTransactionDialog";

// Define Transaction type
interface Transaction {
  id: string;
  name: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  category: string;
}

// Mock reminders
const mockReminders = [
  { id: "rem1", title: "Electricity Bill", amount: 2000, dueDate: "Apr 8, 2025" },
  { id: "rem2", title: "Credit Card Payment", amount: 8000, dueDate: "Apr 15, 2025" },
];

// Budget categories for different profiles
const getBudgetCategoriesForProfile = (profileType: string) => {
  const commonCategories = [
    { category: "Food and Drinks", spent: 0, budget: 10000, color: "yellow", icon: "food" },
    { category: "Transportation", spent: 0, budget: 6000, color: "blue", icon: "transport" },
    { category: "Shopping", spent: 0, budget: 5000, color: "red", icon: "shopping" },
  ];
  
  // Add profile-specific categories
  switch (profileType) {
    case 'student':
      return [
        ...commonCategories,
        { category: "Education", spent: 0, budget: 20000, color: "purple", icon: "home" },
        { category: "Entertainment", spent: 0, budget: 3000, color: "teal", icon: "home" },
      ];
    case 'business':
      return [
        ...commonCategories,
        { category: "Business Expenses", spent: 0, budget: 30000, color: "purple", icon: "business" },
        { category: "Marketing", spent: 0, budget: 15000, color: "teal", icon: "home" },
      ];
    case 'housewife':
      return [
        ...commonCategories,
        { category: "Household", spent: 0, budget: 15000, color: "purple", icon: "home" },
        { category: "Children", spent: 0, budget: 10000, color: "teal", icon: "home" },
      ];
    default: // salary employee
      return [
        ...commonCategories,
        { category: "Housing", spent: 0, budget: 18000, color: "purple", icon: "home" },
        { category: "Entertainment", spent: 0, budget: 5000, color: "teal", icon: "home" },
      ];
  }
};

// Get the list of all unique categories based on profile type
const getAllCategories = (profileType: string) => {
  const budgetCategories = getBudgetCategoriesForProfile(profileType);
  return budgetCategories.map(cat => cat.category);
};

const Dashboard = () => {
  const [profile, setProfile] = useState({ 
    name: "Lucy", 
    type: "salary" 
  });
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgetCategories, setBudgetCategories] = useState(getBudgetCategoriesForProfile(profile.type));
  const [categories, setCategories] = useState<string[]>(getAllCategories(profile.type));
  
  // Calculate totals
  const income = transactions
    .filter(tx => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);
    
  const expenses = transactions
    .filter(tx => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);
    
  const balance = income - expenses;
  
  // Update budget categories when transactions change
  useEffect(() => {
    const updatedCategories = [...budgetCategories];
    
    // Reset spent amounts
    updatedCategories.forEach(cat => {
      cat.spent = 0;
    });
    
    // Calculate new spent amounts based on transactions
    transactions.forEach(tx => {
      if (tx.type === 'expense') {
        const categoryIndex = updatedCategories.findIndex(cat => cat.category === tx.category);
        if (categoryIndex !== -1) {
          updatedCategories[categoryIndex].spent += tx.amount;
        }
      }
    });
    
    setBudgetCategories(updatedCategories);
  }, [transactions]);
  
  // Update budget categories when profile changes
  useEffect(() => {
    setBudgetCategories(getBudgetCategoriesForProfile(profile.type));
    setCategories(getAllCategories(profile.type));
  }, [profile.type]);
  
  // Generate chart data from transactions
  const generateCashFlowData = () => {
    // Create a map of months with default values
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const data = months.map(month => ({
      name: month,
      income: 0,
      expense: 0
    }));
    
    // Add actual data from transactions if any
    if (transactions.length > 0) {
      // This is a simplified example for demo purposes
      // In a real app, you would map transactions to actual months
      let monthIndex = 0;
      const incomeByMonth: Record<string, number> = {};
      const expenseByMonth: Record<string, number> = {};
      
      // Group transactions by month (simplified)
      transactions.forEach(tx => {
        const month = tx.date.split(' ')[0].substring(0, 3);
        if (tx.type === 'income') {
          incomeByMonth[month] = (incomeByMonth[month] || 0) + tx.amount;
        } else {
          expenseByMonth[month] = (expenseByMonth[month] || 0) + tx.amount;
        }
      });
      
      // Update the chart data
      data.forEach(item => {
        if (incomeByMonth[item.name]) {
          item.income = incomeByMonth[item.name];
        }
        if (expenseByMonth[item.name]) {
          item.expense = expenseByMonth[item.name];
        }
      });
    }
    
    return data;
  };
  
  // Generate expense data for pie chart
  const generateExpenseData = () => {
    const colors = ["#FFC107", "#2196F3", "#673AB7", "#009688", "#F44336"];
    
    // Group expenses by category
    const expenseByCategory: Record<string, number> = {};
    transactions
      .filter(tx => tx.type === 'expense')
      .forEach(tx => {
        expenseByCategory[tx.category] = (expenseByCategory[tx.category] || 0) + tx.amount;
      });
    
    // Convert to array format for the pie chart
    return Object.entries(expenseByCategory).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length]
    }));
  };
  
  // Handle adding a new transaction
  const handleAddTransaction = (transaction: Transaction) => {
    setTransactions(prev => [...prev, transaction]);
  };
  
  // Handle profile change
  const handleProfileChange = (name: string, type: string) => {
    setProfile({ name, type });
    toast.success("Profile updated", {
      description: `Profile changed to ${name} (${type})`
    });
  };
  
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex items-center justify-between h-16 px-4">
          <Logo />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button size="icon" variant="ghost" className="rounded-full">
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container py-6 px-4">
        {/* Payment reminders notification */}
        <ReminderNotification reminders={mockReminders} />
        
        {/* Main content */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
          {/* Left column */}
          <Card className="budget-card bg-gradient-to-br from-budget-purple to-budget-purple/90 text-white p-6 md:col-span-1">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-xl font-semibold">Hello, {profile.name}!</h1>
                <p className="text-white/80 text-sm">
                  {new Date().toLocaleDateString('en-IN', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <AddTransactionDialog 
                onAddTransaction={handleAddTransaction}
                categories={categories}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-3 mb-6">
              <OverviewCard name="Balance" amount={balance} positive={balance >= 0} className="bg-white/10 border-0 text-white" />
              <OverviewCard name="Income" amount={income} className="bg-white/10 border-0 text-white" />
              <OverviewCard name="Expenses" amount={expenses} positive={false} className="bg-white/10 border-0 text-white" />
            </div>
            
            <div className="flex flex-col gap-4">
              <h2 className="font-medium">Recent Transactions</h2>
              <div className="space-y-3">
                {transactions.length === 0 ? (
                  <div className="p-3 bg-white/10 rounded-lg text-center">
                    <p>No transactions yet</p>
                    <p className="text-xs text-white/70">Add your first transaction using the Add button</p>
                  </div>
                ) : (
                  transactions.slice(0, 4).map((transaction) => (
                    <div 
                      key={transaction.id} 
                      className="flex items-center justify-between p-3 bg-white/10 rounded-lg"
                    >
                      <div>
                        <div className="font-medium">{transaction.name}</div>
                        <div className="text-xs text-white/70">{transaction.date}</div>
                      </div>
                      <div className={`${transaction.type === 'income' ? 'text-budget-light-green' : 'text-budget-light-red'} font-semibold flex items-center`}>
                        {transaction.type === 'income' ? '+' : '-'}
                        <IndianRupee className="h-3 w-3 mr-0.5" />
                        {transaction.amount.toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Card>
          
          {/* Middle column */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Budgets</h2>
              <ExportData transactions={transactions} />
            </div>
            
            <div>
              {budgetCategories.map((item, index) => (
                <BudgetCategory
                  key={index}
                  category={item.category}
                  spent={item.spent}
                  budget={item.budget}
                  color={item.color}
                  icon={item.icon}
                />
              ))}
            </div>
            
            <ProfileSelection 
              onProfileChange={handleProfileChange}
              currentProfile={profile}
            />
            
            <SavingsTips profileType={profile.type} />
          </div>
          
          {/* Right column */}
          <div className="space-y-6 md:col-span-2 lg:col-span-1">
            <Tabs defaultValue="cash-flow">
              <TabsList className="w-full">
                <TabsTrigger value="cash-flow" className="flex-1">Cash Flow</TabsTrigger>
                <TabsTrigger value="expenses" className="flex-1">Expenses</TabsTrigger>
              </TabsList>
              <TabsContent value="cash-flow" className="mt-4">
                <CashFlowChart data={generateCashFlowData()} />
              </TabsContent>
              <TabsContent value="expenses" className="mt-4">
                <ExpensePieChart data={generateExpenseData()} />
              </TabsContent>
            </Tabs>
            
            <FutureInsights 
              profileType={profile.type}
              currentSavings={balance > 0 ? balance : 0}
              monthlyIncome={income}
              monthlyExpenses={expenses}
            />
            
            <RecentTransactions transactions={transactions} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
