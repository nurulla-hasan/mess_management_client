/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { ModalWrapper } from "@/components/ui/custom/modal-wrapper";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addMealAction, getMealByDateAction } from "@/actions/meal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ErrorToast, SuccessToast } from "@/lib/utils";

import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export function AddMealModal() {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Active meal types (to show/hide columns)
  const [activeMeals, setActiveMeals] = useState({
    breakfast: true,
    lunch: true,
    dinner: true,
    guest: true,
  });

  // Bulk action values
  const [bulkValues, setBulkValues] = useState({
    breakfast: "",
    lunch: "",
    dinner: "",
    guest: "",
  });

  const fetchMeals = async (targetDate: string) => {
    setLoading(true);
    setEntries([]);
    try {
      const data = await getMealByDateAction(targetDate);
      if (data) {
        // If entries exist (data.entries is array of populated objects)
        // Or if it's new (data.entries is array of template objects from backend)
        const normalized = data.entries.map((entry: any) => {
          // Check if entry.memberId is populated (object) or just an ID (string)
          // When creating new meal, backend sends { memberId: "...", member: {...} }
          // When updating, backend sends { memberId: {...} }
          const memberData = typeof entry.memberId === 'object' && entry.memberId !== null
            ? entry.memberId 
            : entry.member;
            
          return {
            memberId: memberData?._id || entry.memberId,
            name: memberData?.userId?.fullName || "Unknown Member",
            avatar: memberData?.userId?.profilePicture,
            breakfast: entry.breakfast || 0,
            lunch: entry.lunch || 0,
            dinner: entry.dinner || 0,
            guest: entry.guest || 0,
          };
        });
        setEntries(normalized);
      }
    } catch {
      ErrorToast("Failed to load meal data")
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchMeals(date);
    }
  }, [open, date]);

  const handleEntryChange = (index: number, field: string, value: number) => {
    const newEntries = [...entries];
    newEntries[index][field] = Math.max(0, value);
    setEntries(newEntries);
  };

  const handleBulkApply = () => {
    const newEntries = entries.map((entry) => ({
      ...entry,
      breakfast: activeMeals.breakfast && bulkValues.breakfast !== "" ? parseInt(bulkValues.breakfast) || 0 : entry.breakfast,
      lunch: activeMeals.lunch && bulkValues.lunch !== "" ? parseInt(bulkValues.lunch) || 0 : entry.lunch,
      dinner: activeMeals.dinner && bulkValues.dinner !== "" ? parseInt(bulkValues.dinner) || 0 : entry.dinner,
      guest: activeMeals.guest && bulkValues.guest !== "" ? parseInt(bulkValues.guest) || 0 : entry.guest,
    }));
    setEntries(newEntries);
    SuccessToast("Bulk values applied to all members");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        date,
        entries: entries.map(e => ({
          memberId: e.memberId,
          breakfast: activeMeals.breakfast ? e.breakfast : 0,
          lunch: activeMeals.lunch ? e.lunch : 0,
          dinner: activeMeals.dinner ? e.dinner : 0,
          guest: activeMeals.guest ? e.guest : 0,
        })),
      };

      const result = await addMealAction(payload);
      if (result?.success) {
        SuccessToast("Meal entries updated successfully")
        setOpen(false);
      } else {
        ErrorToast(result?.message || "Failed to update meals")
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
      title="Add / Update Daily Meals"
      description="Manage meal counts for all members for a specific date."
      actionTrigger={
        <Button>
          <Plus /> Add Meal
        </Button>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col h-full max-h-[80vh]">
        <div className="p-4 border-b bg-muted/10 space-y-4">
          <div className="flex items-center gap-4">
            <Label htmlFor="date" className="shrink-0">Date:</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full max-w-xs"
            />
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="font-medium text-muted-foreground">Active Meals:</span>
              <div className="flex items-center gap-2">
                <Switch 
                  id="show-breakfast" 
                  checked={activeMeals.breakfast}
                  onCheckedChange={(checked) => setActiveMeals(prev => ({ ...prev, breakfast: checked }))}
                />
                <Label htmlFor="show-breakfast" className="cursor-pointer">Breakfast</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch 
                  id="show-lunch" 
                  checked={activeMeals.lunch}
                  onCheckedChange={(checked) => setActiveMeals(prev => ({ ...prev, lunch: checked }))}
                />
                <Label htmlFor="show-lunch" className="cursor-pointer">Lunch</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch 
                  id="show-dinner" 
                  checked={activeMeals.dinner}
                  onCheckedChange={(checked) => setActiveMeals(prev => ({ ...prev, dinner: checked }))}
                />
                <Label htmlFor="show-dinner" className="cursor-pointer">Dinner</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch 
                  id="show-guest" 
                  checked={activeMeals.guest}
                  onCheckedChange={(checked) => setActiveMeals(prev => ({ ...prev, guest: checked }))}
                />
                <Label htmlFor="show-guest" className="cursor-pointer">Guest</Label>
              </div>
            </div>

            <Separator />

            <div className="flex flex-wrap items-end gap-3">
              <span className="font-medium text-sm text-muted-foreground pb-2">Bulk Fill:</span>
              {activeMeals.breakfast && (
                <div className="flex flex-col gap-1 w-16">
                  <Label className="text-[10px] text-muted-foreground">B</Label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="-"
                    className="h-8 text-center px-1"
                    value={bulkValues.breakfast}
                    onChange={(e) => setBulkValues(prev => ({ ...prev, breakfast: e.target.value }))}
                  />
                </div>
              )}
              {activeMeals.lunch && (
                <div className="flex flex-col gap-1 w-16">
                  <Label className="text-[10px] text-muted-foreground">L</Label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="-"
                    className="h-8 text-center px-1"
                    value={bulkValues.lunch}
                    onChange={(e) => setBulkValues(prev => ({ ...prev, lunch: e.target.value }))}
                  />
                </div>
              )}
              {activeMeals.dinner && (
                <div className="flex flex-col gap-1 w-16">
                  <Label className="text-[10px] text-muted-foreground">D</Label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="-"
                    className="h-8 text-center px-1"
                    value={bulkValues.dinner}
                    onChange={(e) => setBulkValues(prev => ({ ...prev, dinner: e.target.value }))}
                  />
                </div>
              )}
              {activeMeals.guest && (
                <div className="flex flex-col gap-1 w-16">
                  <Label className="text-[10px] text-muted-foreground">Guest</Label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="-"
                    className="h-8 text-center px-1"
                    value={bulkValues.guest}
                    onChange={(e) => setBulkValues(prev => ({ ...prev, guest: e.target.value }))}
                  />
                </div>
              )}
              <Button 
                type="button" 
                variant="secondary" 
                size="sm" 
                className="h-8 mb-px"
                onClick={handleBulkApply}
              >
                Apply to All
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading members...</div>
          ) : (
            entries.map((entry, index) => (
              <div key={entry.memberId} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3 min-w-37.5">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={entry.avatar} />
                    <AvatarFallback>{entry.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium truncate max-w-30" title={entry.name}>{entry.name}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {activeMeals.breakfast && (
                    <div className="flex flex-col items-center gap-1">
                      <Label className="text-[10px] text-muted-foreground">B</Label>
                      <Input
                        type="number"
                        min="0"
                        className="h-8 w-12 text-center px-1"
                        value={entry.breakfast}
                        onChange={(e) => handleEntryChange(index, "breakfast", parseInt(e.target.value) || 0)}
                      />
                    </div>
                  )}
                  {activeMeals.lunch && (
                    <div className="flex flex-col items-center gap-1">
                      <Label className="text-[10px] text-muted-foreground">L</Label>
                      <Input
                        type="number"
                        min="0"
                        className="h-8 w-12 text-center px-1"
                        value={entry.lunch}
                        onChange={(e) => handleEntryChange(index, "lunch", parseInt(e.target.value) || 0)}
                      />
                    </div>
                  )}
                  {activeMeals.dinner && (
                    <div className="flex flex-col items-center gap-1">
                      <Label className="text-[10px] text-muted-foreground">D</Label>
                      <Input
                        type="number"
                        min="0"
                        className="h-8 w-12 text-center px-1"
                        value={entry.dinner}
                        onChange={(e) => handleEntryChange(index, "dinner", parseInt(e.target.value) || 0)}
                      />
                    </div>
                  )}
                  {activeMeals.guest && (
                    <div className="flex flex-col items-center gap-1 border-l pl-2 ml-1">
                      <Label className="text-[10px] text-muted-foreground">Guest</Label>
                      <Input
                        type="number"
                        min="0"
                        className="h-8 w-12 text-center px-1"
                        value={entry.guest}
                        onChange={(e) => handleEntryChange(index, "guest", parseInt(e.target.value) || 0)}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t bg-muted/10 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button type="submit" disabled={submitting || loading}>
            {submitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </ModalWrapper>
  );
}
