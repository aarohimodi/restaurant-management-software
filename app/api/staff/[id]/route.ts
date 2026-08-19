import { connectDB } from "@/lib/db";
import SalaryHistory from "@/models/SalaryHistory";
import Staff from "@/models/Staff";
import { dateObjectToUTC, dateToUTC } from "@/lib/date/dateOnly";
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
    const staff = await Staff.findById(id);
    if (!staff) {
      return NextResponse.json(
        {
          success: false,
          message: "Staff not found",
        },
        { status: 404 },
      );
    }
    return NextResponse.json({
      success: true,
      message: "Staff fetched successfully",
      data: staff,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await context.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json(
        {
          success: false,
          message: "Invalid Staff ID",
        },
        { status: 400 },
      );
    }
    const body = await request.json();
    const {
      name,
      phone,
      designation,
      salary,
      joiningDate,
      address,
      isActive,
      reason,
    } = body;
    console.log(body);
    const staff = await Staff.findById(id);
    if (!staff) {
      return Response.json(
        {
          success: false,
          message: "Staff not found",
        },
        { status: 404 },
      );
    }
    const salaryChanged = staff.salary !== salary;
    const joiningDateValue = dateToUTC(joiningDate);
    const updateData: any = {
      name,
      phone,
      designation,
      salary,
      joiningDate: joiningDateValue,
      address,
      isActive,
    };
    if (staff.isActive && !isActive) {
      updateData.leftDate = new Date();
    }
    if (!staff.isActive && isActive) {
      updateData.leftDate = null;
    }
    const updatedStaff = await Staff.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (salaryChanged) {
      const today = new Date();
      let effectiveFrom: Date;

      if (today.getDate() === 1) {
        effectiveFrom = dateObjectToUTC(
          new Date(today.getFullYear(), today.getMonth(), 1),
        );
      } else {
        effectiveFrom = dateObjectToUTC(
          new Date(today.getFullYear(), today.getMonth() + 1, 1),
        );
      }
      await SalaryHistory.create({
        staff: id,
        salary,
        effectiveFrom,
        reason: reason || "Salary Updated",
      });
    }
    return Response.json({
      success: true,
      message: "Staff updated successfully",
      data: updatedStaff,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await context.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json(
        {
          success: false,
          message: "Invalid Staff ID",
        },
        { status: 400 },
      );
    }
    const staff = await Staff.findById(id);
    if (!staff) {
      return Response.json(
        {
          success: false,
          message: "Staff not found",
        },
        { status: 404 },
      );
    }
    await Staff.findByIdAndDelete(id);
    return Response.json({
      success: true,
      message: "Staff deleted successfully",
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}
