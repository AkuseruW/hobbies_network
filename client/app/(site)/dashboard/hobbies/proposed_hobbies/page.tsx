import { DataTable } from '@/components/dashboard/DataTable';
import { columnsProposedHobbies } from '@/components/dashboard/dataTable/columns';
import { getProposedHobbiesAdmin } from '@/utils/requests/_hobbies_requests';

const HobbiesAdminPage = async ({ searchParams }: { searchParams: { search?: string; page?: string, q?: string } }) => {
    const search = typeof searchParams.search === 'string' ? searchParams.search : undefined
    const page = typeof searchParams.page === 'string' ? searchParams.page : undefined;

    const { hobbies, totalPages } = await getProposedHobbiesAdmin({ search, page });
    const url = '/dashboard/hobbies'

    return (
        <div className="hidden h-full flex-1 flex-col space-y-2 md:flex mt-5">
            <h2 className="text-xl font-bold tracking-tight">List of proposed hobbies</h2>
            <DataTable
                //@ts-ignore
                columns={columnsProposedHobbies}
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