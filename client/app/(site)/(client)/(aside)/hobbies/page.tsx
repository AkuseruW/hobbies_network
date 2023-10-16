import React, { Suspense } from 'react'
import { v4 as uuid } from 'uuid'
import CardGroupe from '@/components/groupes/Cards';
import Searchbar from '@/components/Searchbar';
import { getHobbies } from '@/utils/requests/_hobbies_requests';


const GroupePage = async ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined
  const { hobbies } = await getHobbies({ search });


  return (
    <section className="min-h-screen mt-5 container">
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
        <Searchbar search={search} type='hobbies' />
      </div>
      <div key={uuid()} className="mt-6  w-full">
        <Suspense fallback={<></>}>
          <CardGroupe search={search} initialHobbies={hobbies} />
        </Suspense>
      </div>
    </section>
  )
}

export default GroupePage;
