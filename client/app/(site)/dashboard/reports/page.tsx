import { DataTable } from "@/components/dashboard/DataTable";
import { columnsReports } from "@/components/dashboard/dataTable/columns";
import { getReports } from "@/utils/requests/_reports_requests";
import React from "react";

const ReportsPage = async ({
  searchParams,
}: {
  searchParams: { search?: string; page?: string };
}) => {
  const search =
    typeof searchParams.search === "string" ? searchParams.search : undefined;
  const page =
    typeof searchParams.page === "number" ? searchParams.page : undefined;

  const { reports, totalPages } = await getReports({ search, page });
  const url = "/dashboard/reports";

  return (
    <div className="h-full flex-1 flex-col space-y-2 md:flex mt-5">
      <h2 className="text-xl font-bold tracking-tight">List of Reports</h2>

      <DataTable
        //@ts-ignore
        columns={columnsReports}
        data={reports}
        url={url}
        pageSize={totalPages}
        initialPage={searchParams as any}
        type={"typeOrder"}
      />
    </div>
  );
};

export default ReportsPage;
