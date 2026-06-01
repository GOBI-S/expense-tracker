import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();

    const {
      firebaseUid,
      name,
      email,
      photoURL,
    } = await req.json();

    let user = await User.findOne({
      firebaseUid,
    });

    if (!user) {
      user = await User.create({
        firebaseUid,
        name,
        email,
        photoURL,
      });
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Login failed",
      },
      {
        status: 500,
      }
    );
  }
}