
import React from 'react';
import { IndianRupee, LineChart } from 'lucide-react';

const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-budget-purple to-budget-blue flex items-center justify-center">
          <IndianRupee className="w-4 h-4 text-white" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-budget-green flex items-center justify-center">
          <LineChart className="w-2 h-2 text-white" />
        </div>
      </div>
      <span className="font-bold text-lg tracking-tight">BudgetVision</span>
    </div>
  );
};

export default Logo;
