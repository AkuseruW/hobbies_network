'use client'
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types/user_types";
import { getUsersPaginated } from "@/utils/requests/_users_requests";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useInView } from 'react-intersection-observer'
import { Icons } from "../icons";


const UserCard = ({ search, initialUsers }: { search?: string | undefined, initialUsers: User[] }) => {
  const [users, setUsers] = useState(initialUsers);
  const [page, setPage] = useState(1)
  const [ref, inView] = useInView()

  console.log(users, 'users')

  const loadMoreUsers = useCallback(async () => {
    const next = page + 1
    const { users } = await getUsersPaginated({ search, page: next })

    if (users?.length) {
      setPage(next)

      setUsers((prev) => [
        ...(prev?.length ? prev : []),
        ...users
      ])
    }
  }, [page, search])

  useEffect(() => {
    if (inView && users.length >= 10) {
      loadMoreUsers()
    }
  }, [inView, loadMoreUsers, users.length])

  return (
    <>
      <div className='min-h-full grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3'>
        {users.map((user) => (
          <article key={user.id}
            className="col-span-1 bg-white h-60 rounded-xl border border-gray-300 
            dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-300 
            hover:shadow-lg transition-all duration-300 
            ease-in-out dark:bg-gray-800 dark:text-white">
            <div className="h-full flex flex-col justify-between p-4">
              <div className="group relative pt-4 space-y-3">
                <Avatar className="mx-auto">
                  <AvatarImage src={user.profile_picture} alt={user.username} className="border rounded-full" />
                </Avatar>
                <h2 className="text-lg font-medium dark:text-white text-center pt-2">{user.firstname} {user.lastname}</h2>
                {user.is_certified && (
                  <Icons.badgecheck className=" w-6 h-6 mx-auto" />
                )}
              </div>
              <div className="mt-6 flex justify-center">
                <Link href={`/profil/${user.id}`} className="text-black dark:text-white border border-gray-800 dark:border-white font-semibold py-2 px-4 rounded transition duration-300 ease-in-out">
                  Voir le profil
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* loading spinner */}
      {users.length >= 10 && (
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

export default UserCard;
