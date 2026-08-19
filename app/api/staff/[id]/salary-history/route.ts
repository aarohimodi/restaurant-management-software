import { connectDB } from "@/lib/db";
import SalaryHistory from "@/models/SalaryHistory";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Staff ID",
        },
        { status: 400 },
      );
    }

    const history = await SalaryHistory.find({ staff: id }).sort({
      effectiveFrom: -1,
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      message: "Salary history fetched successfully",
      data: history,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}
