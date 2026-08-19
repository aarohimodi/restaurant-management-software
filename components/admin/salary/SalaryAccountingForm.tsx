"use client";

import SalaryService from "@/services/SalaryService";
import StaffService from "@/services/StaffService";
import { SalaryCalculation } from "@/types/salary.types";
import { useEffect, useState } from "react";
import { staff } from "@/types/staff.types";
import SalaryDetails from "./SalaryDetails";
import SalaryPayModal from "./SalaryPayModal";
import toast from "react-hot-toast";
export default function SalaryAccountingForm() {
  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();
  const years = [];
  for (let y = currentYear; y >= currentYear - 5; y--) {
    years.push(y);
  }
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);

  const [staffId, setStaffId] = useState("");
  const [staffList, setStaffList] = useState<staff[]>([]);
  const [salary, setSalary] = useState<SalaryCalculation | null>(null);
  const [loading, setLoading] = useState(false);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  useEffect(() => {
    loadStaff();
  }, []);
  const loadStaff = async () => {
    try {
      const response = await StaffService.getAllStaff();
      if (response.success) {
        setStaffList(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleCalculate = async () => {
    if (!staffId) {
      toast.error("Please Select Staff");

      return;
    }

    setLoading(true);

    try {
      const response = await SalaryService.calculateSalary(
        staffId,
        Number(month),
        Number(year),
      );
      if (response.success) {
        setSalary(response.data);
      } else {
        toast.error(response.missingDates);

        setSalary(null);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
      <h1 className="text-2xl font-bold mb-6">Salary Accounting</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Month */}

        <div>
          <label className="block mb-2 font-medium">Month</label>

          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="w-full border rounded-lg px-4 py-2"
          >
            {months.map((item) => (
              <option
                key={item.value}
                value={item.value}
                disabled={year === currentYear && item.value > currentMonth}
              >
                {item.label}
              </option>
            ))}
          </select>
        </div>

        {/* Year */}

        <div>
          <label className="block mb-2 font-medium">Year</label>

          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-full border rounded-lg px-4 py-2"
          >
            {years.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Staff */}

      <div className="mt-5">
        <label className="block mb-2 font-medium">Staff</label>

        <select
          value={staffId}
          onChange={(e) => setStaffId(e.target.value)}
          className="w-full border rounded-lg px-4 py-2"
        >
          <option value="">Select Staff</option>

          {staffList.map((staff) => (
            <option key={staff._id} value={staff._id}>
              {staff.name}
            </option>
          ))}
        </select>
      </div>

      {/* Button */}

      <div className="mt-6">
        <button
          type="button"
          onClick={handleCalculate}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Calculating..." : "Calculate Salary"}
        </button>
      </div>

      {/* Salary Details */}

      {salary && (
        <div className="mt-8">
          <SalaryDetails salary={salary} />

          {(() => {
            const today = new Date();

            const currentMonth = today.getUTCMonth() + 1;
            const currentYear = today.getUTCFullYear();

            const salaryMonthCompleted =
              year < currentYear ||
              (year === currentYear && month < currentMonth);

            const salaryPaid = salary.remainingSalary === 0;

            if (!salaryMonthCompleted) {
              return null;
            }

            return (
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setOpenPaymentModal(true)}
                  disabled={salaryPaid}
                  className={`px-5 py-2 rounded-lg text-white font-medium ${
                    salaryPaid
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {salaryPaid ? "Salary Paid" : "Pay Salary"}
                </button>
              </div>
            );
          })()}
        </div>
      )}
      {salary && salary.overPaidAmount > 0 && (
        <>
          <div className="mt-6 rounded-lg border border-red-300 bg-red-50 p-4">
            <p className="font-semibold text-red-700">
              Overpaid Amount: ₹{salary.overPaidAmount}
            </p>

            <p className="text-sm text-red-600 mt-1">
              Staff has received more salary than calculated. Please adjust this
              amount manually in next month's salary.
            </p>
          </div>
        </>
      )}

      {openPaymentModal && (
        <SalaryPayModal
          open={openPaymentModal}
          onClose={() => setOpenPaymentModal(false)}
          month={month}
          year={year}
          salary={salary}
          onSuccess={() => {
            setOpenPaymentModal(false);
            handleCalculate(); // salary refresh
          }}
        />
      )}
    </div>
  );
}
