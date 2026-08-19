import { z } from "zod";

export const settingSchema = z.object({
  restaurantName: z.string().min(2, "Resaurant name is required"),
  ownerName: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  openingBalance: z.number().min(0, "Opening balance cannot be negative"),
});

export type SettingsFormData = z.infer<typeof settingSchema>;
