"use client";

import { useEffect, useState } from "react";
import DashboardCard from "./DashboardCard";

interface DashboardData {
  cashInHand: number;
  todayIncome: number;
  todayExpense: number;
  totalStaff: number;
}

export default function OverviewSection() {
  const [data, setData] = useState<DashboardData>({
    cashInHand: 0,
    todayIncome: 0,
    todayExpense: 0,
    totalStaff: 0,
  });

  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/dashboard");

      const result = await response.json();

      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const cards = [
    {
      title: "Cash In Hand",
      value: `₹${data.cashInHand.toLocaleString()}`,
    },
    {
      title: "Today's Income",
      value: `₹${data.todayIncome.toLocaleString()}`,
    },
    {
      title: "Today's Expense",
      value: `₹${data.todayExpense.toLocaleString()}`,
    },
    {
      title: "Total Staff",
      value: data.totalStaff.toString(),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2">
      {cards.map((card) => (
        <DashboardCard
          key={card.title}
          title={card.title}
          value={loading ? "..." : card.value}
        />
      ))}
    </div>
  );
}
