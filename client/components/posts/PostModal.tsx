import Modal from "@/components/Modal";
import CommentCard from "@/components/comments/CommentCard";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { PostData } from "@/types/post_types";
import { PostComment } from "@/types/comments_types";
import UserInfo from "./cards_elements/UserInfoCard";
import BtnAction from "./cards_elements/ButtonCardAction";
import InputComment from "../comments/InputComment";
import { ImagePostPage } from "./ImagePostPage";

const PostModalComponent = ({ post, comments }: { post: PostData; comments: PostComment[] }) => {
  const hasImages = post.post_images_urls && post.post_images_urls.length > 0;

  return (
    <Modal size="h-[90%] w-[80%] max-sm:w-[100%] max-sm:h-[100%]" title={post.user.username}>
      <div className="flex flex-col sm:flex-row gap-0 h-full">
        {/* Left Section */}
        {hasImages && (
          <div className="w-full sm:w-[75%] flex h-full border-r-2 border-gray">
            {/* <PostImagesCarousel images={post.post_images_urls} /> */}
            <ImagePostPage images={post.post_images_urls} />
          </div>
        )}

        {/* Right Section */}
        <div className={`flex flex-col ${hasImages ? 'sm:flex-grow-0 sm:w-[25%]' : 'w-full'}  h-[100%]`}>
          <div className=" w-full ">
            <section className="min-h-[20%] p-2">
              <UserInfo data={post} />
              <ScrollArea className="h-[250px] px-4">
                <p className="text-sm sm:text-base py-4 px-2 mx-2 min-h-[70px]">
                  {post.content}
                </p>
              </ScrollArea>
            </section>
          </div>
          <section>
            <Separator className="dark:bg-slate-700" />
            <BtnAction data={post} />
            <ScrollArea className="h-[340px] px-4">
              <CommentCard data={comments} />
            </ScrollArea>
          </section>
          <div className="h-[8%]">
            <Separator className="mb-2" />
            <InputComment post_id={post.id} />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PostModalComponent;
