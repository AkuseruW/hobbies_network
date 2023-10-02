import { Activity, CreditCard, DollarSign, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area";
import PinnedReportCard from "@/components/reports/PinnedReportCard";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { Report } from "@/types/reports_types";
import { getPinnedReports } from "@/utils/requests/_reports_requests";

const DashboardPage = async () => {
  const { pinnedReports, pinnedReportsCount } = await getPinnedReports({});


  return (
    <div className="hidden flex-col md:flex">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              <DashboardCard title="Customers" icon={<Users className="h-4 w-4 text-muted-foreground" />} />
              <DashboardCard title="Products" icon={<Activity className="h-4 w-4 text-muted-foreground" />} />
              <DashboardCard title="Hobbies" icon={<CreditCard className="h-4 w-4 text-muted-foreground" />} />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  {/* <Overview /> */}
                </CardContent>
              </Card>

              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Pin Reports</CardTitle>
                  <CardDescription>
                    {pinnedReportsCount} {pinnedReportsCount === 1 ? "report" : "reports"} have been pinned.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                      {pinnedReports.map((report: Report) => (
                        <PinnedReportCard key={report.id} report={report} />
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DashboardPage;
