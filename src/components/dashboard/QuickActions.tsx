import { AddMealModal } from "./quick-actions/AddMealModal";
import { AddExpenseModal } from "./quick-actions/AddExpenseModal";
import { RecordPaymentModal } from "./quick-actions/RecordPaymentModal";
import { PettyCashAdjustmentModal } from "./quick-actions/PettyCashAdjustmentModal";
import { InviteMemberModal } from "./quick-actions/InviteMemberModal";

export function QuickActions({ inviteCode }: { inviteCode?: string }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold tracking-tight">Quick Actions</h2>
      <div className="flex flex-wrap gap-4">
        <AddMealModal />
        <AddExpenseModal />
        <RecordPaymentModal />
        <PettyCashAdjustmentModal />
        <InviteMemberModal inviteCode={inviteCode} />
      </div>
    </div>
  );
}
