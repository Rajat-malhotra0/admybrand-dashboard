import useSWR from "swr";
import { dashboardApi } from "@/lib/api/dashboard";
import { DemographicData } from "@/lib/api/types";

const fetcher = async (url: string): Promise<DemographicData[]> => {
  const platform = url.split('/')[1]; // Extract platform from URL
  const response = await dashboardApi.getPlatformDemographics(platform);
  return response.data;
};

export const usePlatformDemographics = (platform: string) => {
  const { data, error, isLoading, mutate } = useSWR<DemographicData[]>(
    platform ? `platforms/${platform}/demographics` : null,
    fetcher,
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
      errorRetryCount: 3,
      dedupingInterval: 5000,
      onError: (error) => {
        console.error(`Demographics fetch error for ${platform}:`, error);
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
