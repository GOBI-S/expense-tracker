'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Category } from '@/types/expense';

interface ExpenseChartProps {
  categoryBreakdown: Record<Category, number>;
}

const CATEGORY_COLORS: Record<Category, string> = {
  food: 'oklch(0.6 0.118 184.704)',
  transport: 'oklch(0.55 0.211 9.23)',
  shopping: 'oklch(0.57 0.196 142.495)',
  bills: 'oklch(0.55 0.196 249.57)',
  entertainment: 'oklch(0.769 0.188 70.08)',
  salary: 'oklch(0.57 0.196 142.495)',
  other: 'oklch(0.269 0 0)',
};

const CATEGORY_LABELS: Record<Category, string> = {
  food: 'Food',
  transport: 'Transport',
  shopping: 'Shopping',
  bills: 'Bills',
  entertainment: 'Entertainment',
  salary: 'Salary',
  other: 'Other',
};

export function ExpenseChart({ categoryBreakdown }: ExpenseChartProps) {
  const data = Object.entries(categoryBreakdown)
    .filter(([_, value]) => value > 0)
    .map(([category, value]) => ({
      name: CATEGORY_LABELS[category as Category],
      value: Math.round(value),
      category: category as Category,
    }));

  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return (
      <Card className="border border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg">Expense Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <p className="text-muted-foreground">No expenses yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border bg-card">
      <CardHeader>
        <CardTitle className="text-lg">Expense Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.category]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => `$${value}`}
              contentStyle={{
                backgroundColor: 'rgba(20, 20, 20, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => (
                <span className="text-muted-foreground text-xs">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
