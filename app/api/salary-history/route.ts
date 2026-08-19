import { connectDB } from "@/lib/db";
import SalaryHistory from "@/models/SalaryHistory";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { staff, salary, effectiveFrom, reason } = body;

    if (!staff || !salary || !effectiveFrom) {
      return NextResponse.json(
        {
          success: false,
          message: "All required fields are mandatory.",
        },
        { status: 400 },
      );
    }
    const existingSalaryHistory = await SalaryHistory.findOne({
      staff,
      effectiveFrom,
    });

    if (existingSalaryHistory) {
      return NextResponse.json(
        {
          success: false,
          message: "Salary history already exists for this date.",
        },
        { status: 409 },
      );
    }
    const salaryHistory = await SalaryHistory.create({
      staff,
      salary,
      effectiveFrom,
      reason,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Salary history added successfully.",
        data: salaryHistory,
      },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Something went wrong.",
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const staff = searchParams.get("staff");

    if (!staff) {
      return NextResponse.json(
        {
          success: false,
          message: "Staff id is required.",
        },
        { status: 400 },
      );
    }

    const salaryHistory = await SalaryHistory.find({ staff }).sort({
      effectiveFrom: -1,
    });

    return NextResponse.json({
      success: true,
      data: salaryHistory,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Something went wrong.",
      },
      { status: 500 },
    );
  }
}
