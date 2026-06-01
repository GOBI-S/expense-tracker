'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { apiService } from '@/lib/api-service';
import { SummaryCards } from '@/components/dashboard/summary-cards';
import { ExpenseChart } from '@/components/dashboard/expense-chart';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import type { Category, Transaction } from '@/types/expense';
import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

function DashboardContent() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState<Record<Category, number>>({
    food: 0,
    transport: 0,
    shopping: 0,
    bills: 0,
    entertainment: 0,
    salary: 0,
    other: 0,
  });

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }

    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const summary = await apiService.getDashboardSummary(user.uid);
        setTotalBalance(summary.totalBalance);
        setTotalIncome(summary.totalIncome);
        setTotalExpense(summary.totalExpense);
        setRecentTransactions(summary.recentTransactions);
        setCategoryBreakdown(summary.categoryBreakdown);
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation user={user} onLogout={handleLogout} />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.displayName || 'User'}!</p>
          </div>
          <Link href="/dashboard/transactions/add">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground mt-4 md:mt-0">
              <Plus className="w-4 h-4 mr-2" />
              Add Transaction
            </Button>
          </Link>
        </div>

        <div className="space-y-6">
          {/* Summary Cards */}
          <SummaryCards
            totalBalance={totalBalance}
            totalIncome={totalIncome}
            totalExpense={totalExpense}
          />

          {/* Charts and Recent Transactions Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ExpenseChart categoryBreakdown={categoryBreakdown} />
            </div>
            <div className="space-y-6">
              {/* Budget Overview could go here */}
            </div>
          </div>

          {/* Recent Transactions */}
          <RecentTransactions transactions={recentTransactions} />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return <DashboardContent />;
}
