
import { create } from "zustand";
import { DebtorInfo, PaymentTransaction, SoldProduct, ReturnedProduct, DebtReduction } from "@/types/debtor";

interface DebtorState {
  debtorInfo: DebtorInfo | null;
  debtorHistory: PaymentTransaction[];
  selectedDebtorId: string | null;
  totalDebtAmount: number;
  totalPaidAmount: number;
  totalReductionAmount: number;
  loading: boolean;
  error: string | null;
  limit: number;
  offset: number;
  totalItems: number;
  
  // Actions
  fetchDebtorHistory: (debtorId: string) => Promise<void>;
  changeLimit: () => void;
  setOffset: (offset: number) => void;
}

// Mock data for demonstration
const mockSoldProducts: SoldProduct[] = [
  { 
    id: "p1", 
    name: "Cement", 
    quantity: 10, 
    unit: "bags", 
    unitPrice: 12.5,
  },
  { 
    id: "p2", 
    name: "Steel Bars", 
    quantity: 5, 
    unit: "pcs", 
    unitPrice: 25.0, 
  },
  { 
    id: "p3", 
    name: "Paint", 
    quantity: 3, 
    unit: "gallons", 
    unitPrice: 35.0, 
  }
];

const mockSoldProducts2: SoldProduct[] = [
  { 
    id: "p4", 
    name: "Bricks", 
    quantity: 200, 
    unit: "pcs", 
    unitPrice: 0.5,
  },
  { 
    id: "p5", 
    name: "Wood Panel", 
    quantity: 15, 
    unit: "sheets", 
    unitPrice: 18.0, 
  }
];

const mockReturnedProducts: ReturnedProduct[] = [
  {
    id: "r1",
    name: "Steel Bars",
    quantity: 2,
    unit: "pcs",
    unitPrice: 25.0,
    returnDate: "2023-06-10T10:00:00Z",
    reason: "Defective items"
  }
];

const mockDebtReductions: DebtReduction[] = [
  {
    id: "dr1",
    amount: [{ amount: 50, unit: { code: "USD" } }],
    reason: "Product return credit",
    createdAt: "2023-06-10T10:00:00Z",
    type: "product_return"
  },
  {
    id: "dr2",
    amount: [{ amount: 20, unit: { code: "USD" } }],
    reason: "Customer loyalty discount",
    createdAt: "2023-06-15T14:30:00Z",
    type: "discount"
  }
];

export const useDebtorStore = create<DebtorState>((set, get) => ({
  debtorInfo: null,
  debtorHistory: [],
  selectedDebtorId: null,
  totalDebtAmount: 0,
  totalPaidAmount: 0,
  totalReductionAmount: 0,
  loading: false,
  error: null,
  limit: 10,
  offset: 0,
  totalItems: 0,
  
  fetchDebtorHistory: async (debtorId: string) => {
    set({ loading: true, error: null, selectedDebtorId: debtorId });
    
    try {
      // This would be an API call in a real app
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock response data
      const mockDebtorInfo: DebtorInfo = {
        id: debtorId,
        firstName: "John",
        lastName: "Doe",
        phoneNumber: "+1234567890",
        email: "john.doe@example.com"
      };
      
      const mockTransactions: PaymentTransaction[] = [
        {
          payment: {
            paymentId: "p1",
            number: "INV-2023-001",
            createdAt: "2023-05-15T10:30:00Z",
            amount: [{ amount: 450, unit: { code: "USD" } }]
          },
          transactions: [
            {
              transactionId: "t1",
              number: "TR-001",
              createdAt: "2023-05-20T14:00:00Z",
              amount: [{ amount: 200, unit: { code: "USD" } }],
              paymentMethod: "Bank Transfer"
            },
            {
              transactionId: "t2",
              number: "TR-002",
              createdAt: "2023-06-05T09:15:00Z",
              amount: [{ amount: 150, unit: { code: "USD" } }],
              paymentMethod: "Cash"
            }
          ],
          soldProducts: mockSoldProducts,
          returnedProducts: mockReturnedProducts,
          debtReductions: mockDebtReductions
        },
        {
          payment: {
            paymentId: "p2",
            number: "INV-2023-002",
            createdAt: "2023-07-10T11:45:00Z",
            amount: [{ amount: 320, unit: { code: "USD" } }]
          },
          transactions: [
            {
              transactionId: "t3",
              number: "TR-003",
              createdAt: "2023-07-25T16:30:00Z",
              amount: [{ amount: 320, unit: { code: "USD" } }],
              paymentMethod: "Credit Card"
            }
          ],
          soldProducts: mockSoldProducts2,
          returnedProducts: [],
          debtReductions: []
        },
        {
          payment: {
            paymentId: "p3",
            number: "INV-2023-003",
            createdAt: "2023-09-05T13:20:00Z",
            amount: [{ amount: 180, unit: { code: "USD" } }]
          },
          transactions: [],
          soldProducts: [],
          returnedProducts: [],
          debtReductions: []
        }
      ];
      
      // Calculate totals
      const totalDebt = mockTransactions.reduce(
        (sum, transaction) => sum + transaction.payment.amount.reduce((total, amt) => total + amt.amount, 0), 
        0
      );
      
      const totalPaid = mockTransactions.reduce(
        (sum, transaction) => sum + transaction.transactions.reduce(
          (transSum, trans) => transSum + trans.amount.reduce((amtSum, amt) => amtSum + amt.amount, 0), 
          0
        ), 
        0
      );

      const totalReductions = mockTransactions.reduce(
        (sum, transaction) => sum + (transaction.debtReductions || []).reduce(
          (reductionSum, reduction) => reductionSum + reduction.amount.reduce((amtSum, amt) => amtSum + amt.amount, 0),
          0
        ),
        0
      );
      
      set({
        debtorInfo: mockDebtorInfo,
        debtorHistory: mockTransactions,
        totalDebtAmount: totalDebt,
        totalPaidAmount: totalPaid,
        totalReductionAmount: totalReductions,
        totalItems: mockTransactions.length,
        loading: false
      });
    } catch (error) {
      set({ 
        error: "Failed to fetch debtor history", 
        loading: false 
      });
      console.error("Error fetching debtor history:", error);
    }
  },
  
  changeLimit: () => {
    const currentLimit = get().limit;
    const newLimit = currentLimit === 10 ? 20 : currentLimit === 20 ? 50 : 10;
    set({ limit: newLimit, offset: 0 });
    
    // Refetch with new limit if we have a selected debtor
    const selectedDebtorId = get().selectedDebtorId;
    if (selectedDebtorId) {
      get().fetchDebtorHistory(selectedDebtorId);
    }
  },
  
  setOffset: (offset: number) => {
    set({ offset });
    
    // Refetch with new offset if we have a selected debtor
    const selectedDebtorId = get().selectedDebtorId;
    if (selectedDebtorId) {
      get().fetchDebtorHistory(selectedDebtorId);
    }
  }
}));
