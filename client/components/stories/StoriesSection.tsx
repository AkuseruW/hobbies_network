'use client'
import React from 'react'
import { PlusIcon } from "@heroicons/react/24/solid";
import Image from 'next/image';
import { Icons } from '../icons';
import { Session } from '@/types/sessions_types';

const StoriesSection = ({ session: currentUser }: { session: Session }) => {

    return (
        <>
            <div className="w-[140px] h-[200px] shadow-md rounded-[7px] bg-gray-800 flex flex-col overflow-hidden">
                <div>
                    <Image
                        className="w-full min-h-[70%] object-cover"
                        height={500}
                        width={500}
                        alt={`${currentUser.firstname}`}
                        src={`${currentUser.profile_picture}`}
                    />
                </div>
                <div className='flex-1 w-full items-center justify-center flex flex-col bg-white dark:bg-gray-800'>
                    <div className="flex justify-center min-h-[50%] w-full relative">
                        <div className="absolute w-[50px] h-[50px] bg-white dark:bg-gray-800  outline outline-1 outline-zinc-500 -translate-y-1/2 rounded-full text-sm flex items-center justify-center">
                            <Icons.add />
                        </div>
                    </div>
                    <div className='flex flex-1 font-medium text-sm relative top-1'>
                        Nouvelle Story
                    </div>
                </div>
            </div>

            {/* {singleStoryData.map(({ title, img, postImg }, index) => (
                <SingleStory key={index} title={title} img={img} postImg={postImg} />
            ))} */}
        </>
    )
}

export default StoriesSection
