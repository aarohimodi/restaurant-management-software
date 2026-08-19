import ActivitySection from "@/components/dashboard/ActivitySection";
import AttendanceSection from "@/components/dashboard/AttendanceSection";
import OverviewSection from "@/components/dashboard/OverviewSection";
import QuickActionSection from "@/components/dashboard/QuickActionSection";
import TransactionSection from "@/components/dashboard/TransactionSection";

export default function Page() {
  return (
    <div className="space-y-8">
      <OverviewSection />

      <div className="grid grid-cols-2 gap-6">
        <AttendanceSection />
        <QuickActionSection />
        {/* <TransactionSection /> */}
      </div>

      {/* <div className="grid grid-cols-2 gap-6">
        <QuickActionSection />

        <ActivitySection />
      </div> */}
    </div>
  );
}
