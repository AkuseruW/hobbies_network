"use server";

import { BASE_API_URL } from "../_api_config";
import { fetcher } from "../_fetcher";


const apiUrl = (path: string) => `${BASE_API_URL}${path}`;

export const getReports = async ({
  page = "1",
  search,
}: {
  page?: string;
  search?: string;
}) => {
  try {
    const searchParam = search ? `&search=${search}` : "";
    return await fetcher(
      apiUrl(`/api/reports?page=${parseInt(page)}${searchParam}`),
      "GET"
    );
  } catch (error) {
    throw error;
  }
};

export const getReport = async ({ report_id }: { report_id: number }) => {
  try {
    return await fetcher(apiUrl(`/api/report/${report_id}`), "GET");
  } catch (error) {
    throw error;
  }
};

export const pin_unpin_report = async ({
  report_id,
}: {
  report_id: number;
}) => {
  try {
    return await fetcher(apiUrl(`/api/report/pin_unpin/${report_id}`), "PATCH");
  } catch (error) {
    throw error;
  }
};

export const approve_report = async ({
  report_id,
  duration,
}: {
  report_id: number;
  duration: number;
}) => {
  try {
    return await fetcher(
      apiUrl(`/api/report/approve/${report_id}`),
      "PATCH",
      {},
      JSON.stringify({ duration })
    );
  } catch (error) {
    throw error;
  }
};


export const getPinnedReports = async ({
  page = "1",
  search,
}: {
  page?: string;
  search?: string;
}) => {
  try {
    const searchParam = search ? `&search=${search}` : "";
    return await fetcher(
      apiUrl(`/api/pinned_reports`),
      "GET"
    );
  } catch (error) {
    throw error;
  }
};