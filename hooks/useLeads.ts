import useSWR from "swr";
import { dashboardApi } from "@/lib/api/dashboard";
import {
  Lead,
  CreateLeadRequest,
  UpdateLeadRequest,
} from "@/lib/api/types";
import { useSortedLeads, SortOrder } from "./useSortedLeads";

const fetcher = async (): Promise<Lead[]> => {
  const response = await dashboardApi.getLeads();
  return response.data;
};

export const useLeads = (sortOrder: SortOrder = 'desc') => {
  const { data, error, isLoading, mutate } = useSWR<Lead[]>(
    "leads",
    fetcher,
    {
      refreshInterval: 0, // Disable automatic refresh
      revalidateOnFocus: false, // Disable focus revalidation
      revalidateOnReconnect: false, // Disable reconnect revalidation
      errorRetryCount: 3,
      dedupingInterval: 60000, // Add deduping interval
    },
  );

  // Sort the leads data whenever it changes or sortOrder changes
  const sortedData = useSortedLeads(data, sortOrder);

  const createLead = async (leadData: CreateLeadRequest) => {
    try {
      const response = await dashboardApi.createLead(leadData);
      mutate(); // Revalidate the data
      return response.data;
    } catch (error) {
      console.error("Error creating lead:", error);
      throw error;
    }
  };

  const updateLead = async (
    id: number,
    leadData: UpdateLeadRequest,
  ) => {
    try {
      const response = await dashboardApi.updateLead(id, leadData);
      mutate(); // Revalidate the data
      return response.data;
    } catch (error) {
      console.error("Error updating lead:", error);
      throw error;
    }
  };

  const deleteLead = async (id: number) => {
    try {
      await dashboardApi.deleteLead(id);
      mutate(); // Revalidate the data
    } catch (error) {
      console.error("Error deleting lead:", error);
      throw error;
    }
  };

  return {
    data: sortedData,
    rawData: data, // Provide access to unsorted data if needed
    error,
    isLoading,
    isError: !!error,
    refresh: mutate,
    createLead,
    updateLead,
    deleteLead,
  };
};
