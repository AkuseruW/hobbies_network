import { getCookie, setCookie } from "cookies-next";

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
    sameSite: false,
  });

  setCookie(
    "auth",
    JSON.stringify({ lastname, firstname, profile_picture, id, role }),
    {
      expires,
      sameSite: false,
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


export const updateProfilePictureInCookie = (newProfilePicture: string) => {
  // Retrieve the existing cookie
  const existingCookie = getCookie("auth");
  // Check if the cookie exists
  if (existingCookie) {
    // Parse the existing cookie into an object
    const authData = JSON.parse(existingCookie);
    // Update the 'profile_picture' value in the cookie object with the new value
    authData.profile_picture = newProfilePicture;
    // Set a new expiration date for the cookie
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    // Reset the cookie with the updated value
    setCookie("auth", JSON.stringify(authData), {
      expires,
      sameSite: true,
      secure: true,
    });
  }
};

