import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Transaction from "@/lib/models/Transaction";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        {
          message: "User ID is required",
        },
        {
          status: 400,
        }
      );
    }

    const transactions = await Transaction.find({
      userId,
    }).sort({
      date: -1,
    });

    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalBalance = totalIncome - totalExpense;

    const categoryBreakdown = {
      food: 0,
      transport: 0,
      shopping: 0,
      bills: 0,
      entertainment: 0,
      salary: 0,
      other: 0,
    };

    transactions.forEach((transaction) => {
      if (transaction.type !== "expense") return;

      const category =
        transaction.category?.toLowerCase();

      if (
        category &&
        category in categoryBreakdown
      ) {
        categoryBreakdown[
          category as keyof typeof categoryBreakdown
        ] += transaction.amount;
      }
    });

    const recentTransactions = transactions
      .slice(0, 5)
      .map((transaction) => ({
        id: transaction._id.toString(),
        userId: transaction.userId,
        type: transaction.type,
        amount: transaction.amount,
        category: transaction.category,
        description: transaction.description,
        date: transaction.date,
        createdAt: transaction.createdAt,
      }));

    return NextResponse.json({
      totalBalance,
      totalIncome,
      totalExpense,
      recentTransactions,
      categoryBreakdown,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);

    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}