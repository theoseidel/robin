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
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const clearSearch = () => {
    setSearchQuery("")
    onSearch("")
  }

  const clearDates = () => {
    setStartDate("")
    setEndDate("")
    onDateRangeChange({ start: "", end: "" })
  }

  return (
    <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/50 space-y-3">
      {/* Search with clear button */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search birds..."
          className="w-full bg-gray-900/50 rounded px-3 py-1.5 text-sm border border-gray-700/50 focus:outline-none focus:border-blue-500/50 pr-8"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            onSearch(e.target.value)
          }}
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>

      {/* Date Range with clear button */}
      <div className="relative flex gap-2 text-sm">
        <input
          type="date"
          className="flex-1 bg-gray-900/50 rounded px-2 py-1 border border-gray-700/50 focus:outline-none focus:border-blue-500/50"
          value={startDate}
          onChange={(e) => {
            setStartDate(e.target.value)
            onDateRangeChange({ start: e.target.value, end: endDate })
          }}
        />
        <input
          type="date"
          className="flex-1 bg-gray-900/50 rounded px-2 py-1 border border-gray-700/50 focus:outline-none focus:border-blue-500/50"
          value={endDate}
          onChange={(e) => {
            setEndDate(e.target.value)
            onDateRangeChange({ start: startDate, end: e.target.value })
          }}
        />
        {(startDate || endDate) && (
          <button
            onClick={clearDates}
            className="absolute right-[-24px] top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1"
            aria-label="Clear dates"
          >
            ×
          </button>
        )}
      </div>

      {/* Sort */}
      <select
        onChange={(e) => onSortChange(e.target.value as "asc" | "desc")}
        className="w-full bg-gray-900/50 rounded px-3 py-1.5 text-sm border border-gray-700/50 focus:outline-none focus:border-blue-500/50"
      >
        <option value="desc">Latest First</option>
        <option value="asc">Oldest First</option>
      </select>
    </div>
  )
}
