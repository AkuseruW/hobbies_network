import { PostData } from "./post_types";

export interface UpdatedPostData extends PostData {
  time_of_publication: string;
}
