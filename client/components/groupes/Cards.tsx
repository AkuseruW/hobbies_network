"use client";
import React, { useCallback, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { getHobbies } from '@/utils/requests/_hobbies_requests';
import { add_or_delete_hobby } from '@/utils/requests/_users_requests';
import { Hobby } from '@/types/hobby_types';
import Modal from '../Modal';
import ProposeHobby from './ProposeHobby';
import { useHobbiesStore, useUserHobbiesStore } from '@/lib/store/hobbies_store';
import { Icons } from '../icons';
import { Button } from '../ui/button';
import { usePostsStore } from '@/lib/store/posts_store';
import { getPosts } from '@/utils/requests/_posts_requests';

interface CardGroupeProps {
  search?: string;
  initialHobbies: Hobby[];
}

const CardGroupe: React.FC<CardGroupeProps> = ({ search, initialHobbies }) => {
  const {
    hobbies,
    initializeHobbies,
    setHobbies,
    currentPage,
    incrementCurrentPage,
    isEndOfList,
    changeIsEndOfList
  } = useHobbiesStore();
  const { initializePosts, resetCurrentPage: resetCurrentPagePosts, resetEndOfList: resetPostsEndOfList } = usePostsStore();
  const { hobbiesSelected, toggleHobby } = useUserHobbiesStore();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [ref, inView] = useInView();
  const { resolvedTheme } = useTheme();
  const isDarkTheme = resolvedTheme === 'dark';

  // Check if a hobby is selected by its ID.
  const isHobbySelected = (id: number) => hobbiesSelected.some(
    (selectedHobby) => selectedHobby.id === id
  );

  if (initialHobbies?.length > hobbies?.length) {
    // Initialize hobbies if the initial list is longer.
    initializeHobbies(initialHobbies);
  }

  // load more hobbies with pagination.
  const loadMoreHobbies = useCallback(async () => {
    if (isEndOfList) {
      return; // Return if the end of the list is reached.
    }
    const { hobbies: newHobbies, is_end_of_list } = await getHobbies({ search, page: currentPage });
    setHobbies(newHobbies);

    incrementCurrentPage(); // Increment the current page number.

    if (is_end_of_list) {
      changeIsEndOfList(); // Change the end of list status if needed.
    }
  }, [currentPage, search, isEndOfList, setHobbies, changeIsEndOfList, incrementCurrentPage]);

  // Add or remove a hobby by its ID.
  const addHobbyOrRemove = async (hobby: Hobby) => {
    toggleHobby(hobby); // Toggle the hobby.
    await add_or_delete_hobby({ id: hobby.id }); // Add or remove the hobby.
    const { posts } = await getPosts({}); // Get the posts.
    initializePosts(posts); // Initialize the posts.
    resetCurrentPagePosts(); // Reset the current page.
    resetPostsEndOfList(); // Reset the end of list status.
  };

  useEffect(() => {
    if (inView && hobbies.length >= 10) {
      loadMoreHobbies(); // Load more hobbies when in view and conditions are met.
    }
  }, [inView, loadMoreHobbies, hobbies.length, hobbies]);

  useEffect(() => setMounted(true), []); // Set the component as mounted.

  if (!mounted) {
    return null; // Render nothing if the component is not yet mounted.
  }

  return (
    <>
      {isOpen && (
        <Modal title="Proposer un hobbies ?" size="w-full sm:w-[90%] lg:w-[60%] md:w-[60%] " close={() => setIsOpen(false)}>
          <ProposeHobby />
        </Modal>
      )}

      <div className="min-h-full grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
        <div
          className="cursor-pointer col-span-1 flex items-center justify-center bg-white p-4 relative w-full h-60 overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-300 hover:shadow-lg transition-all duration-300 ease-in-out dark:bg-secondary_dark dark:text-white"
          onClick={() => setIsOpen(true)}
        >
          <div className="space-y-4 lg:space-y-0">
            <div className="group relative">
              <div className="flex flex-col items-center gap-2">
                <Icons.add className="w-20 h-20" />
                <h2 className="text-sm font-medium dark:text-white">Proposer un hobbies ?</h2>
              </div>
            </div>
          </div>
        </div>
        {hobbies.map((hobby) => (
          <div
            key={hobby.id}
            className={`${isHobbySelected(hobby.id) && 'dark:bg-secondary_dark dark:text-white bg-white'
              } col-span-1  p-4 relative w-full h-60 overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-300 hover:shadow-lg transition-all duration-300 ease-in-out dark:bg-background_dark dark:text-white`}
          >
            <div className="h-full flex flex-col justify-between">
              <div className="group relative">
                <div className="flex items-center gap-2">
                  <svg
                    id="hexa"
                    data-name="Calque 1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 650.83 572"
                    className="svg h-10 w-10"
                    fill="none"
                    stroke={isDarkTheme ? 'white' : 'black'}
                    strokeWidth="10"
                  >
                    <path
                      className="cls-1"
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
                  <Link href={`hobby/${hobby.slug}`} className="ml-4 flex-grow">
                    <h2 className="font-medium dark:text-white text-sm">{hobby.name}</h2>
                  </Link>
                  <Button
                    type="button"
                    onClick={(e) => {
                      addHobbyOrRemove(hobby);
                    }}
                    className={`h-[24px] relative bg-transparent p-0 border ${isHobbySelected(hobby.id)
                      ? 'border-primary dark:border-white'
                      : 'border-secondary dark:border-gray-500'
                      } hover:bg-transparent hover:border-primary dark:hover:border-white`}
                  >
                    <Icons.add
                      className="w-[24px] h-[12px] p-0 text-black dark:text-white"
                      style={{ transform: isHobbySelected(hobby.id) ? 'rotate(45deg)' : 'rotate(0)' }}
                    />
                  </Button>
                </div>
                <p className="mt-5 text-gray-600 dark:text-gray-400 text-sm md:text-base">
                  {hobby.description ? hobby.description.slice(0, 100) + ' ...' : 'Aucune description'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* loading spinner */}
      {!isEndOfList && hobbies.length >= 10 && (
        <div
          ref={ref}
          className="col-span-1 mt-16 flex items-center justify-center sm:col-span-2 md:col-span-3 lg:col-span-4"
        >
          <Icons.spinner className="w-10 h-10 animate-spin" />
          <span className="sr-only">Loading...</span>
        </div>
      )}
    </>
  );
};

export default CardGroupe;
