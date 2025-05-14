
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const debtorsList = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    phoneNumber: "+1234567890",
    totalDebt: 950,
    remainingDebt: 280
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    phoneNumber: "+9876543210",
    totalDebt: 750,
    remainingDebt: 0
  },
  {
    id: "3",
    firstName: "Robert",
    lastName: "Johnson",
    phoneNumber: "+1122334455",
    totalDebt: 1200,
    remainingDebt: 500
  }
];

const Debtors = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-2xl font-bold mb-6">Debtors Management</h1>
        
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle>Search Debtors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input placeholder="Search by name or phone..." className="max-w-sm" />
              <Button>Search</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Debtors List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead className="text-right">Total Debt</TableHead>
                  <TableHead className="text-right">Remaining</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {debtorsList.map((debtor) => (
                  <TableRow key={debtor.id}>
                    <TableCell className="font-medium">
                      {debtor.firstName} {debtor.lastName}
                    </TableCell>
                    <TableCell>{debtor.phoneNumber}</TableCell>
                    <TableCell className="text-right">
                      ${debtor.totalDebt.toFixed(2)}
                    </TableCell>
                    <TableCell className={`text-right ${debtor.remainingDebt > 0 ? 'text-destructive' : 'text-green-600'}`}>
                      ${debtor.remainingDebt.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/debtors/${debtor.id}/history`)}
                      >
                        View History
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Debtors;
