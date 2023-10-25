import { DataTable } from '@/components/dashboard/DataTable';
import { columnsHobbies } from '@/components/dashboard/dataTable/columns';
import { getHobbiesAdmin } from '@/utils/requests/_hobbies_requests';

const HobbiesAdminPage = async ({ searchParams }: { searchParams: { search?: string; page?: string } }) => {
  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined
  const page = typeof searchParams.page === 'string' ? searchParams.page : undefined;

  const { hobbies, totalPages } = await getHobbiesAdmin({ search, page });
  const url = '/dashboard/hobbies'

  return (
    <div className="hidden h-full flex-1 flex-col space-y-2 md:flex mt-5">
      <h2 className="text-xl font-bold tracking-tight">List of Hobbies</h2>
      <DataTable
        //@ts-ignore
        columns={columnsHobbies}
        data={hobbies}
        url={url}
        pageSize={totalPages}
        initialPage={searchParams as any}
        type={'typeHobbies'}
      />
    </div>
  )
}

export default HobbiesAdminPage