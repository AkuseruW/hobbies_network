import React from 'react';
import Image from 'next/image';
import PostsSection from '@/components/posts/PostsSection';
import { v4 as uuid } from 'uuid'
import BtnEditProfil from '@/components/user/BtnEditProfil';
import { currentUser } from '@/utils/_auth_informations';
import { getUserProfil } from '@/utils/requests/_users_requests';
import BtnFollowProfil from '@/components/user/BtnFollowProfil';
import { ChangeProfilePicture } from '@/components/user/ChangeProfilePicture';
import { ScrollArea } from '@/components/ui/scroll-area';
import { updatePostsWithTime } from '@/utils/_date';
import { HobbiesCarousel } from '@/components/user/HobbiesCarousel';
import Badge from './badge';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { user_id: string } }): Promise<Metadata> {
  const { user } = await getUserProfil({ user_id: params.user_id });
  return { title: user.firstname + ' ' + user.lastname };
}

const ProfilePage = async ({ params }: { params: { user_id: string } }) => {
  const { user, hobbies, is_following, posts, count_hobbies, count_followers, count_following } = await getUserProfil({ user_id: params.user_id });
  const posts_with_time = updatePostsWithTime(posts);
  const currentUserID = await currentUser().id;
  const parsedUserID = parseInt(params.user_id, 10);
  const isCurrentUser = currentUserID === parsedUserID;

  return (
    <div className="flex flex-col items-center w-full">

      <div className="w-full md:w-[70%] relative h-auto overflow-hidden rounded-lg bg-white dark:bg-secondary_dark">
        <div className="profiles_content flex flex-col lg:flex-row items-center p-6 lg:p-8">

          <div className="profile_avatar relative w-24 h-24 md:w-40 md:h-40 lg:w-48 lg:h-48 mr-4 md:mr-8 mb-4 lg:mb-0">
            <div className="profile_avatar_holder overflow-hidden rounded-full bg-gray-400 w-full h-full">
              <Image src={user.profile_picture} width={100} height={100} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="user_status status_online absolute bottom-0 right-0 h-5 w-5 md:h-6 md:w-6 lg:h-8 lg:w-8 rounded-full"></div>
            {isCurrentUser && (<ChangeProfilePicture />)}
          </div>

          <div className="profile_info flex flex-col">
            <div className='flex flex-1 items-center mb-4'>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold capitalize"> {user.firstname} {user.lastname} </h1>
              <Badge user={user} />
            </div>
            {!isCurrentUser && <BtnFollowProfil is_following={is_following} user_id={user.id} />}
          </div>

        </div>

        <div className="text-slate-800 dark:text-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-[80%] container mx-auto p-6">
          {["Hobbies", "Follows", "Suivis"].map((title, index) => (
            <div
              key={index}
              className="card border hover:border-gray-500 hover:shadow-lg transition-all text-center mb-4 bg-[#f0f2f5] dark:bg-accent_dark rounded-lg">
              <p className="text-lg font-semibold">{title}</p>
              <p className="text-gray-800 dark:text-gray-200 text-xl">
                {title === "Hobbies" ? count_hobbies : title === "Follows" ? count_followers : count_following}
              </p>
            </div>
          ))}
        </div>
      </div>

      <section className="w-full md:w-[70%] lg:w-[70%] my-10">
        <HobbiesCarousel hobbies={hobbies} />
      </section>

      <section className="flex flex-col items-center mt-5 w-full md:w-[70%] space-y-8 mb-20">

        <div className=' max-md:mb-5 w-full max-sm:mb-5 flex justify-start items-start'>
          <div className="p-4 w-full shadow-md bg-white dark:bg-secondary_dark rounded-lg dark:border-gray-800">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Bio</h3>
            <ScrollArea className="h-[200px] max-lg-[600px]">
              <p className="text-gray-700 dark:text-gray-300">{user.bio}</p>
            </ScrollArea>
          </div>
        </div>

        <div className="col-span-2 max-w-xl items-center md:mt-5">
          <div className="w-xl md:w-full">
            <div key={uuid()} className="sm:col-span-2 lg:col-span-3 xl:col-span-4">
              <PostsSection initialPosts={posts_with_time} />
            </div>
          </div>
        </div>

      </section>

    </div>
  );
};

export default ProfilePage;
