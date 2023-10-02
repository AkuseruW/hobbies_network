import { User } from "./user_types";

export interface Hobby {
  id: number;
  name: string;
  slug: string;
  description: string;
  users: User[];
  icone_white: string;
  icone_black: string;
  added: boolean;
}
