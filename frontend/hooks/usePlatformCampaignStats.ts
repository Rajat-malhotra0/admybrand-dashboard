import useSWR from "swr";
import { dashboardApi } from "@/lib/api/dashboard";
import { CampaignStat } from "@/lib/api/types";

const fetcher = async (url: string): Promise<CampaignStat[]> => {
  const platform = url.split('/')[1]; // Extract platform from URL
  const response = await dashboardApi.getPlatformCampaignStats(platform);
  return response.data;
};

export const usePlatformCampaignStats = (platform: string) => {
  const { data, error, isLoading, mutate } = useSWR<CampaignStat[]>(
    platform ? `platforms/${platform}/campaign-stats` : null,
    fetcher,
    {
      refreshInterval: 0, // Disable automatic refresh
      revalidateOnFocus: false, // Disable focus revalidation
      revalidateOnReconnect: false, // Disable reconnect revalidation
      errorRetryCount: 3,
      dedupingInterval: 60000, // Increase deduping interval
      onError: (error) => {
        console.error(`Campaign stats fetch error for ${platform}:`, error);
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
