"use client";

import { useState, useEffect, useMemo, useTransition } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import axios from "axios";
import { format } from "date-fns";
import { Category, Events } from "@/types/types";

// Hook untuk debounce input
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
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // State untuk input pencarian
  const [searchInput, setSearchInput] = useState(
    searchParams?.get("title") || ""
  );
  const debouncedSearch = useDebounce(searchInput, 500);

  const selectedCategory = searchParams?.get("category") || "All";
  const selectedDate = searchParams?.get("date") || "";

  // Ambil data events dari API
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:9000/api/v1/events");
        if (response.data.success) {
          setEvents(response.data);
        } else {
          console.error("Failed to fetch events:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Ambil kategori dari API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:9000/api/v1/categories"
        );
        if (response.data.success) {
          setCategories(response.data);
        } else {
          console.error("Failed to fetch categories:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Update query string tanpa membuat UI lag
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

  // Update query string saat input debounce berubah
  useEffect(() => {
    updateQueryString({ title: debouncedSearch });
  }, [debouncedSearch]);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesCategory =
        selectedCategory === "All" ||
        event.Category.some(
          (cat: { name: string }) =>
            cat.name.toLowerCase() === selectedCategory.toLowerCase()
        );

      const matchesTitle =
        !debouncedSearch ||
        event.title.toLowerCase().includes(debouncedSearch.toLowerCase());

      const matchesDate =
        !selectedDate ||
        format(new Date(event.eventStartDate), "yyyy-MM-dd").startsWith(
          selectedDate
        );

      return matchesCategory && matchesTitle && matchesDate;
    });
  }, [events, selectedCategory, debouncedSearch, selectedDate]);

  return (
    <div className="flex gap-10">
      {/* Sidebar Filter */}
      <aside className="w-1/4 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 dark:text-black">
          Filter Events
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium">Search</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            placeholder="Search by event title"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Category</label>
          <select
            className="w-full p-2 border rounded-md"
            value={selectedCategory}
            onChange={(e) => updateQueryString({ category: e.target.value })}
          >
            <option value="All">All</option>
            {categories.map((cat: Category) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Date</label>
          <input
            type="date"
            className="w-full p-2 border rounded-md"
            value={selectedDate}
            onChange={(e) => updateQueryString({ date: e.target.value })}
          />
        </div>
      </aside>

      {/* Events List */}
      <main className="w-3/4 p-4">
        <h1 className="text-3xl font-bold mb-4">Explore Events</h1>

        {/* Loading State */}
        {loading || isPending ? (
          <div>Loading...</div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <div key={event.id} className="p-4 border rounded-lg shadow-sm">
                  <h3 className="font-semibold text-lg">{event.title}</h3>
                  <p className="text-sm text-gray-600">
                    {format(event.eventStartDate, "dd MMMM yyyy")} -{" "}
                    {format(event.eventEndDate, "dd MMMM yyyy")}
                  </p>
                </div>
              ))
            ) : (
              <div>No events found</div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
