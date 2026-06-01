import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Budget from "@/lib/models/Budget";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const body = await req.json();

    const budget =
      await Budget.findByIdAndUpdate(
        params.id,
        body,
        { new: true }
      );

    return NextResponse.json(budget);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Update failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    await Budget.findByIdAndDelete(
      params.id
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Delete failed" },
      { status: 500 }
    );
  }
}