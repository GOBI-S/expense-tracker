'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownLeft, DollarSign } from 'lucide-react';

interface SummaryCardsProps {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
}

export function SummaryCards({ totalBalance, totalIncome, totalExpense }: SummaryCardsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Balance */}
      <Card className="border border-border bg-card overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-primary" />
            </div>
            Total Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground">
            {formatCurrency(totalBalance)}
          </div>
          <p className={`text-xs mt-2 ${totalBalance >= 0 ? 'text-income' : 'text-expense'}`}>
            {totalBalance >= 0 ? '+' : ''}{formatCurrency(totalBalance)}
          </p>
        </CardContent>
      </Card>

      {/* Total Income */}
      <Card className="border border-border bg-card overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <div className="w-8 h-8 bg-income/10 rounded-lg flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4 text-income" />
            </div>
            Total Income
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground">
            {formatCurrency(totalIncome)}
          </div>
          <p className="text-xs mt-2 text-income">+{formatCurrency(totalIncome)}</p>
        </CardContent>
      </Card>

      {/* Total Expense */}
      <Card className="border border-border bg-card overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <div className="w-8 h-8 bg-expense/10 rounded-lg flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4 text-expense" />
            </div>
            Total Expense
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground">
            {formatCurrency(totalExpense)}
          </div>
          <p className="text-xs mt-2 text-expense">-{formatCurrency(totalExpense)}</p>
        </CardContent>
      </Card>
    </div>
  );
}
