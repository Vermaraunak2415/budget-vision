
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus } from "lucide-react";

interface Transaction {
  id: string;
  name: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  category: string;
}

interface AddTransactionDialogProps {
  onAddTransaction: (transaction: Transaction) => void;
  categories: string[];
}

const AddTransactionDialog = ({ onAddTransaction, categories }: AddTransactionDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Please enter a name");
      return;
    }
    
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    if (!category && type === 'expense') {
      toast.error("Please select a category");
      return;
    }
    
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      name: name.trim(),
      amount: Number(amount),
      type,
      date: new Date().toLocaleDateString('en-IN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      category: type === 'income' ? 'Income' : category
    };
    
    onAddTransaction(newTransaction);
    setOpen(false);
    resetForm();
    
    toast.success("Transaction added successfully");
  };
  
  const resetForm = () => {
    setName("");
    setAmount("");
    setType('expense');
    setCategory("");
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-1">
          <Plus className="h-4 w-4" />
          <span>Add Transaction</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Transaction</DialogTitle>
          <DialogDescription>
            Enter the details of your transaction below.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="transaction-type">Transaction Type</Label>
            <RadioGroup 
              id="transaction-type" 
              value={type} 
              onValueChange={(value: 'income' | 'expense') => setType(value)}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="expense" id="expense" />
                <Label htmlFor="expense">Expense</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="income" id="income" />
                <Label htmlFor="income">Income</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="name">Description</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="e.g. Grocery Shopping"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input 
              id="amount" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              type="number" 
              min="1" 
              placeholder="0.00"
            />
          </div>
          
          {type === 'expense' && (
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
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
          )}
          
          <DialogFooter>
            <Button type="submit">Add Transaction</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionDialog;
