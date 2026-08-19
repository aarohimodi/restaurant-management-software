"use client";
import StaffService from "@/services/StaffService";
import { staff as Istaff } from "@/types/staff.types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Pencil, Trash2, History } from "lucide-react";
import Button from "@/components/ui/Button";
import SalaryHistory from "./SalaryHistory";
import toast from "react-hot-toast";
interface staffTableProps {
  staffs: Istaff[];
}
export default function StaffTable({ staffs }: staffTableProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const handleHistory = (id: string) => {
    setSelectedStaffId(id);
  };
  const handleDelete = async (id: string) => {
    const confirmed = confirm("Are you sure you want to delete this staff?");

    if (!confirmed) return;
    setLoading(true);
    try {
      const response = await StaffService.deleteStaff(id);

      if (response.success) {
        router.refresh();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <table className="w-full">
        <thead className="border-b bg-slate-50 text-left">
          <tr>
            <th className="px-6 py-4 ">Name</th>
            <th className="px-6 py-4 ">Phone</th>
            <th className="px-6 py-4">Designation</th>
            <th className="px-6 py-4 ">Salary</th>
            <th className="px-6 py-4 ">Status</th>
            <th className="px-6 py-4 ">Left On</th>
            <th className="px-6 py-4 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="text-left">
          {staffs.map((staff) => (
            <tr key={staff.name.toString()}>
              <td className="px-6 py-4">{staff.name}</td>
              <td className="px-6 py-4">{staff.phone}</td>

              <td className="px-6 py-4">{staff.designation}</td>
              <td className="px-6 py-4">₹{staff.salary}</td>
              <td className="px-6 py-4">
                {staff.isActive ? "Active" : "Inactive"}
              </td>
              <td className="px-6 py-4">
                {staff.leftDate
                  ? new Date(staff.leftDate).toLocaleDateString("en-IN")
                  : "-"}
              </td>
              <td className="p-3">
                <div className="flex items-center justify-center gap-2">
                  <Link href={`/staff/edit/${staff._id}`}>
                    <Button title="" icon={<Pencil className="h-4 w-4" />} />
                  </Link>
                  <Button
                    title=""
                    icon={<History className="h-4 w-4" />}
                    onClick={() => handleHistory(staff._id!)}
                  />
                  <Button
                    title=""
                    icon={<Trash2 className="h-4 w-4" />}
                    onClick={() => handleDelete(staff._id!)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedStaffId && (
        <SalaryHistory
          staffId={selectedStaffId}
          onClose={() => setSelectedStaffId(null)}
        />
      )}
    </div>
  );
}
