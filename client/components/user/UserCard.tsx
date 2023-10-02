'use client'
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types/user_types";
import { getUsersPaginated } from "@/utils/requests/_users_requests";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useInView } from 'react-intersection-observer'


const UserCard = ({ search, initialUsers }: { search?: string | undefined, initialUsers: User[] }) => {
  const [users, setUsers] = useState(initialUsers);
  const [page, setPage] = useState(1)
  const [ref, inView] = useInView()

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
    if (inView && users.length > 0) {
      loadMoreUsers()
    }
  }, [inView, loadMoreUsers, users.length])

  return (
    <>
      {users.map((user) => (
        <article key={user.id}
          className="col-span-1 bg-white p-4 relative w-full h-full overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700 hover:border-gray-500 hover:shadow-lg transition-all duration-300 ease-in-out dark:bg-gray-800 dark:text-white"
        >
          <div className=" space-y-4 lg:space-y-0 h-full">
            <div className="group relative h-full">
              <Avatar className="mx-auto">
                <AvatarImage
                  src={user.profile_picture}
                  alt={user.username}
                  className="border rounded-full"
                />
              </Avatar>
              <div className="flex items-center gap-2">

                {/* {hobby.url} */}
                <div className="ml-2 flex-grow">
                  <h2 className="text-lg font-medium dark:text-white text-center pt-2">{user.firstname} {user.lastname}</h2>
                </div>
              </div>
              <div className="mt-6 space-y-6 flex justify-center">
                <Link href={`/profil/${user.id}`} className="hover:bg-gray-100 text-black dark:text-white border border-gray-800 dark:border-white font-semibold py-2 px-4 rounded transition duration-300 ease-in-out">
                  Voir le profil
                </Link>
              </div>
            </div>
          </div>
        </article>
      ))}
    </>

  );
};

export default UserCard;
