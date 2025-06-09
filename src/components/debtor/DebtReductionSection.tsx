
import { ChevronDown, ChevronUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { DebtReduction } from "@/types/debtor";

interface DebtReductionSectionProps {
  debtReductions: DebtReduction[];
  isExpanded: boolean;
  onToggle: () => void;
}

export const DebtReductionSection = ({ 
  debtReductions, 
  isExpanded, 
  onToggle 
}: DebtReductionSectionProps) => {
  if (!debtReductions || debtReductions.length === 0) {
    return null;
  }

  const totalReduction = debtReductions.reduce(
    (sum, reduction) => sum + reduction.amount.reduce((total, amt) => total + amt.amount, 0), 0
  );

  const getReductionTypeColor = (type: string) => {
    switch (type) {
      case 'product_return': return 'bg-orange-100 text-orange-800';
      case 'discount': return 'bg-green-100 text-green-800';
      case 'adjustment': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getReductionTypeLabel = (type: string) => {
    switch (type) {
      case 'product_return': return 'Product Return';
      case 'discount': return 'Discount';
      case 'adjustment': return 'Adjustment';
      default: return 'Other';
    }
  };

  return (
    <div className="px-4 py-2 bg-green-50 border-t border-b border-green-200">
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center gap-2">
          <TrendingDown size={16} className="text-green-600" />
          <h4 className="text-sm font-medium text-green-800">
            Debt Reductions ({debtReductions.length})
          </h4>
          <span className="text-sm text-green-600 font-medium">
            -{formatCurrency(totalReduction)}
          </span>
        </div>
        <Button variant="ghost" size="sm">
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </Button>
      </div>
      
      {isExpanded && (
        <div className="mt-2 mb-2">
          <div className="bg-white rounded-md overflow-hidden border border-green-200">
            <table className="min-w-full divide-y divide-green-200">
              <thead>
                <tr className="bg-green-100">
                  <th className="px-3 py-2 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Type</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-green-700 uppercase tracking-wider">Amount</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Date</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-green-100">
                {debtReductions.map((reduction, idx) => (
                  <tr key={`debt-reduction-${idx}`} className="hover:bg-green-50">
                    <td className="px-3 py-2 whitespace-nowrap text-sm">
                      <Badge variant="outline" className={getReductionTypeColor(reduction.type)}>
                        {getReductionTypeLabel(reduction.type)}
                      </Badge>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-right font-medium text-green-600">
                      -{reduction.amount.map((amt, i) => (
                        <span key={i}>
                          {formatCurrency(amt.amount)} {amt.unit?.code}
                          {i < reduction.amount.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm">{formatDate(reduction.createdAt)}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm">{reduction.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
