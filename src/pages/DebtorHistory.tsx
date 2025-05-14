
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Download, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { DebtHistoryList } from "@/components/debtor/DebtHistoryList";
import { DebtorSummary } from "@/components/debtor/DebtorSummary";
import { Pagination } from "@/components/common/Pagination";
import { useDebtorStore } from "@/store/debtorStore";
import { formatCurrency } from "@/utils/formatters";

const DebtorHistory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Store state
  const { 
    debtorInfo, 
    debtorHistory, 
    totalDebtAmount,
    totalPaidAmount,
    fetchDebtorHistory,
    loading,
    limit,
    offset,
    totalItems,
    changeLimit,
    setOffset
  } = useDebtorStore();
  
  // Calculate remaining debt
  const remainingDebt = totalDebtAmount - totalPaidAmount;

  useEffect(() => {
    if (id) {
      fetchDebtorHistory(id);
    }
  }, [id, fetchDebtorHistory]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    if (id) {
      fetchDebtorHistory(id).finally(() => {
        setIsRefreshing(false);
        toast({
          title: "Refreshed",
          description: "The debtor history has been refreshed.",
        });
      });
    }
  };

  const handleExport = () => {
    toast({
      title: "Exporting to Word",
      description: "Your document is being generated...",
    });
    
    // This would be implemented with actual API
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "The document has been downloaded.",
      });
    }, 1500);
  };

  const fullName = debtorInfo ? `${debtorInfo.firstName} ${debtorInfo.lastName}` : "Debtor";
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/debtors")}
            className="hover:bg-primary-foreground/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-medium ml-2 truncate">
            {fullName}'s Debt History
          </h1>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleExport}
          disabled={debtorHistory.length === 0}
          className="hover:bg-primary-foreground/10"
        >
          <Download className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto p-4 max-w-6xl">
        {loading && (
          <div className="w-full h-1 bg-gray-200 rounded overflow-hidden">
            <div className="h-full bg-secondary animate-pulse" style={{width: "100%"}}></div>
          </div>
        )}
        
        <div className="mt-4 space-y-4">
          {/* Summary Card */}
          {debtorHistory.length > 0 && (
            <DebtorSummary 
              totalDebt={totalDebtAmount} 
              totalPaid={totalPaidAmount} 
              remainingDebt={remainingDebt}
            />
          )}
          
          {/* Debt History */}
          <DebtHistoryList debts={debtorHistory} />
          
          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2"
            >
              <RefreshCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            
            <Pagination
              currentPage={Math.floor(offset / limit) + 1}
              totalPages={Math.ceil(totalItems / limit)}
              onPageChange={(page) => setOffset((page - 1) * limit)}
            />
            
            <Button 
              variant="outline" 
              onClick={changeLimit}
            >
              {limit} Items per page
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebtorHistory;
