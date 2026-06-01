'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { apiService } from '@/lib/api-service';
import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Category } from '@/types/expense';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES: Record<Category, string> = {
  food: 'Food',
  transport: 'Transport',
  shopping: 'Shopping',
  bills: 'Bills',
  entertainment: 'Entertainment',
  salary: 'Salary',
  other: 'Other',
};

export default function AddTransactionPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    category: 'food' as Category,
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      await apiService.addTransaction({
        userId: user.uid,
        type: formData.type,
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description,
        date: new Date(formData.date),
      });
      router.push('/dashboard/transactions');
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert('Failed to add transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation user={user} onLogout={handleLogout} />

      <div className="container mx-auto px-4 py-8">
        <Link href="/dashboard/transactions">
          <Button variant="ghost" className="text-foreground mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Transactions
          </Button>
        </Link>

        <Card className="border border-border bg-card max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">Add New Transaction</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Type Selection */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'income' })}
                    className={`p-3 rounded-lg border-2 transition-all font-medium ${
                      formData.type === 'income'
                        ? 'border-income bg-income/10 text-income'
                        : 'border-border bg-secondary text-foreground hover:border-income'
                    }`}
                  >
                    Income
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'expense' })}
                    className={`p-3 rounded-lg border-2 transition-all font-medium ${
                      formData.type === 'expense'
                        ? 'border-expense bg-expense/10 text-expense'
                        : 'border-border bg-secondary text-foreground hover:border-expense'
                    }`}
                  >
                    Expense
                  </button>
                </div>
              </div>

              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value as Category })
                  }
                  className="w-full bg-secondary border border-border rounded-lg px-4 py-2 text-foreground"
                >
                  {Object.entries(CATEGORIES).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Amount
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  className="bg-secondary border-border"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description
                </label>
                <Input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g., Grocery shopping, Monthly salary"
                  className="bg-secondary border-border"
                  required
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Date</label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="bg-secondary border-border"
                  required
                />
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={loading || !formData.amount || !formData.description}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {loading ? 'Adding...' : 'Add Transaction'}
                </Button>
                <Link href="/dashboard/transactions" className="flex-1">
                  <Button variant="outline" className="w-full text-foreground border-border">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
