"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { SalaryHistoryItem } from "@/types/salaryHistory";
import SalaryHistoryService from "@/services/salaryHistoryService";
import toast from "react-hot-toast";
interface SalaryHistoryProps {
  staffId: string;
  onClose: () => void;
}

export default function SalaryHistory({
  staffId,
  onClose,
}: SalaryHistoryProps) {
  const [history, setHistory] = useState<SalaryHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, [staffId]);

  const fetchHistory = async () => {
    try {
      setLoading(true);

      const response = await SalaryHistoryService.getSalaryHistory(staffId);

      if (response.success) {
        setHistory(response.data);
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
    <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl  font-semibold">Salary History</h2>
        <div className="w-fit">
          {" "}
          <Button title="Close" onClick={onClose} />
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : history.length === 0 ? (
        <p>No salary history found.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b bg-slate-100">
              <th className="p-3 text-left">Salary</th>
              <th className="p-3 text-left">Effective From</th>
              <th className="p-3 text-left">Reason</th>
            </tr>
          </thead>

          <tbody>
            {history.map((item) => (
              <tr key={item._id} className="border-b">
                <td className="p-3">₹{item.salary}</td>

                <td className="p-3">
                  {new Date(item.effectiveFrom).toLocaleDateString("en-IN")}
                </td>

                <td className="p-3">{item.reason || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
