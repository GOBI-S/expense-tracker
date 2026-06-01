'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { apiService } from '@/lib/api-service';
import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, LogOut, Trash2, Edit2 } from 'lucide-react';
import Link from 'next/link';
import { Transaction, Category } from '@/types/expense';
import { formatDistance } from 'date-fns';

const CATEGORY_NAMES: Record<Category, string> = {
  food: 'Food',
  transport: 'Transport',
  shopping: 'Shopping',
  bills: 'Bills',
  entertainment: 'Entertainment',
  salary: 'Salary',
  other: 'Other',
};

export default function TransactionsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState<'all' | Category>('all');

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }

    const loadTransactions = async () => {
      try {
        setLoading(true);
        const data = await apiService.getTransactions(user.uid);
        setTransactions(data);
        setFilteredTransactions(data);
      } catch (error) {
        console.error('Error loading transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [user, router]);

  useEffect(() => {
    let filtered = transactions;

    if (searchQuery) {
      filtered = filtered.filter(
        (t) =>
          t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.amount.toString().includes(searchQuery)
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter((t) => t.type === filterType);
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter((t) => t.category === filterCategory);
    }

    setFilteredTransactions(filtered);
  }, [searchQuery, filterType, filterCategory, transactions]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      try {
        await apiService.deleteTransaction(id);
        setTransactions(transactions.filter((t) => t.id !== id));
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

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
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Transactions</h1>
            <p className="text-muted-foreground">Manage all your income and expenses</p>
          </div>
          <Link href="/dashboard/transactions/add">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground mt-4 md:mt-0">
              <Plus className="w-4 h-4 mr-2" />
              Add Transaction
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card className="border border-border bg-card mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Search</label>
                <Input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-secondary border-border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as 'all' | 'income' | 'expense')}
                  className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-foreground"
                >
                  <option value="all">All Types</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Category</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value as 'all' | Category)}
                  className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-foreground"
                >
                  <option value="all">All Categories</option>
                  {Object.entries(CATEGORY_NAMES).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setFilterType('all');
                    setFilterCategory('all');
                  }}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <Card className="border border-border bg-card">
          <CardHeader>
            <CardTitle className="text-lg">
              {filteredTransactions.length} Transaction{filteredTransactions.length !== 1 ? 's' : ''}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No transactions found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-foreground">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-foreground">Description</th>
                      <th className="text-left py-3 px-4 font-medium text-foreground">Category</th>
                      <th className="text-left py-3 px-4 font-medium text-foreground">Type</th>
                      <th className="text-right py-3 px-4 font-medium text-foreground">Amount</th>
                      <th className="text-right py-3 px-4 font-medium text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b border-border hover:bg-secondary/30">
                        <td className="py-3 px-4 text-sm text-foreground">
                          {new Date(transaction.date).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-sm text-foreground">{transaction.description}</td>
                        <td className="py-3 px-4 text-sm text-foreground">
                          {CATEGORY_NAMES[transaction.category]}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded ${
                              transaction.type === 'income'
                                ? 'bg-income/10 text-income'
                                : 'bg-expense/10 text-expense'
                            }`}
                          >
                            {transaction.type === 'income' ? 'Income' : 'Expense'}
                          </span>
                        </td>
                        <td
                          className={`py-3 px-4 text-right font-semibold ${
                            transaction.type === 'income' ? 'text-income' : 'text-expense'
                          }`}
                        >
                          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex gap-2 justify-end">
                            {/* <Link href={`/dashboard/transactions/${transaction.id}/edit`}>
                              <Button variant="ghost" size="icon" className="text-foreground hover:bg-secondary">
                                <Edit2 className="w-4 h-4" />
                              </Button>
                            </Link> */}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-expense hover:bg-expense/10"
                              onClick={() => handleDelete(transaction.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
