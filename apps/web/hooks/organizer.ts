"use client";

import { Organizer } from "@/types/types";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export const useOrganizer = () => {
  const { data: session, status } = useSession();
  const [organizer, setOrganizer] = useState<Organizer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrganizer = async () => {
    if (!session?.user?.access_token) {
      setError("No authentication token available");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axios.get<Organizer>(
        "http://localhost:9000/api/v1/organizer",
        {
          headers: {
            Authorization: `Bearer ${session.user.access_token}`,
          },
        }
      );
      console.log("FETCH ORGANIZER", response.data);
      console.log("FETCH ORGANIZER WITH MORE", response.data.data);
      // Check if response.data exists and is not null
      if (response.data) {
        // If response.data is an array, use it directly; if it's a single object, wrap it in an array
        setOrganizer(
          Array.isArray(response.data.data)
            ? response.data.data
            : [response.data.data]
        );
      } else {
        setOrganizer([]);
      }
    } catch (err) {
      const error = err as AxiosError;
      console.error("Failed to fetch organizer:", error);

      if (error.response?.status === 401) {
        setError("Your session has expired. Please sign in again.");
      } else if (error.response?.status === 403) {
        setError("You don't have permission to access this resource.");
      } else {
        setError("Failed to fetch organizer data. Please try again later.");
      }

      setOrganizer([]);
    } finally {
      setLoading(false);
    }
  };

  // Function to manually refresh the data
  const refreshOrganizer = () => {
    fetchOrganizer();
  };

  useEffect(() => {
    // Only fetch when the session is ready
    if (status === "authenticated") {
      fetchOrganizer();
    } else if (status === "unauthenticated") {
      setLoading(false);
      setError("Please sign in to access organizer data");
    }
  }, [status, session?.user?.access_token]);

  return {
    organizer,
    loading,
    error,
    refresh: refreshOrganizer,
    isAuthenticated: status === "authenticated",
  };
};
