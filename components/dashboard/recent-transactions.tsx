'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Transaction, Category } from '@/types/expense';
import { formatDistance } from 'date-fns';
import { TrendingUp, TrendingDown, Utensils, Navigation, ShoppingBag, FileText, Zap } from 'lucide-react';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const CATEGORY_ICONS: Record<Category, React.ReactNode> = {
  food: <Utensils className="w-4 h-4" />,
  transport: <Navigation className="w-4 h-4" />,
  shopping: <ShoppingBag className="w-4 h-4" />,
  bills: <FileText className="w-4 h-4" />,
  entertainment: <Zap className="w-4 h-4" />,
  salary: <TrendingUp className="w-4 h-4" />,
  other: <TrendingDown className="w-4 h-4" />,
};

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (transactions.length === 0) {
    return (
      <Card className="border border-border bg-card col-span-full">
        <CardHeader>
          <CardTitle className="text-lg">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <p className="text-muted-foreground">No transactions yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border bg-card col-span-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Recent Transactions</CardTitle>
        <a href="/dashboard/transactions" className="text-sm text-primary hover:underline">
          View all
        </a>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    transaction.type === 'income'
                      ? 'bg-income/10 text-income'
                      : 'bg-expense/10 text-expense'
                  }`}
                >
                  {CATEGORY_ICONS[transaction.category]}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{transaction.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistance(new Date(transaction.date), new Date(), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`text-sm font-semibold ${
                    transaction.type === 'income' ? 'text-income' : 'text-expense'
                  }`}
                >
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
