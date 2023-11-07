import { DataTable } from "@/components/dashboard/DataTable";
import { columnsNotifications } from "@/components/dashboard/dataTable/columns";
import { getNotificationsAdmin } from "@/utils/requests/_notifications_requests";
import React from "react";

const page = async ({
  searchParams,
}: {
  searchParams: { search?: string; page?: string };
}) => {
  const search =
    typeof searchParams.search === "string" ? searchParams.search : undefined;
  const page =
    typeof searchParams.page === "string" ? searchParams.page : undefined;
  const { notifications, totalPages } = await getNotificationsAdmin({
    search,
    page,
  });
  const url = "/dashboard/notifications";

  return (
    <div className="h-full flex-1 flex-col space-y-2 md:flex mt-5">
      <h2 className="text-xl font-bold tracking-tight">
        List of Notifications
      </h2>
      <DataTable
        // @ts-ignore
        columns={columnsNotifications}
        type={"typeCustomers"}
        data={notifications}
        url={url}
        pageSize={totalPages}
        initialPage={searchParams as any}
      />
    </div>
  );
};

export default page;
