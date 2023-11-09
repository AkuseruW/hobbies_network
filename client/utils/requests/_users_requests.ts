import { BASE_API_URL } from "../_api_config";
import { fetcher } from "../_fetcher";

const apiUrl = (path: string) => `${BASE_API_URL}${path}`;

export const getUsersPaginated = async ({
  page = 1,
  search,
}: {
  page?: number;
  search?: string;
}) => {
  try {
    const searchParam = search ? `&search=${search}` : "";
    return await fetcher(
      apiUrl(`/api/users?page=${page}${searchParam}`),
      "GET"
    );
  } catch (error) {
    throw error;
  }
};

export const getUserProfil = async ({ user_id }: { user_id: string }) => {
  try {
    return await fetcher(apiUrl(`/api/user/${user_id}`), "GET");
  } catch (error) {
    throw error;
  }
};

export const add_or_delete_hobby = async ({ id }: { id: number }) => {
  try {
    return await fetcher(apiUrl(`/api/user/add_or_delete_hobby/${id}`), "POST");
  } catch (error) {
    throw error;
  }
};

export const updatePassword = async ({
  current_password,
  new_password,
}: {
  current_password: string;
  new_password: string;
}) => {
  try {
    return await fetcher(
      apiUrl("/api/auth/update-password"),
      "PATCH",
      { "Content-Type": "application/json" },
      JSON.stringify({ current_password, new_password })
    );
  } catch (error) {
    throw error;
  }
};

export const updateProfile = async ({
  firstname,
  lastname,
  bio,
}: {
  firstname: string;
  lastname: string;
  bio: string | undefined | null;
}) => {

  try {
    return await fetcher(
      apiUrl("/api/users/update-profile"),
      "PATCH",
      {},
      JSON.stringify({ firstname, lastname, bio })
    );
  } catch (error) {
    throw error;
  }
};

export const follow_or_unfollow_user = async ({
  user_id,
}: {
  user_id: number;
}) => {
  try {
    await fetcher(apiUrl(`/api/follow_or_unfollow_user/${user_id}`), "POST");
  } catch (error) {
    throw error;
  }
};

export const getUsersAdmin = async ({
  page = "1",
  search,
  query
}: {
  page?: string;
  search?: string;
  query?: string
}) => {
  try {
    const searchParam = search ? `&search=${search}` : "";
    const queryParam = query ? `&query=${query}` : "";
    return await fetcher(
      apiUrl(`/api/all-users?page=${parseInt(page)}${searchParam}${queryParam}`),
      "GET"
    );
  } catch (error) {
    throw error;
  }
};

export const banUser = async ({
  user_id,
  duration,
  reason,
}: {
  user_id: number;
  duration: number;
  reason: string;
}) => {
  try {
    return await fetcher(
      apiUrl(`/api/ban_user/${user_id}/${duration}`),
      "POST",
      {},
      JSON.stringify({ reason })
    );
  } catch (error) {
    throw error;
  }
};

export const unbanUser = async ({ user_id }: { user_id: number }) => {
  try {
    return await fetcher(apiUrl(`/api/unban_user/${user_id}`), "DELETE");
  } catch (error) {
    throw error;
  }
};


export const deleteAccount = async () => {
  try {
    return await fetcher(apiUrl(`/api/delete_account`), "DELETE");
  } catch (error) {
    throw error;
  }
}

export const updateProfilPicture = async ({ formData }: { formData: FormData }) => {
  try {
    return await fetcher(apiUrl(`/api/users/update-profile-picture`), "PATCH", {}, formData);
  } catch (error) {
    throw error;
  }
}

export const getUserHobbies = async () => {
  try {
    return await fetcher(apiUrl(`/api/user_hobbies`), "GET");
  } catch (error) {
    throw error;
  }
}