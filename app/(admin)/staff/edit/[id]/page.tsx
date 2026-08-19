import StaffForm from "@/components/admin/staff/StaffForm";
import { connectDB } from "@/lib/db";
import Staff from "@/models/Staff";
import mongoose from "mongoose";
import { notFound } from "next/navigation";
interface EditStaffPageProps {
  params: Promise<{ id: string }>;
}
export default async function EditStaffPage({ params }: EditStaffPageProps) {
  await connectDB();
  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    notFound();
  }
  const staff = await Staff.findById(id).lean();
  if (!staff) {
    notFound();
  }
  const formattedStaff = {
    ...staff,
    _id: staff._id.toString(),
  };

  return (
    <>
      <h1>Edit Staff</h1>
      <StaffForm staff={formattedStaff} />
    </>
  );
}
