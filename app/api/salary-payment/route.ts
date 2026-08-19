import { dateToUTC, getTodayDateInputValue } from "@/lib/date/dateOnly";
import { connectDB } from "@/lib/db";
import { calculateSalary } from "@/lib/salary/calculateSalary";
// import AttendanceLock from "@/models/AttendanceLock";
import Cashbook from "@/models/Cashbook";
import SalaryPayment from "@/models/SalaryPayment";

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { staffId, month, year, amount, paymentMode, remarks } = body;
    if (!staffId || !month || !year || !amount || !paymentMode) {
      return Response.json({
        success: false,
        message: "Missing required fields",
      });
    }

    // SALARY CALCULATION CODE START

    const result = await calculateSalary({
      staffId,
      month,
      year,
    });

    if (!result.success) {
      return Response.json(result);
    }

    const salary = result.data!;
    // salary payment api code is starts from here

    // Salary month must be completed
    const today = new Date();

    const currentMonth = today.getUTCMonth() + 1;
    const currentYear = today.getUTCFullYear();

    const salaryMonthCompleted =
      year < currentYear || (year === currentYear && month < currentMonth);

    if (!salaryMonthCompleted) {
      return Response.json(
        {
          success: false,
          message:
            "Salary can only be paid after the salary month is completed.",
        },
        { status: 400 },
      );
    }

    if (salary.remainingSalary <= 0) {
      return Response.json(
        {
          success: false,
          message: "Salary has already been paid.",
        },
        { status: 400 },
      );
    }
    if (amount !== salary.remainingSalary) {
      return Response.json(
        {
          success: false,
          message: "Full remaining salary must be paid.",
        },
        { status: 400 },
      );
    }
    if (amount <= 0) {
      return Response.json(
        {
          success: false,
          message: "Amount must be greater than zero",
        },
        { status: 400 },
      );
    }
    await SalaryPayment.create({
      staff: staffId,
      month,
      year,
      amount,
      paymentMode,
      remarks,
    });

    const paymentDate = dateToUTC(getTodayDateInputValue());
    await Cashbook.create({
      date: paymentDate,
      type: "Salary Payment",
      staff: staffId,
      amount,
      remarks:
        remarks?.trim() ||
        `Salary paid to ${salary.staff.name} for ${month}/${year}`,
    });

    // const newRemainingSalary = salary.remainingSalary - amount;

    // if (newRemainingSalary === 0) {
    //   await AttendanceLock.create({
    //     staff: staffId,
    //     month,
    //     year,
    //   });
    // }
    return Response.json({
      success: true,
      message: "Salary paid successfully",
    });
  } catch (error) {
    console.error(error);

    return Response.json({
      success: false,
      message: "Something went wrong",
    });
  }
}
export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const page = Math.max(Number(searchParams.get("page")) || 1, 1);
    const limit = 10;

    const month = searchParams.get("month");
    const year = searchParams.get("year");
    const staff = searchParams.get("staff");

    const matchStage: any = {};

    if (month) {
      matchStage.month = Number(month);
    }

    if (year) {
      matchStage.year = Number(year);
    }

    if (staff) {
      matchStage.staff = staff;
    }

    const payments = await SalaryPayment.find(matchStage)
      .populate("staff", "_id name")
      .sort({ paymentDate: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const totalRecords = await SalaryPayment.countDocuments(matchStage);

    const totalPages = Math.ceil(totalRecords / limit);

    return Response.json({
      success: true,
      data: payments,
      pagination: {
        currentPage: page,
        totalPages,
        totalRecords,
        limit,
      },
    });
  } catch (error) {
    console.error(error);

    return Response.json(
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
