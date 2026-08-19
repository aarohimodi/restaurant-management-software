import SettingsForm from "@/components/admin/settings/SettingsForm";
import { getSettings } from "@/lib/actions/settings";

export default async function SettingsPage() {
  const settings = await getSettings();

  return <SettingsForm settings={settings} />;
}
