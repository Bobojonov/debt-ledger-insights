
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Debtor Management System</h1>
        <p className="text-xl text-gray-600 mb-8">Manage your debtors, track payments and monitor outstanding balances</p>
        <Button onClick={() => navigate('/debtors')} size="lg">
          View Debtors
        </Button>
      </div>
    </div>
  );
};

export default Index;
