export type SalaryStatus = "Pending" | "Partial" | "Paid";
export interface SalaryPaymentData {
  staffId: string;
  month: number;
  year: number;
  amount: number;
  paymentMode: string;
  remarks: string;
}
export interface SalaryCalculation {
  staff: {
    _id: string;
    name: string;
  };
  salaryHistory: {
    salary: number;
  };
  present: number;
  absent: number;
  paidLeave: number;
  unpaidLeave: number;
  halfDay: number;

  paidDays: number;
  actualDays: number;
  totalWorkingDays: number;
  payableDays: number;

  perDaySalary: number;
  grossSalary: number;
  expectedStart: string;
  expectedEnd: string;
  advancePaid: number;
  alreadyPaid: number;
  remainingSalary: number;
  overPaidAmount: number;
  status: SalaryStatus;
}

export interface SalaryCalculationResponse {
  success: boolean;
  messsage?: string;
  data?: SalaryCalculation;
}
export interface SalaryPayment {
  _id: string;
  staff: {
    _id: string;
    name: string;
  };
  month: number;
  year: number;
  amount: number;
  paymentMode: string;
  remarks?: string;
  paymentDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface SalaryPaymentPagination {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
}
