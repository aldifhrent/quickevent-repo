"use client";

import { api } from "@/lib/api";
import { Organizer } from "@/types/types";
import { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

export const useOrganizer = () => {
  const { data: session, status } = useSession();
  const [organizer, setOrganizer] = useState<Organizer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Pengecekan token hanya dilakukan saat session sudah siap
  const token = session?.user?.access_token;

  const fetchOrganizer = useCallback(async () => {
    if (!token) {
      setError("No authentication token available");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await api("/organizer", "GET", {}, token);

      setOrganizer(
        Array.isArray(response.data) ? response.data : [response.data]
      );
    } catch (err) {
      const error = err as AxiosError;

      if (error.response?.status === 404) {
        setOrganizer([]);
      } else {
        setError("Terjadi kesalahan saat mengambil data organizer");
        setOrganizer([]);
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (status === "authenticated" && token) {
      fetchOrganizer(); // Fetch only when session is authenticated and token is available
    } else if (status === "unauthenticated") {
      setLoading(false);
      setError("Please sign in to access organizer data");
    }
  }, [status, token, fetchOrganizer]); // Dependensi tambahan pada status dan token

  return {
    organizer,
    loading,
    error,
  };
};
