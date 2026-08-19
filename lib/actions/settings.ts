import Settings from "@/models/Settings";
import { connectDB } from "../db";

export async function getSettings() {
  await connectDB();

  const settings = await Settings.findOne().lean();

  if (!settings) return null;

  return {
    ...settings,
    _id: settings._id.toString(),
  };
}
