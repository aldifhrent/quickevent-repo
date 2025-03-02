interface AsideExplorerProps {
  searchInput: string;
  setSearchInput: (value: string) => void;
  selectedCategory: string;
  selectedDate: string;
  eventStartDate: string;
  eventEndDate: string;
  registrationStart: string;
  registrationEnd: string;
  updateQueryString: (newQuery: Record<string, string>) => void;
}

export default function AsideExplorer({
  searchInput,
  setSearchInput,
  selectedCategory,
  selectedDate,
  eventStartDate,
  eventEndDate,
  registrationStart,
  registrationEnd,
  updateQueryString,
}: AsideExplorerProps) {
  return (
    <aside className="w-full md:w-1/4 p-4 bg-gray-50 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 dark:text-black">
        Filter Events
      </h2>

      {/* Search Input */}
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

      {/* Category Select */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Category</label>
        <select
          className="w-full p-2 border rounded-md"
          value={selectedCategory}
          onChange={(e) => updateQueryString({ category: e.target.value })}
        >
          <option value="All">All</option>
          <option value="ART">ART</option>
          <option value="MUSIC">MUSIC</option>
          <option value="TECH">TECH</option>
        </select>
      </div>

      {/* Date Filters */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Event Start Date</label>
        <input
          type="date"
          className="w-full p-2 border rounded-md"
          value={eventStartDate}
          onChange={(e) =>
            updateQueryString({ eventStartDate: e.target.value })
          }
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">Event End Date</label>
        <input
          type="date"
          className="w-full p-2 border rounded-md"
          value={eventEndDate}
          onChange={(e) => updateQueryString({ eventEndDate: e.target.value })}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">Registration Start</label>
        <input
          type="date"
          className="w-full p-2 border rounded-md"
          value={registrationStart}
          onChange={(e) =>
            updateQueryString({ registrationStart: e.target.value })
          }
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">Registration End</label>
        <input
          type="date"
          className="w-full p-2 border rounded-md"
          value={registrationEnd}
          onChange={(e) =>
            updateQueryString({ registrationEnd: e.target.value })
          }
        />
      </div>
    </aside>
  );
}
