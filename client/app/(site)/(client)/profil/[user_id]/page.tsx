import React from 'react';
import Image from 'next/image';
import PostsSection from '@/components/posts/PostsSection';
import { v4 as uuid } from 'uuid'
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import BtnEditProfil from '@/components/user/BtnEditProfil';
import { currentUser } from '@/utils/_auth_informations';
import { getUserProfil } from '@/utils/requests/_users_requests';
import BtnFollowProfil from '@/components/user/BtnFollowProfil';
import IconColor from '../iconColor';
import { Hobby } from '@/types/hobby_types';

const ProfilePage = async ({ params }: { params: { user_id: string } }) => {
  const { user, hobbies, is_following, posts } = await getUserProfil({ user_id: params.user_id });
  const currentUserID = await currentUser().id;
  const parsedUserID = parseInt(params.user_id, 10);
  const isCurrentUser = currentUserID === parsedUserID;

  console.log(hobbies)

  return (
    <div className="flex flex-col items-center w-full">
      {/* Conteneur de la bannière */}
      <div className="w-full md:w-[70%] relative h-auto md:h-[30vh] overflow-hidden rounded-lg bg-white dark:bg-gray-800">
        <div className="text-slate-800 dark:text-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-[80%] container mx-auto p-6">
          {["Hobbies", "Follows", "Suivis"].map((title, index) => (
            <div
              key={index}
              className="card border hover:border-gray-500 hover:shadow-lg transition-all text-center mb-4 bg-[#f0f2f5] dark:bg-gray-900 rounded-lg"
            >
              <p className="text-lg font-semibold">{title}</p>
              <p className="text-gray-800 dark:text-gray-200 text-xl">1000</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row w-full md:w-[70%] items-center overflow-x-auto">
          <Avatar className='w-[15%] h-[15%] md:mr-6  md:mb-0'>
            <AvatarImage
              src={user.profile_picture}
              alt={user.username}
              className="border rounded-full h-90 w-90"
            />
          </Avatar>
          <div className='flex flex-col md:flex-row py-6 '>
            <div className='flex'>
              <h2 className="text-3xl text-black font-semibold dark:text-white">{`${user.firstname} ${user.lastname}`}</h2>
              {user.is_certified && (
                <Image
                  width={100}
                  height={100}
                  src="/assets/certif_black.svg"
                  alt="certif"
                  className="ml-4 h-8 w-8"
                />
              )}
            </div>
            {isCurrentUser ? <BtnEditProfil currentUser={user} /> : <BtnFollowProfil is_following={is_following} user_id={user.id} />}
          </div>
        </div>
      </div>


      <section className="w-full md:w-[70%] lg:w-[70%] my-10">
        <h2 className='text-2xl font-semibold mb-3'>  Mes hobbies</h2>
        <div className="flex space-x-8">
          {hobbies.map((hobby: Hobby) => (
            <div
              key={hobby.id}
              className="
              flex flex-col items-center gap-2
              bg-white p-4 relative w-28 h-26 overflow-hidden 
              rounded-xl border border-gray-300 dark:border-gray-700
              hover:border-gray-500 hover:shadow-lg transition-all
              duration-300 ease-in-out dark:bg-gray-800 dark:text-white">
              <IconColor icone_black={hobby.icone_black} icone_white={hobby.icone_white} />
              <p>{hobby.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="w-full md:w-[60%] lg:w-[50%]">
        <div className="max-w-xl mx-auto">
          <div key={uuid()} className="sm:col-span-2 lg:col-span-3 xl:col-span-4 mt-5">
            <PostsSection initialPosts={posts} />
          </div>
        </div>
      </section>
    </div>

  );
};

export default ProfilePage;
