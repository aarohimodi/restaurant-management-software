import { SalaryCalculation } from "@/types/salary.types";
import { formatDateIN } from "@/lib/date/dateOnly";
interface SalaryDetailsProps {
  salary: SalaryCalculation;
}
export default function SalaryDetails({ salary }: SalaryDetailsProps) {
  return (
    <div className="mt-8 border rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-6">Salary Details</h2>

      {/* Staff Details */}

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-gray-500">Staff Name</p>
          <p className="font-semibold">{salary.staff.name}</p>
        </div>

        <div>
          <p className="text-gray-500">Monthly Salary</p>
          <p className="font-semibold">₹{salary.salaryHistory.salary}</p>
        </div>
      </div>

      {/* Attendance */}

      <h3 className="font-semibold mb-3">Attendance Summary</h3>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="border rounded-lg p-3">
          <p className="text-sm text-gray-500">Present</p>

          <p className="text-xl font-bold">{salary.present}</p>
        </div>

        <div className="border rounded-lg p-3">
          <p className="text-sm text-gray-500">Absent</p>

          <p className="text-xl font-bold">{salary.absent}</p>
        </div>

        <div className="border rounded-lg p-3">
          <p className="text-sm text-gray-500">Paid Leave</p>

          <p className="text-xl font-bold">{salary.paidLeave}</p>
        </div>

        <div className="border rounded-lg p-3">
          <p className="text-sm text-gray-500">Half Day</p>

          <p className="text-xl font-bold">{salary.halfDay}</p>
        </div>

        <div className="border rounded-lg p-3">
          <p className="text-sm text-gray-500">Unpaid Leave</p>

          <p className="text-xl font-bold">{salary.unpaidLeave}</p>
        </div>
      </div>

      {/* Salary */}

      <h3 className="font-semibold mb-3">Salary Summary</h3>
      <div className="flex gap-2 space-y-3">
        <h3>Salary Calculation Period : </h3>
        <p className="font-semibold">
          {formatDateIN(salary.expectedStart)} -{" "}
          {formatDateIN(salary.expectedEnd)}
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span>Gross Salary (till date)</span>
          <span>₹{salary.grossSalary}</span>
        </div>

        <div className="flex justify-between">
          <span>Advance Paid</span>
          <span>₹{salary.advancePaid}</span>
        </div>

        <div className="flex justify-between">
          <span>Salary Paid</span>
          <span>₹{salary.alreadyPaid}</span>
        </div>

        <div className="flex justify-between font-semibold text-lg">
          <span>Remaining Salary</span>
          <span>₹{salary.remainingSalary}</span>
        </div>

        <div className="flex justify-between">
          <span>Status</span>

          <span
            className={`font-semibold ${
              salary.status === "Paid"
                ? "text-green-600"
                : salary.status === "Partial"
                  ? "text-orange-500"
                  : "text-red-500"
            }`}
          >
            {salary.status}
          </span>
        </div>
      </div>
    </div>
  );
}
