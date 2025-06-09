
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { PaymentTransaction } from "@/types/debtor";
import { ReturnedProductsSection } from "./ReturnedProductsSection";
import { DebtReductionSection } from "./DebtReductionSection";

interface DebtHistoryListProps {
  debts: PaymentTransaction[];
}

export const DebtHistoryList = ({ debts }: DebtHistoryListProps) => {
  const [expandedPayments, setExpandedPayments] = useState<Record<string, boolean>>({});
  const [expandedProducts, setExpandedProducts] = useState<Record<string, boolean>>({});
  const [expandedReturns, setExpandedReturns] = useState<Record<string, boolean>>({});
  const [expandedReductions, setExpandedReductions] = useState<Record<string, boolean>>({});
  
  const togglePaymentExpand = (paymentId: string) => {
    setExpandedPayments(prev => ({
      ...prev,
      [paymentId]: !prev[paymentId]
    }));
  };
  
  const toggleProductsExpand = (paymentId: string) => {
    setExpandedProducts(prev => ({
      ...prev,
      [paymentId]: !prev[paymentId]
    }));
  };

  const toggleReturnsExpand = (paymentId: string) => {
    setExpandedReturns(prev => ({
      ...prev,
      [paymentId]: !prev[paymentId]
    }));
  };

  const toggleReductionsExpand = (paymentId: string) => {
    setExpandedReductions(prev => ({
      ...prev,
      [paymentId]: !prev[paymentId]
    }));
  };
  
  if (debts.length === 0) {
    return (
      <Card className="border shadow-sm">
        <CardContent className="p-6 flex items-center justify-center">
          <p className="text-muted-foreground text-lg">No debts found for this debtor.</p>
        </CardContent>
      </Card>
    );
  }
  
  const getPaymentStatusColor = (remainingAmount: number) => {
    if (remainingAmount <= 0) return "bg-green-100 text-green-800";
    return "bg-red-100 text-red-800";
  };
  
  return (
    <div className="space-y-4">
      {debts.map((debt) => {
        const isExpanded = expandedPayments[debt.payment.paymentId] || false;
        const areProductsExpanded = expandedProducts[debt.payment.paymentId] || false;
        const areReturnsExpanded = expandedReturns[debt.payment.paymentId] || false;
        const areReductionsExpanded = expandedReductions[debt.payment.paymentId] || false;
        
        const totalPaid = debt.transactions.reduce((sum, transaction) => 
          sum + transaction.amount.reduce((total, amt) => total + amt.amount, 0), 0);
          
        const totalReductions = (debt.debtReductions || []).reduce((sum, reduction) => 
          sum + reduction.amount.reduce((total, amt) => total + amt.amount, 0), 0);
        
        const totalAmount = debt.payment.amount.reduce((sum, amt) => sum + amt.amount, 0);
        const remainingAmount = totalAmount - totalPaid - totalReductions;
        
        return (
          <Card key={debt.payment.paymentId} className="overflow-hidden border shadow-sm">
            {/* Payment Header */}
            <CardHeader 
              className="bg-muted/50 p-4 cursor-pointer"
              onClick={() => togglePaymentExpand(debt.payment.paymentId)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg font-semibold">
                      Sale #{debt.payment.number}
                    </CardTitle>
                    <Badge variant="outline" className={getPaymentStatusColor(remainingAmount)}>
                      {remainingAmount <= 0 ? "Paid" : "Outstanding"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatDate(debt.payment.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">Amount: {formatCurrency(totalAmount)}</p>
                    {totalReductions > 0 && (
                      <p className="text-sm text-green-600">
                        Reductions: -{formatCurrency(totalReductions)}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Remaining: {formatCurrency(remainingAmount)}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="ml-2">
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            {isExpanded && (
              <CardContent className="p-0">
                {/* Products Section */}
                <div className="px-4 py-2 bg-muted/20 border-t border-b">
                  <div 
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleProductsExpand(debt.payment.paymentId)}
                  >
                    <h4 className="text-sm font-medium">Sold Products</h4>
                    <Button variant="ghost" size="sm">
                      {areProductsExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </Button>
                  </div>
                  
                  {areProductsExpanded && (
                    <div className="mt-2 mb-2">
                      {debt.soldProducts && debt.soldProducts.length > 0 ? (
                        <div className="bg-white rounded-md overflow-hidden border">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                              <tr className="bg-gray-50">
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {debt.soldProducts.map((product, idx) => (
                                <tr key={`${debt.payment.paymentId}-product-${idx}`} className="hover:bg-gray-50">
                                  <td className="px-3 py-2 whitespace-nowrap text-sm">{product.name}</td>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm">{product.quantity} {product.unit}</td>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm text-right">{formatCurrency(product.unitPrice)}</td>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm text-right">{formatCurrency(product.quantity * product.unitPrice)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground py-2">No products found for this payment.</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Returned Products Section */}
                <ReturnedProductsSection 
                  returnedProducts={debt.returnedProducts || []}
                  isExpanded={areReturnsExpanded}
                  onToggle={() => toggleReturnsExpand(debt.payment.paymentId)}
                />

                {/* Debt Reductions Section */}
                <DebtReductionSection 
                  debtReductions={debt.debtReductions || []}
                  isExpanded={areReductionsExpanded}
                  onToggle={() => toggleReductionsExpand(debt.payment.paymentId)}
                />
                
                {/* Transactions Table */}
                <div className="px-4 py-3">
                  <h4 className="font-medium mb-2">Payment Transactions</h4>
                  
                  {debt.transactions.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr className="bg-muted/30">
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction #</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {debt.transactions.map((transaction) => (
                            <tr key={transaction.transactionId} className="hover:bg-muted/10">
                              <td className="px-3 py-2 whitespace-nowrap text-sm">{transaction.number}</td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm">{formatDate(transaction.createdAt)}</td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-right">
                                {transaction.amount.map((amt, idx) => (
                                  <span key={idx}>
                                    {formatCurrency(amt.amount)} {amt.unit?.code}
                                    {idx < transaction.amount.length - 1 ? ', ' : ''}
                                  </span>
                                ))}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-right">
                                {transaction.paymentMethod || '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground py-2">No payments have been made yet.</p>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
};
