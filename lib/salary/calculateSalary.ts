import Attendance from "@/models/Attendance";
import Cashbook from "@/models/Cashbook";
import SalaryHistory from "@/models/SalaryHistory";
import SalaryPayment from "@/models/SalaryPayment";
import Staff from "@/models/Staff";
import { dateObjectToUTC, toDateInputValue } from "../date/dateOnly";

interface CalculateSalaryParams {
  staffId: string;
  month: number;
  year: number;
}

/**
 * =====================================================
 * Salary Calculation Helper
 * =====================================================
 *
 * This helper calculates complete monthly salary details.
 *
 * Responsibilities:
 * ------------------------------------------
 * ✔ Validate selected month
 * ✔ Validate staff
 * ✔ Find applicable salary history
 * ✔ Validate attendance
 * ✔ Calculate attendance summary
 * ✔ Calculate gross salary
 * ✔ Calculate already paid salary
 * ✔ Calculate remaining salary
 * ✔ Determine payment status
 *
 * NOTE:
 * This helper ONLY performs calculation.
 *
 * It DOES NOT:
 * ❌ Create Salary Payment
 * ❌ Create Cashbook Entry
 * ❌ Lock Attendance
 *
 * These operations will be handled inside APIs.
 *
 * =====================================================
 */

export async function calculateSalary({
  staffId,
  month,
  year,
}: CalculateSalaryParams) {
  // SALARY CALCULATION CODE START

  const today = dateObjectToUTC(new Date());
  const currentMonth = today.getUTCMonth() + 1;
  const currentYear = today.getUTCFullYear();

  if (year > currentYear || (year === currentYear && month > currentMonth)) {
    return {
      success: false,
      message: "Future month salary cannot be calculated",
    };
  }

  const staff = await Staff.findById(staffId);
  if (!staff) {
    return {
      success: false,
      message: "Staff not found",
    };
  }
  const selectedDate = new Date(Date.UTC(year, month, 0));
  // const selectedMonth = new Date(year, month - 1, 1);
  const salaryHistory = await SalaryHistory.findOne({
    staff: staffId,
    effectiveFrom: {
      $lte: selectedDate,
    },
  }).sort({
    effectiveFrom: -1,
  });

  if (!salaryHistory) {
    return {
      success: false,
      message: "Salary history not found",
    };
  }

  const firstDayOfMonth = new Date(Date.UTC(year, month - 1, 1));
  const lastDayofMonth = new Date(Date.UTC(year, month, 0));

  const joiningDate = dateObjectToUTC(new Date(staff.joiningDate));
  const leftDate = staff.leftDate
    ? dateObjectToUTC(new Date(staff.leftDate))
    : null;

  const expectedStart =
    joiningDate > firstDayOfMonth ? joiningDate : firstDayOfMonth;
  let expectedEnd =
    leftDate && leftDate < lastDayofMonth ? leftDate : lastDayofMonth;
  const isCurrentMonth =
    today.getUTCMonth() === month - 1 && today.getUTCFullYear() === year;
  if (isCurrentMonth && today < expectedEnd) {
    expectedEnd = today;
  }
  if (joiningDate > lastDayofMonth) {
    return {
      success: false,
      message: "Staff was not joined in selected month",
    };
  }
  if (leftDate && leftDate < firstDayOfMonth) {
    return {
      success: false,
      message: "Staff already left before selected month",
    };
  }

  const attendances = await Attendance.find({
    staff: staffId,
    date: {
      $gte: expectedStart,
      $lte: expectedEnd,
    },
  }).sort({
    date: 1,
  });

  const expectedDates: Date[] = [];

  const currentDate = new Date(expectedStart);

  while (currentDate <= expectedEnd) {
    expectedDates.push(new Date(currentDate));

    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }

  const attendanceDates = attendances.map((attendance) =>
    toDateInputValue(attendance.date),
  );
  const missingDates = expectedDates.filter(
    (date) => !attendanceDates.includes(toDateInputValue(date)),
  );
  if (missingDates.length > 0) {
    return {
      success: false,
      message: "Attendance is incomplete",
      missingDates,
    };
  }
  let present = 0;
  let absent = 0;
  let paidLeave = 0;
  let halfDay = 0;
  let unpaidLeave = 0;

  for (const attandance of attendances) {
    switch (attandance.status) {
      case "Present":
        present++;
        break;
      case "Absent":
        absent++;
        break;
      case "Paid Leave":
        paidLeave++;
        break;
      case "Half Day":
        halfDay++;
        break;
      case "Unpaid Leave":
        unpaidLeave++;
        break;
    }
  }

  const paidDays = present + paidLeave + halfDay / 2;
  // const actualDays = lastDayofMonth.getUTCDate();

  // const totalWorkingDays = actualDays === 31 ? 31 : actualDays;
  const eligibleDays = expectedDates.length;
  // const salaryBasisDays = Math.min(eligibalDays, 30);
  const isFullMonth =
    expectedStart.getTime() === firstDayOfMonth.getTime() &&
    expectedEnd.getTime() === lastDayofMonth.getTime();

  const salaryBasisDays = isFullMonth ? 30 : Math.min(eligibleDays, 30);
  const absentDays = Math.max(eligibleDays - paidDays, 0);
  const payableDays = Math.max(salaryBasisDays - absentDays, 0);
  // const payableDays = 30 - absentDays;
  const perDaySalary = salaryHistory.salary / 30;
  const grossSalary = Math.round(payableDays * perDaySalary);
  const nextMonth = new Date(Date.UTC(year, month, 1));
  const salaryAdvances = await Cashbook.find({
    staff: staffId,
    type: "Staff Expense",
    date: {
      $gte: firstDayOfMonth,
      $lt: nextMonth,
    },
  });
  const advancePaid = salaryAdvances.reduce(
    (total, expense) => total + expense.amount,
    0,
  );
  const salaryPayments = await SalaryPayment.find({
    staff: staffId,
    month,
    year,
  });
  const alreadyPaid = salaryPayments.reduce(
    (total, payment) => total + payment.amount,
    0,
  );
  const remainingSalary = Math.max(grossSalary - alreadyPaid - advancePaid, 0);
  // Extra amount paid to staff (Advance + Salary Payment > Gross Salary)

  const overPaidAmount = Math.max(alreadyPaid + advancePaid - grossSalary, 0);
  const totalPaid = alreadyPaid + advancePaid;
  let status = "Pending";

  if (totalPaid === 0) {
    status = "Pending";
  } else if (remainingSalary === 0) {
    status = "Paid";
  } else {
    status = "Partial";
  }
  return {
    success: true,
    data: {
      // Basic Details
      staff,
      salaryHistory,

      // Attendance Range
      expectedStart,
      expectedEnd,

      // Attendance Records
      attendances,

      // Attendance Summary
      present,
      absent,
      paidLeave,
      halfDay,
      unpaidLeave,

      // Salary Calculation
      paidDays,
      eligibleDays,
      salaryBasisDays,
      absentDays,
      payableDays,
      perDaySalary,
      grossSalary,

      // Payment Summary
      alreadyPaid,
      remainingSalary,
      status,
      advancePaid,
      overPaidAmount,
    },
  };
}
