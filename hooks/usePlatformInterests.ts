import useSWR from "swr";
import { dashboardApi } from "@/lib/api/dashboard";
import { InterestData } from "@/lib/api/types";

const fetcher = async (url: string): Promise<InterestData[]> => {
  const platform = url.split('/')[1]; // Extract platform from URL
  const response = await dashboardApi.getPlatformInterests(platform);
  return response.data;
};

export const usePlatformInterests = (platform: string) => {
  const { data, error, isLoading, mutate } = useSWR<InterestData[]>(
    platform ? `platforms/${platform}/interests` : null,
    fetcher,
    {
      refreshInterval: 0, // Disable automatic refresh
      revalidateOnFocus: false, // Disable focus revalidation
      revalidateOnReconnect: false, // Disable reconnect revalidation
      errorRetryCount: 3,
      dedupingInterval: 60000, // Increase deduping interval
      onError: (error) => {
        console.error(`Interests fetch error for ${platform}:`, error);
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
