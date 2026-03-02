import { AddMealModal } from "./quick-actions/AddMealModal";
import { AddExpenseModal } from "./quick-actions/AddExpenseModal";
import { RecordPaymentModal } from "./quick-actions/RecordPaymentModal";
import { PettyCashAdjustmentModal } from "./quick-actions/PettyCashAdjustmentModal";

export function QuickActions() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold tracking-tight">Quick Actions</h2>
      <div className="flex flex-wrap gap-4">
        <AddMealModal />
        <AddExpenseModal />
        <RecordPaymentModal />
        <PettyCashAdjustmentModal />
      </div>
    </div>
  );
}
