import useSWR from 'swr';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

const fetcher = async (url: string): Promise<{ countries: string[] }> => {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch countries with data: ${response.statusText}`);
  }
  
  return response.json();
};

export const useCountriesWithData = () => {
  const { data, error, isLoading, mutate } = useSWR<{ countries: string[] }>(
    `${BASE_URL}/countries-with-data`,
    fetcher,
    {
      refreshInterval: 0, // Don't auto-refresh
      revalidateOnFocus: true, // Refresh when window gains focus
      revalidateOnReconnect: true, // Refresh when reconnected
      errorRetryCount: 2,
      dedupingInterval: 5000, // Reduce cache time to 5 seconds
      onError: (error) => {
        console.error('Error fetching countries with data:', error);
      },
      onSuccess: (data) => {
        console.log('Countries with data loaded:', data.countries);
      },
    }
  );

  return {
    countries: data?.countries || [],
    error,
    isLoading,
    refresh: () => mutate(), // Add refresh function
  };
};
