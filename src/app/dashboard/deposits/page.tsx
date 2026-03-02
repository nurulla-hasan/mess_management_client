
import { DepositList } from "@/components/dashboard/deposits/DepositList";
import PageHeader from "@/components/ui/custom/page-header";
import { getAllDeposits } from "@/services/deposit";

interface DepositsPageProps {
  searchParams: Promise<{ page?: string; limit?: string; status?: string }>;
}

export default async function DepositsPage({ searchParams }: DepositsPageProps) {
  const { page, limit, status } = await searchParams;
  
  const pageNum = page ? parseInt(page) : 1;
  const limitNum = limit ? parseInt(limit) : 10;
  
  const depositsData = await getAllDeposits(pageNum, limitNum, status);

  return (
    <div className="flex flex-col gap-6 h-full">
      <PageHeader 
        title="Deposit History" 
        description="View and manage member deposits and payments."
      />
      
      <div className="flex-1">
        <DepositList 
            initialData={depositsData?.deposits || []} 
            pagination={depositsData?.pagination} 
        />
      </div>
    </div>
  );
}
