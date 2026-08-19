"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import CashbookService from "@/services/CashbookService";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import AddIncomeModal from "./AddIncomeModal";
import AddExpenseModal from "./AddExpenseModal";
import { staff } from "@/types/staff.types";
import toast from "react-hot-toast";
import {
  dateObjectToUTC,
  formatCurrencyIN,
  formatDateIN,
} from "@/lib/date/dateOnly";

interface CashbookEntry {
  _id: string;
  type: string;
  amount: number;
  remarks: string;
  staff?: {
    _id: string;
    name: string;
  };
}
interface CashbookViewModalProps {
  onRefresh: () => void;
  open: boolean;
  onClose: () => void;
  date: string | null;
  staffs: staff[];
}
export default function CashbookViewModal({
  open,
  onClose,
  date,
  staffs,
  onRefresh,
}: CashbookViewModalProps) {
  const [entries, setEntries] = useState<CashbookEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [openingBalance, setOpeningBalance] = useState(0);
  const modalDate = date ? dateObjectToUTC(new Date(date)) : null;
  const [editIncomeOpen, setEditIncomeOpen] = useState(false);
  const [editExpenseOpen, setEditExpenseOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<any>(null);

  const today = dateObjectToUTC(new Date());

  const isToday = modalDate?.getTime() === today.getTime();
  const fetchDetails = async () => {
    if (!date) return;
    try {
      setLoading(true);

      const response = await CashbookService.getCashbookDetails(date);

      if (response.success) {
        setOpeningBalance(response.data.openingBalance);
        setEntries(response.data.entries);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!open || !date) return;

    fetchDetails();
  }, [open, date]);
  let closingBalance = openingBalance;
  entries.forEach((entry) => {
    if (entry.type === "Income") {
      closingBalance += entry.amount;
    } else {
      closingBalance -= entry.amount;
    }
  });
  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this entry?",
    );
    if (!confirmDelete) return;
    try {
      const response = await CashbookService.deleteEntry(id);
      if (!response.success) {
        toast.error(response.message);
        return;
      }
      toast.success(response.message);
      onRefresh();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };
  return (
    <>
      <Modal open={open} onClose={onClose} title="Cashbook Details">
        {loading ? (
          <p className="text-center py-6">Loading...</p>
        ) : entries.length === 0 ? (
          <p className="text-center py-6 text-slate-500">No entries found.</p>
        ) : (
          <div>
            <div className="mb-4 flex justify-between font-semibold">
              <p>Date : {date ? formatDateIN(date) : "-"}</p>

              <p>Opening Balance : ₹{formatCurrencyIN(openingBalance)}</p>
            </div>

            <table className="w-full border text-center">
              <thead className="bg-slate-100">
                <tr>
                  <th className="border p-2">S.No</th>
                  {/* <th className="border p-2">Opening</th> */}
                  <th className="border p-2">Type</th>
                  <th className="border p-2">Staff</th>
                  <th className="border p-2">Amount</th>
                  <th className="border p-2">Remarks</th>
                  {/* {isToday && <th className="border p-2">Action</th>} */}
                  <th className="border p-2">Action</th>
                </tr>
              </thead>

              <tbody>
                {entries.map((entry, index) => {
                  // const opening = currentBalance;
                  // let income = 0;
                  // let expense = 0;
                  // if (entry.type === "Income") {
                  //   income = entry.amount;
                  //   currentBalance += entry.amount;
                  // } else {
                  //   expense = entry.amount;
                  //   currentBalance -= entry.amount;
                  // }
                  // const balance = currentBalance;
                  return (
                    <tr key={entry._id}>
                      <td className="border p-2">{index + 1}</td>
                      {/* <td className="border p-2"> ₹{opening.toLocaleString()}</td> */}

                      <td className="border p-2">{entry.type}</td>

                      <td className="border p-2">{entry.staff?.name ?? "-"}</td>

                      <td className="border p-2">
                        ₹{formatCurrencyIN(entry.amount)}
                      </td>

                      <td className="border p-2">{entry.remarks}</td>
                      {/* {isToday && ( hide edit and delete button for previous dates )} */}
                      {entry.type !== "Salary Payment" ? (
                        <td className="border-b   flex p-2 gap-2 justify-center">
                          <Button
                            title="Edit"
                            onClick={() => {
                              setSelectedEntry(entry);
                              if (entry.type === "Income") {
                                setEditIncomeOpen(true);
                              } else {
                                setEditExpenseOpen(true);
                              }
                            }}
                          />
                          <Button
                            title="Delete"
                            onClick={() => handleDelete(entry._id)}
                          />{" "}
                        </td>
                      ) : (
                        <td className="border-b h-14 flex p-2 gap-2">
                          <p></p>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="mt-2 flex justify-between font-semibold">
              <p>Closing Balance : ₹{formatCurrencyIN(closingBalance)}</p>
            </div>
          </div>
        )}
      </Modal>
      <AddIncomeModal
        open={editIncomeOpen}
        onClose={() => {
          setEditIncomeOpen(false);
          setSelectedEntry(null);
        }}
        mode="edit"
        initialData={selectedEntry}
        onSuccess={() => {
          fetchDetails();
          onRefresh();
        }}
      />
      <AddExpenseModal
        open={editExpenseOpen}
        onClose={() => {
          setEditExpenseOpen(false);
          setSelectedEntry(null);
        }}
        mode="edit"
        initialData={{
          _id: selectedEntry?._id,
          type: selectedEntry?.type,
          staff: selectedEntry?.staff?._id,
          amount: selectedEntry?.amount,
          remarks: selectedEntry?.remarks,
        }}
        onSuccess={() => {
          fetchDetails();
          onRefresh();
        }}
        staffs={staffs}
      />
    </>
  );
}
