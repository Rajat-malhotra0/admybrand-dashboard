import useSWR from "swr";
import { dashboardApi } from "@/lib/api/dashboard";
import { DashboardData } from "@/lib/api/types";

const fetcher = async (): Promise<DashboardData> => {
  const response = await dashboardApi.getDashboardData();
  return response.data;
};

export const useDashboardData = () => {
  const { data, error, isLoading, mutate } = useSWR<DashboardData>(
    "dashboard",
    fetcher,
    {
      refreshInterval: 0, // Disable automatic refresh
      revalidateOnFocus: false, // Disable focus revalidation
      revalidateOnReconnect: false, // Disable reconnect revalidation
      errorRetryCount: 3,
      dedupingInterval: 60000, // Increase deduping interval to 60 seconds
      onError: (error) => {
        console.error("Dashboard data fetch error:", error);
      },
    },
  );

  return {
    data,
    error,
    isLoading,
    refresh: mutate,
    isError: !!error,
  };
};
