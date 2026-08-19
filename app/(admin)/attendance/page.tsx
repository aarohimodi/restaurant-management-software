import Link from "next/link";
import AttendanceHistory from "@/components/admin/attendance/AttendanceHistory";
export default function page() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Attendance</h1>

        <Link
          href="/attendance/mark"
          className="rounded bg-orange-500 px-4 py-2 text-white"
        >
          Mark Attendance
        </Link>
      </div>

      <AttendanceHistory />
    </div>
  );
}
