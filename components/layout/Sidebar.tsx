import Link from "next/link";

const menuItems = [
  {
    name: "Dashboard",
    link: "/dashboard",
  },
  {
    name: "Cashbook",
    link: "/cashbook",
  },
  {
    name: "Attendance",
    link: "/attendance",
  },
  {
    name: "Staff Management",
    link: "/staff",
  },

  {
    name: "Salary Accounting",
    link: "/salary-accounting",
  },
  {
    name: "Salary Payment",
    link: "/salary-payment",
  },

  {
    name: "Settings",
    link: "/settings",
  },
];

export default function Sidebar() {
  return (
    <aside className="w-72 min-h-screen bg-slate-900 text-white p-6">
      {/* <h1 className="text-3xl font-bold mb-10">GABBAR</h1> */}

      <ul className="space-y-4">
        {menuItems.map((item) => (
          <li key={item.name}>
            <Link
              href={item.link}
              className="block rounded-xl px-5 py-3 hover:bg-slate-800 transition-all duration-300"
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
