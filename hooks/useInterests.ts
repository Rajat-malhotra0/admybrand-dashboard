import useSWR from 'swr';
import { dashboardApi } from '@/lib/api/dashboard';
import { InterestData } from '@/lib/api/types';

const fetcher = async (): Promise<InterestData[]> => {
  const response = await dashboardApi.getInterests();
  return response.data;
};

export const useInterests = () => {
  const { data, error, isLoading, mutate } = useSWR<InterestData[]>(
    'interests',
    fetcher,
    {
      revalidateOnFocus: true,
      errorRetryCount: 3,
    }
  );

  const updateInterest = async (id: number, interestData: Partial<InterestData>) => {
    try {
      const response = await dashboardApi.updateInterest(id, interestData);
      mutate(); // Revalidate the data
      return response.data;
    } catch (error) {
      console.error('Error updating interest:', error);
      throw error;
    }
  };

  return {
    data,
    error,
    isLoading,
    isError: !!error,
    refresh: mutate,
    updateInterest,
  };
};
