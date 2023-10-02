import { DataTable } from '@/components/dashboard/DataTable';
import { columnsCustomers } from '@/components/dashboard/dataTable/columns';
import { getUsersAdmin } from '@/utils/requests/_users_requests';


const UsersPageAdmin = async ({ searchParams }: { searchParams: { search?: string; page?: string } }) => {
  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined
  const page = typeof searchParams.page === 'string' ? searchParams.page : undefined;

  const { users, total_pages } = await getUsersAdmin({ search, page });
  const url = '/dashboard/customers'

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">List of Users</h2>
        </div>
      </div>
      <DataTable
        // @ts-ignore
        columns={columnsCustomers}
        type={'typeCustomers'}
        data={users}
        url={url}
        pageSize={total_pages}
        initialPage={searchParams as any}
      />
    </div>
  );
}

export default UsersPageAdmin;