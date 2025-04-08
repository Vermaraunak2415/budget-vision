
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IndianRupee, ArrowDown, ArrowUp } from "lucide-react";

interface Transaction {
  id: string;
  name: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  category: string;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const RecentTransactions = ({ transactions }: RecentTransactionsProps) => {
  return (
    <Card className="budget-card">
      <CardHeader>
        <CardTitle className="text-lg">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent className="px-2">
        <div className="space-y-2">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${transaction.type === 'income' ? 'bg-budget-light-green' : 'bg-budget-light-red'}`}>
                  {transaction.type === 'income' ? (
                    <ArrowDown className="h-4 w-4 text-budget-green" />
                  ) : (
                    <ArrowUp className="h-4 w-4 text-budget-red" />
                  )}
                </div>
                <div>
                  <div className="font-medium">{transaction.name}</div>
                  <div className="text-xs text-muted-foreground">{transaction.date}</div>
                </div>
              </div>
              <div className={`flex items-center ${transaction.type === 'income' ? 'text-budget-green' : 'text-budget-red'}`}>
                {transaction.type === 'income' ? '+' : '-'}
                <IndianRupee className="h-3 w-3 mr-0.5" />
                <span className="font-semibold">{transaction.amount.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
