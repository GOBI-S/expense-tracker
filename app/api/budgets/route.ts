import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Budget from "@/lib/models/Budget";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const userId =
      req.nextUrl.searchParams.get("userId");

    const month =
      req.nextUrl.searchParams.get("month");

    const query: any = {
      userId,
    };

    if (month) {
      query.month = month;
    }

    const budgets =
      await Budget.find(query);

    return NextResponse.json(budgets);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to load budgets" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    const budget =
      await Budget.create(body);

    return NextResponse.json(
      budget,
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to create budget" },
      { status: 500 }
    );
  }
}