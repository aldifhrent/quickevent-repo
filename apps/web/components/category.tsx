"use client";

import React, { useState } from "react";

const Category = () => {
  const [selectedFilter, setSelectedFilter] = useState("");

  const filterTypes = ["All", "Sports", "Concerts", "Theater & Comedy"];

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div className="text-md font-medium">Explore events</div>
        <div className="flex flex-wrap gap-2">
          {/* Event Type Filters */}
          <div className="flex flex-wrap gap-2">
            {filterTypes.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`rounded-full px-4 py-2 text-sm transition-colors ${
                  selectedFilter === filter
                    ? "bg-orange-100 text-orange-800"
                    : "border bg-white hover:bg-gray-50"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;
