import useSWR from 'swr';
import { dashboardApi } from '@/lib/api/dashboard';
import { DashboardData } from '@/lib/api/types';

const fetcher = async (): Promise<DashboardData> => {
  const response = await dashboardApi.getDashboardData();
  return response.data;
};

export const useDashboardData = () => {
  const { data, error, isLoading, mutate } = useSWR<DashboardData>(
    'dashboard',
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
      errorRetryCount: 3,
      dedupingInterval: 5000, // Dedupe requests within 5 seconds
      onError: (error) => {
        console.error('Dashboard data fetch error:', error);
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
