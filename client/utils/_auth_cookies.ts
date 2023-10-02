import { setCookie } from "cookies-next";

export const setAuthCookies = async (
  token: string,
  lastname: string,
  firstname: string,
  profile_picture: string,
  id: string,
  role: string
) => {
  const expires = new Date();
  expires.setDate(expires.getDate() + 7);

  setCookie("access_token", token, {
    expires,
    secure: true,
    sameSite: true,
  });

  setCookie(
    "auth",
    JSON.stringify({ lastname, firstname, profile_picture, id, role }),
    {
      expires,
      sameSite: true,
      secure: true,
    }
  );
};

export const setSetupCookies = async (
  lastname: string,
  firstname: string,
  profile_picture: string,
  id: string,
  role: string
) => {
  const expires = new Date();
  expires.setDate(expires.getDate() + 7);
  setCookie(
    "auth",
    JSON.stringify({ lastname, firstname, profile_picture, id }),
    {
      expires,
      sameSite: true,
      secure: true,
    }
  );
};

export const updateAuthCookies = async (
  firstname: string,
  lastname: string,
  profile_picture: string,
  id: string,
  role: string
) => {
  const expires = new Date();
  expires.setDate(expires.getDate() + 7);

  // Update the "auth" cookie with the new user information
  setCookie(
    "auth",
    JSON.stringify({ lastname, firstname, profile_picture, id, role }),
    {
      expires,
      sameSite: true,
      secure: true,
    }
  );
};
