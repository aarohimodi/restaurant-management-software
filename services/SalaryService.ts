import { SalaryPaymentData } from "@/types/salary.types";
const SalaryService = {
  async calculateSalary(staffId: string, month: number, year: number) {
    const response = await fetch(
      `/api/salary-accounting?staffId=${staffId}&month=${month}&year=${year}`,
    );
    return response.json();
  },
  async paySalary(data: SalaryPaymentData) {
    const response = await fetch("/api/salary-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  async getPayments(
    page: number,
    month?: number,
    year?: number,
    staff?: string,
  ) {
    let url = `/api/salary-payment?page=${page}`;

    if (month) {
      url += `&month=${month}`;
    }

    if (year) {
      url += `&year=${year}`;
    }

    if (staff) {
      url += `&staff=${staff}`;
    }

    const response = await fetch(url);

    return response.json();
  },
};
export default SalaryService;
