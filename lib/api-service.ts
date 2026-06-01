import { Transaction, Budget } from '@/types/expense';

export const apiService = {
  // =========================
  // TRANSACTIONS
  // =========================

  async getTransactions(userId: string): Promise<Transaction[]> {
    const response = await fetch(
      `/api/transactions?userId=${userId}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch transactions');
    }

    return response.json();
  },

  async addTransaction(
    transaction: Omit<Transaction, 'id' | 'createdAt'>
  ): Promise<Transaction> {
    const response = await fetch(
      '/api/transactions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to add transaction');
    }

    return response.json();
  },

  async updateTransaction(
    id: string,
    updates: Partial<Transaction>
  ): Promise<Transaction> {
    const response = await fetch(
      `/api/transactions/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to update transaction');
    }

    return response.json();
  },

  async deleteTransaction(id: string): Promise<void> {
    const response = await fetch(
      `/api/transactions/${id}`,
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      throw new Error('Failed to delete transaction');
    }
  },

  // =========================
  // DASHBOARD
  // =========================

  async getDashboardSummary(userId: string) {
    const response = await fetch(
      `/api/dashboard/summary?userId=${userId}`
    );

    if (!response.ok) {
      throw new Error('Failed to load dashboard');
    }

    return response.json();
  },

  // =========================
  // BUDGETS
  // =========================

async getBudgets(
  userId: string,
  month?: string
) {
  const query = new URLSearchParams({
    userId,
  });

  if (month) {
    query.append("month", month);
  }

  const response = await fetch(
    `/api/budgets?${query}`
  );

  return response.json();
},

  async createBudget(data: any) {
  const response = await fetch(
    "/api/budgets",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  return response.json();
},

  async updateBudget(
  id: string,
  updates: any
) {
  const response = await fetch(
    `/api/budgets/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify(updates),
    }
  );

  return response.json();
},

  async deleteBudget(id: string) {
  const response = await fetch(
    `/api/budgets/${id}`,
    {
      method: "DELETE",
    }
  );

  return response.json();
},

  // =========================
  // AUTH
  // =========================

  async saveGoogleUser(user: {
    firebaseUid: string;
    name: string;
    email: string;
    photoURL: string;
  }) {
    const response = await fetch(
      '/api/auth/google',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to save user');
    }

    return response.json();
  },
};