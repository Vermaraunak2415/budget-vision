
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IndianRupee, Plus, Search } from "lucide-react";

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

// Mock data
const mockTransactions = [
  { id: "tx1", name: "Salary", amount: 50000, type: 'income', date: "April 1, 2025", category: "Income" },
  { id: "tx2", name: "Grocery Shopping", amount: 2500, type: 'expense', date: "April 5, 2025", category: "Food" },
  { id: "tx3", name: "Electricity Bill", amount: 1800, type: 'expense', date: "April 6, 2025", category: "Utilities" },
  { id: "tx4", name: "Movie Tickets", amount: 600, type: 'expense', date: "April 7, 2025", category: "Entertainment" },
  { id: "tx5", name: "Freelance Work", amount: 15000, type: 'income', date: "April 10, 2025", category: "Income" },
  { id: "tx6", name: "Restaurant", amount: 1200, type: 'expense', date: "April 12, 2025", category: "Food" },
];

const mockCashFlowData = [
  { name: "Jan", income: 45000, expense: 30000 },
  { name: "Feb", income: 48000, expense: 32000 },
  { name: "Mar", income: 52000, expense: 34000 },
  { name: "Apr", income: 65000, expense: 36000 },
  { name: "May", income: 50000, expense: 35000 },
  { name: "Jun", income: 55000, expense: 37000 },
];

const mockExpenseData = [
  { name: "Food", value: 8000, color: "#FFC107" },
  { name: "Transport", value: 6000, color: "#2196F3" },
  { name: "Entertainment", value: 4000, color: "#673AB7" },
  { name: "Utilities", value: 5000, color: "#009688" },
  { name: "Shopping", value: 7000, color: "#F44336" },
];

const mockReminders = [
  { id: "rem1", title: "Electricity Bill", amount: 2000, dueDate: "Apr 8, 2025" },
  { id: "rem2", title: "Credit Card Payment", amount: 8000, dueDate: "Apr 15, 2025" },
];

// Budget categories for different profiles
const getBudgetCategoriesForProfile = (profileType: string) => {
  const commonCategories = [
    { category: "Food and Drinks", spent: 8000, budget: 10000, color: "yellow", icon: "food" },
    { category: "Transportation", spent: 6000, budget: 6000, color: "blue", icon: "transport" },
    { category: "Shopping", spent: 7000, budget: 5000, color: "red", icon: "shopping" },
  ];
  
  // Add profile-specific categories
  switch (profileType) {
    case 'student':
      return [
        ...commonCategories,
        { category: "Education", spent: 15000, budget: 20000, color: "purple", icon: "home" },
        { category: "Entertainment", spent: 4000, budget: 3000, color: "teal", icon: "home" },
      ];
    case 'business':
      return [
        ...commonCategories,
        { category: "Business Expenses", spent: 25000, budget: 30000, color: "purple", icon: "business" },
        { category: "Marketing", spent: 10000, budget: 15000, color: "teal", icon: "home" },
      ];
    case 'housewife':
      return [
        ...commonCategories,
        { category: "Household", spent: 12000, budget: 15000, color: "purple", icon: "home" },
        { category: "Children", spent: 8000, budget: 10000, color: "teal", icon: "home" },
      ];
    default: // salary employee
      return [
        ...commonCategories,
        { category: "Housing", spent: 15000, budget: 18000, color: "purple", icon: "home" },
        { category: "Entertainment", spent: 5000, budget: 5000, color: "teal", icon: "home" },
      ];
  }
};

const Dashboard = () => {
  const [profile, setProfile] = useState({ 
    name: "Lucy", 
    type: "salary" 
  });
  
  const [budgetCategories, setBudgetCategories] = useState(getBudgetCategoriesForProfile(profile.type));
  
  // Calculate totals
  const income = mockTransactions
    .filter(tx => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);
    
  const expenses = mockTransactions
    .filter(tx => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);
    
  const balance = income - expenses;
  
  // Update budget categories when profile changes
  useEffect(() => {
    setBudgetCategories(getBudgetCategoriesForProfile(profile.type));
  }, [profile.type]);
  
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
              <Button 
                size="sm" 
                className="bg-white/20 text-white hover:bg-white/30"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-3 mb-6">
              <OverviewCard name="Balance" amount={balance} positive={balance >= 0} className="bg-white/10 border-0 text-white" />
              <OverviewCard name="Income" amount={income} className="bg-white/10 border-0 text-white" />
              <OverviewCard name="Expenses" amount={expenses} positive={false} className="bg-white/10 border-0 text-white" />
            </div>
            
            <div className="flex flex-col gap-4">
              <h2 className="font-medium">Recent Transactions</h2>
              <div className="space-y-3">
                {mockTransactions.slice(0, 4).map((transaction) => (
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
                ))}
              </div>
            </div>
          </Card>
          
          {/* Middle column */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Budgets</h2>
              <ExportData transactions={mockTransactions} />
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
                <CashFlowChart data={mockCashFlowData} />
              </TabsContent>
              <TabsContent value="expenses" className="mt-4">
                <ExpensePieChart data={mockExpenseData} />
              </TabsContent>
            </Tabs>
            
            <FutureInsights 
              profileType={profile.type}
              currentSavings={100000}
              monthlyIncome={income}
              monthlyExpenses={expenses}
            />
            
            <RecentTransactions transactions={mockTransactions} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
