import React from 'react';
import Image from 'next/image';
import PostsSection from '@/components/posts/PostsSection';
import { v4 as uuid } from 'uuid'
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import BtnEditProfil from '@/components/user/BtnEditProfil';
import { currentUser } from '@/utils/_auth_informations';
import { getUserProfil } from '@/utils/requests/_users_requests';
import BtnFollowProfil from '@/components/user/BtnFollowProfil';

const ProfilePage = async ({ params }: { params: { user_id: string } }) => {
  const { user, hobbies, is_following, posts } = await getUserProfil({ user_id: params.user_id });
  const currentUserID = await currentUser().id;
  const parsedUserID = parseInt(params.user_id, 10);
  const isCurrentUser = currentUserID === parsedUserID;

  return (
    <div className="flex flex-col items-center w-full">
      {/* Conteneur de la bannière */}
      <div className="w-full relative h-[30vh] overflow-hidden rounded-lg bg-white dark:bg-gray-800 mx-10">

        {/* Contenu de la bannière */}
        <div className="absolute bottom-0 left-0 right-0 py-6 px-4 text-white dark:bg-gray-800 ">
          <Avatar className='w-20 h-20' >
            <AvatarImage
              src={user.profile_picture}
              alt={user.username}
              className="border rounded-full "
            />
          </Avatar>
          <div className="flex justify-between items-center">
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

      {/* Section des messages */}
      <section className="md:w-[60%] lg:w-[50%]">
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
