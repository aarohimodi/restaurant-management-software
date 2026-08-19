import { z } from "zod";

export const expenseSchema = z
  .object({
    type: z.enum(["Other Expense", "Staff Expense"]),

    staff: z.string().optional(),
    date: z.string().min(1, "Date is required"),
    amount: z.number().min(1, "Amount must be greater than 0"),

    remarks: z.string().min(1, "Remarks is required"),
  })
  .refine(
    (data) => {
      if (data.type === "Staff Expense") {
        return !!data.staff;
      }
      return true;
    },
    {
      message: "Please select a staff member",
      path: ["staff"],
    },
  );

export type ExpenseFormData = z.infer<typeof expenseSchema>;
