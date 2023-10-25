import CardGroupeSetup from '@/components/groupes/CardsForSetup';
import React, { Suspense } from 'react'
import { v4 as uuid } from 'uuid'
import { cookies } from 'next/headers'
import Searchbar from '@/components/Searchbar';
import { getHobbies } from '@/utils/requests/_hobbies_requests';

const page = async ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
    const search = typeof searchParams.search === 'string' ? searchParams.search : undefined
    const { hobbies } = await getHobbies({ search });
    const cookieStore = cookies()
    const cookHobbies = cookieStore.get('hobbies_info')
    let hobbiesCookie = []

    if (cookHobbies) {
        hobbiesCookie = JSON.parse(cookHobbies?.value as any)
    }

    return (
        <div>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <Searchbar search={search} type='setup' />
            </div>
            <div key={uuid()} className='mb-16' >
                <div className="flex flex-col">
                    <div className='rounded-md border p-4 mt-4 bg-white dark:bg-secondary_dark dark:border-gray-300 min-h-[500px]'>
                        <CardGroupeSetup search={search} initialHobbies={hobbies} hobbiesCookie={hobbiesCookie} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page
