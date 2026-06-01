export type TransactionType = 'income' | 'expense';

export type Category = 'food' | 'transport' | 'shopping' | 'bills' | 'entertainment' | 'salary' | 'other';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  category: Category;
  description: string;
  date: Date;
  createdAt: Date;
}

export interface Budget {
  id: string;
  userId: string;
  category: Category;
  limit: number;
  spent: number;
  month: string;
  createdAt: Date;
}

export interface DashboardSummary {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  recentTransactions: Transaction[];
  categoryBreakdown: Record<Category, number>;
}
