import { useState } from "react"

interface FilterBarProps {
  onSortChange: (direction: "asc" | "desc") => void
  onDateRangeChange: (range: { start: string; end: string }) => void
  onSearch: (query: string) => void
}

export default function FilterBar({
  onSortChange,
  onDateRangeChange,
  onSearch,
}: FilterBarProps) {
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [dateRange, setDateRange] = useState({ start: "", end: "" })
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    onSearch(e.target.value)
  }

  const handleSortChange = () => {
    const newDirection = sortDirection === "asc" ? "desc" : "asc"
    setSortDirection(newDirection)
    onSortChange(newDirection)
  }

  const handleDateChange = (type: "start" | "end", value: string) => {
    const newRange = { ...dateRange, [type]: value }
    setDateRange(newRange)
    onDateRangeChange(newRange)
  }

  const handleClearFilters = () => {
    setSortDirection("desc")
    setDateRange({ start: "", end: "" })
    setSearchQuery("")
    onSortChange("desc")
    onDateRangeChange({ start: "", end: "" })
    onSearch("")
  }

  return (
    <div className="w-full bg-gray-800/50 rounded-lg border border-gray-700 p-4">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold whitespace-nowrap">Search</h3>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search birds..."
              className="px-3 py-2 bg-gray-700/50 rounded-md text-white min-w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold whitespace-nowrap">
              Sort by Date
            </h3>
            <button
              onClick={handleSortChange}
              className="flex items-center gap-2 px-3 py-2 bg-gray-700/50 rounded-md hover:bg-gray-700 transition-colors"
            >
              {sortDirection === "asc" ? "↑" : "↓"}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <h3 className="text-lg font-semibold whitespace-nowrap">
              Date Range
            </h3>
            <div className="flex gap-2">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => handleDateChange("start", e.target.value)}
                className="px-3 py-2 bg-gray-700/50 rounded-md text-white min-w-0"
              />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => handleDateChange("end", e.target.value)}
                className="px-3 py-2 bg-gray-700/50 rounded-md text-white min-w-0"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleClearFilters}
          className="px-4 py-2 bg-gray-700/50 rounded-md hover:bg-gray-700 transition-colors text-sm font-medium"
        >
          Clear Filters
        </button>
      </div>
    </div>
  )
}
