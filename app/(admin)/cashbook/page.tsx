import CashbookPage from "@/components/admin/cashbook/CashbookPage";
import { getCashbookSummary } from "@/lib/actions/cashbook";
import { getAllStaff } from "@/lib/actions/staff";

export default async function page() {
  const staffs = await getAllStaff();
  const cashbook = await getCashbookSummary();
  return <CashbookPage staffs={staffs} cashbook={cashbook} />;
}
