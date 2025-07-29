import useSWR from "swr";
import { dashboardApi } from "@/lib/api/dashboard";
import {
  Influencer,
  CreateInfluencerRequest,
  UpdateInfluencerRequest,
} from "@/lib/api/types";

const fetcher = async (): Promise<Influencer[]> => {
  const response = await dashboardApi.getInfluencers();
  return response.data;
};

export const useInfluencers = () => {
  const { data, error, isLoading, mutate } = useSWR<Influencer[]>(
    "influencers",
    fetcher,
    {
      revalidateOnFocus: true,
      errorRetryCount: 3,
    },
  );

  const createInfluencer = async (influencerData: CreateInfluencerRequest) => {
    try {
      const response = await dashboardApi.createInfluencer(influencerData);
      mutate(); // Revalidate the data
      return response.data;
    } catch (error) {
      console.error("Error creating influencer:", error);
      throw error;
    }
  };

  const updateInfluencer = async (
    id: number,
    influencerData: UpdateInfluencerRequest,
  ) => {
    try {
      const response = await dashboardApi.updateInfluencer(id, influencerData);
      mutate(); // Revalidate the data
      return response.data;
    } catch (error) {
      console.error("Error updating influencer:", error);
      throw error;
    }
  };

  const deleteInfluencer = async (id: number) => {
    try {
      await dashboardApi.deleteInfluencer(id);
      mutate(); // Revalidate the data
    } catch (error) {
      console.error("Error deleting influencer:", error);
      throw error;
    }
  };

  return {
    data,
    error,
    isLoading,
    isError: !!error,
    refresh: mutate,
    createInfluencer,
    updateInfluencer,
    deleteInfluencer,
  };
};
