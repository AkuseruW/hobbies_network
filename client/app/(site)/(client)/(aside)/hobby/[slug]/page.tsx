import PostsSection from '@/components/posts/PostsSection';
import { getPostsByHobby } from '@/utils/requests/_posts_requests';
import { v4 as uuid } from 'uuid'

const GroupePage = async ({ params }: { params: { slug: string } }) => {
  const slug = params.slug;
  const posts = await getPostsByHobby({ slug });

  return (
    <section className='md:w-[60%] lg:w-[50%]'>
      <div className="max-w-xl mx-auto">
        {posts.length > 0 ? (
          <div key={uuid()} className="sm:col-span-2 lg:col-span-3 xl:col-span-4 mt-5">
            <PostsSection initialPosts={posts} />
          </div>)
          : (
            <div className='mt-5'>
              <div className="sm:col-span-2 lg:col-span-3 xl:col-span-4 mt-5">
                <div className='text-center'>
                  <h1 className='text-xl font-bold'>Aucun post n'a été publié pour l'instant</h1>
                </div>
              </div>
            </div>

          )}
      </div>
    </section>
  );
};

export default GroupePage;
