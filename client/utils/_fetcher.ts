"use server";

import { getAccessToken } from "./_auth_informations";

export const fetcher = async (
  url: string,
  method: string,
  headers: Record<string, string> = {},
  body?: FormData | null | any
) => {
  try {
    const response = await fetch(url, {
      method,
      cache: 'no-store',
      headers: {
        Authorization: "Bearer " + getAccessToken(),
        ...headers,
      },
      body,
    });

    return await response.json();
  } catch (error) {
    throw error;
  }
};
