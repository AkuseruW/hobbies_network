import React from 'react'
import type { Metadata } from 'next'
import { getPost } from '@/utils/requests/_posts_requests';
import { getComments } from '@/utils/requests/_comments_request';
import PostModalComponent from '@/components/posts/PostModal';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const postId = typeof params.id === 'string' ? params.id : '';
    const post = await getPost({ postId });
    return { title: post.user.username };
}

const PostModalPage = async ({ params }: { params: { id: string } }) => {
    const postId = typeof params.id === 'string' ? params.id : '';
    const post = await getPost({ postId });
    const comments = await getComments({ postId });

    return <PostModalComponent post={post} comments={comments} />
}

export default PostModalPage
