import { api } from "@/lib/api";
import { useEffect, useState } from "react";

export const useEvents = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [newEvents, setNewEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async (type: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api(`/events?type=${type}`, "GET");
      console.log("FETCH EVENT", response.data);
      if (response.data.success) {
        if (type === "upcoming") {
          setUpcomingEvents(response.data);
        } else if (type === "new") {
          setNewEvents(response.data);
        }
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      const error = err as Error;
      setError("Failed to fetch events. Please try again later.");
      console.error("Error fetching events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents("upcoming");
    fetchEvents("new");
  }, []);

  return {
    upcomingEvents,
    newEvents,
    isLoading,
    error,
    refetch: fetchEvents,
  };
};
