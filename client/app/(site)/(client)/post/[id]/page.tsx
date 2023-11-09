import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getComments } from "@/utils/requests/_comments_request";
import { getPost } from "@/utils/requests/_posts_requests";
import InputComment from "@/components/comments/InputComment";
import UserInfo from "@/components/posts/cards_elements/UserInfoCard";
import BtnAction from "@/components/posts/cards_elements/ButtonCardAction";
import CommentCard from "@/components/comments/CommentCard";
import { ImagePostPage } from "@/components/posts/ImagePostPage";

const PostPage = async ({ params }: { params: { id: string } }) => {
  const postId = typeof params.id === 'string' ? params.id : '';
  const post = await getPost({ postId });
  const comments = await getComments({ postId });
  // check if post has images
  const hasImages = post.post_images_urls && post.post_images_urls.length > 0;

  return (
    <div className={`h-[80vh] ${!hasImages ? 'w-2/4' : 'w-full'} flex flex-col sm:flex-row gap-0 h-full  rounded`}>
      {/* Left Section */}
      {hasImages && (
        <div className="w-full sm:w-[75%] flex h-full border-r-2 border-gray">
          {/* <PostImagesCarousel images={post.post_images_urls} /> */}
          <ImagePostPage images={post.post_images_urls}/>
        </div>
      )}

      {/* Right Section */}
      <div className={`flex flex-col ${hasImages ? 'sm:flex-grow-0 sm:w-[25%]' : 'w-full'}  h-[100%]`}>
        <div className=" w-full ">
          <section className="min-h-[20%] p-2">
            <UserInfo data={post} />
            <ScrollArea className="h-[300px] px-4">
              <p className="text-sm sm:text-base py-4 px-2 mx-2 min-h-[70px]">
                {post.content}
              </p>
            </ScrollArea>
          </section>
        </div>
        <section>
          <Separator />
          <BtnAction data={post} />
          <ScrollArea className="h-[250px] px-4">
            <CommentCard data={comments} />
          </ScrollArea>
        </section>
        <div className="h-[8%]">
          <Separator className="mb-2" />
          <InputComment post_id={post.id} />
        </div>
      </div>
    </div>
  )
}

export default PostPage