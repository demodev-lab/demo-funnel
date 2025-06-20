import SummaryCardList from "@/components/admin/dashboard/SummaryCardList";
import DashboardTabs from "@/components/admin/dashboard/DashboardTabs";

export default function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="space-y-6 animate-fade-in">
        <SummaryCardList />
        <DashboardTabs />
      </div>
    </div>
  );
}
