import mongoose, { Schema, model, models } from "mongoose";

const attendanceSchema = new Schema(
  {
    staff: {
      type: Schema.Types.ObjectId,
      ref: "Staff",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Present", "Absent", "Half Day", "Paid Leave", "Unpaid Leave"],
      default: "Present",
    },
    checkIn: {
      type: String,
      default: "",
    },
    checkOut: {
      type: String,
      default: "",
    },
    remarks: {
      type: String,
      trim: true,
      default: "",
    },
    leaveReason: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

attendanceSchema.index({ staff: 1, date: 1 }, { unique: true });

const Attendance = models.Attendance || model("Attendance", attendanceSchema);

export default Attendance;
