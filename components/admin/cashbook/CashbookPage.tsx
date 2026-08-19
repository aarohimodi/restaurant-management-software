"use client";
import AddExpenseModal from "@/components/admin/cashbook/AddExpenseModal";
import AddIncomeModal from "@/components/admin/cashbook/AddIncomeModal";
import Button from "@/components/ui/Button";
import { useState } from "react";
import { CashbookSummary } from "@/types/cashbook.types";
import { staff } from "@/types/staff.types";
import CashbookTable from "./CashbookTable";
interface CashbookPageProps {
  staffs: staff[];
  cashbook: CashbookSummary[];
}

export default function CashbookPage({ staffs, cashbook }: CashbookPageProps) {
  const [openIncomeModal, setOpenIncomeModal] = useState(false);
  const [openExpenseModal, setOpenExpenseModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Cashbook</h1>
          <p className="text-slate-500">
            Manage your daily income and expenses
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setOpenIncomeModal(true)} title="Add Income" />
          <Button
            onClick={() => setOpenExpenseModal(true)}
            title="Add Expense"
          />
        </div>
      </div>
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <CashbookTable
          cashbook={cashbook}
          staffs={staffs}
          refreshKey={refreshKey}
          onRefresh={handleRefresh}
        />
      </div>
      <AddIncomeModal
        open={openIncomeModal}
        onClose={() => setOpenIncomeModal(false)}
        onSuccess={() => setRefreshKey((prev) => prev + 1)}
      />
      <AddExpenseModal
        open={openExpenseModal}
        onClose={() => setOpenExpenseModal(false)}
        staffs={staffs}
        onSuccess={() => setRefreshKey((prev) => prev + 1)}
      />
    </div>
  );
}
