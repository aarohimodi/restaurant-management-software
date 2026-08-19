import mongoose, { Schema, models } from "mongoose";

export interface Istaff extends Document {
  name: string;
  phone: string;
  designation: string;
  salary: number;
  joiningDate: Date;
  leftDate?: Date;
  leftReason?: string;
  address?: string;
  isActive: boolean;
}
const staffSchema = new Schema<Istaff>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    designation: {
      type: String,
      required: true,
      trim: true,
    },
    salary: {
      type: Number,
      required: true,
      min: 0,
    },
    joiningDate: {
      type: Date,
      required: true,
    },
    leftDate: {
      type: Date,
    },

    leftReason: {
      type: String,
      trim: true,
      default: "",
    },

    address: {
      type: String,
      default: "",
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);
const Staff = models.Staff || mongoose.model<Istaff>("Staff", staffSchema);
export default Staff;
