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
  const { user, hobbies, is_following, posts, count_hobbies, count_followers, count_following } = await getUserProfil({ user_id: params.user_id });
  const currentUserID = await currentUser().id;
  const parsedUserID = parseInt(params.user_id, 10);
  const isCurrentUser = currentUserID === parsedUserID;

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full md:w-[70%] relative h-auto overflow-hidden rounded-lg bg-white dark:bg-gray-800">

        <div className="profiles_content flex flex-col lg:flex-row items-center p-6 lg:p-8">
          <div className="profile_avatar relative z-10 w-24 h-24 md:w-40 md:h-40 lg:w-48 lg:h-48 mr-4 md:mr-8 mb-4 lg:mb-0">
            <div className="profile_avatar_holder overflow-hidden rounded-full bg-gray-400 w-full h-full">
              <Image src={user.profile_picture} width={100} height={100} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="user_status status_online absolute bottom-0 right-0 h-5 w-5 md:h-6 md:w-6 lg:h-8 lg:w-8 rounded-full"></div>
            {isCurrentUser && (
              <div className="icon_change_photo md:block absolute bottom-0 right-0 w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 border-2 border-white bg-gray-300 flex items-center justify-center rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-camera"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg>
              </div>
            )}

          </div>

          <div className="profile_info flex-1">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold capitalize mb-1 md:mb-2 md:mt-2"> {user.firstname} {user.lastname} </h1>
            {isCurrentUser ? <BtnEditProfil currentUser={user} /> : <BtnFollowProfil is_following={is_following} user_id={user.id} />}
          </div>
        </div>
        <div className="text-slate-800 dark:text-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-[80%] container mx-auto p-6">
          {["Hobbies", "Follows", "Suivis"].map((title, index) => (
            <div
              key={index}
              className="card border hover:border-gray-500 hover:shadow-lg transition-all text-center mb-4 bg-[#f0f2f5] dark:bg-gray-900 rounded-lg"
            >
              <p className="text-lg font-semibold">{title}</p>
              <p className="text-gray-800 dark:text-gray-200 text-xl">
                {title === "Hobbies" ? count_hobbies : title === "Follows" ? count_followers : count_following}
              </p>
            </div>
          ))}
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
