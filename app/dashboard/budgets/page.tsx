'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { apiService } from '@/lib/api-service';
import { Navigation } from '@/components/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Budget, Category } from '@/types/expense';
import { AlertCircle, TrendingDown } from 'lucide-react';

const CATEGORY_NAMES: Record<Category, string> = {
  food: 'Food',
  transport: 'Transport',
  shopping: 'Shopping',
  bills: 'Bills',
  entertainment: 'Entertainment',
  salary: 'Salary',
  other: 'Other',
};

export default function BudgetsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }

    const loadBudgets = async () => {
      try {
        setLoading(true);
        const currentMonth = new Date().toISOString().slice(0, 7);
        const data = await apiService.getBudgets(user.uid, currentMonth);
        setBudgets(data);
      } catch (error) {
        console.error('Error loading budgets:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBudgets();
  }, [user, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getProgressPercentage = (spent: number, limit: number) => {
    return Math.min((spent / limit) * 100, 100);
  };

  const isOverBudget = (spent: number, limit: number) => {
    return spent > limit;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation user={user} onLogout={handleLogout} />
        <div className="flex items-center justify-center h-96">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation user={user} onLogout={handleLogout} />

      <div className="container mx-auto px-4 py-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Budgets</h1>
          <p className="text-muted-foreground">Monitor your spending limits for each category</p>
        </div>

        {/* Budget Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {budgets.length === 0 ? (
            <Card className="border border-border bg-card col-span-full">
              <CardContent className="pt-6 h-40 flex items-center justify-center">
                <p className="text-muted-foreground">No budgets set yet</p>
              </CardContent>
            </Card>
          ) : (
            budgets.map((budget) => {
              const percentage = getProgressPercentage(budget.spent, budget.limit);
              const over = isOverBudget(budget.spent, budget.limit);

              return (
                <Card key={budget.id} className="border border-border bg-card">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">
                        {CATEGORY_NAMES[budget.category]}
                      </CardTitle>
                      {over && (
                        <div className="flex items-center gap-1 bg-expense/10 text-expense px-2 py-1 rounded text-xs font-semibold">
                          <AlertCircle className="w-3 h-3" />
                          Over Budget
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Spent</span>
                        <span
                          className={`text-sm font-semibold ${
                            over ? 'text-expense' : 'text-income'
                          }`}
                        >
                          {formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            over ? 'bg-expense' : 'bg-income'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Remaining */}
                    <div className="bg-secondary/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">
                        {over ? 'Over Budget By' : 'Remaining'}
                      </p>
                      <p
                        className={`text-lg font-bold ${
                          over ? 'text-expense' : 'text-income'
                        }`}
                      >
                        {over
                          ? '-' + formatCurrency(budget.spent - budget.limit)
                          : formatCurrency(budget.limit - budget.spent)}
                      </p>
                    </div>

                    {/* Percentage */}
                    <div className="text-center">
                      <span className="text-xs text-muted-foreground">
                        {Math.round(percentage)}% of budget used
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Budget Tips */}
        <Card className="border border-border bg-card mt-8">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingDown className="w-5 h-5" />
              Budget Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-foreground">
              • Monitor your spending regularly to stay within budget
            </p>
            <p className="text-sm text-foreground">
              • Set realistic budget limits based on your income
            </p>
            <p className="text-sm text-foreground">
              • Review your budgets monthly and adjust as needed
            </p>
            <p className="text-sm text-foreground">
              • Track your expenses daily to catch overspending early
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
