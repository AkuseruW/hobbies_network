import { Hobby } from "./hobby_types";
import { User } from "./user_types";

export interface PostData {
  id: string;
  content: string;
  post_images_urls: string[];
  time_of_publication: string;
  total_comments: number;
  total_likes: number;
  created_at: string;
  userHasLiked: boolean;
  user: User;
  hobby: Hobby;
}
