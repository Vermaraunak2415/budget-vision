
import { Card, CardContent } from "@/components/ui/card";
import { IndianRupee, ShoppingBag, Car, Pizza, Briefcase, Home } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface BudgetCategoryProps {
  category: string;
  spent: number;
  budget: number;
  color: string;
  icon?: string;
}

const BudgetCategory = ({ category, spent, budget, color, icon }: BudgetCategoryProps) => {
  const percentage = (spent / budget) * 100;
  const isOverBudget = spent > budget;
  
  const getIcon = () => {
    switch (icon) {
      case 'shopping':
        return <ShoppingBag className={`h-6 w-6 text-budget-${color}`} />;
      case 'transport':
        return <Car className={`h-6 w-6 text-budget-${color}`} />;
      case 'food':
        return <Pizza className={`h-6 w-6 text-budget-${color}`} />;
      case 'business':
        return <Briefcase className={`h-6 w-6 text-budget-${color}`} />;
      default:
        return <Home className={`h-6 w-6 text-budget-${color}`} />;
    }
  };
  
  return (
    <Card className="budget-card p-4 mb-3">
      <CardContent className="p-0">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-full bg-budget-light-${color}`}>
              {getIcon()}
            </div>
            <div>
              <h3 className="font-medium">{category}</h3>
              <div className="flex items-center text-xs text-muted-foreground">
                <span>Budget: </span>
                <IndianRupee className="h-3 w-3 ml-1 mr-0.5" />
                <span>{budget.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div className={`text-right ${isOverBudget ? 'text-budget-red' : ''}`}>
            <div className="flex items-center justify-end text-sm font-semibold">
              {isOverBudget && <span>-</span>}
              <IndianRupee className="h-3 w-3 mr-0.5" />
              <span>{Math.abs(budget - spent).toLocaleString()}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {isOverBudget ? 'Over budget' : 'Remaining'}
            </div>
          </div>
        </div>
        <Progress 
          value={Math.min(percentage, 100)} 
          className={`h-2 ${isOverBudget ? 'bg-budget-light-red' : `bg-budget-light-${color}`}`}
          indicatorClassName={`${isOverBudget ? 'bg-budget-red' : `bg-budget-${color}`}`}
        />
      </CardContent>
    </Card>
  );
};

export default BudgetCategory;
