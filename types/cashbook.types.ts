export type CashbookType =
  | "Income"
  | "Other Expense"
  | "Staff Expense"
  | "Salary Payment";

export interface Cashbook {
  _id?: string;
  date: string;
  type: CashbookType;
  staff?: string;
  amount: number;
  remarks: string;
  isDeleted?: boolean;

  createdAt?: string;
  updatedAt?: string;
}
export interface CashbookSummary {
  _id: string;
  income: number;
  expense: number;
  opening: number;
  closing: number;
}
