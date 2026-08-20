"use client";
import { useEffect, useState } from "react";
import { staff } from "@/types/staff.types";
import { AttendanceItem, AttendanceRequest } from "@/types/attendance.types";
import AttendanceService from "@/services/AttendanceService";
import { useRouter } from "next/navigation";
// import { getActiveStaffs } from "@/lib/attendance/getActiveStaffs";
import { getTodayDateInputValue } from "@/lib/date/dateOnly";
import toast from "react-hot-toast";
interface AttendanceFormProps {
  staffs: staff[];
}
export default function AttendanceForm({ staffs }: AttendanceFormProps) {
  const today = getTodayDateInputValue();

  const router = useRouter();
  const [date, setDate] = useState(today);
  const [missingStaffs, setMissingStaffs] = useState<staff[]>([]);
  const [attendanceAlreadyFilled, setAttendanceAlreadyFilled] = useState(false);
  const [noEligibleStaff, setNoEligibleStaff] = useState(false);
  // const activeStaffs = useMemo(
  //   () => getActiveStaffs(staffs, date),
  //   [staffs, date],
  // );
  const [attendance, setAttendance] = useState<AttendanceItem[]>([]);
  // const [attendance, setAttendance] = useState<AttendanceItem[]>(
  //   activeStaffs.map((staff: staff) => ({
  //     staff: staff._id!,
  //     status: "Present",
  //     leaveReason: "",
  //   })),
  // );
  // useEffect(() => {
  //   setAttendance(
  //     activeStaffs.map((staff) => ({
  //       staff: staff._id!,
  //       status: "Present",
  //       leaveReason: "",
  //     })),
  //   );
  // }, [activeStaffs]);
  useEffect(() => {
    setAttendance(
      missingStaffs.map((staff) => ({
        staff: staff._id!,
        status: "Present",
        leaveReason: "",
      })),
    );
  }, [missingStaffs]);
  useEffect(() => {
    const loadMissingAttendance = async () => {
      try {
        const response = await AttendanceService.getMissingAttendance(date);

        if (response.success) {
          setMissingStaffs(response.data);
          setAttendanceAlreadyFilled(
            response.eligibleStaffCount > 0 && response.data.length === 0,
          );
          setNoEligibleStaff(response.eligibleStaffCount === 0);
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
      }
    };

    loadMissingAttendance();
  }, [date]);
  const handleStatusChange = (
    staffId: string,
    status: AttendanceItem["status"],
  ) => {
    setAttendance((prev) =>
      prev.map((item) =>
        item.staff === staffId
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
  const handleLeaveReasonChange = (staffId: string, leaveReason: string) => {
    setAttendance((prev) =>
      prev.map((item) =>
        item.staff === staffId ? { ...item, leaveReason } : item,
      ),
    );
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const data: AttendanceRequest = {
        date,
        attendance,
      };

      const response = await AttendanceService.markAttendance(data);
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
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Mark Attendance</h2>

      <div className="mb-6">
        <label className="block mb-2 font-medium">Date</label>

        <input
          type="date"
          value={date}
          max={today}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded-md px-3 py-2"
        />
      </div>

      <div className="space-y-5">
        {noEligibleStaff ? (
          <p className="text-center text-gray-600 font-medium py-6">
            No staff was eligible for attendance on this date.
          </p>
        ) : attendanceAlreadyFilled ? (
          <p className="text-center text-gray-600 font-medium py-6">
            Attendance is already filled for this date.
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            {missingStaffs.map((staff) => {
              const selectedAttendance = attendance.find(
                (a) => a.staff === staff._id,
              );
              return (
                <div key={staff._id} className="border rounded-lg p-4 mt-2">
                  <h3 className="font-semibold text-lg mb-3">{staff.name}</h3>
                  <div className="flex flex-wrap gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={`attendance-${staff._id}`}
                        checked={selectedAttendance?.status === "Present"}
                        onChange={() =>
                          handleStatusChange(staff._id!, "Present")
                        }
                      />
                      Present
                    </label>
                    {/* <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`attendance-${staff._id}`}
                      checked={selectedAttendance?.status === "Absent"}
                      onChange={() => handleStatusChange(staff._id!, "Absent")}
                    />
                    Absent
                  </label> */}
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={`attendance-${staff._id}`}
                        checked={selectedAttendance?.status === "Unpaid Leave"}
                        onChange={() =>
                          handleStatusChange(staff._id!, "Unpaid Leave")
                        }
                      />
                      Absent
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={`attendance-${staff._id}`}
                        checked={selectedAttendance?.status === "Half Day"}
                        onChange={() =>
                          handleStatusChange(staff._id!, "Half Day")
                        }
                      />
                      Half Day
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={`attendance-${staff._id}`}
                        checked={selectedAttendance?.status === "Paid Leave"}
                        onChange={() =>
                          handleStatusChange(staff._id!, "Paid Leave")
                        }
                      />
                      Paid Leave
                    </label>
                  </div>
                  {(selectedAttendance?.status === "Paid Leave" ||
                    selectedAttendance?.status === "Unpaid Leave") && (
                    <div className="mt-4">
                      <label className="block mb-2 font-medium">
                        Leave Reason
                      </label>

                      <input
                        type="text"
                        placeholder="Enter Leave Reason"
                        value={selectedAttendance.leaveReason || ""}
                        onChange={(e) =>
                          handleLeaveReasonChange(staff._id!, e.target.value)
                        }
                        className="w-full border rounded-md px-3 py-2"
                      />
                    </div>
                  )}
                </div>
              );
            })}
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                className="bg-black text-white px-6 py-2 rounded-md"
              >
                Save Attendance
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
