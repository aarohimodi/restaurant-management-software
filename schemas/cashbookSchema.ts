import { z } from "zod";

export const cashbookSchema = z.object({
  type: z.enum(["Income", "Other Expense", "Staff Expense", "Salary Payment"]),
  date: z.string().min(1, "Date is required"),
  staff: z.string().optional(),

  amount: z.number().min(1, "Amount must be greater than 0"),

  remarks: z.string().min(1, "Remarks is required"),
});

export type CashbookFormData = z.infer<typeof cashbookSchema>;
