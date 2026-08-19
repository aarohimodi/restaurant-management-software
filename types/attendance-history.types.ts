export interface AttendanceHistory {
  _id: string;
  present: number;
  absent: number;
  paidLeave: number;
  unpaidLeave: number;
  halfDay: number;
  totalStaff: number;
}
