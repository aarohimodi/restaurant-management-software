import mongoose, { Schema, models } from "mongoose";

const attendanceLockSchema = new Schema(
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

    lockedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// One lock per staff per month
attendanceLockSchema.index({ staff: 1, month: 1, year: 1 }, { unique: true });

const AttendanceLock =
  models.AttendanceLock ||
  mongoose.model("AttendanceLock", attendanceLockSchema);

export default AttendanceLock;
