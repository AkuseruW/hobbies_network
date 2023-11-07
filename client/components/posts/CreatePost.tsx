import React from 'react';
import InputNewPost from './create/InputCreatePost';
import AvatarUser from '../user/AvatarUser';
import { getUserHobbies } from '@/utils/requests/_hobbies_requests';
import { Session } from '@/types/sessions_types';

const CreatePost = async ({ session }: { session: Session }) => {

    return (
        <div className="p-4 bg-white dark:bg-secondary_dark rounded-lg shadow-md mt-5 flex">
            <div className="flex items-center flex-1">
                <div className="mr-4">
                    <AvatarUser data={session} />
                </div>
                <InputNewPost session={session} />
            </div>
        </div>
    );
}

export default CreatePost
