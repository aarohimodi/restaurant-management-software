import { z } from "zod";
export const staffSchema = z.object({
  name: z.string().trim().min(1, "Staff name is required"),
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .length(10, "phone number must be 10 digits"),
  designation: z.string().trim().min(1, "Designation is required"),

  salary: z.number().min(1, "Salary must be greater than 0"),

  joiningDate: z.string().min(1, "Joining date is required"),

  address: z.string().trim().optional(),
  // effectiveFrom: z.string().optional(),
  reason: z.string().optional(),
  isActive: z.boolean(),
});
