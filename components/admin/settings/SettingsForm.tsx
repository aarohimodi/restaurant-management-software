"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { settingSchema, SettingsFormData } from "@/schemas/settingsSchema";
import SettingsService from "@/services/settingsService";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Settings } from "@/types/settings.types";
import { useRouter } from "next/navigation";

interface SettingsFormProps {
  settings?: Settings | null;
}

export default function SettingsForm({ settings }: SettingsFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingSchema),
    defaultValues: {
      restaurantName: "",
      ownerName: "",
      phone: "",
      address: "",
      openingBalance: 0,
    },
  });
  useEffect(() => {
    if (settings) {
      reset({
        restaurantName: settings.restaurantName,
        ownerName: settings.ownerName,
        phone: settings.phone,
        address: settings.address,
        openingBalance: settings.openingBalance,
      });
    }
  }, [settings, reset]);
  const onSubmit = async (data: SettingsFormData) => {
    try {
      const response = await SettingsService.saveSettings(data);
      if (!response.success) {
        toast.error(response.message);
        return;
      }
      toast.success(response.message);
      router.refresh();
    } catch (error) {
      console.error(error);
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
          label="Restaurant Name"
          {...register("restaurantName")}
          error={errors.restaurantName?.message?.toString()}
        />

        <Input
          label="Owner Name"
          {...register("ownerName")}
          error={errors.ownerName?.message?.toString()}
        />

        <Input
          label="Phone Number"
          {...register("phone")}
          error={errors.phone?.message?.toString()}
        />

        <Input
          label="Opening Balance"
          type="number"
          {...register("openingBalance", {
            valueAsNumber: true,
          })}
          error={errors.openingBalance?.message?.toString()}
        />
      </div>

      <div className="mt-6">
        <Input
          label="Address"
          {...register("address")}
          error={errors.address?.message?.toString()}
        />
      </div>

      <div className="mt-8 flex justify-end">
        <Button title="Save Settings" type="submit" />
      </div>
    </form>
  );
}
