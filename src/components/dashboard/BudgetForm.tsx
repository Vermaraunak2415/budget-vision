
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus } from "lucide-react";

interface BudgetFormProps {
  categories: string[];
  onAddBudget: (category: string, amount: number) => void;
}

const BudgetForm = ({ categories, onAddBudget }: BudgetFormProps) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [budgetAmount, setBudgetAmount] = useState("");
  const [showForm, setShowForm] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCategory) {
      toast.error("Please select a category");
      return;
    }
    
    if (!budgetAmount || isNaN(Number(budgetAmount)) || Number(budgetAmount) <= 0) {
      toast.error("Please enter a valid budget amount");
      return;
    }
    
    onAddBudget(selectedCategory, Number(budgetAmount));
    resetForm();
  };
  
  const resetForm = () => {
    setSelectedCategory("");
    setBudgetAmount("");
    setShowForm(false);
  };
  
  return (
    <Card className="budget-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>Add New Budget</span>
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => setShowForm(!showForm)}
            className="h-8"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {showForm ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="budget-category">Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger id="budget-category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="budget-amount">Budget Amount (₹)</Label>
              <Input 
                id="budget-amount" 
                value={budgetAmount} 
                onChange={(e) => setBudgetAmount(e.target.value)} 
                type="number" 
                min="1" 
                placeholder="0.00"
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit">
                Add Budget
              </Button>
            </div>
          </form>
        ) : (
          <div className="text-center py-2 text-muted-foreground">
            Click the + button to add a new budget
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BudgetForm;
