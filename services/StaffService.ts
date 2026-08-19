import { staff } from "@/types/staff.types";
const StaffService = {
  async createStaff(data: staff) {
    const response = await fetch("/api/staff", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  async getAllStaff() {
    const response = await fetch("/api/staff");
    return response.json();
  },
  async getStaffById(id: string) {
    const response = await fetch(`/api/staff/${id}`);
    return response.json();
  },
  async updateStaff(id: string, data: staff) {
    const response = await fetch(`/api/staff/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  async deleteStaff(id: string) {
    const response = await fetch(`/api/staff/${id}`, {
      method: "DELETE",
    });
    return response.json();
  },
};

export default StaffService;
