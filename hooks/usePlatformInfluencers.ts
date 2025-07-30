import useSWR from "swr";
import { dashboardApi } from "@/lib/api/dashboard";
import { Influencer } from "@/lib/api/types";

const fetcher = async (url: string): Promise<Influencer[]> => {
  const platform = url.split('/')[1]; // Extract platform from URL
  const response = await dashboardApi.getPlatformInfluencers(platform);
  return response.data;
};

export const usePlatformInfluencers = (platform: string) => {
  const { data, error, isLoading, mutate } = useSWR<Influencer[]>(
    platform ? `platforms/${platform}/influencers` : null,
    fetcher,
    {
      refreshInterval: 0, // Disable automatic refresh
      revalidateOnFocus: false, // Disable focus revalidation
      revalidateOnReconnect: false, // Disable reconnect revalidation
      errorRetryCount: 3,
      dedupingInterval: 60000, // Increase deduping interval
      onError: (error) => {
        console.error(`Influencers fetch error for ${platform}:`, error);
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
