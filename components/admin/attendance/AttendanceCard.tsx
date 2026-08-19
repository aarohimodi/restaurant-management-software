import { toDateInputValue } from "@/lib/date/dateOnly";
import { AttendanceHistory } from "@/types/attendance-history.types";
import Link from "next/link";
type Props = {
  attendance: AttendanceHistory;
};
export default function AttendanceCard({ attendance }: Props) {
  return (
    <div className="rounded-lg border p-4 shadow-sm">
      <h2 className="font-bold text-xl mb-2 text-orange-500">
        {new Date(attendance._id).toLocaleDateString()}
      </h2>
      <div className="space-y-1 text-[17px] flex justify-between ">
        <div className="flex gap-5">
          <p>Present : {attendance.present}</p>
          <p>Absent : {attendance.absent}</p>
          <p>Paid Leave : {attendance.paidLeave}</p>
          <p>Unpaid Leave : {attendance.unpaidLeave}</p>
          <p>Half Day : {attendance.halfDay}</p>
          <p>Total Staff : {attendance.totalStaff}</p>
        </div>
        <div>
          <Link
            href={`/attendance/edit?date=${toDateInputValue(attendance._id)}`}
            className=" inline-block rounded bg-black px-4 py-2 text-white"
          >
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
}
