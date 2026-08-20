import { dateToUTC, getTodayDateInputValue } from "@/lib/date/dateOnly";
import { connectDB } from "@/lib/db";
import Attendance from "@/models/Attendance";
import "@/models/Staff";
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { date, attendance } = body;
    const attendanceDate = dateToUTC(date);

    const today = dateToUTC(getTodayDateInputValue());

    if (attendanceDate > today) {
      return Response.json(
        {
          success: false,
          message: "Future attendance is not allowed",
        },
        { status: 400 },
      );
    }
    const attendanceData = attendance.map((item: any) => ({
      staff: item.staff,
      date: attendanceDate,
      status: item.status,
      leaveReason: item.leaveReason,
    }));
    const nextDay = new Date(attendanceDate);
    nextDay.setUTCDate(nextDay.getUTCDate() + 1);
    const existingAttendance = await Attendance.findOne({
      date: {
        $gte: attendanceDate,
        $lt: nextDay,
      },
    });
    console.log("Existing Attendance:", existingAttendance);

    const allAttendance = await Attendance.find({});
    console.log(
      allAttendance.map((item) => ({
        date: item.date,
        staff: item.staff,
      })),
    );
    if (existingAttendance) {
      return Response.json(
        {
          success: false,
          message: "Attendance already marked for this date",
        },
        { status: 400 },
      );
    }
    await Attendance.insertMany(attendanceData);
    return Response.json({
      success: true,
      message: "Attendance marked successfully",
    });
  } catch (error: any) {
    console.error("POST Attendance Error:", error);

    if (error.code === 11000) {
      return Response.json(
        {
          success: false,
          message: "Attendance  already marked for this date",
        },
        {
          status: 400,
        },
      );
    }

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

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    if (date) {
      const selectedDate = dateToUTC(date);
      if (isNaN(selectedDate.getTime())) {
        return Response.json(
          {
            success: false,
            message: "Invalid date",
          },
          {
            status: 400,
          },
        );
      }
      const attendance = await Attendance.find({ date: selectedDate })
        .populate("staff", "name")
        .lean();
      return Response.json({
        success: true,
        data: attendance,
      });
    }
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 4;
    const searchDate = searchParams.get("searchDate");
    let matchStage = {};
    if (searchDate) {
      const startDate = dateToUTC(searchDate);
      const endDate = new Date(startDate);
      endDate.setUTCDate(endDate.getUTCDate() + 1);
      matchStage = {
        date: {
          $gte: startDate,
          $lt: endDate,
        },
      };
    }
    const skip = (page - 1) * limit;
    const totalRecords = await Attendance.distinct("date", matchStage);
    const total = totalRecords.length;
    const totalPages = Math.ceil(total / limit);
    const history = await Attendance.aggregate([
      {
        $match: matchStage,
      },
      {
        $group: {
          _id: "$date",
          present: {
            $sum: {
              $cond: [{ $eq: ["$status", "Present"] }, 1, 0],
            },
          },
          absent: {
            $sum: {
              $cond: [{ $eq: ["$status", "Absent"] }, 1, 0],
            },
          },

          paidLeave: {
            $sum: {
              $cond: [{ $eq: ["$status", "Paid Leave"] }, 1, 0],
            },
          },

          unpaidLeave: {
            $sum: {
              $cond: [{ $eq: ["$status", "Unpaid Leave"] }, 1, 0],
            },
          },

          halfDay: {
            $sum: {
              $cond: [{ $eq: ["$status", "Half Day"] }, 1, 0],
            },
          },
          totalStaff: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);
    return Response.json({
      success: true,
      data: history,
      pagination: {
        currentPage: page,
        totalPages,
        totalRecords: total,
        limit,
      },
    });
  } catch (error) {
    console.log(error);
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
export async function PUT(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const { date, attendance } = body;
    if (!date || !Array.isArray(attendance) || attendance.length === 0) {
      return Response.json(
        {
          success: false,
          message: "Attendance data is required",
        },
        { status: 400 },
      );
    }
    const attendanceDate = dateToUTC(date);

    const today = dateToUTC(getTodayDateInputValue());

    if (attendanceDate > today) {
      return Response.json(
        {
          success: false,
          message: "Future attendance cannot be updated.",
        },
        { status: 400 },
      );
    }

    for (const item of attendance) {
      await Attendance.findByIdAndUpdate(item._id, {
        status: item.status,
        leaveReason: item.leaveReason,
      });
    }

    return Response.json({
      success: true,
      message: "Attendance updated successfully",
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
