import {
  AttendanceRequest,
  EditAttendanceItem,
} from "@/types/attendance.types";

const AttendanceService = {
  async markAttendance(data: AttendanceRequest) {
    const response = await fetch("/api/attendance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  async getAttendance(page: Number, searchDate?: string) {
    let url = `/api/attendance?page=${page}&limit=4`;
    if (searchDate) {
      url += `&searchDate=${searchDate}`;
    }
    const response = await fetch(url);
    return response.json();
  },
  async getAttendanceByDate(date: string) {
    const response = await fetch(`/api/attendance?date=${date}`);
    return response.json();
  },
  async getMissingAttendance(date: string) {
    const response = await fetch(`/api/attendance/missing?date=${date}`);

    return response.json();
  },
  async updateAttendance(data: {
    date: string;
    attendance: EditAttendanceItem[];
  }) {
    const response = await fetch("/api/attendance", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return response.json();
  },
};
export default AttendanceService;
