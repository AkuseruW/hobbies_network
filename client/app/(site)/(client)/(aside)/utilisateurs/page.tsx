import { v4 as uuid } from 'uuid'
import { Suspense } from "react";
import Searchbar from '@/components/Searchbar';
import { getUsersPaginated } from '@/utils/requests/_users_requests';
import UserCard from '@/components/user/UserCard';

const FriendsPage = async ({ searchParams, }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined
  const users  = await getUsersPaginated({ search });

  return (
    <section className="min-h-screen mt-5">
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <Searchbar search={search} type="users" />
      </div>
      <div key={uuid()} className="mt-6 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        <Suspense fallback={<></>}>
          <UserCard search={search} initialUsers={users} />
        </Suspense>
      </div>
    </section>
  );
};

export default FriendsPage;
