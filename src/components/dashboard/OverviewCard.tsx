
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IndianRupee } from "lucide-react";

interface OverviewCardProps {
  name: string;
  amount: number;
  positive?: boolean;
  className?: string;
}

const OverviewCard = ({ name, amount, positive = true, className = "" }: OverviewCardProps) => {
  return (
    <Card className={`budget-card ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center">
          <IndianRupee className="mr-1 h-4 w-4" />
          <span className="text-2xl font-bold">{Math.abs(amount).toLocaleString()}</span>
          {!positive && amount !== 0 && <span className="text-budget-red ml-1">-</span>}
        </div>
      </CardContent>
    </Card>
  );
};

export default OverviewCard;
