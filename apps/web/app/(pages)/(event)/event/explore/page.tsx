"use client";

import { useState, useEffect, useMemo, useTransition } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { format } from "date-fns";
import { Events } from "@/types/types";
import { api } from "@/lib/api";
import AsideExplorer from "../../_components/aside";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function ExplorePage() {
  const [events, setEvents] = useState<Events[]>([]);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 5,
  });

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [searchInput, setSearchInput] = useState(
    searchParams?.get("title") || ""
  );
  const debouncedSearch = useDebounce(searchInput, 500);

  const selectedCategory = searchParams?.get("category") || "All";
  const selectedDate = searchParams?.get("date") || "";
  const eventStartDate = searchParams?.get("eventStartDate") || "";
  const eventEndDate = searchParams?.get("eventEndDate") || "";
  const registrationStart = searchParams?.get("registrationStart") || "";
  const registrationEnd = searchParams?.get("registrationEnd") || "";

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await api(
          `/events?page=${pagination.currentPage}&limit=5`,
          "GET"
        );
        if (response.success) {
          setEvents(
            response.data.map((event: Events) => ({
              ...event,
              category: event.category
                ? event.category.replace(/"/g, "")
                : "Unknown",
            }))
          );
          setPagination(response.pagination);
        } else {
          console.error("Failed to fetch events:", response.message);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [pagination.currentPage]);

  const updateQueryString = (newQuery: Record<string, string>) => {
    startTransition(() => {
      const query = new URLSearchParams(window.location.search);

      Object.keys(newQuery).forEach((key) => {
        if (newQuery[key]) {
          query.set(key, newQuery[key]);
        } else {
          query.delete(key);
        }
      });

      router.push(`${pathname}?${query.toString()}`);
    });
  };

  useEffect(() => {
    updateQueryString({ title: debouncedSearch });
  }, [debouncedSearch]);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesCategory =
        selectedCategory === "All" || event.category === selectedCategory;
      const matchesTitle =
        !debouncedSearch ||
        event.title.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesDate =
        !selectedDate ||
        format(new Date(event.eventStartDate), "yyyy-MM-dd").startsWith(
          selectedDate
        );
      const matchesEventStartDate =
        !eventStartDate ||
        format(new Date(event.eventStartDate), "yyyy-MM-dd") >= eventStartDate;
      const matchesEventEndDate =
        !eventEndDate ||
        format(new Date(event.eventEndDate), "yyyy-MM-dd") <= eventEndDate;
      const matchesRegistrationStart =
        !registrationStart ||
        format(new Date(event.registrationStartDate), "yyyy-MM-dd") >=
          registrationStart;
      const matchesRegistrationEnd =
        !registrationEnd ||
        format(new Date(event.registrationEndDate), "yyyy-MM-dd") <=
          registrationEnd;

      return (
        matchesCategory &&
        matchesTitle &&
        matchesDate &&
        matchesEventStartDate &&
        matchesEventEndDate &&
        matchesRegistrationStart &&
        matchesRegistrationEnd
      );
    });
  }, [
    events,
    selectedCategory,
    debouncedSearch,
    selectedDate,
    eventStartDate,
    eventEndDate,
    registrationStart,
    registrationEnd,
  ]);

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: newPage,
    }));
  };

  const getPageNumbers = () => {
    const totalNumbers = 5;
    const pages = [];

    if (pagination.totalPages <= totalNumbers) {
      // Jika total halaman 5 atau kurang, tampilkan semua
      for (let i = 1; i <= pagination.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Selalu tampilkan halaman pertama
      pages.push(1);

      let start = Math.max(2, pagination.currentPage - 1);
      let end = Math.min(pagination.currentPage + 1, pagination.totalPages - 1);

      // Sesuaikan start dan end untuk selalu menampilkan 3 angka di tengah
      if (pagination.currentPage <= 2) {
        end = 3;
      }
      if (pagination.currentPage >= pagination.totalPages - 1) {
        start = pagination.totalPages - 2;
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Selalu tampilkan halaman terakhir
      if (!pages.includes(pagination.totalPages)) {
        pages.push(pagination.totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-10">
      <AsideExplorer
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        selectedCategory={selectedCategory}
        selectedDate={selectedDate}
        eventStartDate={eventStartDate}
        eventEndDate={eventEndDate}
        registrationStart={registrationStart}
        registrationEnd={registrationEnd}
        updateQueryString={updateQueryString}
      />

      <main className="flex  flex-col w-full lg:w-3/4 p-0 lg:p-4">
        <h1 className="text-3xl font-bold mb-4">Explore Events</h1>
        {loading || isPending ? (
          <div>Loading...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-900"
                  >
                    {/* Event Image */}
                    {event.imageUrl && (
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-40 object-cover rounded-md mb-4"
                      />
                    )}

                    {/* Event Title & Category */}
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-lg">{event.title}</h3>
                      <Badge className="px-2 py-1 text-xs font-medium text-white rounded-md">
                        {event.category}
                      </Badge>
                    </div>

                    {/* Event Date & Location */}
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      📅{" "}
                      {format(new Date(event.eventStartDate), "dd MMMM yyyy")} -{" "}
                      {format(new Date(event.eventEndDate), "dd MMMM yyyy")}
                    </p>
                    {/* <p className="text-sm text-gray-600 dark:text-gray-400">
                      📍 {event.location}
                    </p> */}

                    {/* Event Description */}
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 line-clamp-2">
                      {event.description}
                    </p>

                    {/* View Details Button */}
                    <div className="mt-4">
                      <Button className="px-4 py-2 text-sm font-medium text-white  rounded-lg transition">
                        <Link href={`/event/${event.slug}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500">No events found</div>
              )}
            </div>

            <div className="mt-8">
              <div className="flex justify-center items-center gap-4 mb-2">
                <span className="text-sm text-gray-600">
                  Total Events: {pagination.totalItems} | Page{" "}
                  {pagination.currentPage} of {pagination.totalPages}
                </span>
              </div>

              <div className="flex justify-center gap-2">
                <Button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  variant="outline"
                >
                  Previous
                </Button>

                {getPageNumbers().map((page, index, array) => (
                  <div key={page}>
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <span className="px-2">...</span>
                    )}
                    <Button
                      onClick={() => handlePageChange(page)}
                      variant={
                        pagination.currentPage === page ? "default" : "outline"
                      }
                    >
                      {page}
                    </Button>
                  </div>
                ))}

                <Button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  variant="outline"
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
