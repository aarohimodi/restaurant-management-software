import { dateToUTC } from "@/lib/date/dateOnly";
import { connectDB } from "@/lib/db";
import Cashbook from "@/models/Cashbook";
import Settings from "@/models/Settings";
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
        {
          status: 400,
        },
      );
    }

    const selectedDate = dateToUTC(date);

    const settings = await Settings.findOne();
    const initialOpening = settings?.openingBalance || 0;

    const previousSummary = await Cashbook.aggregate([
      {
        $match: {
          isDeleted: false,
          date: {
            $lt: selectedDate,
          },
        },
      },
      {
        $group: {
          _id: null,
          income: {
            $sum: {
              $cond: [{ $eq: ["$type", "Income"] }, "$amount", 0],
            },
          },
          expense: {
            $sum: {
              $cond: [{ $ne: ["$type", "Income"] }, "$amount", 0],
            },
          },
        },
      },
    ]);

    const totalIncome = previousSummary[0]?.income || 0;
    const totalExpense = previousSummary[0]?.expense || 0;
    const openingBalance = initialOpening + totalIncome - totalExpense;

    const entries = await Cashbook.find({
      date: selectedDate,
      isDeleted: false,
    })
      .populate("staff", "_id name")
      .sort({ createdAt: 1 })
      .lean();
    return Response.json({
      success: true,
      data: {
        openingBalance,
        entries,
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
