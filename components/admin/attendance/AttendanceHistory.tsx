"use client";

import AttendanceService from "@/services/AttendanceService";
import { useEffect, useState } from "react";
import AttendanceCard from "./AttendanceCard";
import { AttendanceHistory as att } from "@/types/attendance-history.types";
export default function AttendanceHistory() {
  const [history, setHistory] = useState<att[]>([]);

  // search

  const [searchDate, setSearchDate] = useState("");
  const [appliedSearchDate, setAppliedSearchDate] = useState("");
  const handleSearch = () => {
    setAppliedSearchDate(searchDate);
    setPage(1);
  };
  const handleReset = () => {
    setSearchDate("");
    setAppliedSearchDate("");
    setPage(1);
  };
  // pagination
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 10,
  });
  const [page, setPage] = useState(1);
  useEffect(() => {
    loadAttendance();
  }, [page, appliedSearchDate]);
  const loadAttendance = async () => {
    const response = await AttendanceService.getAttendance(
      page,
      appliedSearchDate,
    );
    if (response.success) {
      setHistory(response.data);
      setPagination(response.pagination);
      console.log(response.pagination);
    }
  };
  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          className="border rounded-lg px-3 py-2"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-black text-white rounded-lg"
        >
          Search
        </button>

        <button onClick={handleReset} className="px-4 py-2 border rounded-lg">
          Reset
        </button>
      </div>

      <div className="grid  gap-4">
        {history.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No attendance records found.
          </div>
        ) : (
          history.map((item) => (
            <AttendanceCard key={item._id} attendance={item} />
          ))
        )}
        <div className="flex items-center justify-center gap-2 mt-8">
          {/* Previous */}
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {/* Page Numbers */}
          {Array.from({ length: pagination.totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setPage(index + 1)}
              className={`w-10 h-10 rounded-lg border font-medium transition-all duration-200 ${
                pagination.currentPage === index + 1
                  ? "bg-orange-500 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {index + 1}
            </button>
          ))}

          {/* Next */}
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === pagination.totalPages}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}
