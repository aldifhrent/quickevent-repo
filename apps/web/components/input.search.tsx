import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { api } from "@/lib/api";
import { Events } from "@/types/types";

export default function SearchInput() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [events, setEvents] = useState<Events[]>([]); // Menyimpan events dari API
  const [loading, setLoading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce query untuk mengurangi pemanggilan filter yang berlebihan
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  // Ambil data events dari API
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await api("/events", "GET");
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

  // Gunakan useMemo untuk menghindari perhitungan ulang yang tidak perlu
  const filteredData = useMemo(() => {
    return debouncedQuery
      ? events.filter(
          (event) =>
            event.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
            event.description
              .toLowerCase()
              .includes(debouncedQuery.toLowerCase())
        )
      : events;
  }, [debouncedQuery, events]);

  // Handle CTRL + K untuk focus langsung ke input
  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === "k") {
      e.preventDefault();
      inputRef.current?.focus();
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  return (
    <div className="relative flex items-center rounded-full">
      {/* Input */}
      <Input
        ref={inputRef}
        type="text"
        className="2xl:full h-10 w-[300px] rounded-full border-2 px-4 pl-12 shadow-2xl outline-none placeholder:text-slate-300 sm:w-[300px] md:w-[600px] lg:w-[600px] xl:w-[800px]"
        placeholder="Search events..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* Search Icon */}
      <div
        className={`absolute left-0 rounded-l-full bg-black p-2 shadow-xl dark:bg-white transition-transform duration-300 ease-in-out`}
      >
        <Search className="text-white dark:text-black" size={24} />
      </div>

      {/* CTRL + K shortcut info */}
      <p className="right-6 hidden cursor-pointer text-slate-200 hover:text-slate-400 md:absolute">
        CTRL + K
      </p>

      {/* Filtered Results */}
      {query && (
        <div className="absolute left-0 mt-4 top-10 p-4 w-full rounded-lg bg-white shadow-lg flex flex-col justify-start">
          {filteredData.length > 0 ? (
            filteredData.map((event) => (
              <div key={event.id} className="p-2 border-b">
                <div className="font-bold">
                  {/* Tambahkan link ke halaman event dengan slug */}
                  <a
                    href={`/event/${event.slug}`}
                    target="_blank"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    {event.title}
                  </a>
                </div>
                <div>{event.description}</div>
              </div>
            ))
          ) : (
            <div className="p-2 text-gray-400">No events found</div>
          )}
        </div>
      )}
    </div>
  );
}
