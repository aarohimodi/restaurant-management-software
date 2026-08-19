import mongoose, { Document, Schema, models } from "mongoose";

export interface ISalaryHistory extends Document {
  staff: mongoose.Types.ObjectId;
  salary: number;
  effectiveFrom: Date;
  reason?: string;
}
const salaryHistorySchema = new Schema<ISalaryHistory>(
  {
    staff: {
      type: Schema.Types.ObjectId,
      ref: "Staff",
      required: true,
    },

    salary: {
      type: Number,
      required: true,
      min: 0,
    },

    effectiveFrom: {
      type: Date,
      required: true,
    },

    reason: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);
salaryHistorySchema.index(
  {
    staff: 1,
    effectiveFrom: 1,
  },
  {
    unique: true,
  },
);
const SalaryHistory =
  models.SalaryHistory ||
  mongoose.model<ISalaryHistory>("SalaryHistory", salaryHistorySchema);
export default SalaryHistory;
