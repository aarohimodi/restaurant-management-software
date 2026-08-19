import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { success } from "zod";

export async function GET() {
  try {
    await connectDB();
    const existingAdmin = await User.findOne({
      email: "admin@gmail.com",
    });
    if (existingAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin already exists",
        },
        {
          status: 400,
        },
      );
    }

    const hashedPassword = await bcrypt.hash("12345678", 10);
    await User.create({
      name: "Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "admin",
      isActive: true,
    });
    return NextResponse.json({
      success: true,
      message: "Admin created successfully",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      {
        status: 500,
      },
    );
  }
}
