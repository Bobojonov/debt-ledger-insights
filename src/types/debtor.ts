
export interface MoneyAmount {
  amount: number;
  unit: {
    code: string;
  };
}

export interface Payment {
  paymentId: string;
  number: string;
  createdAt: string;
  amount: MoneyAmount[];
}

export interface Transaction {
  transactionId: string;
  number: string;
  createdAt: string;
  amount: MoneyAmount[];
  paymentMethod: string | null;
}

export interface SoldProduct {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
}

export interface ReturnedProduct {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  returnDate: string;
  reason?: string;
}

export interface DebtReduction {
  id: string;
  amount: MoneyAmount[];
  reason: string;
  createdAt: string;
  type: 'product_return' | 'adjustment' | 'discount';
}

export interface PaymentTransaction {
  payment: Payment;
  transactions: Transaction[];
  soldProducts: SoldProduct[];
  returnedProducts?: ReturnedProduct[];
  debtReductions?: DebtReduction[];
}

export interface DebtorInfo {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
}
