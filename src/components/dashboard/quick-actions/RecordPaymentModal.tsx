/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ModalWrapper } from "@/components/ui/custom/modal-wrapper";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addDeposit } from "@/services/deposit";
import { getAllMembers } from "@/services/member";
import { SearchableSelect, SearchableOption } from "@/components/ui/custom/searchable-select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ErrorToast, SuccessToast } from "@/lib/utils";

export function RecordPaymentModal() {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    amount: "",
    paymentMethod: "cash",
    note: "",
    member: null as SearchableOption | null,
  });

  const fetchMemberOptions = useCallback(async (search: string) => {
    try {
      const members = await getAllMembers();
      if (!Array.isArray(members)) return [];
      
      return members
        .filter((m: any) => {
          const name = m.userId?.fullName || "";
          return name.toLowerCase().includes(search.toLowerCase());
        })
        .map((m: any) => ({
          value: m._id,
          label: m.userId?.fullName || "Unknown Member",
          original: m,
        }));
    } catch (error) {
      console.error("Failed to fetch member options:", error);
      return [];
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.paymentMethod || !formData.member) {
      ErrorToast("Please fill all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        date: formData.date,
        amount: parseFloat(formData.amount),
        paymentMethod: formData.paymentMethod,
        note: formData.note,
        memberId: formData.member.value,
      };

      const result = await addDeposit(payload);
      if (result?.success) {
        SuccessToast("Payment recorded successfully");
        setOpen(false);
        setFormData({
          date: new Date().toISOString().split("T")[0],
          amount: "",
          paymentMethod: "cash",
          note: "",
          member: null,
        });
      } else {
        ErrorToast(result?.message || "Failed to record payment");
      }
    } catch  {
      ErrorToast("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalWrapper
      open={open}
      onOpenChange={setOpen}
      title="Record Payment"
      description="Add a deposit to member's balance."
      actionTrigger={
        <Button variant="secondary">
          <CreditCard /> Record Payment
        </Button>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 p-6">
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
          <Label>Member</Label>
          <SearchableSelect
            onSelect={(option) => setFormData({ ...formData, member: option })}
            fetchOptions={fetchMemberOptions}
            value={formData.member}
            placeholder="Select Member"
            searchPlaceholder="Search members..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentMethod">Payment Method</Label>
          <Select
            value={formData.paymentMethod}
            onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
              <SelectItem value="bkash">bKash</SelectItem>
              <SelectItem value="nagad">Nagad</SelectItem>
              <SelectItem value="rocket">Rocket</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="note">Note (Optional)</Label>
          <Textarea
            id="note"
            placeholder="e.g. Transaction ID, Purpose"
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" variant="secondary" disabled={submitting}>
            {submitting ? "Recording..." : "Record Payment"}
          </Button>
        </div>
      </form>
    </ModalWrapper>
  );
}
