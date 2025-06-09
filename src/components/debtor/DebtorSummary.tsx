
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatters";

interface DebtorSummaryProps {
  totalDebt: number;
  totalPaid: number;
  totalReductions: number;
  remainingDebt: number;
}

export const DebtorSummary = ({ 
  totalDebt,
  totalPaid,
  totalReductions,
  remainingDebt
}: DebtorSummaryProps) => {
  return (
    <Card className="border shadow-sm">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Debt</p>
            <p className="text-2xl font-semibold">{formatCurrency(totalDebt)}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Paid</p>
            <p className="text-2xl font-semibold text-blue-600">{formatCurrency(totalPaid)}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Debt Reductions</p>
            <p className="text-2xl font-semibold text-green-600">{formatCurrency(totalReductions)}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-muted-foreground">Remaining Balance</p>
            <p className={`text-2xl font-semibold ${remainingDebt > 0 ? 'text-destructive' : 'text-green-600'}`}>
              {formatCurrency(remainingDebt)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
