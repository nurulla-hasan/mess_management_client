/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ModalWrapper } from "@/components/ui/custom/modal-wrapper";
import { Button } from "@/components/ui/button";
import { Minus } from "lucide-react";
import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addExpenseAction } from "@/actions/expense";
import { getAllMembersAction } from "@/actions/member";
import { SearchableSelect, SearchableOption } from "@/components/ui/custom/searchable-select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ErrorToast, SuccessToast } from "@/lib/utils";

export function AddExpenseModal() {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    amount: "",
    category: "",
    items: "",
    buyer: null as SearchableOption | null,
    paymentSource: "mess_fund",
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
    if (!formData.amount || !formData.category || !formData.items || !formData.buyer) {
      ErrorToast("Please fill all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        date: formData.date,
        amount: parseFloat(formData.amount),
        category: formData.category,
        items: formData.items,
        buyerId: formData.buyer.value,
        paymentSource: formData.paymentSource,
      };

      const result = await addExpenseAction(payload);
      if (result?.success) {
        SuccessToast("Expense added successfully");
        setOpen(false);
        setFormData({
          date: new Date().toISOString().split("T")[0],
          amount: "",
          category: "",
          items: "",
          buyer: null,
          paymentSource: "mess_fund",
        });
      } else {
        ErrorToast(result?.message || "Failed to add expense");
      }
    } catch {
      ErrorToast("Something went wrong")
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalWrapper
      open={open}
      onOpenChange={setOpen}
      title="Add Expense"
      description="Record a new expense for the mess."
      actionTrigger={
        <Button variant="destructive">
          <Minus /> Add Expense
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
          <Label>Buyer</Label>
          <SearchableSelect
            onSelect={(option) => setFormData({ ...formData, buyer: option })}
            fetchOptions={fetchMemberOptions}
            value={formData.buyer}
            placeholder="Select Buyer"
            searchPlaceholder="Search members..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="meat_fish">Meat / Fish</SelectItem>
              <SelectItem value="vegetables">Vegetables</SelectItem>
              <SelectItem value="groceries">Groceries</SelectItem>
              <SelectItem value="utility">Utility</SelectItem>
              <SelectItem value="gas">Gas</SelectItem>
              <SelectItem value="rent">Rent</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="items">Items / Description</Label>
          <Input
            id="items"
            placeholder="e.g. Rice, Oil, Vegetables"
            value={formData.items}
            onChange={(e) => setFormData({ ...formData, items: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentSource">Payment Source</Label>
          <Select
            value={formData.paymentSource}
            onValueChange={(value) => setFormData({ ...formData, paymentSource: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mess_fund">Mess Fund</SelectItem>
              <SelectItem value="personal">Personal Balance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" variant="destructive" disabled={submitting}>
            {submitting ? "Adding..." : "Add Expense"}
          </Button>
        </div>
      </form>
    </ModalWrapper>
  );
}
