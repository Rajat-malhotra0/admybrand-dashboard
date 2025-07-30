import useSWR from "swr";
import { PlatformData } from "@/lib/api/types";

const BASE_URL = 'http://localhost:5000/api';

const fetcher = async (url: string | null): Promise<PlatformData | null> => {
  if (!url) return null;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch platform data: ${response.statusText}`);
  }
  
  return response.json();
};

export const usePlatformData = (platform: string, enabled: boolean = true, country?: string) => {
  const params = new URLSearchParams();
  if (platform && platform !== 'global') {
    params.set('platform', platform);
  }
  if (country && country !== 'global') {
    params.set('country', country);
  }
  const swrKey = enabled ? `${BASE_URL}/platform-data?${params.toString()}` : null;
  
  const { data, error, isLoading, mutate } = useSWR<PlatformData | null>(
    swrKey,
    fetcher,
    {
      refreshInterval: 0,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateOnMount: true,
      errorRetryCount: 1,
      dedupingInterval: 30000,
      focusThrottleInterval: 5000,
      loadingTimeout: 3000,
      errorRetryInterval: 5000,
      keepPreviousData: true,
      onError: (error) => {
        if (swrKey) {
          console.error(`Platform data fetch error for ${swrKey}:`, error);
        }
      },
      onSuccess: () => {
        if (process.env.NODE_ENV === 'development' && swrKey) {
          console.log('Platform data loaded successfully');
        }
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
