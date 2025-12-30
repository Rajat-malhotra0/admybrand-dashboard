import useSWR from "swr";
import { dashboardApi } from "@/lib/api/dashboard";
import { Lead } from "@/lib/api/types";

const fetcher = async (url: string): Promise<Lead[]> => {
  const platform = url.split('/')[1]; // Extract platform from URL
  const response = await dashboardApi.getPlatformLeads(platform);
  return response.data;
};

export const usePlatformLeads = (platform: string) => {
  const { data, error, isLoading, mutate } = useSWR<Lead[]>(
    platform ? `platforms/${platform}/leads` : null,
    fetcher,
    {
      refreshInterval: 0, // Disable automatic refresh
      revalidateOnFocus: false, // Disable focus revalidation
      revalidateOnReconnect: false, // Disable reconnect revalidation
      errorRetryCount: 3,
      dedupingInterval: 60000, // Increase deduping interval
      onError: (error) => {
        console.error(`Leads fetch error for ${platform}:`, error);
      },
    }
  );

  return {
    data,
    error,
    isLoading,
    refresh: mutate,
    isError: !!error,
  };
};
