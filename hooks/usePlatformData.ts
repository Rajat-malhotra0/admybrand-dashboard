import useSWR from "swr";
import { PlatformData } from "@/lib/api/types";

const BASE_URL = 'http://localhost:5000/api';

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
    swrKey = `${BASE_URL}/platform-data?${params.toString()}`;
    console.log('SWR Key:', swrKey); // Debug: show URL being called
  }
  
  const { data, error, isLoading, mutate } = useSWR<PlatformData>(
    swrKey,
    fetcher,
    {
      refreshInterval: 0, // Disable automatic refresh
      revalidateOnFocus: false, // Disable focus revalidation
      revalidateOnReconnect: false, // Disable reconnect revalidation
      revalidateOnMount: true, // Only revalidate on mount
      errorRetryCount: 1, // Reduce retry attempts
      dedupingInterval: 30000, // Increase deduping interval to 30 seconds
      focusThrottleInterval: 5000, // Throttle focus events
      loadingTimeout: 3000, // Set loading timeout
      errorRetryInterval: 5000, // Increase retry interval
      keepPreviousData: true, // Keep previous data while loading new data
      onError: (error) => {
        if (swrKey) {
          console.error(`Platform data fetch error for ${swrKey}:`, error);
        }
      },
      onSuccess: (data) => {
        // Reduce console logging
        if (process.env.NODE_ENV === 'development') {
          console.log('Platform data loaded successfully');
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
