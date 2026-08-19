import mongoose, { Schema, models } from "mongoose";

export interface ISettings extends Document {
  restaurantName: string;
  ownerName?: string;
  phone?: string;
  address?: string;
  openingBalance: number;
}

const settingsSchema = new Schema<ISettings>(
  {
    restaurantName: {
      type: String,
      required: true,
      trim: true,
    },

    ownerName: {
      type: String,
      default: "",
      trim: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    address: {
      type: String,
      default: "",
      trim: true,
    },

    openingBalance: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const Settings =
  models.Settings || mongoose.model<ISettings>("Settings", settingsSchema);

export default Settings;
