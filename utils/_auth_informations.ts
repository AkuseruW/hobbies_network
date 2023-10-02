import { cookies } from "next/headers";

export const getAccessToken = () => {
  const accessTokenValue = cookies().get("access_token")?.value;
  if (accessTokenValue) {
    return accessTokenValue;
  }
  return null;
};

export const currentUser = () => {
  const authValue = cookies().get("auth")?.value;
  if (authValue) {
    const user = JSON.parse(authValue);
    return user;
  }
  return null;
};

export const getAdminAccessToken = () => {
  const adminAccessTokenValue = cookies().get("admin_access_token")?.value;
  if (adminAccessTokenValue) {
    return adminAccessTokenValue;
  }
  return null;
};
