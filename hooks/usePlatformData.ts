import useSWR from "swr";
import { PlatformData } from "@/lib/api/types";

const fetcher = async (url: string): Promise<PlatformData> => {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch platform data: ${response.statusText}`);
  }
  
  return response.json();
};

export const usePlatformData = (platform: string, enabled: boolean = true, country?: string) => {
  // Only create a URL if enabled
  let swrKey: string | null = null;
  if (enabled) {
    const params = new URLSearchParams();
    if (platform && platform !== 'global') {
      params.set('platform', platform);
    }
    if (country && country !== 'global') {
      params.set('country', country);
    }
    swrKey = `/api/platform-data?${params.toString()}`;
  }
  // If enabled is false, swrKey remains null, disabling SWR completely
  
  const { data, error, isLoading, mutate } = useSWR<PlatformData>(
    swrKey,
    fetcher,
    {
      refreshInterval: swrKey ? 60000 : 0, // Only refresh when there's a key
      revalidateOnFocus: !!swrKey,
      errorRetryCount: swrKey ? 2 : 0,
      dedupingInterval: 10000,
      onError: (error) => {
        if (swrKey) {
          console.error(`Platform data fetch error for ${swrKey}:`, error);
        }
      },
    }
  );

  return {
    data: swrKey ? data : undefined,
    error: swrKey ? error : null,
    isLoading: swrKey ? isLoading : false,
    refresh: mutate,
    isError: swrKey ? !!error : false,
  };
};
