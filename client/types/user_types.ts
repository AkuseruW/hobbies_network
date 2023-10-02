import { Hobby } from "./hobby_types";

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  profile_picture: string;
  username: string;
  friend_status: boolean;
  friend_request_pending: boolean;
  hobbies: Hobby[];
  common_hobbies_count: number;
  is_certified: boolean;
  user_id: number;
  bio: string;
}
