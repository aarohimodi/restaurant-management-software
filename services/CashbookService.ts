import { CashbookFormData } from "@/schemas/cashbookSchema";

const CashbookService = {
  async addEntry(data: CashbookFormData) {
    const response = await fetch("/api/cashbook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return response.json();
  },

  async getSummary(page: number, fromDate?: string, toDate?: string) {
    let url = `/api/cashbook?page=${page}`;
    if (fromDate) {
      url += `&fromDate=${fromDate}`;
    }
    if (toDate) {
      url += `&toDate=${toDate}`;
    }
    const response = await fetch(url, {
      method: "GET",
    });

    return response.json();
  },
  async getCashbookDetails(date: string) {
    const response = await fetch(`/api/cashbook/details?date=${date}`);
    return response.json();
  },
  async updateEntry(
    id: string,
    data: { staff?: string; amount: number; remarks: string },
  ) {
    const response = await fetch(`/api/cashbook/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  async deleteEntry(id: string) {
    const response = await fetch(`/api/cashbook/${id}`, {
      method: "DELETE",
    });
    return response.json();
  },
};

export default CashbookService;
