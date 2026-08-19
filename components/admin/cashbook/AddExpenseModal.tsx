"use client";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { expenseSchema, ExpenseFormData } from "@/schemas/expenseSchema";
import CashbookService from "@/services/CashbookService";
import { useRouter } from "next/navigation";
import { staff } from "@/types/staff.types";
import { getTodayDateInputValue } from "@/lib/date/dateOnly";

interface AddExpenseModalProps {
  open: boolean;
  mode?: "add" | "edit";
  onClose: () => void;
  staffs: staff[];
  initialData?: {
    _id: string;
    type: "Other Expense" | "Staff Expense";
    staff?: string;
    amount: number;
    remarks: string;
  };
  onSuccess?: () => void;
}

export default function AddExpenseModal({
  open,
  onClose,
  staffs,
  mode = "add",
  initialData,
  onSuccess,
}: AddExpenseModalProps) {
  const today = getTodayDateInputValue();

  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      type: "Other Expense",
      staff: "",
      amount: 0,
      date: today,
      remarks: "",
    },
  });

  const expenseType = watch("type");

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && initialData) {
      reset({
        type: initialData.type,
        staff: initialData.staff || "",
        amount: initialData.amount,
        remarks: initialData.remarks,
        date: today,
      });
    } else {
      reset({
        type: "Other Expense",
        staff: "",
        amount: 0,
        date: today,
        remarks: "",
      });
    }
  }, [open, reset, initialData, mode]);

  const onSubmit = async (data: ExpenseFormData) => {
    try {
      let response;

      if (mode === "edit" && initialData) {
        response = await CashbookService.updateEntry(initialData._id, data);
      } else {
        response = await CashbookService.addEntry(data);
      }

      if (!response.success) {
        toast.error(response.message);
        return;
      }

      toast.success(response.message);

      reset();

      if (onSuccess) {
        onSuccess();
      } else {
        router.refresh();
      }
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        title={mode === "edit" ? "Edit Expense" : "Add Expense"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {mode === "add" && (
            <Input
              label="Date"
              type="date"
              {...register("date")}
              max={today}
              error={errors.date?.message?.toString()}
            />
          )}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Expense Type
            </label>

            <select
              {...register("type")}
              className="w-full rounded-md border px-3 py-2"
            >
              <option value="Other Expense">Other Expense</option>
              <option value="Staff Expense">Staff Expense</option>
            </select>
          </div>

          {expenseType === "Staff Expense" && (
            <div>
              <label className="mb-2 block text-sm font-medium">Staff</label>

              <select
                {...register("staff")}
                className="w-full rounded-md border px-3 py-2"
              >
                <option value="">Select Staff</option>

                {staffs.map((staff) => (
                  <option key={staff._id} value={staff._id}>
                    {staff.name}
                  </option>
                ))}
              </select>

              <p className="mt-1 text-sm text-red-500">
                {errors.staff?.message}
              </p>
            </div>
          )}

          <Input
            label="Amount"
            type="number"
            {...register("amount", {
              valueAsNumber: true,
            })}
            error={errors.amount?.message?.toString()}
          />

          <Input
            label="Remarks"
            {...register("remarks")}
            error={errors.remarks?.message?.toString()}
          />

          <div className="flex justify-end gap-3">
            <Button type="button" title="Cancel" onClick={onClose} />

            <Button type="submit" title={mode === "edit" ? "Update" : "Save"} />
          </div>
        </form>
      </Modal>
    </>
  );
}
