import { User } from "./user_types";

export interface PostComment {
  id: string;
  content: string;
  time_of_publication: string;
  user: User;
}
