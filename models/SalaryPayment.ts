import mongoose, { Document, Schema, models } from "mongoose";

export interface ISalaryPayment extends Document {
  staff: mongoose.Types.ObjectId;
  month: number;
  year: number;
  amount: number;
  paymentDate: Date;
  paymentMode: "Cash" | "UPI" | "Bank";
  remarks?: string;
}

const salaryPaymentSchema = new Schema<ISalaryPayment>(
  {
    staff: {
      type: Schema.Types.ObjectId,
      ref: "Staff",
      required: true,
    },

    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },

    year: {
      type: Number,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    paymentDate: {
      type: Date,
      required: true,
      default: Date.now,
    },

    paymentMode: {
      type: String,
      enum: ["Cash", "UPI", "Bank"],
      default: "Cash",
    },

    remarks: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const SalaryPayment =
  models.SalaryPayment ||
  mongoose.model<ISalaryPayment>("SalaryPayment", salaryPaymentSchema);

export default SalaryPayment;
