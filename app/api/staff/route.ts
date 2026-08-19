import { connectDB } from "@/lib/db";
import Staff from "@/models/Staff";
import { NextResponse, NextRequest } from "next/server";
import SalaryHistory from "@/models/SalaryHistory";
import { dateToUTC } from "@/lib/date/dateOnly";
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, phone, designation, salary, joiningDate, address, isActive } =
      body;
    if (!name || !phone || !designation || !salary || !joiningDate) {
      return NextResponse.json(
        {
          success: false,
          message: "All required fields are required.",
        },
        { status: 400 },
      );
    }
    const existingStaff = await Staff.findOne({ phone });
    if (existingStaff) {
      return NextResponse.json(
        {
          success: false,
          message: "Phone number already exists.",
        },
        { status: 409 },
      );
    }
    const joiningDateValue = dateToUTC(joiningDate);
    const staff = await Staff.create({
      name,
      phone,
      designation,
      salary,
      joiningDate: joiningDateValue,
      address,
      isActive,
    });
    await SalaryHistory.create({
      staff: staff._id,
      salary,
      effectiveFrom: joiningDateValue,
      reason: "Initial Salary",
    });
    return NextResponse.json(
      {
        success: true,
        message: "Staff added successfully.",
        data: staff,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const staff = await Staff.find().sort({ createdAt: -1 });
    return NextResponse.json(
      {
        success: true,
        data: staff,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 },
    );
  }
}
