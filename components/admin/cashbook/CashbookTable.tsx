"use client";
import Button from "@/components/ui/Button";
import { CashbookSummary } from "@/types/cashbook.types";
import { useState, useEffect } from "react";
import { staff } from "@/types/staff.types";
import CashbookViewModal from "./CashbookViewModal";
import {
  formatCurrencyIN,
  formatDateIN,
  toDateInputValue,
} from "@/lib/date/dateOnly";
import CashbookService from "@/services/CashbookService";

interface CashbookTableProps {
  cashbook: CashbookSummary[];
  staffs: staff[];
  refreshKey: number;
  onRefresh: () => void;
}
export default function CashbookTable({
  cashbook,
  staffs,
  refreshKey,
  onRefresh,
}: CashbookTableProps) {
  const [history, setHistory] = useState<CashbookSummary[]>(cashbook);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [appliedFromDate, setAppliedFromDate] = useState("");
  const [appliedToDate, setAppliedToDate] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 10,
  });
  const loadCashbook = async () => {
    const response = await CashbookService.getSummary(
      page,
      appliedFromDate,
      appliedToDate,
    );
    if (response.success) {
      setHistory(response.data);
      setPagination(response.pagination);
    }
  };
  useEffect(() => {
    loadCashbook();
  }, [page, appliedFromDate, appliedToDate, refreshKey]);
  const handleSearch = () => {
    setPage(1);
    setAppliedFromDate(fromDate);
    setAppliedToDate(toDate);
  };
  const handleReset = () => {
    setFromDate("");
    setToDate("");
    setAppliedFromDate("");
    setAppliedToDate("");
    setPage(1);
  };
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="flex items-end gap-3 mb-6 p-3">
        <div>
          <label className="block mb-1 text-sm font-medium">From Date</label>

          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">To Date</label>

          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border rounded-lg px-3 py-2"
          />
        </div>
        <div className="flex gap-3">
          <Button title="Search" onClick={handleSearch} />

          <Button title="Reset" onClick={handleReset} />
        </div>
      </div>
      <table className="w-full">
        <thead className="border-b bg-slate-50">
          <tr>
            <th className="px-6 py-4 text-left">Date</th>
            <th className="px-6 py-4 text-left">Opening</th>
            <th className="px-6 py-4 text-left">Income</th>
            <th className="px-6 py-4 text-left">Expense</th>
            <th className="px-6 py-4 text-left">Closing</th>
            <th className="px-6 py-4 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {history.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-12 text-center text-slate-500">
                No cashbook records found.
              </td>
            </tr>
          ) : (
            history.map((item) => (
              <tr key={item._id} className="border-b hover:bg-slate-50">
                <td className="px-6 py-4">{formatDateIN(item._id)}</td>

                {/* Opening balance baad me calculate hoga */}
                <td className="px-6 py-4">
                  {" "}
                  ₹{formatCurrencyIN(item.opening)}
                </td>

                <td className="px-6 py-4 font-medium text-green-600">
                  ₹{formatCurrencyIN(item.income)}
                </td>

                <td className="px-6 py-4 font-medium text-red-600">
                  ₹{formatCurrencyIN(item.expense)}
                </td>

                {/* Closing balance baad me calculate hoga */}
                <td className="px-6 py-4">
                  {" "}
                  ₹{formatCurrencyIN(item.closing)}
                </td>

                <td className="px-6 py-4 text-center">
                  <Button
                    title="View"
                    onClick={() => setSelectedDate(toDateInputValue(item._id))}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="flex items-center justify-center gap-2 mt-6">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 rounded-lg border disabled:opacity-50"
        >
          Previous
        </button>

        {Array.from({ length: pagination.totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => setPage(index + 1)}
            className={`w-10 h-10 rounded-lg border ${
              pagination.currentPage === index + 1
                ? "bg-orange-500 text-white"
                : "bg-white"
            }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() => setPage(page + 1)}
          disabled={page === pagination.totalPages}
          className="px-4 py-2 rounded-lg border disabled:opacity-50"
        >
          Next
        </button>
      </div>
      <CashbookViewModal
        staffs={staffs}
        onRefresh={onRefresh}
        date={selectedDate}
        open={!!selectedDate}
        onClose={() => setSelectedDate(null)}
      />
    </div>
  );
}
