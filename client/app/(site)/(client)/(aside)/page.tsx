import React from 'react'
import { v4 as uuid } from 'uuid'
import CreatePost from '@/components/posts/CreatePost';
import PostsSection from '@/components/posts/PostsSection';
import StoriesSection from '@/components/stories/StoriesSection';
import { currentUser } from '@/utils/_auth_informations';
import { getPosts } from '@/utils/requests/_posts_requests';

export const fetchCache = 'force-no-store'
export const dynamic = 'force-dynamic'
export const revalidate = 0

const HomePage = async () => {
    const user = currentUser();
    const { posts } = await getPosts({});

    return (
        <section className=" md:w-[80%] lg:w-[90%] flex">
            <div className="w-xl md:w-[70%] mx-auto">
                {/* Create Post Section */}
                <CreatePost session={user} />

                <div className='mt-5'>
                    {/* Stories Section */}
                    <div className="sm:col-span-2 lg:col-span-3 xl:col-span-4">
                        <StoriesSection session={user} />
                    </div>

                    {/* Posts Section */}
                    <div key={uuid()} className="sm:col-span-2 lg:col-span-3 xl:col-span-4 mt-5">
                        <PostsSection initialPosts={posts} />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HomePage