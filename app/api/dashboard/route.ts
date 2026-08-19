import { dateToUTC, getTodayDateInputValue } from "@/lib/date/dateOnly";
import { connectDB } from "@/lib/db";
import Cashbook from "@/models/Cashbook";
import Settings from "@/models/Settings";
import Staff from "@/models/Staff";
import Attendance from "@/models/Attendance";

export async function GET() {
  try {
    await connectDB();

    const today = dateToUTC(getTodayDateInputValue());

    // -----------------------------
    // TODAY'S DATE RANGE
    // -----------------------------

    const tomorrow = new Date(today);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

    // -----------------------------
    // SETTINGS
    // -----------------------------

    const settings = await Settings.findOne().lean();

    const initialOpeningBalance = settings?.openingBalance || 0;

    // -----------------------------
    // CASHBOOK SUMMARY
    // -----------------------------

    const cashbookSummary = await Cashbook.aggregate([
      {
        $match: {
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: null,

          totalIncome: {
            $sum: {
              $cond: [{ $eq: ["$type", "Income"] }, "$amount", 0],
            },
          },

          totalExpense: {
            $sum: {
              $cond: [{ $ne: ["$type", "Income"] }, "$amount", 0],
            },
          },

          todayIncome: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$type", "Income"] },
                    { $gte: ["$date", today] },
                    { $lt: ["$date", tomorrow] },
                  ],
                },
                "$amount",
                0,
              ],
            },
          },

          todayExpense: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $ne: ["$type", "Income"] },
                    { $gte: ["$date", today] },
                    { $lt: ["$date", tomorrow] },
                  ],
                },
                "$amount",
                0,
              ],
            },
          },
        },
      },
    ]);

    const summary = cashbookSummary[0] || {
      totalIncome: 0,
      totalExpense: 0,
      todayIncome: 0,
      todayExpense: 0,
    };

    // -----------------------------
    // CASH IN HAND
    // -----------------------------

    const cashInHand =
      initialOpeningBalance + summary.totalIncome - summary.totalExpense;

    // -----------------------------
    // TOTAL STAFF
    // -----------------------------

    const totalStaff = await Staff.countDocuments();

    // -----------------------------
    // TODAY'S ATTENDANCE
    // -----------------------------

    const attendance = await Attendance.find({
      date: today,
    })
      .populate("staff", "_id name")
      .lean();

    return Response.json({
      success: true,

      data: {
        cashInHand,
        todayIncome: summary.todayIncome,
        todayExpense: summary.todayExpense,
        totalStaff,
        attendance,
      },
    });
  } catch (error) {
    console.error("Dashboard GET Error:", error);

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
