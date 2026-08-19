import AttendanceForm from "@/components/admin/attendance/AttendanceForm";
import { connectDB } from "@/lib/db";
import Staff from "@/models/Staff";

export default async function page() {
  await connectDB();
  const staffs = await Staff.find({ isActive: true }).lean();
  const formattedStaffs = staffs.map((staff) => ({
    ...staff,
    _id: staff._id.toString(),
  }));
  return <AttendanceForm staffs={formattedStaffs} />;
}
