export interface SalaryHistory {
  _id?: string;
  staff: string;
  salary: number;
  effectiveFrom: string;
  reason?: string;
  createdAt?: string;
  updatedAt?: string;
}
export interface SalaryHistoryRequest {
  staff: string;
  salary: number;
  effectiveFrom: string;
  reason?: string;
}
export interface SalaryHistoryItem {
  _id: string;
  salary: number;
  effectiveFrom: string;
  reason?: string;
}
