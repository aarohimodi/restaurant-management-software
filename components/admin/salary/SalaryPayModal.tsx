"use client";

import Modal from "@/components/ui/Modal";
import SalaryService from "@/services/SalaryService";
import { SalaryCalculation } from "@/types/salary.types";
import { useState } from "react";
import toast from "react-hot-toast";
interface SalaryPayModalProps {
  open: boolean;
  onClose: () => void;
  salary: SalaryCalculation | null;
  month: number;
  year: number;

  onSuccess: () => void;
}

export default function SalaryPayModal({
  salary,
  month,
  year,
  open,
  onClose,
  onSuccess,
}: SalaryPayModalProps) {
  const paymentModes = ["Cash", "UPI", "Bank Transfer"];

  // const [amount, setAmount] = useState(salary.remainingSalary);
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  if (!salary) return null;
  const handleSubmit = async () => {
    const amount = salary.remainingSalary;
    if (amount <= 0) {
      toast.error("Salary has already been Paid");

      return;
    }
    try {
      setLoading(true);
      // if (amount > salary.remainingSalary) {
      //   alert("Payment amount cannot exceed remaining salary");
      //   return;
      // }
      const response = await SalaryService.paySalary({
        staffId: salary.staff._id,
        month,
        year,
        amount,
        paymentMode,
        remarks,
      });
      if (response.success) {
        toast.success(response.message);
        onSuccess();
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
    <Modal open={open} onClose={onClose} title="Pay Salary">
      <div className="space-y-5">
        {/* Amount */}
        {/* <div>
          <label className="block mb-2 font-medium">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div> */}
        <div>
          <label className="block mb-2 font-medium">Remaining Salary</label>

          <div className="w-full border rounded-lg px-4 py-2 bg-gray-100 font-semibold">
            ₹{salary.remainingSalary.toLocaleString()}
          </div>
        </div>
        <div>
          <label className="block mb-2 font-medium">Payment Mode</label>
          <select
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          >
            {paymentModes.map((mode) => (
              <option key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-2 font-medium">Remarks</label>

          <textarea
            rows={3}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 resize-none"
            placeholder="Enter remarks (optional)"
          />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg border"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || salary.remainingSalary <= 0}
            className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading
              ? "Paying..."
              : `Pay ₹${salary.remainingSalary.toLocaleString()}`}
          </button>
        </div>
      </div>
    </Modal>
  );
}
