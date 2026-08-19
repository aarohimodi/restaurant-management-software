import { staff } from "@/types/staff.types";
import { dateObjectToUTC, dateToUTC } from "../date/dateOnly";

export const getActiveStaffs = (staffs: staff[], date: string | Date) => {
  const attendanceDate =
    typeof date === "string" ? dateToUTC(date) : dateObjectToUTC(date);
  return staffs.filter((staff) => {
    const joiningDate = dateObjectToUTC(new Date(staff.joiningDate));
    const leftDate = staff.leftDate
      ? dateObjectToUTC(new Date(staff.leftDate))
      : null;
    return (
      joiningDate <= attendanceDate && (!leftDate || leftDate >= attendanceDate)
    );
  });
};

// export const getActiveStaffs = (staffs: staff[], date: string | Date) => {
//   const attendanceDate = new Date(date);
//   attendanceDate.setHours(0, 0, 0, 0);

//   return staffs.filter((staff) => {
//     const joiningDate = new Date(staff.joiningDate);
//     joiningDate.setHours(0, 0, 0, 0);

//     const leftDate = staff.leftDate ? new Date(staff.leftDate) : null;

//     if (leftDate) {
//       leftDate.setHours(0, 0, 0, 0);
//     }

//     return (
//       joiningDate <= attendanceDate && (!leftDate || leftDate >= attendanceDate)
//     );
//   });
// };
