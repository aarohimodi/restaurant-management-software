"use client";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { cashbookSchema } from "@/schemas/cashbookSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CashbookFormData } from "@/schemas/cashbookSchema";
import CashbookService from "@/services/CashbookService";
import Modal from "@/components/ui/Modal";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getTodayDateInputValue } from "@/lib/date/dateOnly";
interface Props {
  open: boolean;
  onClose: () => void;
  mode?: "add" | "edit";
  initialData?: {
    _id: string;
    amount: number;
    remarks: string;
  };
  onSuccess?: () => void;
}

export default function AddIncomeModal({
  open,
  onClose,
  mode = "add",
  initialData,
  onSuccess,
}: Props) {
  const today = getTodayDateInputValue();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CashbookFormData>({
    resolver: zodResolver(cashbookSchema),
    defaultValues: {
      type: "Income",
      date: today,
      amount: 0,
      remarks: "",
    },
  });
  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && initialData) {
      reset({
        type: "Income",
        amount: initialData.amount,
        remarks: initialData.remarks,
        date: today,
      });
    } else {
      reset({
        type: "Income",
        amount: 0,
        date: today,
        remarks: "",
      });
    }
  }, [open, mode, initialData, reset]);
  const onSubmit = async (data: CashbookFormData) => {
    try {
      let response;
      if (mode === "edit" && initialData) {
        response = await CashbookService.updateEntry(initialData._id, {
          amount: data.amount,
          remarks: data.remarks,
        });
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
    // <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
    /* <div className="w-full max-w-md rounded-xl bg-white p-6">
        <h2 className="mb-6 text-2xl font-semibold">Add Income</h2>
      </div> */

    // </div>
    <>
      <Modal
        open={open}
        onClose={onClose}
        title={mode === "edit" ? "Edit Income" : "Add Income"}
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
            placeholder="Today's Sale"
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
