"use client";

import { ModalWrapper } from "@/components/ui/custom/modal-wrapper";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addExpenseAction } from "@/actions/expense";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ErrorToast, SuccessToast } from "@/lib/utils";

export function RequestExpenseModal() {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    amount: "",
    category: "",
    items: "",
    paymentSource: "personal", // Default to personal for members
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.category || !formData.items) {
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
        paymentSource: formData.paymentSource,
        // buyerId is handled by backend for members
      };

      const result = await addExpenseAction(payload);
      if (result?.success) {
        SuccessToast("Expense request submitted successfully");
        setOpen(false);
        setFormData({
          date: new Date().toISOString().split("T")[0],
          amount: "",
          category: "",
          items: "",
          paymentSource: "personal",
        });
      } else {
        ErrorToast(result?.message || "Failed to submit expense request");
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
      title="Request Expense"
      description="Submit an expense request for approval."
      actionTrigger={
        <Button className="w-full justify-start gap-2" variant="outline">
          <PlusCircle className="h-4 w-4 text-blue-500" />
          Request Expense
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
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
            <SelectItem value="meat_fish">Meat & Fish</SelectItem>
            <SelectItem value="vegetables">Vegetables</SelectItem>
            <SelectItem value="groceries">Groceries</SelectItem>
            <SelectItem value="utility">Utility</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="items">Items Description</Label>
          <Input
            id="items"
            placeholder="e.g., Chicken 2kg, Rice 5kg"
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
              <SelectValue placeholder="Select source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="personal">Personal (I paid)</SelectItem>
              <SelectItem value="mess_fund">Petty Cash (Mess Fund)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Request"}
          </Button>
        </div>
      </form>
    </ModalWrapper>
  );
}
