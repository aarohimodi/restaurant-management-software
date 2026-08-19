"use client";

import { staff } from "@/types/staff.types";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import StaffService from "@/services/StaffService";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { staffSchema } from "@/schemas/staffSchema";
import { useEffect } from "react";
import { toDateInputValue } from "@/lib/date/dateOnly";
import toast from "react-hot-toast";
interface StaffFormProps {
  staff?: staff;
}
export default function StaffForm({ staff }: StaffFormProps) {
  const isEditMode = !!staff;
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm<staff>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      name: "",
      phone: "",
      designation: "",
      salary: 0,
      joiningDate: "",
      address: "",
      // effectiveFrom: "",
      reason: "",
      isActive: true,
    },
  });
  const isActiveValue = watch("isActive");

  useEffect(() => {
    if (staff) {
      reset({
        name: staff.name,
        phone: staff.phone,
        designation: staff.designation,
        salary: staff.salary,
        // joiningDate: new Date(staff.joiningDate).toISOString().split("T")[0],
        joiningDate: toDateInputValue(staff.joiningDate),
        address: staff.address ?? "",
        isActive: staff.isActive,
        // effectiveFrom: "",
        reason: "",
      });
    }
  }, [staff, reset]);
  const originalSalary = staff?.salary ?? 0;
  const currentSalary = watch("salary");
  const salaryChanged =
    isEditMode && Number(currentSalary) !== Number(originalSalary);
  const onSubmit = async (data: staff) => {
    console.log("Submitted Data:", data);
    try {
      const response = isEditMode
        ? await StaffService.updateStaff(staff._id!, data)
        : await StaffService.createStaff(data);

      if (!response.success) {
        toast.error(response.message);

        return;
      }
      toast.success(response.message);
      router.push("/staff");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-2xl bg-white p-6 shadow-sm"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Input
          label="Staff Name"
          placeholder="Enter staff name"
          {...register("name")}
          error={errors.name?.message?.toString()}
        />
        <Input
          label="Phone Number"
          placeholder="Enter phone number"
          {...register("phone")}
          error={errors.phone?.message?.toString()}
        />
        <Input
          label="Designation"
          placeholder="Enter designation"
          {...register("designation")}
          error={errors.designation?.message?.toString()}
        />

        <Input
          label="Monthly Salary"
          type="number"
          placeholder="Enter salary"
          {...register("salary", { valueAsNumber: true })}
          error={errors.salary?.message?.toString()}
        />
        {salaryChanged && (
          <>
            {/* <Input
              label="Effective From"
              type="date"
              {...register("effectiveFrom")}
              error={errors.effectiveFrom?.message?.toString()}
            />*/}
            <Input
              label="Reason (Optional)"
              placeholder="e.g. Annual Increment"
              {...register("reason")}
              error={errors.reason?.message?.toString()}
            />
          </>
        )}
        <Input
          label="Joining Date"
          type="date"
          {...register("joiningDate")}
          error={errors.joiningDate?.message?.toString()}
        />
        {/* <div>
          <label className="mb-2 block text-sm font-medium">Status</label>
          <select
            className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-black"
            {...register("isActive", {
              setValueAs: (value) => value === "true",
            })}
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div> */}
        <div>
          <label className="mb-2 block text-sm font-medium">Status</label>

          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <select
                value={field.value ? "true" : "false"}
                onChange={(e) => field.onChange(e.target.value === "true")}
                className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-black"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            )}
          />
        </div>
      </div>
      <div className="mt-6">
        <Input
          label="Address"
          placeholder="Enter Address"
          {...register("address")}
          error={errors.address?.message?.toString()}
        />
      </div>
      <div className="mt-8 flex justify-end">
        <Button
          type="submit"
          title={isEditMode ? "update Staff" : "Save Staff"}
        />
      </div>
    </form>
  );
}
