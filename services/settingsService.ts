import { Settings } from "@/types/settings.types";

const SettingsService = {
  async getSettings() {
    const response = await fetch("/api/settings");
    return response.json();
  },
  async saveSettings(data: Settings) {
    const response = await fetch("/api/settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};

export default SettingsService;
