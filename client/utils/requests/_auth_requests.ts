"use server";

import { BASE_API_URL } from "../_api_config";
import { getAccessToken } from "../_auth_informations";
import { fetcher } from "../_fetcher";

const apiUrl = (path: string) => `${BASE_API_URL}${path}`;

interface FormValues {
  email: string;
  password: string;
}

export const signin = async (values: FormValues) => {
  try {
    const response = await fetch(apiUrl(`/api/auth/signin`), {
      cache: "no-store",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const data = await response.json();

    if (response.ok) {
      return { data, success: true };
    }
    return { data, success: false };
  } catch (error) {
    throw error;
  }
};

export const signup = async (values: FormValues) => {
  try {
    return await fetcher(apiUrl(`/api/auth/signup`),
      "POST",
      { "Content-Type": "application/json" },
      JSON.stringify(values),
    )
  } catch (error) {
    throw error;
  }
};

export const setUpProfil = async ({ formData }: { formData: FormData }) => {
  try {
    const response = await fetch(apiUrl("/api/users/setup"), {
      method: "PATCH",
      headers: {
        Authorization: "Bearer " + getAccessToken(),
      },
      body: formData,
    });

    const data = await response.json();
    if (response.ok) {
      return { data, success: true };
    }
    return { data, success: false };
  } catch (error) {
    throw error;
  }
};


export const me = async () => {
  try {
    return await fetcher(apiUrl("/api/auth/users/me"), "GET");
  } catch (error) {
    throw error;
  }
}