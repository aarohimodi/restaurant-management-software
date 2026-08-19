import Link from "next/link";

export default function QuickActionSection() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h1 className="text-2xl font-bold mb-5">Quick Actions</h1>

      <div className="grid grid-cols-2 gap-4">
        <Link
          className="bg-orange-500 text-white rounded-xl p-4"
          href="staff/add"
        >
          {" "}
          <button>Add Staff</button>
        </Link>
        <Link
          className="bg-orange-500 text-white rounded-xl p-4"
          href="salary-accounting"
        >
          <button>Pay Salary</button>
        </Link>
        <Link
          className="bg-orange-500 text-white rounded-xl p-4"
          href="cashbook"
        >
          <button>Cash In</button>
        </Link>
        <Link
          className="bg-orange-500 text-white rounded-xl p-4"
          href="cashbook"
        >
          <button>Cash Out</button>
        </Link>
      </div>
    </div>
  );
}
