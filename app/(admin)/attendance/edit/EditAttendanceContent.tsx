"use client";
import EditAttendanceForm from "@/components/admin/attendance/EditAttendanceForm";
import AttendanceService from "@/services/AttendanceService";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditAttendanceContent() {
  const searchParams = useSearchParams();
  const date = searchParams.get("date");
  console.log(date);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (date) {
      loadAttendance();
    }
  }, [date]);
  const loadAttendance = async () => {
    try {
      setLoading(true);
      const response = await AttendanceService.getAttendanceByDate(date!);

      if (response.success) {
        setAttendance(response.data);
      } else {
        alert(response.message);
      }
    } catch (error) {
      // console.error(error);
      console.error("EDIT ATTENDANCE ERROR:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <p>Loading...</p>;
  }

  if (!attendance.length) {
    return <p>No attendance found.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <EditAttendanceForm attendance={attendance} date={date!} />
    </div>
  );
}
