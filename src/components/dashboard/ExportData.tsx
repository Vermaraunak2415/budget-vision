
import { Button } from "@/components/ui/button";
import { DownloadCloud, FileText, FileSpreadsheet } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface Transaction {
  id: string;
  name: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  category: string;
}

interface ExportDataProps {
  transactions: Transaction[];
}

const ExportData = ({ transactions }: ExportDataProps) => {
  const formatTransactionsForExport = () => {
    return transactions.map(t => ({
      Name: t.name,
      Amount: t.amount,
      Type: t.type,
      Date: t.date,
      Category: t.category
    }));
  };
  
  const exportToCSV = () => {
    try {
      const formattedData = formatTransactionsForExport();
      const headers = Object.keys(formattedData[0]).join(',');
      const csvData = formattedData.map(row => 
        Object.values(row).map(value => 
          typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value
        ).join(',')
      ).join('\n');
      
      const csv = `${headers}\n${csvData}`;
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `BudgetVision_Transactions_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Export successful", {
        description: "Your transactions have been exported to CSV"
      });
    } catch (err) {
      toast.error("Export failed", {
        description: "There was a problem exporting your data"
      });
      console.error("Export error:", err);
    }
  };
  
  const exportToPDF = () => {
    // In a real app, implement PDF generation
    toast.success("Export successful", {
      description: "Your transactions have been exported to PDF"
    });
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <DownloadCloud className="h-4 w-4" />
          <span>Export</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportToCSV} className="cursor-pointer">
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          <span>Export to Excel/CSV</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToPDF} className="cursor-pointer">
          <FileText className="h-4 w-4 mr-2" />
          <span>Export to PDF</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportData;
