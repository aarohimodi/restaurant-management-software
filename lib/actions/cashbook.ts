import { connectDB } from "../db";
import Cashbook from "@/models/Cashbook";
import Settings from "@/models/Settings";
export async function getCashbookSummary() {
  await connectDB();
  const settings = await Settings.findOne().lean();
  const openingBalance = settings?.openingBalance || 0;
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
    {
      $sort: {
        _id: 1,
      },
    },
  ]);

  let currentOpening = openingBalance;
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
  return result.reverse();
}
