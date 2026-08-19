import { connectDB } from "../db";
import Staff from "@/models/Staff";

export async function getAllStaff() {
  await connectDB();

  const staffs = await Staff.find().sort({ createdAt: -1 }).lean();
  return staffs.map((staff) => ({
    ...staff,
    _id: staff._id.toString(),
    joiningDate: staff.joiningDate?.toISOString(),
    leftDate: staff.leftDate?.toISOString() ?? "",
    createdAt: staff.createdAt?.toISOString(),
    updatedAt: staff.updatedAt?.toISOString(),
  }));
}
