/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ModalWrapper } from "@/components/ui/custom/modal-wrapper";
import { Button } from "@/components/ui/button";
import { RotateCw } from "lucide-react";
import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addExpenseAction } from "@/actions/expense";
import { addDepositAction } from "@/actions/deposit";
import { getAllMembersAction } from "@/actions/member";
import { SearchableSelect, SearchableOption } from "@/components/ui/custom/searchable-select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ErrorToast, SuccessToast } from "@/lib/utils";

export function PettyCashAdjustmentModal() {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [type, setType] = useState("deduct"); // deduct (expense) or add (deposit)
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    amount: "",
    reason: "",
    member: null as SearchableOption | null,
  });

  const fetchMemberOptions = useCallback(async (search: string) => {
    const members = await getAllMembersAction();
    return members
      .filter((m: any) => m.userId?.fullName.toLowerCase().includes(search.toLowerCase()))
      .map((m: any) => ({
        value: m._id,
        label: m.userId?.fullName,
        original: m,
      }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.reason || !formData.member) {
      ErrorToast("Please fill all required fields");
      return;
    }

    setSubmitting(true);
    try {
      let result;
      if (type === "deduct") {
        // Expense
        const payload = {
          date: formData.date,
          amount: parseFloat(formData.amount),
          category: "other",
          items: `Adjustment: ${formData.reason}`,
          buyerId: formData.member.value,
          paymentSource: "mess_fund",
        };
        result = await addExpenseAction(payload);
      } else {
        // Deposit
        const payload = {
          date: formData.date,
          amount: parseFloat(formData.amount),
          paymentMethod: "cash", // Assume cash for adjustment
          note: `Adjustment: ${formData.reason}`,
          memberId: formData.member.value,
        };
        result = await addDepositAction(payload);
      }

      if (result?.success) {
        SuccessToast("Adjustment recorded successfully");
        setOpen(false);
        setFormData({
          date: new Date().toISOString().split("T")[0],
          amount: "",
          reason: "",
          member: null,
        });
      } else {
        ErrorToast(result?.message || "Failed to record adjustment");
      }
    } catch {
      ErrorToast("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalWrapper
      open={open}
      onOpenChange={setOpen}
      title="Petty Cash Adjustment"
      description="Adjust mess fund balance manually."
      actionTrigger={
        <Button variant="outline">
          <RotateCw /> Petty Cash Adjustment
        </Button>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 p-6">
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-md p-3 text-sm text-yellow-600 dark:text-yellow-400">
            For regular bills like <strong>Rent, Gas, or Utility</strong>, please use the <span className="font-semibold text-destructive">Add Expense</span> button instead. Use this only for small balance corrections.
        </div>
        <Tabs value={type} onValueChange={setType} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="deduct">Deduct (Expense)</TabsTrigger>
            <TabsTrigger value="add">Add (Deposit)</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Adjusted By (Member)</Label>
          <SearchableSelect
            onSelect={(option) => setFormData({ ...formData, member: option })}
            fetchOptions={fetchMemberOptions}
            value={formData.member}
            placeholder="Select Member"
            searchPlaceholder="Search members..."
          />
          <p className="text-xs text-muted-foreground">
            This member is recorded as the reporter. The cost is still shared by all.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="reason">Reason</Label>
          <Textarea
            id="reason"
            placeholder="e.g. Calculation error, Found extra cash"
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            required
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" variant="outline" disabled={submitting}>
            {submitting ? "Adjusting..." : "Confirm Adjustment"}
          </Button>
        </div>
      </form>
    </ModalWrapper>
  );
}