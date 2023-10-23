import { Hobby } from "@/types/hobby_types";
import { setCookie } from "cookies-next";

interface UserInformationProps {
  lastname: string;
  firstname: string;
  bio: string | undefined;
}

export const UserInformation = async ({
  user,
}: {
  user: UserInformationProps;
}) => {
  const expires = new Date();
  expires.setDate(expires.getDate() + 1);
  const userS = JSON.stringify(user);
  setCookie("setup_info", JSON.stringify(user), {
    expires,
    sameSite: true,
    secure: true,
  });
};

export const UserHobbies = async ({ hobbies }: { hobbies: Hobby[] }) => {
  const expires = new Date();
  expires.setDate(expires.getDate() + 1);
  setCookie("hobbies_info", JSON.stringify(hobbies), {
    expires,
    sameSite: true,
    secure: true,
  });
};
