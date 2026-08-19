export function dateToUTC(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);

  return new Date(Date.UTC(year, month - 1, day));
}
export function toDateInputValue(date: Date | string): string {
  return new Date(date).toISOString().split("T")[0];
}
export function dateObjectToUTC(date: Date): Date {
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
}
export function getTodayDateInputValue(): string {
  const today = new Date();

  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}

export function formatDateIN(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  });
}
export const formatCurrencyIN = (amount: number) => {
  return new Intl.NumberFormat("en-IN").format(amount);
};
