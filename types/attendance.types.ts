// ==========================================
// Database Attendance Record
// MongoDB se data fetch hoga ya save hoga
// ==========================================
export interface Attendance {
  _id?: string;
  staff: string;
  date: string;
  status: AttendanceStatus;
  checkIn?: string;
  checkOut?: string;
  remarks?: string;
  leaveReason?: string;
}
// ==========================================
// Single Attendance Item
// Frontend state ke liye
// Example:
// { staff: "123", status: "Present" }
// ==========================================
export interface AttendanceItem {
  staff: string;
  status: AttendanceStatus;
  leaveReason?: string;
}
// ==========================================
// Attendance API Request Body
// Frontend se backend ko ye data jayega
//
// Example:
// {
//   date: "2026-07-27",
//   attendance: [
//     { staff: "123", status: "Present" },
//     { staff: "456", status: "Absent" }
//   ]
// }
// ==========================================
export interface AttendanceRequest {
  date: string;
  attendance: AttendanceItem[];
}

export type AttendanceStatus =
  | "Present"
  | "Absent"
  | "Half Day"
  | "Paid Leave"
  | "Unpaid Leave";

export interface EditAttendanceItem {
  _id: string;
  staff: {
    _id: string;
    name: string;
  };
  status: AttendanceStatus;
  leaveReason?: string;
}
