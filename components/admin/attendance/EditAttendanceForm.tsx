import AttendanceService from "@/services/AttendanceService";
import { AttendanceStatus } from "@/types/attendance.types";
import { useRouter } from "next/navigation";
import { EditAttendanceItem } from "@/types/attendance.types";
import { useState } from "react";
import toast from "react-hot-toast";
interface EditAttendanceFormProps {
  attendance: EditAttendanceItem[];
  date: string;
}

// const attendanceStatus: AttendanceStatus[] = [
//   "Present",
//   "Absent",
//   "Half Day",
//   "Paid Leave",
//   "Unpaid Leave",
// ];
const attendanceStatus: AttendanceStatus[] = [
  "Present",
  "Unpaid Leave",
  "Half Day",
  "Paid Leave",
];
export default function EditAttendanceForm({
  attendance,
  date,
}: EditAttendanceFormProps) {
  const formattedDate = new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const router = useRouter();
  const [attendanceData, setAttendanceData] = useState(attendance);
  const handleStatusChange = (
    attendanceId: string,
    status: AttendanceStatus,
  ) => {
    setAttendanceData((prev) =>
      prev.map((item) =>
        item._id === attendanceId
          ? {
              ...item,
              status,
              leaveReason:
                status === "Paid Leave" || status === "Unpaid Leave"
                  ? item.leaveReason
                  : "",
            }
          : item,
      ),
    );
  };
  const handleLeaveReasonChange = (
    attendanceId: string,
    leaveReason: string,
  ) => {
    setAttendanceData((prev) =>
      prev.map((item) =>
        item._id === attendanceId ? { ...item, leaveReason } : item,
      ),
    );
  };
  const handleSubmit = async () => {
    try {
      const response = await AttendanceService.updateAttendance({
        date,
        attendance: attendanceData,
      });

      if (response.success) {
        toast.success(response.message);
        router.push("/attendance");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between">
        <h2 className="text-2xl font-semibold mb-6">Edit Attendance</h2>
        <h2>{formattedDate}</h2>
      </div>

      <div className="space-y-5">
        {attendanceData.map((item) => (
          <div
            key={item._id}
            className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <h3 className="font-medium text-lg">{item.staff.name}</h3>

            <div className="flex flex-wrap gap-4">
              {attendanceStatus.map((status) => (
                <label
                  key={status}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name={item._id}
                    value={status}
                    checked={item.status === status}
                    onChange={() => handleStatusChange(item._id, status)}
                  />

                  <span>{status === "Unpaid Leave" ? "Absent" : status}</span>
                </label>
              ))}
              {(item.status === "Paid Leave" ||
                item.status === "Unpaid Leave") && (
                <div className="mt-3">
                  <input
                    type="text"
                    placeholder="Enter leave reason"
                    value={item.leaveReason}
                    onChange={(e) =>
                      handleLeaveReasonChange(item._id, e.target.value)
                    }
                    className="w-full border rounded-md px-3 py-2"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        type="button"
        className="mt-6 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Save Changes
      </button>
    </div>
  );
}
