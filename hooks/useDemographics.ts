import useSWR from "swr";
import { dashboardApi } from "@/lib/api/dashboard";
import { DemographicData } from "@/lib/api/types";

const fetcher = async (): Promise<DemographicData[]> => {
  const response = await dashboardApi.getDemographics();
  return response.data;
};

export const useDemographics = () => {
  const { data, error, isLoading, mutate } = useSWR<DemographicData[]>(
    "demographics",
    fetcher,
    {
      refreshInterval: 0, // Disable automatic refresh
      revalidateOnFocus: false, // Disable focus revalidation
      revalidateOnReconnect: false, // Disable reconnect revalidation
      errorRetryCount: 3,
      dedupingInterval: 60000, // Add deduping interval
    },
  );

  const updateDemographic = async (
    id: number,
    demographicData: Partial<DemographicData>,
  ) => {
    try {
      const response = await dashboardApi.updateDemographic(
        id,
        demographicData,
      );
      mutate(); // Revalidate the data
      return response.data;
    } catch (error) {
      console.error("Error updating demographic:", error);
      throw error;
    }
  };

  return {
    data,
    error,
    isLoading,
    isError: !!error,
    refresh: mutate,
    updateDemographic,
  };
};
