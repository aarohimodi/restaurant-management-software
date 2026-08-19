import { SalaryHistoryRequest } from "@/types/salaryHistory";

const SalaryHistoryService = {
  async getSalaryHistory(staffId: string) {
    const response = await fetch(`/api/staff/${staffId}/salary-history`);
    return response.json();
  },
};

export default SalaryHistoryService;
