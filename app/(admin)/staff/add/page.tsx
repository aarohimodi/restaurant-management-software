import StaffForm from "@/components/admin/staff/StaffForm";
export default function page() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Add Staff</h1>
        <p className="mt-1 text-slate-500">
          Add a new staff member to your restaurant
        </p>
      </div>
      <StaffForm />
    </div>
  );
}
