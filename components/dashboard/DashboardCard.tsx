interface DashboardCardProps {
  title: string;
  value: string;
}

export default function DashboardCard({ title, value }: DashboardCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300">
      <h3 className="text-slate-500">{title}</h3>

      <h1 className="text-4xl font-bold mt-4 text-slate-900">{value}</h1>
    </div>
  );
}
