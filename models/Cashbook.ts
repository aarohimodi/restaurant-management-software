import mongoose, { Schema, models } from "mongoose";

export type CashbookType =
  | "Income"
  | "Other Expense"
  | "Staff Expense"
  | "Salary Payment";

export interface ICashbook extends Document {
  date: Date;
  type: CashbookType;
  staff?: mongoose.Types.ObjectId;
  amount: number;
  remarks: string;
  isDeleted: boolean;
}

const cashbookSchema = new Schema<ICashbook>(
  {
    date: {
      type: Date,
      required: true,
    },

    type: {
      type: String,
      enum: ["Income", "Other Expense", "Staff Expense", "Salary Payment"],
      required: true,
    },

    staff: {
      type: Schema.Types.ObjectId,
      ref: "Staff",
      default: null,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    remarks: {
      type: String,
      required: true,
      trim: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Cashbook =
  models.Cashbook || mongoose.model<ICashbook>("Cashbook", cashbookSchema);

export default Cashbook;
