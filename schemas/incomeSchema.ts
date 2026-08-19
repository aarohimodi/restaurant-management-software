import { z } from "zod";

export const incomeSchema = z.object({
  amount: z.number().min(1, "Amount must be greater than 0"),
  date: z.string().min(1, "Date is required"),
  remarks: z.string().min(1, "Remarks is required"),
});

export type IncomeFormData = z.infer<typeof incomeSchema>;
