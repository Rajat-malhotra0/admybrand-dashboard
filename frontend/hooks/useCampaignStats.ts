import useSWR from "swr";
import { dashboardApi } from "@/lib/api/dashboard";
import {
  CampaignStat,
  CreateCampaignStatRequest,
  UpdateCampaignStatRequest,
} from "@/lib/api/types";

const fetcher = async (): Promise<CampaignStat[]> => {
  const response = await dashboardApi.getCampaignStats();
  return response.data;
};

export const useCampaignStats = () => {
  const { data, error, isLoading, mutate } = useSWR<CampaignStat[]>(
    "campaign-stats",
    fetcher,
    {
      refreshInterval: 0, // Disable automatic refresh
      revalidateOnFocus: false, // Disable focus revalidation
      revalidateOnReconnect: false, // Disable reconnect revalidation
      errorRetryCount: 3,
      dedupingInterval: 60000, // Add deduping interval
    },
  );

  const createCampaignStat = async (statData: CreateCampaignStatRequest) => {
    try {
      const response = await dashboardApi.createCampaignStat(statData);
      mutate(); // Revalidate the data
      return response.data;
    } catch (error) {
      console.error("Error creating campaign stat:", error);
      throw error;
    }
  };

  const updateCampaignStat = async (
    id: number,
    statData: UpdateCampaignStatRequest,
  ) => {
    try {
      const response = await dashboardApi.updateCampaignStat(id, statData);
      mutate(); // Revalidate the data
      return response.data;
    } catch (error) {
      console.error("Error updating campaign stat:", error);
      throw error;
    }
  };

  const deleteCampaignStat = async (id: number) => {
    try {
      await dashboardApi.deleteCampaignStat(id);
      mutate(); // Revalidate the data
    } catch (error) {
      console.error("Error deleting campaign stat:", error);
      throw error;
    }
  };

  return {
    data,
    error,
    isLoading,
    isError: !!error,
    refresh: mutate,
    createCampaignStat,
    updateCampaignStat,
    deleteCampaignStat,
  };
};
