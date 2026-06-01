import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Transaction from "@/lib/models/Transaction";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    console.log(body);

    const transaction = await Transaction.create({
      userId: body.userId,
      type: body.type,
      amount: body.amount,
      category: body.category,
      description: body.description,
      date: body.date,
    });

    return NextResponse.json({
  id: transaction._id.toString(),
  userId: transaction.userId,
  type: transaction.type,
  amount: transaction.amount,
  category: transaction.category,
  description: transaction.description,
  date: transaction.date,
  createdAt: transaction.createdAt,
});
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to create transaction" },
      { status: 500 }
    );
  }
}
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const userId =
      req.nextUrl.searchParams.get("userId");

    const transactions =
      await Transaction.find({
        userId,
      }).sort({
        date: -1,
      });

    const formatted = transactions.map(
      (transaction) => ({
        id: transaction._id.toString(),
        userId: transaction.userId,
        type: transaction.type,
        amount: transaction.amount,
        category: transaction.category,
        description: transaction.description,
        date: transaction.date,
        createdAt: transaction.createdAt,
      })
    );

    return NextResponse.json(formatted);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}