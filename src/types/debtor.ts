
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

export interface PaymentTransaction {
  payment: Payment;
  transactions: Transaction[];
  soldProducts: SoldProduct[];
}

export interface DebtorInfo {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
}
