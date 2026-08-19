import Link from "next/link";
import Button from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { getAllStaff } from "@/lib/actions/staff";
import StaffTable from "@/components/admin/staff/StaffTable";
import StaffService from "@/services/StaffService";
export default async function StaffPage() {
  const staffs = await getAllStaff();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Staff Management
          </h1>
          <p className="mt-1 text-slate-500">Manage your restaurant staff</p>
        </div>
        <Link href={"/staff/add"}>
          <Button title="Add Staff" icon={<Plus size={18} />} />
        </Link>
      </div>
      {/* <div>
        <input
          placeholder="Search by name or phone"
          className="w-full p-2 border"
        />
      </div> */}
      <StaffTable staffs={staffs} />
    </div>
  );
}
