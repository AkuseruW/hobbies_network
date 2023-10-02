import { getCookie } from "cookies-next";

export const getAccessTokenFromClient = () => {
  const accessTokenValue = getCookie("access_token");
  if (accessTokenValue) {
    return accessTokenValue;
  }
  return null;
};

export const currentUserClient = () => {
  const authValue = getCookie("auth");
  if (authValue) {
    const user = JSON.parse(authValue);
    return user;
  }
  return null;
};

export const getAdminAccessTokenFromClient = () => {
  const adminAccessTokenValue = getCookie("admin_access_token");
  if (adminAccessTokenValue) {
    return adminAccessTokenValue;
  }
  return null;
};
