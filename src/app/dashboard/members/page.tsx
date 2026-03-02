import { MemberStats } from "@/components/dashboard/members/MemberStats";
import { MemberTable } from "@/components/dashboard/members/MemberTable";
import { SearchInput } from "@/components/ui/custom/search-input";
import { AddMemberModal } from "@/components/dashboard/members/AddMemberModal";
import PageHeader from "@/components/ui/custom/page-header";
import { getMembers, getMemberStats } from "@/services/member";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function MembersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;
  const search = (params.search as string) || "";

  // Fetch data in parallel
  const [stats, membersData] = await Promise.all([
    getMemberStats(),
    getMembers(page, limit, search),
  ]);

  return (
    <div className="flex flex-col gap-6 w-full p-1">
      <PageHeader 
        title="Member Management" 
        description="Manage your mess members, roles, and status."
      >
        <AddMemberModal />
      </PageHeader>

      <MemberStats stats={stats} />

      <div className="flex items-center justify-start">
        <SearchInput
          placeholder="Search members by name, email or phone..."
          className="w-72"
        />
      </div>
      
      {membersData && (
        <MemberTable 
          members={membersData.members} 
          pagination={membersData.pagination} 
        />
      )}
    </div>
  );
}
