import { dateToUTC } from "@/lib/date/dateOnly";
import { connectDB } from "@/lib/db";
import Attendance from "@/models/Attendance";
import Staff from "@/models/Staff";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    if (!date) {
      return Response.json(
        {
          success: false,
          message: "Date is required",
        },
        { status: 400 },
      );
    }
    const attendanceDate = dateToUTC(date);
    if (isNaN(attendanceDate.getTime())) {
      return Response.json(
        {
          success: false,
          message: "Invalid date",
        },
        { status: 400 },
      );
    }
    const eligibleStaffs = await Staff.find({
      joiningDate: { $lte: attendanceDate },
      $or: [
        { leftDate: { $exists: false } },
        { leftDate: null },
        { leftDate: { $gte: attendanceDate } },
      ],
    }).select("_id name");

    const nextDay = new Date(attendanceDate);
    nextDay.setUTCDate(nextDay.getUTCDate() + 1);
    const existingAttendance = await Attendance.find({
      date: {
        $gte: attendanceDate,
        $lt: nextDay,
      },
    }).select("staff");

    const existingStaffIds = existingAttendance.map((attendance) =>
      attendance.staff.toString(),
    );
    const missingStaffs = eligibleStaffs.filter(
      (staff) => !existingStaffIds.includes(staff._id.toString()),
    );
    return Response.json({
      success: true,
      data: missingStaffs,
      eligibleStaffCount: eligibleStaffs.length,
    });
  } catch (error) {
    console.error("Missing Attendance Error:", error);

    return Response.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}
