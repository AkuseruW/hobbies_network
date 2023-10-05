"use client";
import { useInView } from 'react-intersection-observer';
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Icons } from "../icons";
import { Button } from "../ui/button";
import { useTheme } from 'next-themes';
import { getHobbies } from '@/utils/requests/_hobbies_requests';
import { add_or_delete_hobby } from '@/utils/requests/_users_requests';
import { Hobby } from '@/types/hobby_types';
import { useRouter } from 'next/navigation';
import Modal from '../Modal';
import ProposeHobby from './ProposeHobby';

interface CardGroupeProps {
  search?: string;
  initialHobbies: Hobby[];
}

const CardGroupe: React.FC<CardGroupeProps> = ({ search, initialHobbies }) => {
  const [hobbies, setHobbies] = useState<Hobby[]>(initialHobbies);

  const initialAddedHobbies: Record<number, boolean> = initialHobbies.reduce((acc, hobby) => {
    // @ts-ignore
    acc[hobby.id] = hobby.added || false;
    return acc;
  }, {});
  const [addedHobbies, setAddedHobbies] = useState<Record<number, boolean>>(initialAddedHobbies);

  const [page, setPage] = useState(1);
  const [ref, inView] = useInView();
  const { resolvedTheme } = useTheme();
  const isDarkTheme = resolvedTheme === "dark";
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const loadMoreHobbies = useCallback(async () => {
    const next = page + 1;
    const { hobbies: newHobbies } = await getHobbies({ search, page: next });
    console.log(newHobbies)
    if (newHobbies?.length) {
      setPage(next);
      setHobbies((prev) => [
        ...(prev?.length ? prev : []),
        ...newHobbies
      ]);
    }
  }, [page, search]);

  const addHobbyOrRemove = async (id: number) => {
    if (addedHobbies[id]) {
      await add_or_delete_hobby({ id });
      const updatedAddedHobbies = { ...addedHobbies };
      delete updatedAddedHobbies[id];
      setAddedHobbies(updatedAddedHobbies);
    } else {
      await add_or_delete_hobby({ id });
      setAddedHobbies({ ...addedHobbies, [id]: true });
    }
  };

  useEffect(() => {
    if (inView && hobbies.length >= 10) {
      loadMoreHobbies();
    }
  }, [inView, loadMoreHobbies, hobbies.length]);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      {isOpen && (
        <Modal title='Ajouter un hobby' size="lg:h-[35%] md:h-[35%] sm:h-[35%] lg:w-[50%] md:w-[50%] sm:w-full" close={() => setIsOpen(false)}>
          <ProposeHobby />
        </Modal>
      )}

      <div
        className="cursor-pointer col-span-1 flex items-center justify-center bg-white p-4 relative w-full h-full overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700 hover:border-gray-500 hover:shadow-lg transition-all duration-300 ease-in-out dark:bg-gray-800 dark:text-white"
        onClick={() => setIsOpen(true)}
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
      {hobbies.map(({ id, name, description, slug, icone_black, icone_white }) => (
        <div
          key={id}
          className="col-span-1 bg-white p-4 relative w-full h-64 overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700 hover:border-gray-500 hover:shadow-lg transition-all duration-300 ease-in-out dark:bg-gray-800 dark:text-white"
        >
          <div className="h-full flex flex-col justify-between">
            <div key={name} className="group relative">
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
                    xlinkHref={isDarkTheme ? icone_white : icone_black}
                  />
                </svg>

                <Link href={`hobby/${slug}`} className="ml-4 flex-grow">
                  <h2 className="text-lg font-medium dark:text-white">{name}</h2>
                </Link>
                <Button
                  type="button"
                  onClick={(e) => { addHobbyOrRemove(id) }}
                  className={`h-[24px] relative bg-transparent p-0 border ${addedHobbies[id]
                    ? 'border-primary dark:border-white'
                    : 'border-secondary dark:border-gray-500'
                    } hover:bg-transparent hover:border-primary dark:hover:border-white`}
                >
                  <Icons.add
                    className="w-[24px] h-[12px] p-0 text-black dark:text-white"
                    style={{ transform: addedHobbies[id] ? 'rotate(45deg)' : 'rotate(0)' }}
                  />
                </Button>
              </div>
              <p className="mt-5 text-gray-600 dark:text-gray-400">
                {description ? description.slice(0, 100) + ' ...' : 'Aucune description'}
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* loading spinner */}
      {hobbies.length >= 10 && (
        <div
          ref={ref}
          className='col-span-1 mt-16 flex items-center justify-center sm:col-span-2 md:col-span-3 lg:col-span-4'
        >
          <Icons.spinner className='w-10 h-10 animate-spin' />
          <span className='sr-only'>Loading...</span>
        </div>
      )}
    </>
  );
};

export default CardGroupe;
