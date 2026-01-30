'use client'

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, X } from "lucide-react"
import { useEffect, useState } from "react"

interface SearchFilterProps {
  onSearchChange: (query: string) => void
  onFilterChange: (filter: string | null) => void
  activeFilter: string | null
}

const filters = [
  { value: 'active', label: 'Active', color: 'bg-green-500' },
  { value: 'pending', label: 'Pending', color: 'bg-yellow-500' },
  { value: 'blocked', label: 'Blocked', color: 'bg-red-500' },
  { value: 'done', label: 'Done', color: 'bg-blue-500' },
]

export function SearchFilter({ onSearchChange, onFilterChange, activeFilter }: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
  }

  useEffect(() => {
    const t = setTimeout(() => onSearchChange(searchQuery), 250)
    return () => clearTimeout(t)
  }, [searchQuery, onSearchChange])

  const handleFilterClick = (filter: string) => {
    const newFilter = activeFilter === filter ? null : filter
    onFilterChange(newFilter)
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
            onClick={() => handleSearchChange('')}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {filters.map(filter => (
          <Badge
            key={filter.value}
            variant={activeFilter === filter.value ? 'default' : 'outline'}
            className="cursor-pointer hover:bg-accent transition-colors"
            onClick={() => handleFilterClick(filter.value)}
          >
            <div className={`w-2 h-2 rounded-full ${filter.color} mr-2`} />
            {filter.label}
          </Badge>
        ))}
      </div>
    </div>
  )
}
