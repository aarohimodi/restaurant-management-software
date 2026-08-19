"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Attendance {
  _id: string;
  status: string;
  staff: {
    _id: string;
    name: string;
  };
}

export default function AttendanceSection() {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAttendance = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/dashboard");
      const result = await response.json();

      if (result.success) {
        setAttendance(result.data.attendance);
      }
    } catch (error) {
      console.error("Attendance Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, []);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-md">
      <h1 className="mb-5 text-2xl font-bold">Today's Attendance</h1>

      {loading ? (
        <p className="py-6 text-center text-slate-500">Loading...</p>
      ) : attendance.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8">
          <p className="mb-4 text-slate-500">
            Today's attendance has not been added yet.
          </p>

          <Link
            href="/attendance/mark"
            className="rounded-lg bg-orange-500 px-5 py-2 text-white hover:bg-orange-600"
          >
            Add Attendance
          </Link>
        </div>
      ) : (
        <div className="space-y-3 grid grid-cols-2 gap-2 ">
          {attendance.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <span className="font-medium">{item.staff.name}</span>

              <span
                className={`font-medium ${
                  item.status === "Present"
                    ? "text-green-600"
                    : item.status === "Absent"
                      ? "text-red-600"
                      : "text-orange-500"
                }`}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
