import {
  dateObjectToUTC,
  dateToUTC,
  getTodayDateInputValue,
} from "@/lib/date/dateOnly";
import { connectDB } from "@/lib/db";
import Cashbook from "@/models/Cashbook";
import SalaryHistory from "@/models/SalaryHistory";
import Settings from "@/models/Settings";

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { type, staff, amount, remarks, date } = body;
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
    const settings = await Settings.findOne();
    if (!settings) {
      return Response.json(
        {
          success: false,
          message: "Please configure settings first",
        },
        {
          status: 400,
        },
      );
    }
    const selectedDate = dateToUTC(date);
    const today = dateToUTC(getTodayDateInputValue());
    if (selectedDate > today) {
      return Response.json(
        {
          success: false,
          message: "Future date entries are not allowed",
        },
        {
          status: 400,
        },
      );
    }

    if (amount <= 0) {
      return Response.json(
        {
          success: false,
          message: "Amount must be greater than zero",
        },
        {
          status: 400,
        },
      );
    }
    if (type === "Staff Expense") {
      if (!staff) {
        return Response.json(
          {
            success: false,
            message: "Staff is required",
          },
          {
            status: 400,
          },
        );
      }

      // Current month
      const month = selectedDate.getUTCMonth() + 1;
      const year = selectedDate.getUTCFullYear();
      // Get staff monthly salary
      // const selectedDate = new Date(Date.UTC(year, month, 0));
      const salaryHistory = await SalaryHistory.findOne({
        staff,
        effectiveFrom: {
          $lte: selectedDate,
        },
      }).sort({
        effectiveFrom: -1,
      });
      if (!salaryHistory) {
        return Response.json(
          {
            success: false,
            message: "Salary history not found",
          },
          {
            status: 404,
          },
        );
      }

      // Total advance already given in current month

      const advances = await Cashbook.find({
        staff,
        type: "Staff Expense",
        isDeleted: false,
        date: {
          $gte: new Date(Date.UTC(year, month - 1, 1)),
          $lt: new Date(Date.UTC(year, month, 1)),
        },
      });
      const totalAdvance = advances.reduce((sum, item) => sum + item.amount, 0);
      // Prevent advance more than monthly salary
      if (totalAdvance + amount > salaryHistory.salary) {
        return Response.json(
          {
            success: false,
            message:
              "Total salary advance cannot exceed the staff's monthly salary.",
          },
          {
            status: 400,
          },
        );
      }
    }

    await Cashbook.create({
      date: selectedDate,
      type,
      staff: staff || null,
      amount,
      remarks,
    });
    return Response.json({
      success: true,
      message: "Entry added successfully",
    });
  } catch (error) {
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

    const page = Number(searchParams.get("page")) || 1;
    const limit = 10;

    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");

    // Initial opening balance from settings
    const settings = await Settings.findOne();
    const initialOpening = settings?.openingBalance || 0;

    // Get ALL cashbook daily summaries
    const summary = await Cashbook.aggregate([
      {
        $match: {
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: "$date",

          income: {
            $sum: {
              $cond: [
                {
                  $eq: ["$type", "Income"],
                },
                "$amount",
                0,
              ],
            },
          },

          expense: {
            $sum: {
              $cond: [
                {
                  $ne: ["$type", "Income"],
                },
                "$amount",
                0,
              ],
            },
          },
        },
      },
      {
        // IMPORTANT:
        // Opening/closing calculate karne ke liye oldest -> newest
        $sort: {
          _id: 1,
        },
      },
    ]);

    // Calculate opening + closing for every day
    let currentOpening = initialOpening;

    const result = summary.map((item) => {
      const closing = currentOpening + item.income - item.expense;

      const row = {
        ...item,
        opening: currentOpening,
        closing,
      };

      currentOpening = closing;

      return row;
    });

    // ---------------------------------------
    // Date Search
    // ---------------------------------------

    let filteredResult = result;

    if (fromDate) {
      const startDate = dateToUTC(fromDate);

      filteredResult = filteredResult.filter((item) => item._id >= startDate);
    }

    if (toDate) {
      const endDate = dateToUTC(toDate);

      filteredResult = filteredResult.filter((item) => item._id <= endDate);
    }

    // ---------------------------------------
    // Newest date first
    // ---------------------------------------

    filteredResult.reverse();

    // ---------------------------------------
    // Pagination
    // ---------------------------------------

    const totalRecords = filteredResult.length;

    const totalPages = Math.ceil(totalRecords / limit);

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedData = filteredResult.slice(startIndex, endIndex);

    return Response.json({
      success: true,
      data: paginatedData,
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

// export async function GET(request: Request) {
//   try {
//     await connectDB();
//     const { searchParams } = new URL(request.url);
//     const page = Number(searchParams.get("page")) || 1;
//     const limit = 10;
//     const fromDate = searchParams.get("fromDate");
//     const toDate = searchParams.get("toDate");

//     const matchStage: any = {
//       isDeleted: false,
//     };

//     // Date Search

//     if (fromDate || toDate) {
//       matchStage.date = {};
//       if (fromDate) {
//         matchStage.date.$gte = dateToUTC(fromDate);
//       }
//       if (toDate) {
//         const endDate = dateToUTC(toDate);
//         endDate.setUTCDate(endDate.getUTCDate() + 1);
//         matchStage.date.$lt = endDate;
//       }
//     }
//     // const entries = await Cashbook.find({
//     //   isDeleted: false,
//     // }).sort({
//     //   date: -1,
//     // });
//     const summary = await Cashbook.aggregate([
//       {
//         $match: matchStage,
//       },
//       {
//         $group: {
//           _id: "$date",
//           income: {
//             $sum: {
//               $cond: [
//                 {
//                   $eq: ["$type", "Income"],
//                 },
//                 "$amount",
//                 0,
//               ],
//             },
//           },
//           expense: {
//             $sum: {
//               $cond: [{ $ne: ["$type", "Income"] }, "$amount", 0],
//             },
//           },
//         },
//       },
//       {
//         $sort: {
//           _id: -1,
//         },
//       },
//       {
//         $skip: (page - 1) * limit,
//       },
//       {
//         $limit: limit,
//       },
//     ]);

//     // Total number of days

//     const totalRecordsResult = await Cashbook.aggregate([
//       {
//         $match: matchStage,
//       },
//       {
//         $group: { _id: "$date" },
//       },
//       {
//         $count: "total",
//       },
//     ]);
//     const totalRecords = totalRecordsResult[0]?.total || 0;

//     const totalPages = Math.ceil(totalRecords / limit);
//     return Response.json({
//       success: true,
//       data: summary,
//       pagination: {
//         currentPage: page,
//         totalPages,
//         totalRecords,
//         limit,
//       },
//     });
//   } catch (error) {
//     console.error(error);

//     return Response.json(
//       {
//         success: false,
//         message: "Something went wrong",
//       },
//       {
//         status: 500,
//       },
//     );
//   }
// }
