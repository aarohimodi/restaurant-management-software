"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import { staff } from "@/types/staff.types";
import StaffService from "@/services/StaffService";
import SalaryService from "@/services/SalaryService";
import { formatDateIN } from "@/lib/date/dateOnly";
import { SalaryPayment } from "@/types/salary.types";
import toast from "react-hot-toast";
export default function SalaryPaymentPage() {
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

  const currentYear = new Date().getFullYear();

  const years = [];

  for (let year = currentYear; year >= currentYear - 5; year--) {
    years.push(year);
  }

  const [staffList, setStaffList] = useState<staff[]>([]);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [staff, setStaff] = useState("");
  const [payments, setPayments] = useState<SalaryPayment[]>([]);
  const [page, setPage] = useState(1);
  const [appliedMonth, setAppliedMonth] = useState("");
  const [appliedYear, setAppliedYear] = useState("");
  const [appliedStaff, setAppliedStaff] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 10,
  });

  const [loading, setLoading] = useState(false);
  const loadPayments = async () => {
    try {
      setLoading(true);

      const response = await SalaryService.getPayments(
        page,
        appliedMonth ? Number(appliedMonth) : undefined,
        appliedYear ? Number(appliedYear) : undefined,
        appliedStaff || undefined,
      );

      if (response.success) {
        setPayments(response.data);
        setPagination(response.pagination);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  const handleSearch = () => {
    setPage(1);
    setAppliedMonth(month);
    setAppliedYear(year);
    setAppliedStaff(staff);
  };
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
  useEffect(() => {
    loadStaff();
  }, []);

  useEffect(() => {
    loadPayments();
  }, [page, appliedMonth, appliedYear, appliedStaff]);

  const handleReset = () => {
    setMonth("");
    setYear("");
    setStaff("");

    setAppliedMonth("");
    setAppliedYear("");
    setAppliedStaff("");

    setPage(1);
  };
  return (
    <div className="space-y-6">
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold text-slate-900">Salary Payments</h1>

        <p className="mt-1 text-slate-500">View salary payment history</p>
      </div>

      {/* Filters */}

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Search Payments</h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Month */}

          <div>
            <label className="mb-2 block text-sm font-medium">Month</label>

            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full rounded-lg border px-3 py-2"
            >
              <option value="">All Months</option>

              {months.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          {/* Year */}

          <div>
            <label className="mb-2 block text-sm font-medium">Year</label>

            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full rounded-lg border px-3 py-2"
            >
              <option value="">All Years</option>

              {years.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Staff */}

          <div>
            <label className="mb-2 block text-sm font-medium">Staff</label>

            <select
              value={staff}
              onChange={(e) => setStaff(e.target.value)}
              className="w-full rounded-lg border px-3 py-2"
            >
              <option value="">All Staff</option>
              {staffList.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
              {/* Staff API integrate hone ke baad yahan map hoga */}
            </select>
          </div>
        </div>

        {/* Buttons */}

        <div className="mt-5 flex justify-end gap-3">
          <Button type="button" title="Reset" onClick={handleReset} />

          <Button type="button" title="Search" onClick={handleSearch} />
        </div>
      </div>

      {/* Payment Table */}

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left">S.No</th>
                <th className="px-6 py-4 text-left">Staff</th>
                <th className="px-6 py-4 text-left">Month</th>
                <th className="px-6 py-4 text-left">Year</th>
                <th className="px-6 py-4 text-left">Amount</th>
                <th className="px-6 py-4 text-left">Payment Mode</th>
                <th className="px-6 py-4 text-left">Payment Date</th>
                <th className="px-6 py-4 text-left">Remarks</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    Loading...
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No salary payments found.
                  </td>
                </tr>
              ) : (
                payments.map((payment, index) => (
                  <tr key={payment._id} className="border-b hover:bg-slate-50">
                    <td className="px-6 py-4">
                      {(page - 1) * pagination.limit + index + 1}
                    </td>

                    <td className="px-6 py-4">{payment.staff?.name ?? "-"}</td>

                    <td className="px-6 py-4">
                      {months[payment.month - 1]?.label}
                    </td>

                    <td className="px-6 py-4">{payment.year}</td>

                    <td className="px-6 py-4 font-medium">
                      ₹{payment.amount.toLocaleString()}
                    </td>

                    <td className="px-6 py-4">{payment.paymentMode}</td>

                    <td className="px-6 py-4">
                      {formatDateIN(payment.paymentDate)}
                    </td>

                    <td className="px-6 py-4">{payment.remarks || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 border-t p-4">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1 || loading}
            className="rounded-lg border px-4 py-2 text-sm disabled:opacity-50"
          >
            Previous
          </button>

          {Array.from({ length: pagination.totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setPage(index + 1)}
              className={`h-10 w-10 rounded-lg border ${
                pagination.currentPage === index + 1
                  ? "bg-blue-600 text-white"
                  : "bg-white"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => setPage(page + 1)}
            disabled={page === pagination.totalPages || loading}
            className="rounded-lg border px-4 py-2 text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
