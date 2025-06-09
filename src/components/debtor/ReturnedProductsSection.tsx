
import { ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { ReturnedProduct } from "@/types/debtor";

interface ReturnedProductsSectionProps {
  returnedProducts: ReturnedProduct[];
  isExpanded: boolean;
  onToggle: () => void;
}

export const ReturnedProductsSection = ({ 
  returnedProducts, 
  isExpanded, 
  onToggle 
}: ReturnedProductsSectionProps) => {
  if (!returnedProducts || returnedProducts.length === 0) {
    return null;
  }

  const totalReturnValue = returnedProducts.reduce(
    (sum, product) => sum + (product.quantity * product.unitPrice), 0
  );

  return (
    <div className="px-4 py-2 bg-orange-50 border-t border-b border-orange-200">
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center gap-2">
          <RotateCcw size={16} className="text-orange-600" />
          <h4 className="text-sm font-medium text-orange-800">
            Returned Products ({returnedProducts.length})
          </h4>
          <span className="text-sm text-orange-600 font-medium">
            -{formatCurrency(totalReturnValue)}
          </span>
        </div>
        <Button variant="ghost" size="sm">
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </Button>
      </div>
      
      {isExpanded && (
        <div className="mt-2 mb-2">
          <div className="bg-white rounded-md overflow-hidden border border-orange-200">
            <table className="min-w-full divide-y divide-orange-200">
              <thead>
                <tr className="bg-orange-100">
                  <th className="px-3 py-2 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">Product</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">Quantity</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-orange-700 uppercase tracking-wider">Unit Price</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-orange-700 uppercase tracking-wider">Return Value</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">Return Date</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-orange-700 uppercase tracking-wider">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-100">
                {returnedProducts.map((product, idx) => (
                  <tr key={`returned-product-${idx}`} className="hover:bg-orange-50">
                    <td className="px-3 py-2 whitespace-nowrap text-sm">{product.name}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm">{product.quantity} {product.unit}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-right">{formatCurrency(product.unitPrice)}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-right font-medium text-orange-600">
                      -{formatCurrency(product.quantity * product.unitPrice)}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm">{formatDate(product.returnDate)}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm">{product.reason || '-'}</td>
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
