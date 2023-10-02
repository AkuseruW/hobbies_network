"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Icons } from "../icons";
import { Button } from "../ui/button";
import { useTheme } from 'next-themes';
import { useRouter } from "next/navigation";
import { Hobby } from '@/types/hobby_types';
import { useInView } from 'react-intersection-observer'
import { getHobbies } from '@/utils/requests/_hobbies_requests';
import { add_or_delete_hobby } from '@/utils/requests/_users_requests';
import { useHobbiesStore } from '@/lib/store/hobbies_store';
import { useHobbiesStore as pageStore } from '@/lib/store/page_store';

const CardGroupe = ({ search, initialHobbies }: { search?: string | undefined, initialHobbies: Hobby[] }) => {
  const { hobbies, setHobbies, addOrRemoveHobby, setNewHobbies } = useHobbiesStore();
  const { currentPage, setCurrentPage } = pageStore();
  const [ref, inView] = useInView()
  const { resolvedTheme } = useTheme()
  const isDarkTheme = resolvedTheme === "dark";
  const [mounted, setMounted] = useState(false)
  const router = useRouter();

  useEffect(() => {
    if (hobbies.length === 0) {
      setHobbies(initialHobbies);
    }
  }, [initialHobbies, setHobbies, hobbies.length]);

  const loadMoreHobbies = useCallback(async () => {
    const next = currentPage + 1
    const newHobbies = await getHobbies({ search, page: next })

    if (newHobbies?.length) {
      setCurrentPage(next);
      setNewHobbies(newHobbies)
    }

  }, [currentPage, setCurrentPage, search, setNewHobbies]);

  const addHobbyOrRemove = async (id: number) => {
    const res = await add_or_delete_hobby({ id });
    if (res.success) {
      addOrRemoveHobby(id)
    }
  };

  useEffect(() => {
    if (inView && hobbies.length > 10) {
      loadMoreHobbies()
    }
  }, [inView, loadMoreHobbies, hobbies.length])

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return null
  }

  return (
    <>
      <div
        className="cursor-pointer col-span-1 flex items-center justify-center bg-white p-4 relative w-full h-full overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700 hover:border-gray-500 hover:shadow-lg transition-all duration-300 ease-in-out dark:bg-gray-800 dark:text-white"
        onClick={() => router.push('/')}
      >
        <div className="space-y-4 lg:space-y-0">
          <div className="group relative">
            <div className="flex flex-col items-center gap-2">
              <Icons.add className="w-20 h-20" />
              <h2 className="text-lg font-medium dark:text-white">Ajouter vos hobbies</h2>
            </div>
          </div>
        </div>
      </div>

      {hobbies.map((hobby) => (
        <div
          key={hobby.id}
          className="col-span-1 bg-white p-4 relative w-full h-full overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700 hover:border-gray-500 hover:shadow-lg transition-all duration-300 ease-in-out dark:bg-gray-800 dark:text-white"
        >
          <div className=" space-y-4 lg:space-y-0 h-full">
            <div key={hobby.name} className="group relative h-full">
              <div className="flex items-center gap-2">
                <svg id="hexa" data-name="Calque 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 650.83 572" className="svg h-10 w-10" fill="none" stroke={isDarkTheme ? `white` : `black`} strokeWidth="10">
                  <path className="cls-1"
                    d="M1089,228.5H794.79a28.7,28.7,0,0,0-24.86,14.35L622.82,497.65a28.73,28.73,0,0,0,0,28.7l147.11,254.8a28.7,28.7,0,0,0,24.86,14.35H1089a28.7,28.7,0,0,0,24.86-14.35L1261,526.35a28.73,28.73,0,0,0,0-28.7l-147.11-254.8A28.7,28.7,0,0,0,1089,228.5Z"
                    transform="translate(-616.48 -226)"
                  />
                  <path className="cls-1" d="M639.5,145.5" transform="translate(-616.48 -226)" />
                  <image
                    x="225.415"
                    y="186"
                    width="200"
                    height="200"
                    xlinkHref={isDarkTheme ? hobby.icone_white : hobby.icone_black}
                  />
                </svg>

                {/* {hobby.url} */}
                <Link href={`hobby/${hobby.slug}`} className="ml-4 flex-grow">
                  <h2 className="text-lg font-medium dark:text-white">{hobby.name}</h2>
                </Link>

                <Button
                  type="button"
                  onClick={(e) => { addHobbyOrRemove(hobby.id) }}
                  className={`h-[24px] relative bg-transparent p-0 border ${hobby.added ? 'border-primary dark:border-white' : 'border-secondary dark:border-gray-500'} hover:bg-transparent hover:border-primary dark:hover:border-white`}
                >
                  <Icons.add className="w-[24px] h-[12px] p-0 text-black dark:text-white" style={{ transform: hobby.added ? 'rotate(45deg)' : 'rotate(0)' }} />
                </Button>

              </div>
              <p className="mt-5 text-sm text-gray-600 dark:text-gray-400">{hobby.description.slice(0, 100)}</p>

            </div>
          </div>
        </div>
      ))}

      {/* loading spinner */}
      {hobbies.length > 10 && (
        <div
          ref={ref}
          className='col-span-1 mt-16 flex items-center justify-center sm:col-span-2 md:col-span-3 lg:col-span-4'
        >
          <Icons.spinner />
          <span className='sr-only'>Loading...</span>
        </div>
      )}
    </>
  );
};

export default CardGroupe;
