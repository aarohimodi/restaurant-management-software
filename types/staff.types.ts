export interface staff {
  _id?: string;
  name: string;
  phone: string;
  designation: string;
  salary: number;
  joiningDate: string;
  leftDate?: string;
  leftReason?: string;
  address?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  effectiveFrom?: string;
  reason?: string;
}
