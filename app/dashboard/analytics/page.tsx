'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { apiService } from '@/lib/api-service';
import { Navigation } from '@/components/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AnalyticsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        const summary = await apiService.getDashboardSummary(user.uid);
        setTotalIncome(summary.totalIncome);
        setTotalExpense(summary.totalExpense);
      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  // Sample data for charts
  const monthlyData = [
    { month: 'Jan', income: 5000, expense: 3200 },
    { month: 'Feb', income: 5500, expense: 3400 },
    { month: 'Mar', income: 5200, expense: 3100 },
    { month: 'Apr', income: 5800, expense: 3600 },
    { month: 'May', income: 6000, expense: 3800 },
  ];

  const savingsData = [
    { month: 'Jan', savings: 1800 },
    { month: 'Feb', savings: 2100 },
    { month: 'Mar', savings: 2100 },
    { month: 'Apr', savings: 2200 },
    { month: 'May', savings: 2200 },
  ];

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
          <h1 className="text-4xl font-bold text-foreground mb-2">Analytics</h1>
          <p className="text-muted-foreground">Track your financial trends and patterns</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card className="border border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Income
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-income">
                ${totalIncome.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Expense
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-expense">
                ${totalExpense.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Comparison Chart */}
        <Card className="border border-border bg-card mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Monthly Income vs Expense</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(20, 20, 20, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="income" fill="var(--income)" name="Income" />
                <Bar dataKey="expense" fill="var(--expense)" name="Expense" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Savings Trend Chart */}
        <Card className="border border-border bg-card mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Monthly Savings Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={savingsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(20, 20, 20, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="savings"
                  stroke="var(--income)"
                  strokeWidth={2}
                  name="Savings"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
