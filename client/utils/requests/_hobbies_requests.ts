import { BASE_API_URL } from "../_api_config";
import { fetcher } from "../_fetcher";

const apiUrl = (path: string) => `${BASE_API_URL}${path}`;

export const getHobbies = async ({
  page = 1,
  search,
}: {
  page?: number;
  search?: string;
}) => {
  try {
    const searchParam = search ? `&search=${search}` : "";
    return await fetcher(
      apiUrl(`/api/all_hobbies?page=${page}${searchParam}`),
      "GET",
    );
  } catch (error) {
    throw error;
  }
};

export const getUserHobbies = async () => {
  try {
    return await fetcher(apiUrl(`/api/user_hobbies`), "GET");
  } catch (error) {
    throw error;
  }
};

export const getHobbyBySlug = async ({ slug }: { slug: string }) => {
  try {
    return await fetcher(apiUrl(`/api/hobby/${slug}`), "GET");
  } catch (error) {
    throw error;
  }
};

export const createHobby = async ({ formData }: { formData: FormData }) => {
  try {
    return await fetcher(apiUrl(`/api/new_hobby`), "POST", {}, formData);
  } catch (error) {
    throw error;
  }
};

export const getHobbiesAdmin = async ({
  page = "1",
  search,
}: {
  page?: string;
  search?: string;
}) => {
  try {
    const searchParam = search ? `&search=${search}` : "";
    return await fetcher(
      apiUrl(`/api/all_hobbies?page=${parseInt(page)}${searchParam}`),
      "GET"
    );
  } catch (error) {
    throw error;
  }
};

export const deleteHobby = async ({ id }: { id: number }) => {
  try {
    return await fetcher(apiUrl(`/api/hobby/${id}`), "DELETE");
  } catch (error) {
    throw error;
  }
};

export const proposeHobby = async ({ values }: { values: { name: string, description: string } }) => {
  try {
    return await fetcher(apiUrl(`/api/propose_hobby`), "POST", {}, JSON.stringify(values));
  } catch (error) {
    throw error;
  }
};


export const updateHobby = async ({ slug, formData }: { slug: string, formData: FormData }) => {
  try {
    return await fetcher(apiUrl(`/api/hobby_update/${slug}`), "POST", {}, formData);
  } catch (error) {
    throw error;
  }
}